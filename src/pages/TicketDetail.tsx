
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AISolutions } from '@/components/AISolutions';
import { ArrowLeft, Edit, Clock, User, AlertTriangle, Wrench, Loader2 } from 'lucide-react';
import { useTicket, useGenerateAISolutions } from '@/hooks/useTickets';

export const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: ticketResponse, isLoading, error } = useTicket(id!);
  const generateSolutionsMutation = useGenerateAISolutions();
  
  const ticket = ticketResponse?.data;

  const handleGenerateSolutions = async () => {
    if (id) {
      generateSolutionsMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement du ticket...</span>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Erreur lors du chargement du ticket</p>
        <p className="text-gray-400 text-sm mt-2">
          Le ticket demandé n'existe pas ou le serveur est indisponible
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
          variant="outline"
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'en-cours': return 'bg-yellow-100 text-yellow-800';
      case 'resolu': return 'bg-green-100 text-green-800';
      case 'ferme': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'normale': return 'bg-blue-100 text-blue-800';
      case 'faible': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Détail du Ticket</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold mb-2">
                    {ticket.title}
                  </CardTitle>
                  <div className="flex space-x-2 mb-4">
                    <Badge className={getStatusColor(ticket.status)} variant="secondary">
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                <div className="ml-4">
                  {ticket.type === 'panne' ? (
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  ) : (
                    <Wrench className="h-8 w-8 text-blue-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                </div>
                
                {ticket.equipment && (
                  <div>
                    <h3 className="font-semibold mb-2">Détails de l'équipement</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Type:</span> {ticket.equipment.equipmentType}</p>
                      <p><span className="font-medium">Quantité:</span> {ticket.equipment.quantity}</p>
                      <p><span className="font-medium">Urgence:</span> {ticket.equipment.urgency}</p>
                      <p><span className="font-medium">Justification:</span> {ticket.equipment.justification}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Solutions IA pour les pannes */}
          {ticket.type === 'panne' && (
            <AISolutions
              ticketDescription={ticket.description}
              solutions={ticket.solutions || []}
              onGenerateSolutions={handleGenerateSolutions}
              loading={generateSolutionsMutation.isPending}
            />
          )}
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Créé le</p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Mis à jour le</p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {ticket.assignedTo && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Assigné à</p>
                    <p className="text-sm text-gray-600">{ticket.assignedTo}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Changer le statut
              </Button>
              <Button className="w-full" variant="outline">
                Réassigner
              </Button>
              <Button className="w-full" variant="outline">
                Ajouter un commentaire
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Marquer comme résolu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
