import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const TeamMemberForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    member || { name: '', email: '', phone: '', role: 'Commercial Junior', commissionRate: 0.03 }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez renseigner le nom, l'email et le rôle du membre.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: John Doe" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: john.doe@example.com" required />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Ex: 0601020304" />
      </div>
      <div>
        <Label htmlFor="role">Rôle</Label>
        <select id="role" name="role" value={formData.role} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="Commercial Junior">Commercial Junior</option>
          <option value="Commercial Senior">Commercial Senior</option>
          <option value="Responsable Partenariats">Responsable Partenariats</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      <div>
        <Label htmlFor="commissionRate">Taux de commission (ex: 0.05 pour 5%)</Label>
        <Input id="commissionRate" name="commissionRate" type="number" step="0.01" value={formData.commissionRate} onChange={handleChange} placeholder="Ex: 0.05" />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white">
          {member ? 'Mettre à jour' : 'Ajouter Membre'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default TeamMemberForm;