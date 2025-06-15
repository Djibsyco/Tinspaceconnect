import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const PartnerForm = ({ partner, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    partner || { name: '', type: '', contact: '', email: '', phone: '', partnershipDate: new Date().toISOString().split('T')[0], contractLink: '', notes: '' }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez renseigner au moins le nom et l'email du partenaire.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'entreprise partenaire</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Loisirs Plus" required />
      </div>
      <div>
        <Label htmlFor="type">Type d'activité/service</Label>
        <Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder="Ex: Parc d'attractions, Escape Game" />
      </div>
      <div>
        <Label htmlFor="contact">Personne à contacter</Label>
        <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Ex: Marie Curie" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: contact@loisirsplus.com" required />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Ex: 01 98 76 54 32" />
      </div>
      <div>
        <Label htmlFor="partnershipDate">Date de début du partenariat</Label>
        <Input id="partnershipDate" name="partnershipDate" type="date" value={formData.partnershipDate} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="contractLink">Lien vers le contrat (optionnel)</Label>
        <Input id="contractLink" name="contractLink" value={formData.contractLink} onChange={handleChange} placeholder="Ex: https://docs.example.com/contrat.pdf" />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Détails du partenariat, conditions spécifiques..."></textarea>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white">
          {partner ? 'Mettre à jour' : 'Ajouter Partenaire'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PartnerForm;