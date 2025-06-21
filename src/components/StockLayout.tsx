
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Ticket, 
  Settings, 
  LogOut,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface StockLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/stock/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Employés',
    href: '/stock/employees',
    icon: Users,
  },
  {
    title: 'Stock',
    href: '/stock/equipment',
    icon: Package,
  },
  {
    title: 'Tickets',
    href: '/stock/tickets',
    icon: Ticket,
  },
  {
    title: 'Paramètres',
    href: '/stock/settings',
    icon: Settings,
  },
];

export const StockLayout = ({ children }: StockLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white w-64 min-h-screen p-4">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-6 w-6" />
            <h1 className="text-xl font-bold">Gestion Stock</h1>
          </div>
          <p className="text-blue-200 text-sm">Module administrateur</p>
          {user && (
            <div className="mt-4 p-2 bg-blue-700 rounded text-sm">
              <p className="font-medium">{user.username}</p>
              <p className="text-blue-200">{user.department}</p>
            </div>
          )}
        </div>
        
        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-transparent border-blue-400 text-blue-100 hover:bg-blue-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};
