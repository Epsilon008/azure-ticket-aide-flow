
import React, { useState, useEffect } from 'react';
import { TicketCard } from '@/components/TicketCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/ticket';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Données de test
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Ordinateur ne démarre plus',
    description: 'Le PC portable de bureau ne s\'allume plus depuis ce matin',
    type: 'panne',
    status: 'nouveau',
    priority: 'haute',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    assignedTo: 'Jean Dupont'
  },
  {
    id: '2',
    title: 'Demande nouvel écran',
    description: 'Besoin d\'un second écran pour améliorer la productivité',
    type: 'equipement',
    status: 'en-cours',
    priority: 'normale',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    equipment: {
      equipmentType: 'Écran 24 pouces',
      quantity: 1,
      urgency: 'normale',
      justification: 'Travail sur plusieurs applications simultanément'
    }
  }
];

export const TicketList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleTicketClick = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Tickets</h1>
        <Button 
          onClick={() => navigate('/nouveau-ticket')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau ticket
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="nouveau">Nouveau</SelectItem>
            <SelectItem value="en-cours">En cours</SelectItem>
            <SelectItem value="resolu">Résolu</SelectItem>
            <SelectItem value="ferme">Fermé</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="panne">Panne</SelectItem>
            <SelectItem value="equipement">Équipement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => handleTicketClick(ticket.id)}
          />
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun ticket trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};
