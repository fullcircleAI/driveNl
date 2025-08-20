const API_BASE_URL = 'http://localhost:3001/api';

export interface AnalysisResult {
  confidence: number;
  similarCases: Array<{
    id: number;
    similarity: number;
    description: string;
  }>;
  recommendations: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const analyzeCase = async (input: string): Promise<ApiResponse<AnalysisResult>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze case');
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}; 