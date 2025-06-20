
const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const stockApi = {
  // Authentication
  auth: {
    login: async (email: string, password: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },

    register: async (userData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
  },

  // Dashboard
  dashboard: {
    getStats: async (): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/dashboard`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Employees
  employees: {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    create: async (employeeData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      return response.json();
    },

    update: async (id: string, employeeData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      return response.json();
    },

    delete: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    assignEquipment: async (assignmentData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assignmentData),
      });
      return response.json();
    },
  },

  // Stock/Equipment
  stock: {
    getEquipments: async (filters?: any): Promise<ApiResponse<any[]>> => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/stock/equipment?${params}`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    createEquipment: async (equipmentData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/equipment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipmentData),
      });
      return response.json();
    },

    updateEquipment: async (id: string, equipmentData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/equipment/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipmentData),
      });
      return response.json();
    },

    deleteEquipment: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/equipment/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    getCategories: async (): Promise<ApiResponse<any[]>> => {
      const response = await fetch(`${API_BASE_URL}/stock/categories`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    createCategory: async (categoryData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      return response.json();
    },

    getAssignmentHistory: async (): Promise<ApiResponse<any[]>> => {
      const response = await fetch(`${API_BASE_URL}/stock/assignments/history`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },
};
