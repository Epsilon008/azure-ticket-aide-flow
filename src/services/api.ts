
const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Helper function to handle fetch errors
const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status}:`, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response;
};

// Helper function to make API calls with better error handling
const apiCall = async (url: string, options?: RequestInit): Promise<any> => {
  try {
    console.log(`Making API call to: ${url}`, options);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    await handleFetchError(response);
    const data = await response.json();
    console.log(`API response from ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

export const api = {
  // Tickets endpoints
  tickets: {
    getAll: async (filters?: {
      status?: string;
      type?: string;
      priority?: string;
      search?: string;
    }): Promise<ApiResponse<any[]>> => {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);

      return apiCall(`${API_BASE_URL}/tickets?${params}`);
    },

    getById: async (id: string): Promise<ApiResponse<any>> => {
      return apiCall(`${API_BASE_URL}/tickets/${id}`);
    },

    create: async (ticketData: any): Promise<ApiResponse<any>> => {
      return apiCall(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });
    },

    update: async (id: string, ticketData: any): Promise<ApiResponse<any>> => {
      return apiCall(`${API_BASE_URL}/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ticketData),
      });
    },

    delete: async (id: string): Promise<ApiResponse<any>> => {
      return apiCall(`${API_BASE_URL}/tickets/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // AI endpoints
  ai: {
    generateSolutions: async (ticketId: string): Promise<ApiResponse<any>> => {
      return apiCall(`${API_BASE_URL}/ai/generate-solutions/${ticketId}`, {
        method: 'POST',
      });
    },

    previewSolutions: async (description: string, title?: string): Promise<ApiResponse<any>> => {
      return apiCall(`${API_BASE_URL}/ai/preview-solutions`, {
        method: 'POST',
        body: JSON.stringify({ description, title }),
      });
    },
  },
};
