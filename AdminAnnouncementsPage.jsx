import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as UiDialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit3, Trash2, Megaphone, Send, CircleSlash as EyeSlash, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient'; // Assuming you'll store announcements in Supabase eventually

const initialAnnouncements = [
  { id: 1, title: "Maintenance Programmée", content: "Une maintenance système est prévue ce Dimanche à 02:00 AM.", type: "Bannière", status: "Publiée", audience: "Tous", created_at: "2025-05-20T10:00:00Z" },
  { id: 2, title: "Nouvelle Fonctionnalité : Export PDF", content: "Découvrez le nouvel outil d'export PDF dans la section Rapports.", type: "Notification Push", status: "Brouillon", audience: "Admins", created_at: "2025-05-22T14:30:00Z" },
  { id: 3, title: "Objectifs Q3 Atteints!", content: "Félicitations à toute l'équipe pour avoir dépassé les objectifs du T3!", type: "Bannière", status: "Archivée", audience: "Commerciaux", created_at: "2025-04-10T09:00:00Z" },
];

const AnnouncementForm = ({ announcement, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    announcement || { title: '', content: '', type: 'Bannière', audience: 'Tous' }
  );
  const { toast } = useToast();

  useEffect(() => {
    if (announcement) {
      setFormData(announcement);
    } else {
      setFormData({ title: '', content: '', type: 'Bannière', audience: 'Tous' });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast({ title: "Champs requis", description: "Titre et contenu sont obligatoires.", variant: "destructive" });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
      <div><Label htmlFor="title">Titre de l'Annonce</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
      <div><Label htmlFor="content">Contenu</Label><Textarea name="content" id="content" value={formData.content} onChange={handleChange} rows="4" required placeholder="Message de l'annonce..."></Textarea></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type d'Annonce</Label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Bannière">Bannière</option>
            <option value="Notification Push">Notification Push (Admin)</option>
            <option value="Email Interne">Email Interne (Simulation)</option>
          </select>
        </div>
        <div>
          <Label htmlFor="audience">Audience Cible</Label>
          <select id="audience" name="audience" value={formData.audience} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Tous">Tous les Utilisateurs</option>
            <option value="Admins">Administrateurs</option>
            <option value="Managers">Managers</option>
            <option value="Commerciaux">Commerciaux</option>
            <option value="Prospecteurs">Prospecteurs</option>
            <option value="Partenaires">Partenaires (via leur espace)</option>
          </select>
        </div>
      </div>
      <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Annuler</Button><Button type="submit">{announcement ? 'Mettre à jour' : 'Créer Annonce'}</Button></DialogFooter>
    </form>
  );
};

const AdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Replace with Supabase fetch later
    const storedAnnouncements = localStorage.getItem('adminAnnouncements');
    setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : initialAnnouncements);
  }, []);

  const updateLocalStorage = (data) => {
    localStorage.setItem('adminAnnouncements', JSON.stringify(data));
  };

  const handleSaveAnnouncement = (announcementData) => {
    let updatedAnnouncements;
    if (editingAnnouncement) {
      updatedAnnouncements = announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...announcementData } : a);
      toast({ title: "Annonce mise à jour" });
    } else {
      const newAnnouncement = { ...announcementData, id: Date.now(), status: 'Brouillon', created_at: new Date().toISOString() };
      updatedAnnouncements = [newAnnouncement, ...announcements];
      toast({ title: "Annonce créée" });
    }
    setAnnouncements(updatedAnnouncements);
    updateLocalStorage(updatedAnnouncements);
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = (announcementId) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== announcementId);
    setAnnouncements(updatedAnnouncements);
    updateLocalStorage(updatedAnnouncements);
    toast({ title: "Annonce supprimée", variant: "destructive" });
  };

  const togglePublishStatus = (announcementId) => {
    const updatedAnnouncements = announcements.map(a => {
      if (a.id === announcementId) {
        const newStatus = a.status === 'Publiée' ? 'Brouillon' : 'Publiée';
        toast({ title: `Annonce ${newStatus === 'Publiée' ? 'publiée' : 'dépubliée'}` });
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAnnouncements(updatedAnnouncements);
    updateLocalStorage(updatedAnnouncements);
  };
  
  const archiveAnnouncement = (announcementId) => {
     const updatedAnnouncements = announcements.map(a => {
      if (a.id === announcementId) {
        toast({ title: `Annonce archivée` });
        return { ...a, status: 'Archivée' };
      }
      return a;
    });
    setAnnouncements(updatedAnnouncements);
    updateLocalStorage(updatedAnnouncements);
  };


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
          Gestion des Annonces Internes
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingAnnouncement(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Nouvelle Annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground">{editingAnnouncement ? 'Modifier l\'Annonce' : 'Créer une Annonce'}</DialogTitle>
            </DialogHeader>
            <AnnouncementForm announcement={editingAnnouncement} onSubmit={handleSaveAnnouncement} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {announcements.map((ann, index) => (
            <motion.div key={ann.id} layout initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -50 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex">
              <Card className={`shadow-lg hover:shadow-xl w-full flex flex-col bg-gradient-to-br from-card to-secondary/10 border-l-4 ${ann.status === 'Publiée' ? 'border-green-500' : ann.status === 'Brouillon' ? 'border-yellow-500' : 'border-gray-500'}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground">{ann.title}</CardTitle>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      ann.status === 'Publiée' ? 'bg-green-100 text-green-700' : 
                      ann.status === 'Brouillon' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>{ann.status}</span>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    Type: {ann.type} | Audience: {ann.audience} | Créée le: {new Date(ann.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm flex-grow">
                  <p className="line-clamp-3">{ann.content}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-3 border-t border-border/50">
                  {ann.status !== 'Archivée' && (
                    <Button variant="ghost" size="sm" onClick={() => togglePublishStatus(ann.id)} title={ann.status === 'Publiée' ? 'Dépublier' : 'Publier'}>
                      {ann.status === 'Publiée' ? <EyeSlash className="h-5 w-5 text-orange-500" /> : <Send className="h-5 w-5 text-green-500" />}
                    </Button>
                  )}
                   {ann.status !== 'Archivée' && (
                    <Button variant="ghost" size="sm" onClick={() => archiveAnnouncement(ann.id)} title="Archiver">
                       <Eye className="h-5 w-5 text-gray-500" /> {/* Using Eye for archive for now */}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { setEditingAnnouncement(ann); setIsFormOpen(true); }} title="Modifier"><Edit3 className="h-5 w-5 text-blue-500" /></Button>
                  <Dialog>
                    <DialogTrigger asChild><Button variant="ghost" size="sm" title="Supprimer"><Trash2 className="h-5 w-5 text-red-500" /></Button></DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card">
                      <DialogHeader><DialogTitle>Confirmer la suppression</DialogTitle><UiDialogDescription>Supprimer l'annonce "{ann.title}" ?</UiDialogDescription></DialogHeader>
                      <DialogFooter><DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose><Button variant="destructive" onClick={() => handleDeleteAnnouncement(ann.id)}>Supprimer</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {announcements.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune annonce pour le moment.</p>}
    </div>
  );
};

export default AdminAnnouncementsPage;