
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AISolutions } from '@/components/AISolutions';
import { Ticket, AISolution } from '@/types/ticket';
import { ArrowLeft, Edit, Clock, User, AlertTriangle, Wrench } from 'lucide-react';

export const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [solutions, setSolutions] = useState<AISolution[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);

  useEffect(() => {
    // Simuler le chargement du ticket
    const mockTicket: Ticket = {
      id: id || '1',
      title: 'Ordinateur ne démarre plus',
      description: 'Le PC portable de bureau ne s\'allume plus depuis ce matin. J\'ai essayé de le brancher mais rien ne se passe. Le voyant d\'alimentation ne s\'allume même pas.',
      type: 'panne',
      status: 'nouveau',
      priority: 'haute',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      assignedTo: 'Jean Dupont'
    };
    setTicket(mockTicket);
  }, [id]);

  const generateSolutions = async () => {
    setLoadingSolutions(true);
    
    // Simuler l'appel à l'IA
    setTimeout(() => {
      const mockSolutions: AISolution[] = [
        {
          id: '1',
          solution: 'Vérifier l\'alimentation et les câbles',
          confidence: 85,
          estimatedTime: '5-10 minutes',
          steps: [
            'Vérifier que le câble d\'alimentation est bien branché',
            'Tester le câble d\'alimentation avec un autre appareil',
            'Vérifier que la prise électrique fonctionne',
            'Essayer de brancher sur une autre prise'
          ]
        },
        {
          id: '2',
          solution: 'Reset de la batterie',
          confidence: 72,
          estimatedTime: '15-20 minutes',
          steps: [
            'Débrancher le câble d\'alimentation',
            'Retirer la batterie si possible',
            'Maintenir le bouton power pendant 30 secondes',
            'Remettre la batterie et rebrancher l\'alimentation',
            'Essayer de démarrer l\'ordinateur'
          ]
        },
        {
          id: '3',
          solution: 'Vérification des composants internes',
          confidence: 60,
          estimatedTime: '30-45 minutes',
          steps: [
            'Ouvrir le boîtier de l\'ordinateur',
            'Vérifier que tous les câbles internes sont bien connectés',
            'Vérifier l\'état de la RAM',
            'Tester avec une seule barrette de RAM si plusieurs présentes'
          ]
        }
      ];
      
      setSolutions(mockSolutions);
      setLoadingSolutions(false);
    }, 2000);
  };

  if (!ticket) {
    return <div>Chargement...</div>;
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
              solutions={solutions}
              onGenerateSolutions={generateSolutions}
              loading={loadingSolutions}
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
