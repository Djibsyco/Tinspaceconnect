import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as UiDialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit3, Trash2, Eye, Filter, Search, CalendarDays, DollarSign, Users as UsersIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const EventForm = ({ event, onSubmit, onCancel, partners }) => {
  const [formData, setFormData] = useState(
    event || { name: '', type: '', date: '', location: '', price: 0, capacity: 0, description: '', partner_id: null }
  );
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        price: event.price || 0,
        capacity: event.capacity || 0,
        partner_id: event.partner_id || null,
      });
    } else {
       setFormData({ name: '', type: '', date: new Date().toISOString().split('T')[0], location: '', price: 0, capacity: 0, description: '', partner_id: null });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type: inputType } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'number' ? parseFloat(value) : value,
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === "null" ? null : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location) {
      toast({ title: "Champs requis", description: "Nom, date et lieu sont obligatoires.", variant: "destructive" });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
      <div><Label htmlFor="name">Nom de l'Événement</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="type">Type d'Événement</Label><Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder="Ex: Concert, Festival, Atelier..." /></div>
        <div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required /></div>
      </div>
      <div><Label htmlFor="location">Lieu</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} required /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="price">Prix (EUR)</Label><Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} /></div>
        <div><Label htmlFor="capacity">Capacité</Label><Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} /></div>
      </div>
      <div>
        <Label htmlFor="partner_id">Partenaire Associé (Optionnel)</Label>
        <select
          id="partner_id"
          name="partner_id"
          value={formData.partner_id === null ? "null" : formData.partner_id}
          onChange={(e) => handleSelectChange('partner_id', e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="null">Aucun partenaire</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div><Label htmlFor="description">Description</Label><Textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Détails sur l'événement..."></Textarea></div>
      <DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Annuler</Button><Button type="submit">{event ? 'Mettre à jour' : 'Créer Événement'}</Button></DialogFooter>
    </form>
  );
};


const AdminEventsManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const { toast } = useToast();

  const fetchEventsAndPartners = async () => {
    const { data: eventsData, error: eventsError } = await supabase.from('activities').select('*, partners(name)');
    if (eventsError) {
      toast({ title: "Erreur de chargement des événements", description: eventsError.message, variant: "destructive" });
    } else {
      setEvents(eventsData || []);
    }
    const { data: partnersData, error: partnersError } = await supabase.from('partners').select('id, name');
    if (partnersError) {
      toast({ title: "Erreur de chargement des partenaires", description: partnersError.message, variant: "destructive" });
    } else {
      setPartners(partnersData || []);
    }
  };

  useEffect(() => {
    fetchEventsAndPartners();
  }, []);

  const handleSaveEvent = async (eventData) => {
    const dataToSave = { ...eventData };
    delete dataToSave.partners; // Remove joined data before saving

    let query;
    if (editingEvent) {
      query = supabase.from('activities').update(dataToSave).eq('id', editingEvent.id);
    } else {
      query = supabase.from('activities').insert([dataToSave]);
    }

    const { error } = await query;
    if (error) {
      toast({ title: "Erreur de sauvegarde", description: error.message, variant: "destructive" });
    } else {
      fetchEventsAndPartners();
      setIsFormOpen(false);
      setEditingEvent(null);
      toast({ title: `Événement ${editingEvent ? 'mis à jour' : 'créé'}`, description: `${eventData.name} a été sauvegardé.` });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const { error } = await supabase.from('activities').delete().eq('id', eventId);
    if (error) {
      toast({ title: "Erreur de suppression", description: error.message, variant: "destructive" });
    } else {
      fetchEventsAndPartners();
      toast({ title: "Événement supprimé", variant: "destructive" });
    }
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const eventTypes = ['Tous', ...new Set(events.map(e => e.type).filter(Boolean).sort())];

  const filteredEvents = events.filter(event => {
    const nameMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || locationMatch;
    const matchesType = filterType === 'Tous' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
          Gestion des Événements ({filteredEvents.length})
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingEvent(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Créer un Événement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground">{editingEvent ? 'Modifier l\'Événement' : 'Créer un Nouvel Événement'}</DialogTitle>
            </DialogHeader>
            <EventForm event={editingEvent} onSubmit={handleSaveEvent} onCancel={() => setIsFormOpen(false)} partners={partners} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Rechercher par nom, lieu..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="pl-10 pr-4 py-2 h-10 w-full md:w-auto rounded-md border border-input bg-background text-sm">
            {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredEvents.map((event, index) => (
            <motion.div key={event.id} layout initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -50 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex">
              <Card className="shadow-lg hover:shadow-xl w-full flex flex-col bg-gradient-to-br from-card to-secondary/10 border-l-4 border-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground">{event.name}</CardTitle>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">{event.type || 'N/A'}</span>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} - {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm flex-grow">
                  <p><DollarSign className="inline h-4 w-4 mr-1 text-green-500" />Prix: {event.price ? `${event.price} €` : 'Gratuit'}</p>
                  <p><UsersIcon className="inline h-4 w-4 mr-1 text-blue-500" />Capacité: {event.capacity || 'N/A'}</p>
                  {event.partners && <p><UsersIcon className="inline h-4 w-4 mr-1 text-indigo-500" />Partenaire: {event.partners.name}</p>}
                  <p className="text-xs text-muted-foreground line-clamp-2">{event.description || 'Aucune description.'}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-3 border-t border-border/50">
                  <Button variant="ghost" size="icon" onClick={() => setViewingEvent(event)} aria-label="Voir détails"><Eye className="h-5 w-5 text-blue-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(event)} aria-label="Modifier"><Edit3 className="h-5 w-5 text-green-500" /></Button>
                  <Dialog>
                    <DialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Supprimer"><Trash2 className="h-5 w-5 text-red-500" /></Button></DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card">
                      <DialogHeader><DialogTitle>Confirmer la suppression</DialogTitle><UiDialogDescription>Supprimer "{event.name}" ?</UiDialogDescription></DialogHeader>
                      <DialogFooter><DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose><Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>Supprimer</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {viewingEvent && (
        <Dialog open={!!viewingEvent} onOpenChange={(isOpen) => !isOpen && setViewingEvent(null)}>
          <DialogContent className="sm:max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl">{viewingEvent.name}</DialogTitle>
              <UiDialogDescription>{viewingEvent.type} - {new Date(viewingEvent.date).toLocaleDateString()} à {viewingEvent.location}</UiDialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <p><strong>Prix:</strong> {viewingEvent.price ? `${viewingEvent.price} €` : 'Gratuit'}</p>
              <p><strong>Capacité:</strong> {viewingEvent.capacity || 'Non spécifiée'}</p>
              {viewingEvent.partners && <p><strong>Partenaire:</strong> {viewingEvent.partners.name}</p>}
              <p><strong>Description:</strong></p>
              <p className="text-sm bg-secondary/30 p-2 rounded">{viewingEvent.description || 'Aucune description détaillée.'}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingEvent(null)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminEventsManagementPage;