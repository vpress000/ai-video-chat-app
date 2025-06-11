import React, { useState } from 'react';

interface Timestamp {
  time: number;
  title: string;
  description: string;
}

interface TimestampLinksProps {
  timestamps: Timestamp[];
  onTimestampClick?: (timestamp: number) => void;
  currentTime?: number;
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

const TimestampLinks: React.FC<TimestampLinksProps> = ({ 
  timestamps, 
  onTimestampClick,
  currentTime 
}) => {
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);

  const handleTimestampClick = (timestamp: number, index: number) => {
    console.log('🔗 Timestamp clicked:', timestamp);
    setActiveTimestamp(index);
    if (onTimestampClick) {
      onTimestampClick(timestamp);
    }
    
    // Reset active state after a short delay
    setTimeout(() => {
      setActiveTimestamp(null);
    }, 1000);
  };

  const getTimestampIcon = (index: number): string => {
    const icons = ['🎬', '📖', '💡', '🎯', '⭐', '🔍', '💬', '🎨'];
    return icons[index % icons.length];
  };

  return (
    <div className="timestamp-links card enhanced">
      <div className="timestamp-header">
        <h3 className="card-title">⏰ Video Timestamps</h3>
        {timestamps.length > 0 && (
          <span className="timestamp-count">
            {timestamps.length} sections
          </span>
        )}
      </div>
      
      {timestamps.length === 0 ? (
        <div className="no-timestamps">
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h4>Timestamps will appear here</h4>
            <p>AI-generated timestamps will show up after video processing</p>
          </div>
        </div>
      ) : (
        <div className="timestamp-list">
          {timestamps.map((timestamp, index) => (
            <div 
              key={index} 
              className={`timestamp-item enhanced ${activeTimestamp === index ? 'active' : ''} ${
                currentTime && Math.abs(currentTime - timestamp.time) < 30 ? 'current' : ''
              }`}
              onClick={() => handleTimestampClick(timestamp.time, index)}
            >
              <div className="timestamp-marker">
                <span className="timestamp-icon">{getTimestampIcon(index)}</span>
                <span className="timestamp-time">{formatTime(timestamp.time)}</span>
              </div>
              
              <div className="timestamp-content">
                <h4 className="timestamp-title">{timestamp.title}</h4>
                <p className="timestamp-description">{timestamp.description}</p>
              </div>
              
              <div className="timestamp-action">
                <span className="jump-button">▶️</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimestampLinks;