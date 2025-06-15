import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const ProspectForm = ({ prospect, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    prospect || { name: '', type: '', contact: '', email: '', phone: '', status: 'Nouveau', notes: '' }
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
        description: "Veuillez renseigner au moins le nom et l'email du prospect.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'entreprise</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Événements Inc." required />
      </div>
      <div>
        <Label htmlFor="type">Type d'entreprise</Label>
        <Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder="Ex: Événementiel, Activités ludiques" />
      </div>
      <div>
        <Label htmlFor="contact">Personne à contacter</Label>
        <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Ex: Jean Dupont" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: contact@evenements-inc.com" required />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Ex: 01 23 45 67 89" />
      </div>
      <div>
        <Label htmlFor="status">Statut</Label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="Nouveau">Nouveau</option>
          <option value="Contacté">Contacté</option>
          <option value="En négociation">En négociation</option>
          <option value="À relancer">À relancer</option>
          <option value="Non intéressé">Non intéressé</option>
        </select>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Ajoutez des notes pertinentes..."></textarea>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white">
          {prospect ? 'Mettre à jour' : 'Ajouter Prospect'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProspectForm;