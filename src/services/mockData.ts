
import { Ticket } from '@/types/ticket';

// Données fictives pour les tickets
export const mockTickets: Ticket[] = [
  {
    id: '1',
    _id: '1',
    title: 'Problème d\'imprimante réseau',
    description: 'L\'imprimante du service comptabilité ne répond plus depuis ce matin',
    type: 'panne',
    status: 'nouveau',
    priority: 'haute',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
    assignedTo: 'Équipe IT'
  },
  {
    id: '2',
    _id: '2',
    title: 'Demande d\'ordinateur portable',
    description: 'Nouveau collaborateur dans l\'équipe marketing, besoin d\'un ordinateur portable pour le télétravail',
    type: 'equipement',
    status: 'en-cours',
    priority: 'normale',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T08:15:00Z',
    assignedTo: 'Service Stock',
    equipment: {
      equipmentType: 'Ordinateur portable',
      quantity: 1,
      urgency: 'normale',
      justification: 'Nouveau collaborateur - télétravail'
    }
  },
  {
    id: '3',
    _id: '3',
    title: 'Écran défaillant bureau 205',
    description: 'L\'écran du bureau 205 présente des lignes verticales et scintille',
    type: 'panne',
    status: 'resolu',
    priority: 'faible',
    createdAt: '2024-01-10T11:45:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    assignedTo: 'Technicien Hardware'
  },
  {
    id: '4',
    _id: '4',
    title: 'Mise à jour logiciel comptabilité',
    description: 'Le logiciel de comptabilité doit être mis à jour vers la dernière version',
    type: 'panne',
    status: 'en-cours',
    priority: 'normale',
    createdAt: '2024-01-13T16:00:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    assignedTo: 'Admin Système'
  },
  {
    id: '5',
    _id: '5',
    title: 'Souris et clavier ergonomiques',
    description: 'Demande d\'équipements ergonomiques pour prévenir les TMS',
    type: 'equipement',
    status: 'nouveau',
    priority: 'faible',
    createdAt: '2024-01-15T13:15:00Z',
    updatedAt: '2024-01-15T13:15:00Z',
    equipment: {
      equipmentType: 'Périphériques ergonomiques',
      quantity: 2,
      urgency: 'normale',
      justification: 'Prévention des troubles musculo-squelettiques'
    }
  }
];

// Fonction pour simuler un délai d'API
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Fonction pour filtrer les tickets selon les critères
export const filterTickets = (
  tickets: Ticket[],
  filters: {
    status?: string;
    type?: string;
    priority?: string;
    search?: string;
  }
): Ticket[] => {
  return tickets.filter(ticket => {
    // Filtre par statut
    if (filters.status && filters.status !== 'all' && ticket.status !== filters.status) {
      return false;
    }
    
    // Filtre par type
    if (filters.type && filters.type !== 'all' && ticket.type !== filters.type) {
      return false;
    }
    
    // Filtre par priorité
    if (filters.priority && filters.priority !== 'all' && ticket.priority !== filters.priority) {
      return false;
    }
    
    // Recherche textuelle
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};
