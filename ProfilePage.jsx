import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth(); // Assuming setUser updates context and localStorage
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '', // Assuming phone might be part of user object
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to update profile
    try {
      // In a real app, you'd make an API call here
      // For demo, update user in AuthContext and localStorage
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser); // This should also update localStorage in AuthContext
      localStorage.setItem('tinSpaceUser', JSON.stringify(updatedUser)); 

      toast({ title: "Profil mis à jour", description: "Vos informations ont été sauvegardées." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le profil.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p>Chargement du profil...</p>; // Or redirect to login
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
      >
        Mon Profil
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={40}/>}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name || 'Utilisateur'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <CardDescription className="text-sm capitalize">{user.role || 'Rôle non défini'}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="name" value={formData.name} onChange={handleChange} placeholder="Votre nom complet" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="votreadresse@example.com" className="pl-10" disabled />
                  <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié ici.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone (optionnel)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0612345678" className="pl-10" />
                </div>
              </div>
              {/* Add password change fields if needed */}
              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white" disabled={isLoading}>
                {isLoading ? 'Sauvegarde...' : <><Save className="mr-2 h-5 w-5" /> Sauvegarder les modifications</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;