import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Database, Trash2, Search } from 'lucide-react';
import { useRAG } from '../hooks/useRAG';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export function RAGAdmin() {
  const { populateDocuments, clearDocuments, searchDocuments, isLoading, error } = useRAG();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handlePopulateDocuments = async () => {
    try {
      await populateDocuments();
      toast.success('Documents populated successfully!');
    } catch (err) {
      toast.error('Failed to populate documents');
    }
  };

  const handleClearDocuments = async () => {
    try {
      await clearDocuments();
      toast.success('Documents cleared successfully!');
    } catch (err) {
      toast.error('Failed to clear documents');
    }
  };

  const handleSearchDocuments = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    try {
      const results = await searchDocuments(searchQuery);
      setSearchResults(results);
      toast.success(`Found ${results.length} documents`);
    } catch (err) {
      toast.error('Failed to search documents');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            RAG Document Management
          </CardTitle>
          <CardDescription>
            Manage the vector database for Retrieval-Augmented Generation. This allows the AI assistant to provide accurate product information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handlePopulateDocuments} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Populate Documents
            </Button>

            <Button 
              onClick={handleClearDocuments} 
              disabled={isLoading}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Clear Documents
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• Populate Documents: Adds product information to the vector database</p>
            <p>• Clear Documents: Removes all documents from the vector database</p>
            <p>• The AI assistant will automatically use this information when answering questions</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Test Document Search
          </CardTitle>
          <CardDescription>
            Test the document search functionality to see how RAG works.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter search query (e.g., 'camera', 'gaming', 'wireless')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
            />
            <Button 
              onClick={handleSearchDocuments} 
              disabled={isLoading || !searchQuery.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Search Results:</h4>
              {searchResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-md bg-muted/50">
                  <pre className="text-sm whitespace-pre-wrap">{result.content}</pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 