import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
    videoUrl?: string;
    videoId?: string;
    title?: string;
    duration?: number;
    thumbnailUrl?: string;
    onTimeUpdate?: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
    videoUrl = "", 
    videoId,
    title,
    duration,
    thumbnailUrl,
    onTimeUpdate 
}) => {
    const videoRef = useRef<HTMLIFrameElement>(null);
    const [currentVideoId, setCurrentVideoId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log('VideoPlayer useEffect - videoId:', videoId, 'videoUrl:', videoUrl);
        
        if (videoId) {
            setIsLoading(true);
            setCurrentVideoId(videoId);
            const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
            console.log('Setting iframe src to:', embedUrl);
            
            if (videoRef.current) {
                videoRef.current.src = embedUrl;
            }
            // Simulate loading time for better UX
            setTimeout(() => {
                console.log('VideoPlayer loading finished');
                setIsLoading(false);
            }, 1000);
        } else if (videoUrl) {
            const extractedVideoId = extractVideoId(videoUrl);
            console.log('Extracted videoId from URL:', extractedVideoId);
            
            if (extractedVideoId) {
                setIsLoading(true);
                setCurrentVideoId(extractedVideoId);
                const embedUrl = `https://www.youtube.com/embed/${extractedVideoId}?enablejsapi=1&origin=${window.location.origin}`;
                console.log('Setting iframe src to:', embedUrl);
                
                if (videoRef.current) {
                    videoRef.current.src = embedUrl;
                }
                setTimeout(() => {
                    console.log('VideoPlayer loading finished');
                    setIsLoading(false);
                }, 1000);
            }
        }
    }, [videoUrl, videoId]);

    const extractVideoId = (url: string): string => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
        const match = url.match(regex);
        return match ? match[1] : '';
    };

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-player card enhanced">
            <div className="video-header">
                <h3 className="card-title">🎥 Video Player</h3>
                {title && (
                    <div className="video-info">
                        <h4 className="video-title">{title}</h4>
                        {duration && (
                            <span className="video-duration">
                                ⏱️ {formatDuration(duration)}
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            <div className="video-container">
                {currentVideoId ? (
                    <>
                        {isLoading && (
                            <div className="video-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading video...</p>
                            </div>
                        )}
                        <iframe
                            ref={videoRef}
                            className={`video-iframe ${isLoading ? 'loading' : ''}`}
                            title={title || "Video Player"}
                            frameBorder="0"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            width="100%"
                            height="315"
                            style={{ 
                                display: isLoading ? 'none' : 'block',
                                minHeight: '315px',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                        />
                        {thumbnailUrl && isLoading && (
                            <div className="video-thumbnail">
                                <img src={thumbnailUrl} alt={title || "Video thumbnail"} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="video-placeholder enhanced">
                        <div className="placeholder-content">
                            <div className="placeholder-icon">🎬</div>
                            <h3>Ready to analyze your video</h3>
                            <p>Enter a YouTube URL above to get started</p>
                            <div className="features-list">
                                <div className="feature">✨ AI-powered timestamps</div>
                                <div className="feature">💬 Chat with video content</div>
                                <div className="feature">🔍 Visual content search</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;