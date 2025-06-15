import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ProspectCard from '@/components/prospects/ProspectCard';
import ProspectForm from '@/components/prospects/ProspectForm';
import ProspectViewModal from '@/components/prospects/ProspectViewModal';

const initialProspects = [
  { id: 1, name: 'Événements Grandeur Nature', type: 'Événementiel', contact: 'Alice Dubois', email: 'alice@egn.com', phone: '0123456789', status: 'Contacté', lastInteraction: '2025-05-15', notes: 'Intéressé par une démo.', assignedTo: 'Alice' },
  { id: 2, name: 'Festivités Locales SA', type: 'Organisateur de festival', contact: 'Bob Martin', email: 'bob@festiloc.fr', phone: '0987654321', status: 'En négociation', lastInteraction: '2025-05-10', notes: 'Demande de devis envoyée.', assignedTo: 'Bob' },
  { id: 3, name: 'Aventures Urbaines SARL', type: 'Activités ludiques', contact: 'Carole Petit', email: 'carole@au.net', phone: '0611223344', status: 'À relancer', lastInteraction: '2025-04-28', notes: 'Pas de réponse au dernier email.', assignedTo: 'Alice' },
  { id: 4, name: 'Team Building Pro', type: 'Événementiel corporatif', contact: 'David Lefevre', email: 'david@tbpro.com', phone: '0755667788', status: 'Nouveau', lastInteraction: '2025-05-20', notes: 'Ajouté via formulaire web.', assignedTo: 'Charles' },
];

const ProspectsPage = () => {
  const [prospects, setProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);
  const [viewingProspect, setViewingProspect] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedProspects = localStorage.getItem('prospects');
    if (storedProspects) {
      setProspects(JSON.parse(storedProspects));
    } else {
      setProspects(initialProspects);
      localStorage.setItem('prospects', JSON.stringify(initialProspects));
    }
  }, []);

  const updateLocalStorage = (updatedProspects) => {
    localStorage.setItem('prospects', JSON.stringify(updatedProspects));
  };

  const handleAddProspect = (prospectData) => {
    const newProspect = { ...prospectData, id: Date.now(), lastInteraction: new Date().toISOString().split('T')[0], assignedTo: 'currentUser' }; // Example: assign to current user
    const updatedProspects = [...prospects, newProspect];
    setProspects(updatedProspects);
    updateLocalStorage(updatedProspects);
    setIsFormOpen(false);
    toast({ title: "Prospect ajouté", description: `${prospectData.name} a été ajouté avec succès.` });
  };

  const handleEditProspect = (prospectData) => {
    const updatedProspects = prospects.map(p => p.id === prospectData.id ? { ...prospectData, lastInteraction: new Date().toISOString().split('T')[0] } : p);
    setProspects(updatedProspects);
    updateLocalStorage(updatedProspects);
    setIsFormOpen(false);
    setEditingProspect(null);
    toast({ title: "Prospect mis à jour", description: `${prospectData.name} a été mis à jour.` });
  };

  const handleDeleteProspect = (prospectId) => {
    const prospectToDelete = prospects.find(p => p.id === prospectId);
    const updatedProspects = prospects.filter(p => p.id !== prospectId);
    setProspects(updatedProspects);
    updateLocalStorage(updatedProspects);
    toast({ title: "Prospect supprimé", description: `${prospectToDelete?.name} a été supprimé.`, variant: "destructive" });
  };
  
  const openEditForm = (prospect) => {
    setEditingProspect(prospect);
    setIsFormOpen(true);
  };

  const openViewModal = (prospect) => {
    setViewingProspect(prospect);
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (prospect.contact && prospect.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'Tous' || prospect.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['Tous', 'Nouveau', 'Contacté', 'En négociation', 'À relancer', 'Non intéressé'];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Entreprises Prospectées ({filteredProspects.length})
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingProspect(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Ajouter un Prospect
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground">{editingProspect ? 'Modifier le Prospect' : 'Ajouter un Nouveau Prospect'}</DialogTitle>
              <DialogDescription>
                {editingProspect ? `Mettez à jour les informations de ${editingProspect.name}.` : "Remplissez les informations ci-dessous pour ajouter une nouvelle entreprise."}
              </DialogDescription>
            </DialogHeader>
            <ProspectForm
              prospect={editingProspect}
              onSubmit={editingProspect ? handleEditProspect : handleAddProspect}
              onCancel={() => { setIsFormOpen(false); setEditingProspect(null); }}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Rechercher par nom, email, contact..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-4 py-2 h-10 w-full md:w-auto rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredProspects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center py-10"
          >
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-foreground">Aucun prospect trouvé.</p>
            <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou d'ajouter un nouveau prospect.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredProspects.map((prospect, index) => (
            <ProspectCard 
              key={prospect.id} 
              prospect={prospect} 
              index={index}
              onView={openViewModal}
              onEdit={openEditForm}
              onDelete={handleDeleteProspect}
            />
          ))}
        </AnimatePresence>
      </div>

      {viewingProspect && (
        <ProspectViewModal 
          prospect={viewingProspect} 
          isOpen={!!viewingProspect} 
          onClose={() => setViewingProspect(null)} 
        />
      )}
    </div>
  );
};

export default ProspectsPage;