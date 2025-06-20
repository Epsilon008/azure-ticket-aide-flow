
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, AlertTriangle, History, ShoppingCart } from 'lucide-react';
import { useEquipments, useCategories, useCreateEquipment, useCreateCategory, useAssignmentHistory } from '@/hooks/useStock';

export const Stock = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    category: '',
    currentStock: 0,
    criticalLevel: 10,
    unit: '',
    description: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const { data: equipmentsResponse, isLoading: equipmentsLoading } = useEquipments();
  const { data: categoriesResponse } = useCategories();
  const { data: historyResponse } = useAssignmentHistory();
  const createEquipment = useCreateEquipment();
  const createCategory = useCreateCategory();

  const equipments = equipmentsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const history = historyResponse?.data || [];

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEquipment.mutateAsync(equipmentForm);
    setIsEquipmentDialogOpen(false);
    setEquipmentForm({
      name: '',
      category: '',
      currentStock: 0,
      criticalLevel: 10,
      unit: '',
      description: ''
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory.mutateAsync(categoryForm);
    setIsCategoryDialogOpen(false);
    setCategoryForm({ name: '', description: '' });
  };

  const criticalEquipments = equipments.filter(eq => eq.currentStock <= eq.criticalLevel);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Stock</h1>
          <p className="text-gray-600">Gérez vos équipements, catégories et commandes</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Bon de Commande
          </Button>
          
          <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Historique
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Historique des Attributions</DialogTitle>
                <DialogDescription>
                  Historique complet des attributions et désattributions
                </DialogDescription>
              </DialogHeader>
              
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Équipement</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.employee?.name}</TableCell>
                        <TableCell>{record.equipment?.name}</TableCell>
                        <TableCell>{record.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={record.type === 'assignment' ? 'default' : 'secondary'}>
                            {record.type === 'assignment' ? 'Attribution' : 'Désattribution'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {criticalEquipments.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertes Stock Critique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {criticalEquipments.map((equipment) => (
                <div key={equipment._id} className="text-sm text-red-700">
                  <strong>{equipment.name}</strong>: {equipment.currentStock} {equipment.unit} restant(s)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Équipements</h2>
            
            <Dialog open={isEquipmentDialogOpen} onOpenChange={setIsEquipmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Équipement
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvel équipement</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouvel équipement au stock
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="eq-name">Nom de l'équipement</Label>
                    <Input
                      id="eq-name"
                      value={equipmentForm.name}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eq-category">Catégorie</Label>
                    <Select
                      value={equipmentForm.category}
                      onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eq-stock">Stock Initial</Label>
                      <Input
                        id="eq-stock"
                        type="number"
                        value={equipmentForm.currentStock}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, currentStock: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="eq-critical">Niveau Critique</Label>
                      <Input
                        id="eq-critical"
                        type="number"
                        value={equipmentForm.criticalLevel}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, criticalLevel: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="eq-unit">Unité</Label>
                    <Input
                      id="eq-unit"
                      value={equipmentForm.unit}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, unit: e.target.value })}
                      placeholder="ex: pièce, kg, litre..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eq-description">Description</Label>
                    <Input
                      id="eq-description"
                      value={equipmentForm.description}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEquipmentDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Créer</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Stock Actuel</TableHead>
                    <TableHead>Niveau Critique</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipments.map((equipment) => (
                    <TableRow key={equipment._id}>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{equipment.category?.name}</Badge>
                      </TableCell>
                      <TableCell>{equipment.currentStock}</TableCell>
                      <TableCell>{equipment.criticalLevel}</TableCell>
                      <TableCell>{equipment.unit}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={equipment.currentStock <= equipment.criticalLevel ? 'destructive' : 'default'}
                        >
                          {equipment.currentStock <= equipment.criticalLevel ? 'Critique' : 'Normal'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Catégories</h2>
            
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Catégorie
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle catégorie</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle catégorie d'équipements
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="cat-name">Nom de la catégorie</Label>
                    <Input
                      id="cat-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cat-description">Description</Label>
                    <Input
                      id="cat-description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Créer</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date de Création</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
