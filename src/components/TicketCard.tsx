
import React from 'react';
import { Ticket } from '@/types/ticket';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Wrench, Clock, User } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'nouveau': return 'bg-blue-100 text-blue-800';
    case 'en-cours': return 'bg-yellow-100 text-yellow-800';
    case 'resolu': return 'bg-green-100 text-green-800';
    case 'ferme': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critique': return 'bg-red-100 text-red-800';
    case 'haute': return 'bg-orange-100 text-orange-800';
    case 'normale': return 'bg-blue-100 text-blue-800';
    case 'faible': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {ticket.title}
          </CardTitle>
          <div className="flex items-center space-x-1 ml-2">
            {ticket.type === 'panne' ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <Wrench className="h-4 w-4 text-blue-500" />
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(ticket.status)} variant="secondary">
            {ticket.status}
          </Badge>
          <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
            {ticket.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {ticket.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{ticket.assignedTo}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
