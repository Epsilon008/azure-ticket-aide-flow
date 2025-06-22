
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useTickets = (filters?: {
  status?: string;
  type?: string;
  priority?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => api.tickets.getAll(filters),
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => api.tickets.getById(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.tickets.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Succès',
        description: 'Ticket créé avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du ticket',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.tickets.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast({
        title: 'Succès',
        description: 'Ticket mis à jour avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du ticket',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.tickets.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Succès',
        description: 'Ticket supprimé avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression du ticket',
        variant: 'destructive',
      });
    },
  });
};

export const useGenerateAISolutions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.ai.generateSolutions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast({
        title: 'Succès',
        description: 'Solutions IA générées avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la génération des solutions',
        variant: 'destructive',
      });
    },
  });
};
