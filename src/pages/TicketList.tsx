
import React, { useState } from 'react';
import { TicketCard } from '@/components/TicketCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/ticket';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '@/hooks/useTickets';

export const TicketList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: ticketsResponse, isLoading, error } = useTickets({
    status: statusFilter,
    type: typeFilter,
    search: searchTerm,
  });

  const tickets = ticketsResponse?.data || [];

  const handleTicketClick = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement des tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Erreur lors du chargement des tickets</p>
        <p className="text-gray-400 text-sm mt-2">
          Vérifiez que le serveur backend est démarré
        </p>
      </div>
    );
  }

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
        {tickets.map((ticket: Ticket) => (
          <TicketCard
            key={ticket._id || ticket.id}
            ticket={ticket}
            onClick={() => handleTicketClick(ticket._id || ticket.id)}
          />
        ))}
      </div>

      {tickets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun ticket trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Créez votre premier ticket'
            }
          </p>
        </div>
      )}
    </div>
  );
};
