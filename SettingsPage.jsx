import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Bell, Palette, Lock, CreditCard, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const SettingsSection = ({ title, description, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl text-foreground">{title}</CardTitle>
            {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  </motion.div>
);


const SettingsPage = () => {
  const { toast } = useToast();

  const handleSaveSettings = (section) => {
    toast({
      title: `Paramètres ${section} sauvegardés`,
      description: "Vos modifications ont été enregistrées (simulation).",
    });
  };


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
      >
        Paramètres
      </motion.h1>

      <SettingsSection title="Profil Utilisateur" description="Gérez les informations de votre compte." icon={User}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" defaultValue="Utilisateur Actuel" />
            </div>
            <div>
              <Label htmlFor="email">Adresse Email</Label>
              <Input id="email" type="email" defaultValue="utilisateur@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input id="password" type="password" placeholder="Laisser vide pour ne pas changer" />
          </div>
          <Button onClick={() => handleSaveSettings("du profil")} type="button" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">Sauvegarder Profil</Button>
        </form>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Configurez vos préférences de notification." icon={Bell}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications" className="flex flex-col">
              <span>Notifications par Email</span>
              <span className="text-xs text-muted-foreground">Recevoir les mises à jour importantes par email.</span>
            </Label>
            <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" id="emailNotifications" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="appNotifications" className="flex flex-col">
              <span>Notifications dans l'application</span>
              <span className="text-xs text-muted-foreground">Afficher les alertes directement dans l'interface.</span>
            </Label>
            <label htmlFor="appNotifications" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" id="appNotifications" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          <Button onClick={() => handleSaveSettings("des notifications")} type="button" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">Sauvegarder Notifications</Button>
        </div>
      </SettingsSection>
      
      <SettingsSection title="Apparence" description="Personnalisez l'interface de l'application." icon={Palette}>
        <form className="space-y-4">
          <div>
            <Label htmlFor="theme">Thème</Label>
            <select id="theme" name="theme" defaultValue="light" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="system">Système</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">Le changement de thème est géré par le ThemeProvider.</p>
          </div>
           <Button onClick={() => handleSaveSettings("de l'apparence")} type="button" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">Sauvegarder Apparence</Button>
        </form>
      </SettingsSection>

      <SettingsSection title="Sécurité" description="Gérez les options de sécurité de votre compte." icon={Lock}>
        <div className="space-y-4">
          <Button variant="outline">Activer l'authentification à deux facteurs (2FA)</Button>
          <Button variant="outline" className="text-red-600 border-red-500 hover:bg-red-50">Changer le mot de passe</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Facturation" description="Gérez vos informations de paiement et abonnements." icon={CreditCard}>
         <div className="space-y-2">
            <p className="text-sm">Votre abonnement actuel : <span className="font-semibold text-primary">Pro</span></p>
            <p className="text-sm text-muted-foreground">Prochaine facture le 01/07/2025.</p>
            <Button variant="outline">Gérer l'abonnement</Button>
            <Button variant="outline">Historique des factures</Button>
         </div>
      </SettingsSection>
      
      <SettingsSection title="À Propos" description="Informations sur l'application." icon={Info}>
         <div className="space-y-2 text-sm">
            <p><strong>Tin Space Connect</strong></p>
            <p>Version: 1.0.0</p>
            <p>© {new Date().getFullYear()} Tin Space Connect. Tous droits réservés.</p>
            <p className="text-muted-foreground">Une application CRM puissante pour gérer vos relations clients et partenaires.</p>
         </div>
      </SettingsSection>

    </div>
  );
};

export default SettingsPage;