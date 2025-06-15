import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit3, Trash2, Eye, Briefcase, Mail, Phone, Filter, Search, Users, TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import ProspectForm from '@/components/prospects/ProspectForm'; // Re-use existing form
import ProspectViewModal from '@/components/prospects/ProspectViewModal'; // Re-use existing view modal

// Using initialProspects from ProspectsPage for demo consistency
const initialProspects = [
  { id: 1, name: 'Événements Grandeur Nature', type: 'Événementiel', contact: 'Alice Dubois', email: 'alice@egn.com', phone: '0123456789', status: 'Contacté', lastInteraction: '2025-05-15', notes: 'Intéressé par une démo.', assignedTo: 'Alice', score: 75, city: 'Paris', region: 'Île-de-France' },
  { id: 2, name: 'Festivités Locales SA', type: 'Organisateur de festival', contact: 'Bob Martin', email: 'bob@festiloc.fr', phone: '0987654321', status: 'En négociation', lastInteraction: '2025-05-10', notes: 'Demande de devis envoyée.', assignedTo: 'Bob', score: 90, city: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
  { id: 3, name: 'Aventures Urbaines SARL', type: 'Activités ludiques', contact: 'Carole Petit', email: 'carole@au.net', phone: '0611223344', status: 'À relancer', lastInteraction: '2025-04-28', notes: 'Pas de réponse au dernier email.', assignedTo: 'Alice', score: 40, city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur' },
  { id: 4, name: 'Team Building Pro', type: 'Événementiel corporatif', contact: 'David Lefevre', email: 'david@tbpro.com', phone: '0755667788', status: 'Nouveau', lastInteraction: '2025-05-20', notes: 'Ajouté via formulaire web.', assignedTo: 'Charles', score: 60, city: 'Paris', region: 'Île-de-France' },
];

const PIPELINE_STAGES = ['À contacter', 'Contact établi', 'RDV fixé', 'Proposition envoyée', 'Accord signé', 'Refusé'];

const AdminProspectsManagementPage = () => {
  const [prospects, setProspects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // For assigning prospects
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterAssignee, setFilterAssignee] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);
  const [viewingProspect, setViewingProspect] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedProspects = localStorage.getItem('prospects');
    if (storedProspects) setProspects(JSON.parse(storedProspects));
    else {
      setProspects(initialProspects);
      localStorage.setItem('prospects', JSON.stringify(initialProspects));
    }
    const storedTeam = localStorage.getItem('teamMembers');
    if (storedTeam) setTeamMembers(JSON.parse(storedTeam));
  }, []);

  const updateLocalStorageProspects = (updatedProspects) => {
    localStorage.setItem('prospects', JSON.stringify(updatedProspects));
  };

  const handleAddProspect = (prospectData) => {
    const newProspect = { ...prospectData, id: Date.now(), lastInteraction: new Date().toISOString().split('T')[0], score: Math.floor(Math.random() * 100) };
    const updatedProspects = [...prospects, newProspect];
    setProspects(updatedProspects);
    updateLocalStorageProspects(updatedProspects);
    setIsFormOpen(false);
    toast({ title: "Prospect ajouté", description: `${prospectData.name} a été ajouté.` });
  };

  const handleEditProspect = (prospectData) => {
    const updatedProspects = prospects.map(p => p.id === prospectData.id ? { ...p, ...prospectData, lastInteraction: new Date().toISOString().split('T')[0] } : p);
    setProspects(updatedProspects);
    updateLocalStorageProspects(updatedProspects);
    setIsFormOpen(false);
    setEditingProspect(null);
    toast({ title: "Prospect mis à jour", description: `${prospectData.name} a été mis à jour.` });
  };

  const handleDeleteProspect = (prospectId) => {
    const prospectToDelete = prospects.find(p => p.id === prospectId);
    const updatedProspects = prospects.filter(p => p.id !== prospectId);
    setProspects(updatedProspects);
    updateLocalStorageProspects(updatedProspects);
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
    const matchesAssignee = filterAssignee === 'Tous' || prospect.assignedTo === filterAssignee;
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const statusOptions = ['Tous', ...new Set(prospects.map(p => p.status).filter(Boolean).sort())];
  const assigneeOptions = ['Tous', ...new Set(teamMembers.map(m => m.name.split(' ')[0]).filter(Boolean).sort())]; // Simplified to first name

  const exportToCSV = () => {
    const headers = "ID,Nom,Type,Contact,Email,Téléphone,Statut,Dernière Interaction,Assigné à,Score,Ville,Région,Notes\n";
    const csvContent = filteredProspects.map(p => 
      `${p.id},"${p.name}","${p.type || ''}","${p.contact || ''}","${p.email}","${p.phone || ''}","${p.status}","${p.lastInteraction}","${p.assignedTo || ''}",${p.score || 0},"${p.city || ''}","${p.region || ''}","${(p.notes || '').replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "prospects_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({title: "Export CSV", description: "Données des prospects exportées."})
  };


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
          Gestion des Prospects ({filteredProspects.length})
        </h1>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
            <Download className="mr-2 h-4 w-4" /> Exporter CSV
          </Button>
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingProspect(null); }}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white">
                <PlusCircle className="mr-2 h-5 w-5" /> Ajouter Prospect
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-foreground">{editingProspect ? 'Modifier Prospect' : 'Nouveau Prospect'}</DialogTitle>
              </DialogHeader>
              <ProspectForm
                prospect={editingProspect}
                onSubmit={editingProspect ? handleEditProspect : handleAddProspect}
                onCancel={() => { setIsFormOpen(false); setEditingProspect(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg shadow"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Rechercher..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pl-10 pr-4 py-2 h-10 w-full rounded-md border border-input bg-background text-sm">
            {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} className="pl-10 pr-4 py-2 h-10 w-full rounded-md border border-input bg-background text-sm">
            {assigneeOptions.map(assignee => <option key={assignee} value={assignee}>{assignee}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Pipeline View (Simplified) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Tunnel de Conversion</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PIPELINE_STAGES.map(stage => (
            <Card key={stage} className="bg-secondary/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-center">{stage}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 min-h-[100px]">
                {prospects.filter(p => p.status === stage).slice(0,3).map(p => ( // Show max 3 per stage for brevity
                  <motion.div key={p.id} className="text-xs p-1.5 bg-card rounded shadow border-l-2 border-primary truncate" title={p.name}
                    initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.2}}
                  >
                    {p.name}
                  </motion.div>
                ))}
                {prospects.filter(p => p.status === stage).length > 3 && <p className="text-xs text-muted-foreground text-center mt-1">+ {prospects.filter(p => p.status === stage).length - 3} autres</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      {/* Prospect Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <AnimatePresence>
          {filteredProspects.map((prospect, index) => (
            <motion.div
              key={prospect.id} layout
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex"
            >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full flex flex-col bg-gradient-to-br from-card to-secondary/10">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-primary">{prospect.name}</CardTitle>
                  <div className="flex items-center space-x-1 text-sm">
                    {prospect.score > 70 ? <TrendingUp className="h-4 w-4 text-green-500"/> : prospect.score < 50 ? <TrendingDown className="h-4 w-4 text-red-500"/> : null}
                    <span>{prospect.score || 'N/A'}</span>
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground">{prospect.type} - {prospect.city || 'Ville inconnue'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <p className="text-sm flex items-center"><Briefcase className="h-4 w-4 mr-2 text-muted-foreground" /> {prospect.contact || 'N/A'}</p>
                <p className="text-sm flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /> {prospect.email}</p>
                <p className="text-sm flex items-center"><Users className="h-4 w-4 mr-2 text-muted-foreground" /> Assigné à: {prospect.assignedTo || 'Personne'}</p>
                <p className="text-xs text-muted-foreground pt-2">Dernier contact: {new Date(prospect.lastInteraction).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
                <Button variant="ghost" size="icon" onClick={() => openViewModal(prospect)}><Eye className="h-5 w-5 text-blue-500" /></Button>
                <Button variant="ghost" size="icon" onClick={() => openEditForm(prospect)}><Edit3 className="h-5 w-5 text-green-500" /></Button>
                <Dialog>
                  <DialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-5 w-5 text-red-500" /></Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card">
                    <DialogHeader><DialogTitle>Supprimer Prospect</DialogTitle><DialogDescription>Confirmez la suppression de "{prospect.name}".</DialogDescription></DialogHeader>
                    <DialogFooter><DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose><DialogClose asChild><Button variant="destructive" onClick={() => handleDeleteProspect(prospect.id)}>Supprimer</Button></DialogClose></DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredProspects.length === 0 && <p className="text-center text-muted-foreground py-10">Aucun prospect ne correspond à vos filtres.</p>}

      {viewingProspect && <ProspectViewModal prospect={viewingProspect} isOpen={!!viewingProspect} onClose={() => setViewingProspect(null)} />}
    </div>
  );
};

export default AdminProspectsManagementPage;