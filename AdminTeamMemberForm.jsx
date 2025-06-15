import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ALL_PERMISSIONS } from '@/pages/admin/AdminTeamManagementPage';


const AdminTeamMemberForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    member || { name: '', email: '', phone: '', role: 'Commercial Junior', commissionRate: 0.03, permissions: [] }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: John Doe" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: john.doe@example.com" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <option value="Marketing">Marketing</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="commissionRate">Taux de commission (ex: 0.05 pour 5%)</Label>
        <Input id="commissionRate" name="commissionRate" type="number" step="0.01" value={formData.commissionRate} onChange={handleChange} placeholder="Ex: 0.05" />
      </div>
      <div>
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
          {ALL_PERMISSIONS.map(perm => (
            <div key={perm.id} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={`perm-${perm.id}`} 
                checked={(formData.permissions && formData.permissions.includes(perm.id)) || (formData.permissions && formData.permissions.includes('all'))} 
                onChange={() => handlePermissionChange(perm.id)}
                disabled={(formData.permissions && formData.permissions.includes('all')) && perm.id !== 'admin_access'}
                className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
              />
              <Label htmlFor={`perm-${perm.id}`} className="text-sm font-normal">{perm.label}</Label>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white">
          {member ? 'Mettre à jour Membre' : 'Ajouter Membre'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AdminTeamMemberForm;