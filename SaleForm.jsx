import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { Slider } from '@/components/ui/slider';
import { useToast } from "@/components/ui/use-toast";

const SaleForm = ({ sale, onSubmit, onCancel, activities }) => {
  const [formData, setFormData] = useState(
    sale || { eventId: '', ticketType: 'Standard', quantity: 1, pricePerTicket: 0, customerName: '', paymentStatus: 'Payé', saleDate: new Date().toISOString().split('T')[0] }
  );
  const { toast } = useToast();

  useEffect(() => {
    if (formData.eventId && activities.length > 0) {
      const selectedActivity = activities.find(act => act.id.toString() === formData.eventId.toString());
      if (selectedActivity) {
        setFormData(prev => ({ ...prev, pricePerTicket: selectedActivity.price }));
      }
    } else if (!formData.eventId) {
       setFormData(prev => ({ ...prev, pricePerTicket: 0 }));
    }
  }, [formData.eventId, activities]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };
  
  const handleSliderChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventId || formData.quantity <= 0) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez sélectionner un événement et une quantité valide.",
        variant: "destructive",
      });
      return;
    }
    const selectedActivity = activities.find(act => act.id.toString() === formData.eventId.toString());
    const finalData = {
      ...formData,
      eventName: selectedActivity ? selectedActivity.name : 'Événement inconnu',
      totalPrice: formData.quantity * formData.pricePerTicket
    };
    onSubmit(finalData);
  };
  
  const currentEventPrice = formData.eventId ? (activities.find(a => a.id.toString() === formData.eventId.toString())?.price || 0) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="eventId">Événement/Activité</Label>
        <select id="eventId" name="eventId" value={formData.eventId} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="">Sélectionner un événement</option>
          {activities.map(act => <option key={act.id} value={act.id}>{act.name}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="ticketType">Type de Billet</Label>
        <Input id="ticketType" name="ticketType" value={formData.ticketType} onChange={handleChange} placeholder="Ex: Standard, VIP" />
      </div>
       <div>
        <Label htmlFor="quantity">Quantité - {formData.quantity}</Label>
        <Slider name="quantity" defaultValue={[formData.quantity]} min={1} max={100} step={1} onValueChange={(value) => handleSliderChange(value, "quantity")} />
      </div>
      <div>
        <Label htmlFor="pricePerTicket">Prix par Billet (€)</Label>
        <Input id="pricePerTicket" name="pricePerTicket" type="number" value={formData.pricePerTicket} onChange={handleChange} placeholder="Ex: 25" />
        <p className="text-xs text-muted-foreground mt-1">Prix suggéré pour cet événement : {currentEventPrice} €</p>
      </div>
      <div>
        <Label htmlFor="customerName">Nom du Client (optionnel)</Label>
        <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Ex: Jeanne Moreau" />
      </div>
      <div>
        <Label htmlFor="paymentStatus">Statut du Paiement</Label>
        <select id="paymentStatus" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="Payé">Payé</option>
          <option value="En attente">En attente</option>
          <option value="Remboursé">Remboursé</option>
        </select>
      </div>
      <div>
        <Label htmlFor="saleDate">Date de Vente</Label>
        <Input id="saleDate" name="saleDate" type="date" value={formData.saleDate} onChange={handleChange} />
      </div>
      <DialogFooter>
        <p className="text-lg font-semibold mr-auto">Total: {(formData.quantity * formData.pricePerTicket).toFixed(2)} €</p>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white">
          {sale ? 'Mettre à jour' : 'Ajouter Vente'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SaleForm;