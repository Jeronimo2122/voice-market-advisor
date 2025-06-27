import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { sampleProducts } from '../data/products';
import { Product } from '../types/product';
import { Json } from '../integrations/supabase/types';

interface Document {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

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

export function useRAG() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Populate the documents table with product information
   */
  const populateDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting document population...');

      // Convert products to documents
      const documents = sampleProducts.map(productToDocument);

      // Insert documents into Supabase
      const { error: insertError } = await supabase
        .from('documents')
        .insert(
          documents.map(doc => ({
            content: doc.content,
            metadata: doc.metadata as Json,
          }))
        );

      if (insertError) {
        throw insertError;
      }

      console.log(`Successfully populated ${documents.length} documents`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error populating documents:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear all documents from the vector store
   */
  const clearDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all documents

      if (deleteError) {
        throw deleteError;
      }

      console.log('Successfully cleared all documents');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error clearing documents:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Search for similar documents based on a query
   */
  const searchDocuments = async (query: string, limit: number = 5): Promise<Document[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // This would typically call the match_documents function
      // For now, we'll return an empty array as the actual search
      // is handled by the backend function
      console.log(`Searching for documents with query: ${query}`);
      
      // In a real implementation, you might call a Supabase function here
      // const { data, error } = await supabase.rpc('match_documents', {
      //   query_embedding: embedding,
      //   match_threshold: 0.78,
      //   match_count: limit,
      // });

      return [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error searching documents:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    populateDocuments,
    clearDocuments,
    searchDocuments,
    isLoading,
    error,
  };
} 