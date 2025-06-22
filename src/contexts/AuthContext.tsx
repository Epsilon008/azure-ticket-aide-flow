
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

// Données fictives pour l'authentification temporaire
const MOCK_USERS = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Administrateur',
    role: 'admin' as const,
    password: 'admin123'
  },
  'user@example.com': {
    id: '2',
    email: 'user@example.com',
    name: 'Utilisateur',
    role: 'user' as const,
    password: 'user123'
  }
};

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
    
    // Authentification avec données fictives
    const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
    
    if (mockUser && mockUser.password === password) {
      const userData: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      };
      
      const mockToken = `mock-token-${Date.now()}`;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', mockToken);
      
      console.log('✅ Connexion réussie pour:', userData.email, 'Rôle:', userData.role);
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
