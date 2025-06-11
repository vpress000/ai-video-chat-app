const API_BASE_URL = 'http://localhost:5000/api';

export interface SearchResult {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  relevanceScore: number;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  query: string;
  searchType: 'keyword' | 'visual' | 'semantic';
  error?: string;
}

export const searchVideoContent = async (
  query: string,
  videoId: string,
  searchType: 'keyword' | 'visual' | 'semantic' = 'semantic'
): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        videoId,
        type: searchType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching video content:', error);
    return {
      success: false,
      results: [],
      query,
      searchType,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const searchKeywords = async (query: string, videoId: string): Promise<SearchResponse> => {
  return searchVideoContent(query, videoId, 'keyword');
};

export const searchVisualContent = async (query: string, videoId: string): Promise<SearchResponse> => {
  return searchVideoContent(query, videoId, 'visual');
};

export const searchSemantic = async (query: string, videoId: string): Promise<SearchResponse> => {
  return searchVideoContent(query, videoId, 'semantic');
};
