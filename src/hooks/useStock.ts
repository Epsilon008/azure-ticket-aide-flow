
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('🔍 Tentative de récupération des stats dashboard...');
      try {
        const result = await api.stock.getDashboardStats();
        console.log('✅ Stats dashboard récupérées:', result);
        return result;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des stats:', error);
        throw error;
      }
    },
  });
};

// Employee hooks
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      console.log('🔍 Tentative de récupération des employés...');
      try {
        const result = await api.employees.getAll();
        console.log('✅ Employés récupérés:', result);
        return result;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des employés:', error);
        throw error;
      }
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.employees.create,
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
      api.employees.update(id, data),
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
    mutationFn: api.employees.delete,
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
    queryFn: async () => {
      console.log('🔍 Tentative de récupération des équipements...');
      try {
        const result = await api.stock.getEquipments(filters);
        console.log('✅ Équipements récupérés:', result);
        return result;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des équipements:', error);
        throw error;
      }
    },
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.stock.createEquipment,
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
    queryFn: async () => {
      console.log('🔍 Tentative de récupération des catégories...');
      try {
        const result = await api.stock.getCategories();
        console.log('✅ Catégories récupérées:', result);
        return result;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des catégories:', error);
        throw error;
      }
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.stock.createCategory,
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
    queryFn: async () => {
      console.log('🔍 Tentative de récupération de l\'historique...');
      try {
        const result = await api.stock.getAssignmentHistory();
        console.log('✅ Historique récupéré:', result);
        return result;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération de l\'historique:', error);
        throw error;
      }
    },
  });
};

// Assignment d'équipement
export const useAssignEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.employees.assignEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Succès',
        description: 'Équipement attribué avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'attribution de l\'équipement',
        variant: 'destructive',
      });
    },
  });
};

// Authentication
export const useLogin = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
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
