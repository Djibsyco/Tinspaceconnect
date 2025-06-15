import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, Edit3, Trash2, Eye, Ticket, Calendar, DollarSign, User, BarChart3, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import SaleForm from '@/components/sales/SaleForm';
import SaleCard from '@/components/sales/SaleCard';
import SaleViewModal from '@/components/sales/SaleViewModal';
import SalesSummaryCards from '@/components/sales/SalesSummaryCards';

const initialSales = [
  { id: 1, eventName: 'Festival de Musique Estival', ticketType: 'Pass 3 Jours', quantity: 2, pricePerTicket: 40, totalPrice: 80, saleDate: '2025-06-01', customerName: 'Jean Client', paymentStatus: 'Payé' },
  { id: 2, eventName: 'Escape Game "Le Secret du Pharaon"', ticketType: 'Entrée Standard', quantity: 4, pricePerTicket: 22, totalPrice: 88, saleDate: '2025-06-05', customerName: 'Marie Acheteuse', paymentStatus: 'Payé' },
  { id: 3, name: 'Soirée Dégustation', eventName: 'Soirée Dégustation', ticketType: 'VIP', quantity: 1, pricePerTicket: 70, totalPrice: 70, saleDate: '2025-08-15', customerName: 'Pierre Gourmet', paymentStatus: 'En attente' },
];


const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [viewingSale, setViewingSale] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedSales = localStorage.getItem('sales');
    if (storedSales) setSales(JSON.parse(storedSales));
    else {
      setSales(initialSales);
      localStorage.setItem('sales', JSON.stringify(initialSales));
    }

    const storedActivities = localStorage.getItem('activities');
    if (storedActivities) setActivities(JSON.parse(storedActivities));
    else localStorage.setItem('activities', JSON.stringify([]));
  }, []);

  const updateLocalStorage = (updatedSales) => {
    localStorage.setItem('sales', JSON.stringify(updatedSales));
  };

  const handleAddSale = (saleData) => {
    const newSale = { ...saleData, id: Date.now() };
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    updateLocalStorage(updatedSales);
    setIsFormOpen(false);
    toast({ title: "Vente ajoutée", description: `Vente pour ${saleData.eventName} enregistrée.` });
  };

  const handleEditSale = (saleData) => {
    const updatedSales = sales.map(s => s.id === saleData.id ? saleData : s);
    setSales(updatedSales);
    updateLocalStorage(updatedSales);
    setIsFormOpen(false);
    setEditingSale(null);
    toast({ title: "Vente mise à jour", description: `La vente pour ${saleData.eventName} a été mise à jour.` });
  };

  const handleDeleteSale = (saleId) => {
    const saleToDelete = sales.find(s => s.id === saleId);
    const updatedSales = sales.filter(s => s.id !== saleId);
    setSales(updatedSales);
    updateLocalStorage(updatedSales);
    toast({ title: "Vente supprimée", description: `La vente pour ${saleToDelete?.eventName} a été supprimée.`, variant: "destructive" });
  };
  
  const openEditForm = (sale) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  };

  const openViewModal = (sale) => {
    setViewingSale(sale);
  };

  const paymentStatusOptions = ['Tous', 'Payé', 'En attente', 'Remboursé'];

  const filteredSales = sales.filter(sale => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (sale.eventName && sale.eventName.toLowerCase().includes(searchTermLower)) ||
                          (sale.customerName && sale.customerName.toLowerCase().includes(searchTermLower));
    const matchesStatus = filterStatus === 'Tous' || sale.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const totalRevenue = filteredSales.reduce((acc, sale) => sale.paymentStatus === 'Payé' ? acc + sale.totalPrice : acc, 0);
  const totalTicketsSold = filteredSales.reduce((acc, sale) => sale.paymentStatus === 'Payé' ? acc + sale.quantity : acc, 0);


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Ventes & Billetterie ({filteredSales.length})
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingSale(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Enregistrer une Vente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground">{editingSale ? 'Modifier la Vente' : 'Enregistrer une Nouvelle Vente'}</DialogTitle>
              <DialogDescription>
                {editingSale ? `Mettez à jour les informations de la vente pour ${editingSale.eventName}.` : "Remplissez les informations ci-dessous."}
              </DialogDescription>
            </DialogHeader>
            <SaleForm
              sale={editingSale}
              onSubmit={editingSale ? handleEditSale : handleAddSale}
              onCancel={() => { setIsFormOpen(false); setEditingSale(null); }}
              activities={activities}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
      
      <SalesSummaryCards totalRevenue={totalRevenue} totalTicketsSold={totalTicketsSold} />

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
            placeholder="Rechercher par événement, client..." 
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
            {paymentStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredSales.length === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center py-10"
          >
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-foreground">Aucune vente trouvée.</p>
            <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou d'enregistrer une nouvelle vente.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredSales.map((sale, index) => (
            <SaleCard 
              key={sale.id}
              sale={sale}
              index={index}
              onView={openViewModal}
              onEdit={openEditForm}
              onDelete={handleDeleteSale}
            />
          ))}
        </AnimatePresence>
      </div>

      {viewingSale && (
        <SaleViewModal
          sale={viewingSale}
          isOpen={!!viewingSale}
          onClose={() => setViewingSale(null)}
        />
      )}
    </div>
  );
};

export default SalesPage;