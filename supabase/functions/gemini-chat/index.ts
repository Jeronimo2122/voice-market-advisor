import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-expect-error - Deno imports not recognized in local TypeScript environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  productContext?: unknown[];
}

/**
 * Get product context either via RAG or by loading all documents
 */
async function getProductContext(query: string): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const useRag = Deno.env.get('USE_RAG') === 'true';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Missing Supabase config');
      return '';
    }

    if (useRag && openaiApiKey) {
      // RAG: generate embedding
      const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: query,
          model: 'text-embedding-ada-002',
        }),
      });

      if (!embeddingRes.ok) {
        console.error('Embedding error:', await embeddingRes.text());
        return '';
      }

      const embedding = (await embeddingRes.json()).data[0].embedding;

      // Call match_documents RPC
      const matchRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_embedding: embedding,
          match_threshold: 0.78,
          match_count: 5,
        }),
      });

      if (!matchRes.ok) {
        console.error('match_documents failed:', await matchRes.text());
        return '';
      }

      const docs = await matchRes.json();
      return docs.map((d: { content: string }) => d.content).join('\n\n');
    }

    // Fallback: get all documents
    const allDocsRes = await fetch(`${supabaseUrl}/rest/v1/documents?select=content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
      },
    });

    if (!allDocsRes.ok) {
      console.error('Fetch all documents failed:', await allDocsRes.text());
      return '';
    }

    const docs = await allDocsRes.json();
    return docs.map((d: { content: string }) => d.content).join('\n\n');
  } catch (err) {
    console.error('getProductContext error:', err);
    return '';
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], productContext = [] }: ChatRequest = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) throw new Error('Gemini API key not set');

    const ragContext = await getProductContext(message);

    const systemPrompt = `Eres un asistente de compras. Usa SOLO esta información de productos para responder la pregunta del usuario. Actúa como un asistente de compras directo y eficiente. Sé claro y breve, no repitas, evita detalles innecesarios, y no tardes más de 30 segundos en tu respuesta. Si no tienes suficiente información, dilo claramente.\n\n${ragContext}\n\nUsuario: ${message}`;

    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.slice(1),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude generar una respuesta.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
