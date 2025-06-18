
export interface Ticket {
  id: string;
  _id?: string; // Pour la compatibilité avec MongoDB
  title: string;
  description: string;
  type: 'panne' | 'equipement';
  status: 'nouveau' | 'en-cours' | 'resolu' | 'ferme';
  priority: 'faible' | 'normale' | 'haute' | 'critique';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  solutions?: AISolution[];
  equipment?: EquipmentRequest;
}

export interface AISolution {
  id: string;
  solution: string;
  confidence: number;
  steps: string[];
  estimatedTime: string;
}

export interface EquipmentRequest {
  equipmentType: string;
  quantity: number;
  urgency: 'normale' | 'urgente';
  justification: string;
}

export type TicketFormData = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'solutions'>;
