
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockApi } from '@/services/stockApi';
import { useToast } from '@/hooks/use-toast';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => stockApi.dashboard.getStats(),
  });
};

// Employee hooks
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => stockApi.employees.getAll(),
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: stockApi.employees.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Succès',
        description: 'Employé créé avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de l\'employé',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      stockApi.employees.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Succès',
        description: 'Employé mis à jour avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de l\'employé',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: stockApi.employees.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Succès',
        description: 'Employé supprimé avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de l\'employé',
        variant: 'destructive',
      });
    },
  });
};

// Equipment hooks
export const useEquipments = (filters?: any) => {
  return useQuery({
    queryKey: ['equipments', filters],
    queryFn: () => stockApi.stock.getEquipments(filters),
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: stockApi.stock.createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Succès',
        description: 'Équipement créé avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de l\'équipement',
        variant: 'destructive',
      });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => stockApi.stock.getCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: stockApi.stock.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Succès',
        description: 'Catégorie créée avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la catégorie',
        variant: 'destructive',
      });
    },
  });
};

// Assignment history
export const useAssignmentHistory = () => {
  return useQuery({
    queryKey: ['assignment-history'],
    queryFn: () => stockApi.stock.getAssignmentHistory(),
  });
};

// Authentication
export const useLogin = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      stockApi.auth.login(email, password),
    onSuccess: (data) => {
      if (data.success && data.data) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        toast({
          title: 'Succès',
          description: 'Connexion réussie',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Email ou mot de passe incorrect',
        variant: 'destructive',
      });
    },
  });
};
