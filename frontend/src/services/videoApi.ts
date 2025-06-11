const API_BASE_URL = 'http://localhost:8000/api';

export interface VideoProcessResponse {
  id: number;
  video_id: string;
  title: string;
  transcript: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface TimestampResponse {
  success: boolean;
  timestamps: Array<{
    time: number;
    title: string;
    description: string;
  }>;
  error?: string;
}

export const processVideo = async (url: string): Promise<VideoProcessResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtube_url: url }),  // Changed to match Python backend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing video:', error);
    throw error; // Re-throw so the component can handle it
  }
};

export const getVideoTimestamps = async (videoId: string): Promise<TimestampResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/${videoId}/timestamps`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching timestamps:', error);
    return {
      success: false,
      timestamps: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const getVideoInfo = async (videoId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching video info:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};