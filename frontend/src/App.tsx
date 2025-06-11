import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import VideoPlayer from './components/VideoPlayer';
import SearchInput from './components/SearchInput';
import TimestampLinks from './components/TimestampLinks';
import { processVideo, getVideoTimestamps } from './services/videoApi';
import { sendMessage, startNewSession, ChatMessage } from './services/chatApi';
import { searchVideoContent, SearchResult } from './services/searchApi';
import { generateTimestamps } from './services/timestampsApi';
import './App.css';

const App: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [currentVideo, setCurrentVideo] = useState<any>(null);
    const [timestamps, setTimestamps] = useState<any[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isConfigError, setIsConfigError] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        // Start a new chat session when the app loads
        const newSessionId = startNewSession();
        setSessionId(newSessionId);
    }, []);

    const handleVideoSubmit = async (url: string) => {
        console.log('🎥 Processing video:', url);
        if (!url.trim()) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        setIsLoading(true);
        setError('');
        setIsConfigError(false);
        setTimestamps([]);  // Clear timestamps immediately when starting processing
        
        try {
            // Process the video
            const result = await processVideo(url);
            console.log('📊 Video processing result:', result);
            
            // Update to use new response format
            setCurrentVideo({
                id: result.id,
                videoId: result.video_id,
                title: result.title,
                transcript: result.transcript,
                created_at: result.created_at
            });
            
            // Start new session for this video
            const newSessionId = startNewSession();
            setSessionId(newSessionId);
            
            console.log('✅ Video processed successfully:', result.title);
            
            // Clear previous chat and set up new session
            setChatMessages([]);
            
            // Generate AI-powered timestamps
            console.log('🕒 Generating timestamps for video...');
            try {
                const timestampsResult = await generateTimestamps(result.video_id);
                if (timestampsResult.success) {
                    setTimestamps(timestampsResult.timestamps);
                    console.log('✅ Timestamps generated successfully:', timestampsResult.timestamps.length);
                } else {
                    console.warn('⚠️ Timestamp generation failed:', timestampsResult.error);
                    setTimestamps([]);
                }
            } catch (timestampError) {
                console.error('❌ Error generating timestamps:', timestampError);
                setTimestamps([]);
            }
            
            setVideoUrl(url);
            
        } catch (err) {
            console.error('❌ Error processing video:', err);
            const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMsg);
            setIsConfigError(errorMsg.includes('API key') || errorMsg.includes('Configuration'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const url = formData.get('videoUrl') as string;
        console.log('📝 Form submitted with URL:', url);
        await handleVideoSubmit(url);
    };

    const handleChatMessage = async (message: string) => {
        console.log('💬 Sending chat message:', message);
        if (!message.trim()) return;

        // Add user message to chat
        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: Date.now(),
            videoContext: currentVideo ? { videoId: currentVideo.videoId } : undefined
        };
        
        setChatMessages(prev => [...prev, userMessage]);

        try {
            // Use videoId as jobId for backend compatibility
            const jobId = currentVideo?.videoId || sessionId;
            const response = await sendMessage(message, currentVideo?.videoId, jobId);
            console.log('🤖 Chat response:', response);
            
            if (response.success && response.message) {
                setChatMessages(prev => [...prev, response.message!]);
            } else {
                // Add error message
                const errorMessage: ChatMessage = {
                    id: `error_${Date.now()}`,
                    role: 'assistant',
                    content: response.error || 'Sorry, I encountered an error processing your message.',
                    timestamp: Date.now()
                };
                setChatMessages(prev => [...prev, errorMessage]);
            }
        } catch (err) {
            console.error('❌ Error sending chat message:', err);
            const errorMessage: ChatMessage = {
                id: `error_${Date.now()}`,
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: Date.now()
            };
            setChatMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleSearch = async (query: string, searchType: 'keyword' | 'visual' | 'semantic' = 'semantic') => {
        console.log('🔍 Searching:', query, 'Type:', searchType);
        if (!query.trim() || !currentVideo) return;

        try {
            const results = await searchVideoContent(query, currentVideo.videoId, searchType);
            console.log('📋 Search results:', results);
            if (results.success) {
                setSearchResults(results.results);
            } else {
                setError(results.error || 'Search failed');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('❌ Error searching:', err);
            setError('Search failed');
            setSearchResults([]);
        }
    };

    const handleTimestampClick = (timestamp: number) => {
        console.log('⏰ Jumping to timestamp:', timestamp);
        // This will be handled by the VideoPlayer component
    };

    return (
        <div className="app-container">
            <div className="app-header fade-in-up">
                <h1 className="app-title">🎥 Video Chat Application</h1>
                <p className="app-subtitle">Chat with videos, search content, and navigate with timestamps</p>
            </div>
            
            <div className="url-input-section fade-in-up">
                <form className="url-form" onSubmit={handleUrlSubmit}>
                    <input
                        type="text"
                        name="videoUrl"
                        placeholder="Paste your YouTube URL here..."
                        className="url-input"
                        disabled={isLoading}
                    />
                    <button type="submit" className="load-button" disabled={isLoading}>
                        {isLoading ? '⏳ Processing...' : '🎬 Load Video'}
                    </button>
                </form>
                
                {error && (
                    <div className={`error-message ${isConfigError ? 'config-error' : ''} fade-in-up`}>
                        <span className="icon">{isConfigError ? '⚙️' : '❌'}</span>
                        <div>
                            {error}
                            {isConfigError && (
                                <div className="config-help">
                                    <p>💡 <strong>Setup Required:</strong></p>
                                    <p>Please configure your API keys in the backend .env file:</p>
                                    <ul>
                                        <li>OPENAI_API_KEY=your_openai_key</li>
                                        <li>YOUTUBE_API_KEY=your_youtube_key</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {currentVideo ? (
                <div className="main-content">
                    <div className="fade-in-up">
                        <VideoPlayer 
                            videoUrl={videoUrl}
                            videoId={currentVideo.videoId}
                            title={currentVideo.title}
                            duration={currentVideo.duration}
                            thumbnailUrl={currentVideo.thumbnailUrl}
                        />
                        <TimestampLinks 
                            timestamps={timestamps} 
                            onTimestampClick={handleTimestampClick}
                        />
                    </div>
                    
                    <div className="fade-in-up">
                        <SearchInput 
                            onSearch={handleSearch}
                            results={searchResults}
                            onResultClick={handleTimestampClick}
                        />
                        <ChatInterface 
                            messages={chatMessages}
                            onSendMessage={handleChatMessage}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            ) : !isLoading ? (
                <div className="welcome-message fade-in-up">
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎬</div>
                            <h3>Video Analysis</h3>
                            <p>Automatically extract key moments and generate smart timestamps</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3>AI Chat</h3>
                            <p>Ask questions about the video content and get intelligent responses</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Visual Search</h3>
                            <p>Search for specific objects, scenes, or concepts within the video</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⏰</div>
                            <h3>Smart Navigation</h3>
                            <p>Jump to relevant sections with AI-generated timestamps</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading-message fade-in-up">
                    <div className="loading-spinner"></div> {/* Changed from emoji to div for CSS styling */}
                    <h3>Processing your video...</h3>
                    <p>This may take 30-60 seconds depending on video length</p>
                </div>
            )}
        </div>
    );
};

export default App;