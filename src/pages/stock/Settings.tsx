
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Palette, Bell, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('accounts');
  
  // États pour la gestion des comptes
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    department: ''
  });

  // États pour l'apparence
  const [appearanceSettings, setAppearanceSettings] = useState({
    appName: 'Gestion Stock',
    primaryColor: '#2563eb',
    logo: ''
  });

  // États pour les notifications
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    criticalStockAlerts: true,
    ticketUpdates: true,
    weeklyReports: false
  });

  // Données mockées pour les utilisateurs (en attendant l'implémentation backend)
  const [users] = useState([
    { _id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', department: 'IT', isActive: true },
    { _id: '2', username: 'user1', email: 'user1@example.com', role: 'user', department: 'Production', isActive: true },
  ]);

  // Équipements critiques mockés
  const [criticalAlerts] = useState([
    { _id: '1', equipment: 'Ordinateur portable', currentStock: 2, criticalLevel: 5, category: 'Informatique' },
    { _id: '2', equipment: 'Casque de sécurité', currentStock: 8, criticalLevel: 10, category: 'Sécurité' },
  ]);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on appellerait l'API pour créer l'utilisateur
    console.log('Création utilisateur:', userForm);
    setIsUserDialogOpen(false);
    setUserForm({
      username: '',
      email: '',
      password: '',
      role: 'user',
      department: ''
    });
  };

  const handleAppearanceUpdate = () => {
    // Ici on sauvegarderait les paramètres d'apparence
    console.log('Mise à jour apparence:', appearanceSettings);
  };

  const handleNotificationUpdate = () => {
    // Ici on sauvegarderait les paramètres de notification
    console.log('Mise à jour notifications:', notificationSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600">Configurez votre application et gérez les paramètres système</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Comptes</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Comptes */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Gestion des Comptes</h2>
              <p className="text-gray-600">Gérez les utilisateurs et leurs droits d'accès</p>
            </div>
            
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouvel utilisateur au système
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={userForm.role}
                      onValueChange={(value) => setUserForm({ ...userForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={userForm.department}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Créer</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs du Système</CardTitle>
              <CardDescription>
                {users.length} utilisateur(s) enregistré(s)
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Personnalisation de l'Apparence</h2>
            <p className="text-gray-600">Personnalisez l'apparence de votre application</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'Apparence</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="app-name">Nom de l'Application</Label>
                <Input
                  id="app-name"
                  value={appearanceSettings.appName}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, appName: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="primary-color">Couleur Principale</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo">Logo (URL)</Label>
                <Input
                  id="logo"
                  value={appearanceSettings.logo}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, logo: e.target.value })}
                  placeholder="https://exemple.com/logo.png"
                />
              </div>
              
              <Button onClick={handleAppearanceUpdate}>
                Sauvegarder les Modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Paramètres de Notification</h2>
            <p className="text-gray-600">Configurez vos préférences de notification</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de Notification</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notifications par Email</Label>
                    <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-stock">Alertes Stock Critique</Label>
                    <p className="text-sm text-gray-600">Alertes quand le stock atteint le niveau critique</p>
                  </div>
                  <Switch
                    id="critical-stock"
                    checked={notificationSettings.criticalStockAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, criticalStockAlerts: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ticket-updates">Mises à jour des Tickets</Label>
                    <p className="text-sm text-gray-600">Notifications pour les nouveaux tickets</p>
                  </div>
                  <Switch
                    id="ticket-updates"
                    checked={notificationSettings.ticketUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, ticketUpdates: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Rapports Hebdomadaires</Label>
                    <p className="text-sm text-gray-600">Recevoir un rapport hebdomadaire</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                    }
                  />
                </div>
                
                <Button onClick={handleNotificationUpdate}>
                  Sauvegarder les Préférences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Alertes Actuelles</span>
                </CardTitle>
                <CardDescription>
                  Équipements ayant atteint le niveau critique
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {criticalAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {criticalAlerts.map((alert) => (
                      <div key={alert._id} className="p-3 border rounded-lg bg-red-50 border-red-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-red-800">{alert.equipment}</p>
                            <p className="text-sm text-red-600">
                              Stock: {alert.currentStock} / Critique: {alert.criticalLevel}
                            </p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune alerte critique pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
