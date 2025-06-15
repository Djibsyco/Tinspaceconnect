import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component
import { Bell, Shield, Mail, Save, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    enableEmailNotifications: true,
    enableSystemAlerts: false,
    defaultUserRole: 'commercial',
    sessionTimeout: 30, // minutes
    maintenanceMode: false,
    apiBaseUrl: 'https://api.tinspaceconnect.com/v1',
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    }));
  };
  
  const handleSwitchChange = (name, checked) => {
     setSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };


  const handleSaveSettings = () => {
    // Simulate saving settings
    localStorage.setItem('adminGlobalSettings', JSON.stringify(settings));
    toast({
      title: "Paramètres Enregistrés",
      description: "Les paramètres globaux ont été mis à jour (simulation).",
    });
  };

  const userRoles = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Support Client' },
    { value: 'manager', label: 'Manager' },
  ];

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
      >
        Paramètres Globaux de l'Application
      </motion.h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Notifications Card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-6 w-6 text-blue-500" /> Gestion des Notifications</CardTitle>
              <CardDescription>Configurez les alertes et notifications du système.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableEmailNotifications" className="flex flex-col space-y-1">
                  <span>Notifications par Email</span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Activer l'envoi d'emails pour les événements importants.
                  </span>
                </Label>
                <Switch
                  id="enableEmailNotifications"
                  name="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('enableEmailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableSystemAlerts" className="flex flex-col space-y-1">
                  <span>Alertes Système Internes</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Afficher les alertes critiques dans l'interface admin.
                  </span>
                </Label>
                 <Switch
                  id="enableSystemAlerts"
                  name="enableSystemAlerts"
                  checked={settings.enableSystemAlerts}
                  onCheckedChange={(checked) => handleSwitchChange('enableSystemAlerts', checked)}
                />
              </div>
              <div>
                <Label htmlFor="adminEmail">Email Administrateur Principal</Label>
                <Input id="adminEmail" type="email" placeholder="admin@example.com" defaultValue="contact@tinspaceconnect.com" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Shield className="mr-2 h-6 w-6 text-green-500" /> Sécurité et Accès</CardTitle>
              <CardDescription>Gérez les options de sécurité et les rôles par défaut.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultUserRole">Rôle par Défaut Nouvel Utilisateur</Label>
                <select 
                  id="defaultUserRole" 
                  name="defaultUserRole"
                  value={settings.defaultUserRole} 
                  onChange={handleInputChange}
                  className="w-full h-10 mt-1 border border-input bg-background rounded-md px-3 text-sm focus:ring-primary focus:border-primary"
                >
                  {userRoles.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Délai d'Expiration de Session (minutes)</Label>
                <Input 
                    id="sessionTimeout" 
                    name="sessionTimeout"
                    type="number" 
                    value={settings.sessionTimeout} 
                    onChange={handleInputChange} 
                    className="mt-1" 
                />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="maintenanceMode" className="flex flex-col space-y-1">
                  <span>Mode Maintenance</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Restreindre l'accès au site pour maintenance.
                  </span>
                </Label>
                 <Switch
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Settings Card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><SlidersHorizontal className="mr-2 h-6 w-6 text-purple-500" /> Paramètres Avancés</CardTitle>
              <CardDescription>Configurations techniques (à utiliser avec prudence).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiBaseUrl">URL de Base de l'API</Label>
                <Input 
                    id="apiBaseUrl" 
                    name="apiBaseUrl"
                    type="url" 
                    value={settings.apiBaseUrl} 
                    onChange={handleInputChange} 
                    className="mt-1" 
                />
              </div>
              <Button variant="outline" className="w-full" disabled>Purger le Cache (Bientôt)</Button>
              <Button variant="destructive" className="w-full" disabled>Réinitialiser les Paramètres (Bientôt)</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end pt-6"
      >
        <Button onClick={handleSaveSettings} size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white">
          <Save className="mr-2 h-5 w-5" /> Enregistrer les Paramètres
        </Button>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;