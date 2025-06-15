import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { Slider } from '@/components/ui/slider';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from '@/components/ui/textarea'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const ActivityForm = ({ activity, onSubmit, onCancel, partners }) => {
  const [formData, setFormData] = useState(
    activity || { name: '', type: '', date: new Date().toISOString().split('T')[0], location: '', price: 0, capacity: 50, partner_id: '', description: '' }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type: inputType } = e.target;
    setFormData(prev => ({ ...prev, [name]: inputType === 'number' ? parseFloat(value) : value }));
  };
  
  const handleSliderChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez renseigner au moins le nom, la date et le lieu de l'activité.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({...formData, partner_id: formData.partner_id === '' ? null : formData.partner_id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="font-semibold">Nom de l'activité/événement</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Concert en Plein Air" required className="mt-1"/>
        </div>
        <div>
          <Label htmlFor="type" className="font-semibold">Type</Label>
          <Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder="Ex: Festival, Atelier, Soirée" className="mt-1"/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date" className="font-semibold">Date</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required className="mt-1"/>
        </div>
        <div>
          <Label htmlFor="location" className="font-semibold">Lieu</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: Salle des Fêtes, Parc Central" required className="mt-1"/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="price" className="font-semibold">Prix (€) - {formData.price}</Label>
          <Slider name="price" defaultValue={[formData.price]} max={500} step={1} onValueChange={(value) => handleSliderChange(value, "price")} className="mt-2"/>
        </div>
        <div>
          <Label htmlFor="capacity" className="font-semibold">Capacité - {formData.capacity}</Label>
          <Slider name="capacity" defaultValue={[formData.capacity]} max={5000} step={10} onValueChange={(value) => handleSliderChange(value, "capacity")} className="mt-2"/>
        </div>
      </div>
       <div>
        <Label htmlFor="partner_id" className="font-semibold">Partenaire associé (optionnel)</Label>
        <Select name="partner_id" value={formData.partner_id || ''} onValueChange={(value) => handleSelectChange(value, "partner_id")}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Sélectionner un partenaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucun</SelectItem>
            {partners.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description" className="font-semibold">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1" placeholder="Détails sur l'activité, programme, informations utiles..."></Textarea>
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
          {activity ? 'Mettre à jour Événement' : 'Ajouter Événement'}
        </Button>
      </DialogFooter>
    </form>
  );
};
export default ActivityForm;