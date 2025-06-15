
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Ticket, Plus, Settings, BarChart3, Wrench, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Tickets',
    href: '/',
    icon: Ticket,
  },
  {
    title: 'Nouveau Ticket',
    href: '/nouveau-ticket',
    icon: Plus,
  },
  {
    title: 'Pannes',
    href: '/pannes',
    icon: AlertTriangle,
  },
  {
    title: 'Équipements',
    href: '/equipements',
    icon: Wrench,
  },
  {
    title: 'Statistiques',
    href: '/statistiques',
    icon: BarChart3,
  },
  {
    title: 'Paramètres',
    href: '/parametres',
    icon: Settings,
  },
];

export const Sidebar = () => {
  return (
    <div className="bg-blue-600 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Gestion Tickets</h1>
        <p className="text-blue-200 text-sm">Système d'intervention</p>
      </div>
      
      <nav className="space-y-2">
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
    </div>
  );
};
