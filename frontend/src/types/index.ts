export interface VideoMetadata {
    title: string;
    description: string;
    thumbnails: {
        default: string;
        medium: string;
        high: string;
    };
    channelTitle: string;
    publishTime: string;
    duration: string;
}

export interface Transcript {
    text: string;
    start: number;
    duration: number;
}

export interface SearchQuery {
    query: string;
    timestamp: number;
}