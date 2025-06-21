
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Eye, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTickets, useUpdateTicket } from '@/hooks/useTickets';

export const StockTickets = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [resolution, setResolution] = useState('');

  const { data: ticketsResponse, isLoading } = useTickets(filters);
  const updateTicket = useUpdateTicket();

  const tickets = ticketsResponse?.data || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'en-attente': { label: 'En Attente', variant: 'secondary' as const, icon: Clock },
      'en-cours': { label: 'En Cours', variant: 'default' as const, icon: AlertCircle },
      'resolu': { label: 'Résolu', variant: 'destructive' as const, icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['en-attente'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'faible': { label: 'Faible', className: 'bg-green-100 text-green-800' },
      'moyenne': { label: 'Moyenne', className: 'bg-yellow-100 text-yellow-800' },
      'elevee': { label: 'Élevée', className: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['moyenne'];
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    await updateTicket.mutateAsync({
      id: ticketId,
      data: { 
        status: newStatus,
        ...(newStatus === 'resolu' && resolution && { resolution })
      }
    });
    setIsDetailOpen(false);
    setResolution('');
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Chargement des tickets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Tickets</h1>
          <p className="text-gray-600">Tickets d'intervention et de maintenance</p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un ticket..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en-attente">En Attente</SelectItem>
                <SelectItem value="en-cours">En Cours</SelectItem>
                <SelectItem value="resolu">Résolu</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.priority}
              onValueChange={(value) => setFilters({ ...filters, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="faible">Faible</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="elevee">Élevée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>
            {tickets.length} ticket(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.type}</Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{ticket.requesterName}</TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de détails du ticket */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Ticket</DialogTitle>
            <DialogDescription>
              Gérez le ticket et mettez à jour son statut
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Titre</Label>
                  <p>{selectedTicket.title}</p>
                </div>
                <div>
                  <Label className="font-semibold">Type</Label>
                  <p>{selectedTicket.type}</p>
                </div>
                <div>
                  <Label className="font-semibold">Priorité</Label>
                  <div>{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <Label className="font-semibold">Statut</Label>
                  <div>{getStatusBadge(selectedTicket.status)}</div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="mt-1 text-sm text-gray-600">{selectedTicket.description}</p>
              </div>
              
              <div>
                <Label className="font-semibold">Demandeur</Label>
                <p>{selectedTicket.requesterName} - {selectedTicket.requesterEmail}</p>
              </div>
              
              {selectedTicket.status !== 'resolu' && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="resolution">Résolution (optionnel)</Label>
                    <Textarea
                      id="resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Décrivez la solution apportée..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    {selectedTicket.status === 'en-attente' && (
                      <Button
                        onClick={() => handleStatusUpdate(selectedTicket._id, 'en-cours')}
                      >
                        Prendre en Charge
                      </Button>
                    )}
                    
                    {selectedTicket.status === 'en-cours' && (
                      <Button
                        onClick={() => handleStatusUpdate(selectedTicket._id, 'resolu')}
                      >
                        Marquer comme Résolu
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {selectedTicket.resolution && (
                <div className="pt-4 border-t">
                  <Label className="font-semibold">Résolution</Label>
                  <p className="mt-1 text-sm text-gray-600">{selectedTicket.resolution}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
