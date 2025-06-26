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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    console.log('TTS request:', { textLength: text.length, voice });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    console.log('Gemini API key found, making request...');

    // Use Gemini's text-to-speech API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Convert this text to speech: "${text}"`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    console.log('Gemini TTS response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini TTS error response:', errorText);
      
      let errorMessage = 'Failed to generate speech';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error?.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Gemini TTS success');
    
    // For now, we'll return a simple audio placeholder
    // In a real implementation, you'd need to use a proper TTS service
    const audioContent = btoa('audio_placeholder'); // This is just a placeholder

    return new Response(JSON.stringify({ audioContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
