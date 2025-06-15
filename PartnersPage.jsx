import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import PartnerCard from '@/components/partners/PartnerCard';
import PartnerForm from '@/components/partners/PartnerForm';
import PartnerViewModal from '@/components/partners/PartnerViewModal';

const initialPartners = [
  { id: 1, name: 'FunZone Loisirs', type: 'Parc d\'attractions', contact: 'Laura Bernard', email: 'laura@funzone.com', phone: '0112233445', partnershipDate: '2024-03-15', contractLink: '#', notes: 'Partenaire clé pour les événements familiaux.', addedBy: 'Alice' },
  { id: 2, name: 'Adrénaline Xperience', type: 'Activités extrêmes', contact: 'Julien Moreau', email: 'julien@adrenalinex.fr', phone: '0655443322', partnershipDate: '2024-01-20', contractLink: '#', notes: 'Populaire auprès des jeunes adultes.', addedBy: 'Bob' },
  { id: 3, name: 'Culture Fest Group', type: 'Organisateur de festivals culturels', contact: 'Sophie Girard', email: 'sophie@culturefest.org', phone: '0788990011', partnershipDate: '2023-11-05', contractLink: '#', notes: 'Gros potentiel pour des événements thématiques.', addedBy: 'Alice'},
];

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [viewingPartner, setViewingPartner] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedPartners = localStorage.getItem('partners');
    if (storedPartners) {
      setPartners(JSON.parse(storedPartners));
    } else {
      setPartners(initialPartners);
      localStorage.setItem('partners', JSON.stringify(initialPartners));
    }
  }, []);

  const updateLocalStorage = (updatedPartners) => {
    localStorage.setItem('partners', JSON.stringify(updatedPartners));
  };

  const handleAddPartner = (partnerData) => {
    const newPartner = { ...partnerData, id: Date.now(), addedBy: 'currentUser' }; // Example
    const updatedPartners = [...partners, newPartner];
    setPartners(updatedPartners);
    updateLocalStorage(updatedPartners);
    setIsFormOpen(false);
    toast({ title: "Partenaire ajouté", description: `${partnerData.name} a été ajouté avec succès.` });
  };

  const handleEditPartner = (partnerData) => {
    const updatedPartners = partners.map(p => p.id === partnerData.id ? partnerData : p);
    setPartners(updatedPartners);
    updateLocalStorage(updatedPartners);
    setIsFormOpen(false);
    setEditingPartner(null);
    toast({ title: "Partenaire mis à jour", description: `${partnerData.name} a été mis à jour.` });
  };

  const handleDeletePartner = (partnerId) => {
    const partnerToDelete = partners.find(p => p.id === partnerId);
    const updatedPartners = partners.filter(p => p.id !== partnerId);
    setPartners(updatedPartners);
    updateLocalStorage(updatedPartners);
    toast({ title: "Partenaire supprimé", description: `${partnerToDelete?.name} a été supprimé.`, variant: "destructive" });
  };
  
  const openEditForm = (partner) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const openViewModal = (partner) => {
    setViewingPartner(partner);
  };
  
  const partnerTypes = ['Tous', ...new Set(partners.map(p => p.type).filter(Boolean).sort())];

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (partner.contact && partner.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'Tous' || partner.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Entreprises Partenaires ({filteredPartners.length})
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingPartner(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Ajouter un Partenaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground">{editingPartner ? 'Modifier le Partenaire' : 'Ajouter un Nouveau Partenaire'}</DialogTitle>
              <DialogDescription>
                {editingPartner ? `Mettez à jour les informations de ${editingPartner.name}.` : "Remplissez les informations ci-dessous pour ajouter une nouvelle entreprise partenaire."}
              </DialogDescription>
            </DialogHeader>
            <PartnerForm
              partner={editingPartner}
              onSubmit={editingPartner ? handleEditPartner : handleAddPartner}
              onCancel={() => { setIsFormOpen(false); setEditingPartner(null); }}
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
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-4 py-2 h-10 w-full md:w-auto rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {partnerTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredPartners.length === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center py-10"
          >
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-foreground">Aucun partenaire trouvé.</p>
            <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou d'ajouter un nouveau partenaire.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredPartners.map((partner, index) => (
            <PartnerCard 
              key={partner.id} 
              partner={partner} 
              index={index}
              onView={openViewModal}
              onEdit={openEditForm}
              onDelete={handleDeletePartner}
            />
          ))}
        </AnimatePresence>
      </div>

      {viewingPartner && (
        <PartnerViewModal
          partner={viewingPartner}
          isOpen={!!viewingPartner}
          onClose={() => setViewingPartner(null)}
        />
      )}
    </div>
  );
};

export default PartnersPage;