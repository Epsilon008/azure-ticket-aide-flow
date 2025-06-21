
import React from 'react';
import { TicketForm } from '@/components/TicketForm';
import { TicketFormData } from '@/types/ticket';
import { useNavigate } from 'react-router-dom';
import { useCreateTicket, useGenerateAISolutions } from '@/hooks/useTickets';
import { useToast } from '@/hooks/use-toast';

export const NewTicket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createTicketMutation = useCreateTicket();
  const generateSolutionsMutation = useGenerateAISolutions();

  const handleSubmit = async (ticketData: TicketFormData) => {
    console.log('Attempting to create ticket:', ticketData);
    
    try {
      // Créer le ticket
      const response = await createTicketMutation.mutateAsync(ticketData);
      console.log('Ticket creation response:', response);
      
      if (response.success && response.data) {
        const ticketId = response.data._id || response.data.id;
        console.log('Ticket created with ID:', ticketId);
        
        // Si c'est un ticket de panne, générer automatiquement les solutions IA
        if (ticketData.type === 'panne') {
          try {
            await generateSolutionsMutation.mutateAsync(ticketId);
            toast({
              title: "Succès",
              description: "Ticket créé et solutions IA générées avec succès",
            });
          } catch (aiError) {
            console.error('Erreur lors de la génération des solutions IA:', aiError);
            toast({
              title: "Ticket créé",
              description: "Ticket créé mais erreur lors de la génération des solutions IA",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Succès", 
            description: "Ticket créé avec succès",
          });
        }
        
        // Rediriger vers le détail du ticket
        navigate(`/ticket/${ticketId}`);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      
      // Message d'erreur plus détaillé selon le type d'erreur
      let errorMessage = "Erreur lors de la création du ticket";
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Impossible de contacter le serveur. Vérifiez que le serveur backend est démarré sur le port 5000.";
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Ticket</h1>
      </div>
      
      <TicketForm 
        onSubmit={handleSubmit}
      />
    </div>
  );
};
