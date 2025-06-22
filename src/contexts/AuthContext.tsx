
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/stock';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Données fictives pour la démonstration
const mockUsers = [
  {
    id: '1',
    username: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    department: 'IT'
  },
  {
    id: '2',
    username: 'Utilisateur',
    email: 'user@example.com',
    password: 'user123',
    role: 'user' as const,
    department: 'Support'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier s'il y a un utilisateur connecté dans le localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ Utilisateur restauré depuis localStorage:', parsedUser.email);
      } catch (error) {
        console.error('❌ Erreur lors de la restauration de l\'utilisateur:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Tentative de connexion pour:', email);
    
    // Simuler un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        department: foundUser.department
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', `mock-token-${foundUser.id}`);
      
      console.log('✅ Connexion réussie pour:', foundUser.email, 'Rôle:', foundUser.role);
      return true;
    } else {
      console.log('❌ Échec de la connexion pour:', email);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion de l\'utilisateur:', user?.email);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
