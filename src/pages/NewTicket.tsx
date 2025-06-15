
import React from 'react';
import { TicketForm } from '@/components/TicketForm';
import { TicketFormData } from '@/types/ticket';
import { useNavigate } from 'react-router-dom';

export const NewTicket = () => {
  const navigate = useNavigate();

  const handleSubmit = (ticketData: TicketFormData) => {
    // Ici on enverrait les données au backend
    console.log('Nouveau ticket:', ticketData);
    
    // Simuler la création du ticket
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Ticket</h1>
      </div>
      
      <TicketForm onSubmit={handleSubmit} />
    </div>
  );
};
