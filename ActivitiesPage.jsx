import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as UiDialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

import ActivityCard from '@/pages/activities/ActivityCard';
import ActivityForm from '@/pages/activities/ActivityForm';
import ActivityViewModal from '@/pages/activities/ActivityViewModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const fetchActivities = useCallback(async () => {
    if (!supabase || !isAuthenticated) return;
    const { data, error } = await supabase.from('activities').select(`
      *,
      partners (
        id,
        name
      )
    `).order('date', { ascending: false });
    if (error) {
      toast({ title: "Erreur de chargement", description: "Impossible de charger les événements.", variant: "destructive" });
      console.error("Error fetching activities:", error);
    } else {
      setActivities(data.map(a => ({...a, partner_name: a.partners?.name })));
    }
  }, [toast, isAuthenticated]);

  const fetchPartners = useCallback(async () => {
    if (!supabase || !isAuthenticated) return;
    const { data, error } = await supabase.from('partners').select('id, name');
    if (error) {
      toast({ title: "Erreur de chargement", description: "Impossible de charger les partenaires.", variant: "destructive" });
    } else {
      setPartners(data || []);
    }
  }, [toast, isAuthenticated]);

  useEffect(() => {
    fetchActivities();
    fetchPartners();
  }, [fetchActivities, fetchPartners]);


  const handleAddActivity = async (activityData) => {
    if (!supabase || !user) return;
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...activityData, user_id: user.id }])
      .select();
    
    if (error) {
      toast({ title: "Erreur d'ajout", description: error.message, variant: "destructive" });
    } else {
      fetchActivities();
      setIsFormOpen(false);
      toast({ title: "Événement ajouté", description: `${activityData.name} a été ajouté avec succès.`, className: "bg-green-500 text-white" });
    }
  };

  const handleEditActivity = async (activityData) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('activities')
      .update(activityData)
      .eq('id', activityData.id)
      .select();

    if (error) {
      toast({ title: "Erreur de mise à jour", description: error.message, variant: "destructive" });
    } else {
      fetchActivities();
      setIsFormOpen(false);
      setEditingActivity(null);
      toast({ title: "Événement mis à jour", description: `${activityData.name} a été mis à jour.`, className: "bg-blue-500 text-white" });
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!supabase) return;
    const activityToDelete = activities.find(a => a.id === activityId);
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId);

    if (error) {
      toast({ title: "Erreur de suppression", description: error.message, variant: "destructive" });
    } else {
      fetchActivities();
      toast({ title: "Événement supprimé", description: `${activityToDelete?.name} a été supprimé.`, variant: "destructive" });
    }
  };
  
  const openEditForm = (activity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const openViewModal = (activity) => {
    setViewingActivity(activity);
  };

  const activityTypes = ['Tous', ...new Set(activities.map(a => a.type).filter(Boolean).sort())];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = (activity.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (activity.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (activity.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Tous' || activity.type === filterType;
    return matchesSearch && matchesType;
  });
  
  if (!isAuthenticated) {
     return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center p-8">
          <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
          <h1 className="text-3xl font-bold text-destructive mb-3">Accès Interdit</h1>
          <p className="text-lg text-muted-foreground mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white">
            <a href="/login">Se Connecter</a>
          </Button>
        </div>
      );
  }

  return (
    <div className="space-y-10 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Gestion des Événements ({filteredActivities.length})
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Organisez, modifiez et suivez tous vos événements et activités.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingActivity(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 py-3 px-6 text-md">
              <PlusCircle className="mr-2 h-5 w-5" /> Créer un Événement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-card border-l-4 border-orange-500">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-2xl font-semibold text-orange-600">{editingActivity ? 'Modifier l\'Événement' : 'Créer un Nouvel Événement'}</DialogTitle>
              <UiDialogDescription className="text-md">
                {editingActivity ? `Mettez à jour les informations de ${editingActivity.name}.` : "Remplissez les informations ci-dessous."}
              </UiDialogDescription>
            </DialogHeader>
            <ActivityForm
              activity={editingActivity}
              onSubmit={editingActivity ? handleEditActivity : handleAddActivity}
              onCancel={() => { setIsFormOpen(false); setEditingActivity(null); }}
              partners={partners}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-xl shadow-lg border"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Rechercher par nom, lieu, description..." 
            className="pl-12 h-11 text-md rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex items-center w-full md:w-auto">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="pl-12 h-11 text-md rounded-lg w-full md:w-52">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center py-16"
          >
            <Zap className="mx-auto h-16 w-16 text-orange-400 mb-6 opacity-70" />
            <p className="text-2xl font-semibold text-foreground mb-2">Aucun événement trouvé.</p>
            <p className="text-md text-muted-foreground">Essayez d'ajuster vos filtres ou d'ajouter un nouvel événement pour commencer.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <ActivityCard 
              key={activity.id}
              activity={activity}
              index={index}
              onView={openViewModal}
              onEdit={openEditForm}
              onDelete={handleDeleteActivity}
            />
          ))}
        </AnimatePresence>
      </div>

      {viewingActivity && (
        <ActivityViewModal
          activity={viewingActivity}
          isOpen={!!viewingActivity}
          onClose={() => setViewingActivity(null)}
        />
      )}
    </div>
  );
};

export default ActivitiesPage;