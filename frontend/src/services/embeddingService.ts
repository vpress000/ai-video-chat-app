import { VideoMetadata, Transcript, SearchQuery } from '../types';
import { generateVideoEmbeddings, multimodalRAG } from '../utils/videoUtils';

export const createVideoEmbedding = async (videoId: string): Promise<number[]> => {
    const embeddings = await generateVideoEmbeddings(videoId);
    return embeddings;
};

export const getContextualResponse = async (query: SearchQuery, videoId: string): Promise<string> => {
    const embeddings = await createVideoEmbedding(videoId);
    const response = await multimodalRAG(query, embeddings);
    return response;
};