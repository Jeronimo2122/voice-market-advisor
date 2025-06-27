// populateRAG.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}

function buildDocumentFromProduct(p) {
  const features = Array.isArray(p.features) ? p.features.join(', ') : p.features;
  return `
Product: ${p.name}
Category: ${p.category}
Price: $${p.price}
Description: ${p.description}
Features: ${features}
Rating: ${p.rating}/5 (${p.reviews} reviews)
Availability: ${p.in_stock ? 'In Stock' : 'Out of Stock'}
Badge: ${p.badge || 'None'}
Discount: ${p.discount ? `${p.discount}% off` : 'None'}
Original Price: ${p.original_price || 'N/A'}
  `.trim();
}

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function populateDocuments() {
  const products = await fetchProducts();

  for (const product of products) {
    const content = buildDocumentFromProduct(product);
    const embedding = await generateEmbedding(content);

    const { error } = await supabase.from('documents').insert([
      {
        content,
        metadata: { product_id: product.id, category: product.category },
        embedding,
      },
    ]);

    if (error) {
      console.error(`❌ Error inserting ${product.name}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${product.name}`);
    }
  }
}

populateDocuments().catch(console.error);
