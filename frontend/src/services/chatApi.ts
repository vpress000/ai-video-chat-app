const API_BASE_URL = 'http://localhost:8000/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  videoContext?: {
    videoId: string;
    timestamp?: number;
  };
}

export interface ChatResponse {
  success: boolean;
  message?: ChatMessage;
  sessionId?: string;
  error?: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  videoId?: string;
}

let currentSessionId: string | null = null;

export const sendMessage = async (
  message: string,
  videoId?: string,
  sessionId?: string
): Promise<ChatResponse> => {
  try {
    const jobId = sessionId || currentSessionId || videoId || 'default';
    const response = await fetch(`${API_BASE_URL}/chat/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        videoId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Update current session ID
    if (data.sessionId) {
      currentSessionId = data.sessionId;
    }

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const getChatHistory = async (sessionId: string): Promise<ChatSession | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/history`, {
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
    console.error('Error fetching chat history:', error);
    return null;
  }
};

export const startNewSession = (videoId?: string): string => {
  currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return currentSessionId;
};

export const getCurrentSessionId = (): string | null => {
  return currentSessionId;
};

export const clearSession = (): void => {
  currentSessionId = null;
};
