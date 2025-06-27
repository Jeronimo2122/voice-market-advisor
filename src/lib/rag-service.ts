import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { supabase } from '../integrations/supabase/client';

export interface Document {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export class RAGService {
  private embeddings: OpenAIEmbeddings;
  private vectorStore: SupabaseVectorStore;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    });
  }

  /**
   * Add documents to the vector store
   */
  async addDocuments(documents: Document[]): Promise<void> {
    try {
      await this.vectorStore.addDocuments(
        documents.map(doc => ({
          pageContent: doc.content,
          metadata: doc.metadata || {},
        }))
      );
      console.log(`Added ${documents.length} documents to vector store`);
    } catch (error) {
      console.error('Error adding documents to vector store:', error);
      throw error;
    }
  }

  /**
   * Search for similar documents based on a query
   */
  async searchDocuments(query: string, limit: number = 5): Promise<Document[]> {
    try {
      const results = await this.vectorStore.similaritySearch(query, limit);
      
      return results.map(result => ({
        id: result.metadata?.id || '',
        content: result.pageContent,
        metadata: result.metadata,
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * Get context from relevant documents for a query
   */
  async getContext(query: string, limit: number = 3): Promise<string> {
    try {
      const documents = await this.searchDocuments(query, limit);
      
      if (documents.length === 0) {
        return '';
      }

      const context = documents
        .map(doc => doc.content)
        .join('\n\n');

      return `Relevant product information:\n${context}`;
    } catch (error) {
      console.error('Error getting context:', error);
      return '';
    }
  }
}

// Export a singleton instance
export const ragService = new RAGService(); 