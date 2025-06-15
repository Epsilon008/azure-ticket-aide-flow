
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketFormData } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';
import { AISolutions } from '@/components/AISolutions';
import { api } from '@/services/api';
import { Eye, List } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (ticket: TicketFormData) => void;
  initialData?: Partial<TicketFormData>;
}

const RECURRING_PROBLEMS = [
  'Ordinateur ne démarre pas',
  'Écran noir / pas d\'affichage',
  'Problème de connexion internet',
  'Imprimante ne fonctionne pas',
  'Logiciel plante / freeze',
  'Problème de connexion réseau',
  'Clavier/souris ne répond pas',
  'Ordinateur très lent',
  'Problème de son/audio',
  'Problème d\'accès aux fichiers partagés',
  'Autre (saisir manuellement)'
];

export const TicketForm = ({ onSubmit, initialData }: TicketFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TicketFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'panne',
    status: initialData?.status || 'nouveau',
    priority: initialData?.priority || 'normale',
    assignedTo: initialData?.assignedTo || '',
    equipment: initialData?.equipment,
  });

  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [aiSolutions, setAiSolutions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    
    toast({
      title: "Succès",
      description: "Ticket créé avec succès",
    });
  };

  const handleProblemChange = (value: string) => {
    setSelectedProblem(value);
    if (value === 'Autre (saisir manuellement)') {
      setFormData(prev => ({ ...prev, title: customTitle }));
    } else if (value) {
      setFormData(prev => ({ ...prev, title: value }));
      setCustomTitle('');
    }
  };

  const handleCustomTitleChange = (value: string) => {
    setCustomTitle(value);
    if (selectedProblem === 'Autre (saisir manuellement)') {
      setFormData(prev => ({ ...prev, title: value }));
    }
  };

  const handlePreviewSolutions = async () => {
    if (!formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une description pour générer des solutions",
        variant: "destructive",
      });
      return;
    }

    setLoadingAI(true);
    try {
      const response = await api.ai.previewSolutions(formData.description, formData.title);
      if (response.success) {
        setAiSolutions(response.data.solutions);
        setShowAIPreview(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération des solutions",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const updateFormData = (field: keyof TicketFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Créer un nouveau ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de ticket</Label>
                <Select value={formData.type} onValueChange={(value: 'panne' | 'equipement') => updateFormData('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="panne">Panne / Incident</SelectItem>
                    <SelectItem value="equipement">Demande d'équipement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={formData.priority} onValueChange={(value: 'faible' | 'normale' | 'haute' | 'critique') => updateFormData('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faible">Faible</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'panne' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recurringProblem">
                    <List className="inline h-4 w-4 mr-1" />
                    Problème récurrent
                  </Label>
                  <Select value={selectedProblem} onValueChange={handleProblemChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un problème récurrent ou 'Autre'" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECURRING_PROBLEMS.map((problem) => (
                        <SelectItem key={problem} value={problem}>
                          {problem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProblem === 'Autre (saisir manuellement)' && (
                  <div className="space-y-2">
                    <Label htmlFor="customTitle">Titre personnalisé *</Label>
                    <Input
                      id="customTitle"
                      value={customTitle}
                      onChange={(e) => handleCustomTitleChange(e.target.value)}
                      placeholder="Décrivez brièvement votre problème"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {formData.type === 'equipement' && (
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Décrivez brièvement la demande d'équipement"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Décrivez en détail le problème ou la demande"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigner à</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => updateFormData('assignedTo', e.target.value)}
                placeholder="Nom du technicien"
              />
            </div>

            {formData.type === 'equipement' && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Détails de l'équipement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentType">Type d'équipement</Label>
                    <Input
                      id="equipmentType"
                      value={formData.equipment?.equipmentType || ''}
                      onChange={(e) => updateFormData('equipment', { ...formData.equipment, equipmentType: e.target.value })}
                      placeholder="ex: Ordinateur portable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.equipment?.quantity || 1}
                      onChange={(e) => updateFormData('equipment', { ...formData.equipment, quantity: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea
                    id="justification"
                    value={formData.equipment?.justification || ''}
                    onChange={(e) => updateFormData('equipment', { ...formData.equipment, justification: e.target.value })}
                    placeholder="Expliquez pourquoi cet équipement est nécessaire"
                    rows={3}
                  />
                </div>
              </Card>
            )}

            {formData.type === 'panne' && formData.description && (
              <div className="flex justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePreviewSolutions}
                  disabled={loadingAI}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser les solutions IA
                </Button>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Créer le ticket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showAIPreview && formData.type === 'panne' && (
        <AISolutions
          ticketDescription={formData.description}
          solutions={aiSolutions}
          onGenerateSolutions={handlePreviewSolutions}
          loading={loadingAI}
        />
      )}
    </div>
  );
};
