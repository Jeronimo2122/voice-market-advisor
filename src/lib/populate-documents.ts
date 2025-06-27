import { supabase } from '../integrations/supabase/client';
import { sampleProducts } from '../data/products';
import { ragService, Document } from './rag-service';
import { Product } from '../types/product';

/**
 * Convert product data to document format for RAG
 */
function productToDocument(product: Product): Document {
  const content = `
Product: ${product.name}
Category: ${product.category || 'General'}
Price: $${product.price}${product.originalPrice ? ` (was $${product.originalPrice})` : ''}
Description: ${product.description || 'No description available'}
Features: ${product.features ? product.features.join(', ') : 'No features listed'}
Rating: ${product.rating ? `${product.rating}/5 (${product.reviews} reviews)` : 'No ratings'}
Availability: ${product.inStock ? 'In Stock' : 'Out of Stock'}
${product.badge ? `Badge: ${product.badge}` : ''}
${product.discount ? `Discount: ${product.discount}% off` : ''}
  `.trim();

  return {
    id: product.id,
    content,
    metadata: {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      inStock: product.inStock,
      badge: product.badge,
      discount: product.discount,
    },
  };
}

/**
 * Populate the documents table with product information
 */
export async function populateDocuments(): Promise<void> {
  try {
    console.log('Starting document population...');

    // Convert products to documents
    const documents = sampleProducts.map(productToDocument);

    // Add documents to vector store
    await ragService.addDocuments(documents);

    console.log(`Successfully populated ${documents.length} documents`);
  } catch (error) {
    console.error('Error populating documents:', error);
    throw error;
  }
}

/**
 * Clear all documents from the vector store
 */
export async function clearDocuments(): Promise<void> {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all documents

    if (error) {
      throw error;
    }

    console.log('Successfully cleared all documents');
  } catch (error) {
    console.error('Error clearing documents:', error);
    throw error;
  }
}

// Run population if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateDocuments()
    .then(() => {
      console.log('Document population completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Document population failed:', error);
      process.exit(1);
    });
} 