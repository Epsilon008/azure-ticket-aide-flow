
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
  console.log('🔑 Token utilisé pour l\'authentification:', token ? 'Présent' : 'Absent');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response, endpoint: string) => {
  console.log(`📡 Réponse ${endpoint}:`, response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Erreur ${endpoint}:`, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log(`✅ Données ${endpoint}:`, data);
  return data;
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

      const response = await fetch(`${API_BASE_URL}/tickets?${params}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'tickets');
    },

    getById: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, `tickets/${id}`);
    },

    create: async (ticketData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticketData),
      });
      return handleResponse(response, 'tickets/create');
    },

    update: async (id: string, ticketData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticketData),
      });
      return handleResponse(response, 'tickets/update');
    },

    delete: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'tickets/delete');
    },

    addSolutions: async (id: string, solutions: any[]): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/solutions`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ solutions }),
      });
      return handleResponse(response, 'tickets/solutions');
    },
  },

  // AI endpoints
  ai: {
    generateSolutions: async (ticketId: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/ai/generate-solutions/${ticketId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'ai/generate-solutions');
    },

    previewSolutions: async (description: string, title?: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/ai/preview-solutions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ description, title }),
      });
      return handleResponse(response, 'ai/preview-solutions');
    },
  },

  // Authentication
  auth: {
    login: async (email: string, password: string): Promise<ApiResponse<any>> => {
      console.log('🔐 Tentative de connexion pour:', email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response, 'auth/login');
    },

    register: async (userData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response, 'auth/register');
    },
  },

  // Stock/Equipment
  stock: {
    getEquipments: async (filters?: any): Promise<ApiResponse<any[]>> => {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/stock/equipment?${params}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'stock/equipment');
    },

    createEquipment: async (equipmentData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/equipment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipmentData),
      });
      return handleResponse(response, 'stock/equipment/create');
    },

    updateEquipment: async (id: string, equipmentData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/equipment/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipmentData),
      });
      return handleResponse(response, 'stock/equipment/update');
    },

    deleteEquipment: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/equipment/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'stock/equipment/delete');
    },

    getCategories: async (): Promise<ApiResponse<any[]>> => {
      const response = await fetch(`${API_BASE_URL}/stock/categories`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'stock/categories');
    },

    createCategory: async (categoryData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      return handleResponse(response, 'stock/categories/create');
    },

    getAssignmentHistory: async (): Promise<ApiResponse<any[]>> => {
      const response = await fetch(`${API_BASE_URL}/stock/assignments/history`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'stock/assignments/history');
    },

    getDashboardStats: async (): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/stock/dashboard`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'stock/dashboard');
    },
  },

  // Employees
  employees: {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      console.log('👥 Récupération des employés...');
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'employees');
    },

    create: async (employeeData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      return handleResponse(response, 'employees/create');
    },

    update: async (id: string, employeeData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      return handleResponse(response, 'employees/update');
    },

    delete: async (id: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response, 'employees/delete');
    },

    assignEquipment: async (assignmentData: any): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/employees/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assignmentData),
      });
      return handleResponse(response, 'employees/assign');
    },
  },
};
