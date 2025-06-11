import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  videoContext?: {
    videoId: string;
    timestamp?: number;
  };
}

interface ChatInterfaceProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages = [], 
  onSendMessage,
  isLoading = false 
}) => {
    const [query, setQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (query.trim() && onSendMessage && !isLoading) {
            console.log('💬 Sending message:', query);
            onSendMessage(query);
            setQuery('');
        }
    };

    return (
        <div className="chat-interface card">
            <h3 className="card-title">💬 Chat with Video</h3>
            <div className="chat-messages">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message.id} className={`message ${message.role}`}>
                            <div className="message-header">
                                <span className="message-role">
                                    {message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
                                </span>
                                <span className="message-time">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                            <div className="message-content">
                                {message.content}
                            </div>
                            {message.videoContext?.timestamp && (
                                <div className="message-context">
                                    📍 Related to timestamp: {message.videoContext.timestamp}s
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="placeholder-message">
                        💡 Ask me anything about the video! For example:
                        <ul>
                            <li>"What is this video about?"</li>
                            <li>"Summarize the main points"</li>
                            <li>"What happens at 2:30?"</li>
                            <li>"Find sections about [topic]"</li>
                        </ul>
                    </div>
                )}
                {isLoading && (
                    <div className="message assistant loading">
                        <div className="message-header">
                            <span className="message-role">🤖 AI Assistant</span>
                        </div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <textarea
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Ask anything about this video..."
                    className="chat-input"
                    disabled={isLoading}
                    rows={1} // Start with a single row, CSS will handle expansion
                />
                <button 
                    type="submit" 
                    className="chat-send-button"
                    disabled={isLoading || !query.trim()}
                >
                    {isLoading ? '⏳' : '➤'}
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;