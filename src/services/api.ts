
import { mockTickets, simulateApiDelay, filterTickets } from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = true; // Basculer à false pour utiliser le vrai backend

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Fonction utilitaire pour créer une réponse API mockée
const createMockResponse = <T>(data: T, count?: number): ApiResponse<T> => ({
  success: true,
  data,
  count: count ?? (Array.isArray(data) ? data.length : undefined)
});

export const api = {
  // Tickets endpoints
  tickets: {
    getAll: async (filters?: {
      status?: string;
      type?: string;
      priority?: string;
      search?: string;
    }): Promise<ApiResponse<any[]>> => {
      if (USE_MOCK_DATA) {
        console.log('🔄 Utilisation des données fictives pour les tickets');
        await simulateApiDelay();
        const filteredTickets = filterTickets(mockTickets, filters || {});
        return createMockResponse(filteredTickets);
      }

      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/tickets?${params}`);
      return response.json();
    },

    getById: async (id: string): Promise<ApiResponse<any>> => {
      if (USE_MOCK_DATA) {
        console.log('🔄 Recherche du ticket:', id);
        await simulateApiDelay();
        const ticket = mockTickets.find(t => t.id === id || t._id === id);
        if (ticket) {
          return createMockResponse(ticket);
        } else {
          return {
            success: false,
            message: 'Ticket non trouvé'
          };
        }
      }

      const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
      return response.json();
    },

    create: async (ticketData: any): Promise<ApiResponse<any>> => {
      if (USE_MOCK_DATA) {
        console.log('🔄 Création d\'un nouveau ticket:', ticketData);
        await simulateApiDelay();
        
        const newTicket = {
          ...ticketData,
          id: Date.now().toString(),
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'nouveau'
        };
        
        mockTickets.unshift(newTicket);
        return createMockResponse(newTicket);
      }

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
      if (USE_MOCK_DATA) {
        console.log('🔄 Mise à jour du ticket:', id, ticketData);
        await simulateApiDelay();
        
        const ticketIndex = mockTickets.findIndex(t => t.id === id || t._id === id);
        if (ticketIndex !== -1) {
          mockTickets[ticketIndex] = {
            ...mockTickets[ticketIndex],
            ...ticketData,
            updatedAt: new Date().toISOString()
          };
          return createMockResponse(mockTickets[ticketIndex]);
        } else {
          return {
            success: false,
            message: 'Ticket non trouvé'
          };
        }
      }

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
      if (USE_MOCK_DATA) {
        console.log('🔄 Suppression du ticket:', id);
        await simulateApiDelay();
        
        const ticketIndex = mockTickets.findIndex(t => t.id === id || t._id === id);
        if (ticketIndex !== -1) {
          mockTickets.splice(ticketIndex, 1);
          return {
            success: true,
            message: 'Ticket supprimé avec succès'
          };
        } else {
          return {
            success: false,
            message: 'Ticket non trouvé'
          };
        }
      }

      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // AI endpoints
  ai: {
    generateSolutions: async (ticketId: string): Promise<ApiResponse<any>> => {
      if (USE_MOCK_DATA) {
        console.log('🔄 Génération de solutions IA pour:', ticketId);
        await simulateApiDelay(1000);
        
        const mockSolutions = [
          {
            solution: 'Redémarrer l\'équipement et vérifier les connexions',
            confidence: 85,
            steps: [
              'Éteindre complètement l\'équipement',
              'Débrancher le câble d\'alimentation pendant 30 secondes',
              'Vérifier toutes les connexions (réseau, USB, etc.)',
              'Redémarrer l\'équipement'
            ],
            estimatedTime: '15 minutes'
          },
          {
            solution: 'Mettre à jour les pilotes et logiciels',
            confidence: 70,
            steps: [
              'Identifier le modèle exact de l\'équipement',
              'Télécharger les derniers pilotes depuis le site du fabricant',
              'Désinstaller les anciens pilotes',
              'Installer les nouveaux pilotes'
            ],
            estimatedTime: '30 minutes'
          }
        ];
        
        return createMockResponse(mockSolutions);
      }

      const response = await fetch(`${API_BASE_URL}/ai/generate-solutions/${ticketId}`, {
        method: 'POST',
      });
      return response.json();
    },

    previewSolutions: async (description: string, title?: string): Promise<ApiResponse<any>> => {
      if (USE_MOCK_DATA) {
        console.log('🔄 Aperçu des solutions IA pour:', title);
        await simulateApiDelay(800);
        
        const mockPreview = [
          {
            solution: 'Solution préliminaire basée sur la description',
            confidence: 75,
            steps: [
              'Analyser le problème décrit',
              'Identifier les causes possibles',
              'Appliquer la solution la plus probable'
            ],
            estimatedTime: '20 minutes'
          }
        ];
        
        return createMockResponse(mockPreview);
      }

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
