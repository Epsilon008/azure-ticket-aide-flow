
const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

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

      const response = await fetch(`${API_BASE_URL}/tickets?${params}`);
      return response.json();
    },

    getById: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
      return response.json();
    },

    create: async (ticketData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      return response.json();
    },

    update: async (id: string, ticketData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      return response.json();
    },

    delete: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // AI endpoints
  ai: {
    generateSolutions: async (ticketId: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/ai/generate-solutions/${ticketId}`, {
        method: 'POST',
      });
      return response.json();
    },

    previewSolutions: async (description: string, title?: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/ai/preview-solutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, title }),
      });
      return response.json();
    },
  },
};
