const API_BASE_URL = 'http://localhost:8000/api';

export interface Timestamp {
  time: number;
  title: string;
  description: string;
}

export interface TimestampsResponse {
  success: boolean;
  timestamps: Timestamp[];
  error?: string;
}

export const generateTimestamps = async (videoId: string): Promise<TimestampsResponse> => {
  try {
    console.log('🕒 Generating timestamps for video:', videoId);
    
    const response = await fetch(`${API_BASE_URL}/timestamps/${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📍 Timestamps response:', data);
    
    return data;
  } catch (error) {
    console.error('Error generating timestamps:', error);
    return {
      success: false,
      timestamps: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
