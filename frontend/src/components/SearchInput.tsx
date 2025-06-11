import React, { useState } from 'react';

interface SearchResult {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  relevanceScore: number;
}

interface SearchInputProps {
  onSearch: (query: string, searchType?: 'keyword' | 'visual' | 'semantic') => void;
  results?: SearchResult[];
  onResultClick?: (timestamp: number) => void;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, results = [], onResultClick }) => {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'keyword' | 'visual' | 'semantic'>('semantic');

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        if (query.trim()) {
            console.log('🔍 Searching:', query, 'Type:', searchType);
            onSearch(query, searchType);
        }
    };

    const handleResultClick = (timestamp: number) => {
        console.log('📍 Search result clicked:', timestamp);
        if (onResultClick) {
            onResultClick(timestamp);
        }
    };

    return (
        <div className="search-container card">
            <h3 className="card-title">🔍 Visual Content Search</h3>
            <form onSubmit={handleSearch}>
                <div className="search-type-selector">
                    <label>
                        <input
                            type="radio"
                            value="semantic"
                            checked={searchType === 'semantic'}
                            onChange={(e) => setSearchType(e.target.value as any)}
                        />
                        🧠 Semantic
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="visual"
                            checked={searchType === 'visual'}
                            onChange={(e) => setSearchType(e.target.value as any)}
                        />
                        👁️ Visual
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="keyword"
                            checked={searchType === 'keyword'}
                            onChange={(e) => setSearchType(e.target.value as any)}
                        />
                        🔤 Keyword
                    </label>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for objects in video (e.g., 'red car', 'person walking')..."
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    🚀 Search Content
                </button>
            </form>

            {results.length > 0 && (
                <div className="search-results">
                    <h4>Search Results:</h4>
                    {results.map((result) => (
                        <div 
                            key={result.id} 
                            className="search-result-item clickable"
                            onClick={() => handleResultClick(result.timestamp)}
                        >
                            <span className="result-time">{formatTime(result.timestamp)}</span>
                            <div className="result-content">
                                <span className="result-title">{result.title}</span>
                                <span className="result-description">{result.description}</span>
                                <span className="result-score">Relevance: {Math.round(result.relevanceScore * 100)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchInput;