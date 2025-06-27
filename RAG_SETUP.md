# RAG (Retrieval-Augmented Generation) Setup Guide

This guide explains how to set up and use the RAG system for the Voice Market Advisor application.

## Overview

The RAG system enhances the AI assistant's responses by providing it with accurate, contextual product information from a vector database. When users ask questions, the system:

1. Converts the query to embeddings using OpenAI's API
2. Searches for similar documents in Supabase using pgvector
3. Retrieves relevant product information
4. Injects this context into the Gemini Live assistant's system prompt

## Prerequisites

1. **Supabase Project** with pgvector extension enabled
2. **OpenAI API Key** for embeddings
3. **Gemini API Key** for the chat functionality

## Environment Variables

Add these environment variables to your Supabase Edge Functions:

```bash
# Required for RAG functionality
OPENAI_API_KEY=your_openai_api_key_here

# Required for Gemini chat
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase configuration (should already be set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

### 1. Run the Migration

The migration file `supabase/migrations/20250625220000_add_documents_table.sql` will:

- Enable the pgvector extension
- Create the `documents` table with vector support
- Create the `match_documents` function for similarity search
- Set up appropriate RLS policies

### 2. Deploy the Migration

```bash
supabase db push
```

## Frontend Setup

### 1. Install Dependencies

The following packages have been added to `package.json`:

```json
{
  "@langchain/community": "^0.2.25",
  "@langchain/openai": "^0.1.25",
  "langchain": "^0.2.25"
}
```

Run:
```bash
npm install
```

### 2. Populate Documents

You can populate the documents table in two ways:

#### Option A: Using the Admin Interface
1. Navigate to `/admin/rag` in your application
2. Click "Populate Documents" to add product information to the vector database
3. Use "Clear Documents" to remove all documents if needed

#### Option B: Programmatically
```typescript
import { populateDocuments } from './src/lib/populate-documents';

// Populate documents with product information
await populateDocuments();
```

## How It Works

### 1. Document Structure

Each product is converted to a document with this structure:

```
Product: Sony Alpha 7R V
Category: cameras
Price: $3899 (was $4299)
Description: Professional full-frame mirrorless camera with 61MP sensor...
Features: 61MP Full-Frame Sensor, 8K Video Recording, 5-Axis Stabilization...
Rating: 4.8/5 (324 reviews)
Availability: In Stock
Badge: Professional
Discount: 9% off
```

### 2. RAG Process

1. **User Query**: "Tell me about cameras under $2000"
2. **Embedding**: Query is converted to 1536-dimensional vector
3. **Search**: Similar documents are retrieved using cosine similarity
4. **Context**: Relevant product information is formatted
5. **Response**: Context is injected into Gemini's system prompt

### 3. Backend Integration

The `gemini-chat` Edge Function has been updated to:

- Accept user queries
- Generate embeddings using OpenAI
- Search for similar documents in Supabase
- Inject relevant context into the system prompt
- Return contextual responses from Gemini

## Testing the RAG System

### 1. Admin Interface

Visit `/admin/rag` to:
- Populate documents with product data
- Test document search functionality
- Clear documents if needed

### 2. Voice Assistant

The voice assistant will automatically use RAG when:
- Users ask about specific products
- Users request recommendations
- Users ask about product features or pricing

### 3. Example Queries

Try these voice queries to test RAG:

- "What cameras do you have?"
- "Show me gaming products"
- "Tell me about the Sony camera"
- "What's the best laptop for professionals?"
- "Are there any wireless headphones?"

## Architecture

```
User Query → OpenAI Embeddings → Supabase pgvector → Relevant Documents → Gemini Context → AI Response
```

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure `OPENAI_API_KEY` is set in Supabase Edge Functions

2. **"No documents found"**
   - Run the document population process
   - Check if the `documents` table exists and has data

3. **"Embedding generation failed"**
   - Verify OpenAI API key is valid
   - Check OpenAI API quota and billing

4. **"Vector search failed"**
   - Ensure pgvector extension is enabled
   - Verify `match_documents` function exists

### Debugging

1. Check Supabase Edge Function logs:
   ```bash
   supabase functions logs gemini-chat
   ```

2. Verify documents table:
   ```sql
   SELECT COUNT(*) FROM documents;
   SELECT * FROM documents LIMIT 5;
   ```

3. Test vector search manually:
   ```sql
   SELECT * FROM match_documents(
     '[0.1, 0.2, ...]'::vector(1536),
     0.78,
     5
   );
   ```

## Performance Considerations

- **Embedding Generation**: ~100ms per query
- **Vector Search**: ~50ms for small datasets
- **Context Injection**: Minimal overhead
- **Total RAG Latency**: ~150-200ms additional

## Security

- OpenAI API key is only used server-side
- No sensitive data is exposed to the client
- RLS policies protect document access
- Vector embeddings are stored securely in Supabase

## Future Enhancements

1. **Caching**: Cache embeddings for common queries
2. **Hybrid Search**: Combine vector and keyword search
3. **Dynamic Updates**: Auto-update documents when products change
4. **Multi-modal**: Support image embeddings for product photos
5. **Personalization**: User-specific recommendations

## Support

For issues or questions about the RAG implementation, check:
1. Supabase documentation on pgvector
2. LangChain documentation
3. OpenAI embeddings API documentation
4. Project logs and error messages 