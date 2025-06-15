import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Mail, Phone, Award, DollarSign, Briefcase as BriefcaseIcon, Building as BuildingIcon, ShieldCheck } from 'lucide-react';
import { ALL_PERMISSIONS } from '@/pages/admin/AdminTeamManagementPage';

const POINT_VALUE_FOR_COMMISSION = 10;

const AdminTeamMemberViewModal = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">{member.name}</DialogTitle>
          <DialogDescription>{member.role}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          <p className="flex items-center"><Mail className="h-5 w-5 mr-3 text-muted-foreground" /> {member.email}</p>
          {member.phone && <p className="flex items-center"><Phone className="h-5 w-5 mr-3 text-muted-foreground" /> {member.phone}</p>}
          <p className="flex items-center"><Award className="h-5 w-5 mr-3 text-yellow-500" /> Points: {member.points}</p>
          <p className="flex items-center"><DollarSign className="h-5 w-5 mr-3 text-green-500" /> Commission Estimée: {(member.points * POINT_VALUE_FOR_COMMISSION * member.commissionRate).toFixed(2)} €</p>
          
          <div>
            <h3 className="text-md font-semibold mt-3 mb-1 text-foreground flex items-center"><ShieldCheck className="h-5 w-5 mr-2 text-muted-foreground" />Permissions Actives:</h3>
            {member.permissions?.includes('all') ? (
                <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full">Accès Total (Admin)</span>
            ) : member.permissions && member.permissions.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1 bg-secondary/30 p-2 rounded-md">
                {member.permissions.map(permId => {
                    const permLabel = ALL_PERMISSIONS.find(p => p.id === permId)?.label;
                    return permLabel ? <li key={permId}>{permLabel}</li> : null;
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucune permission spécifique.</p>
            )}
          </div>

          {member.prospects && member.prospects.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mt-3 mb-1 text-foreground flex items-center"><BriefcaseIcon className="h-5 w-5 mr-2 text-muted-foreground" /> Prospects Assignés ({member.prospects.length})</h3>
              <ul className="space-y-1 list-disc list-inside text-sm bg-secondary/30 p-2 rounded-md">
                {member.prospects.map(p => <li key={p.id}>{p.name} - <span className="italic text-muted-foreground">{p.status}</span></li>)}
              </ul>
            </div>
          )}

          {member.partners && member.partners.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mt-3 mb-1 text-foreground flex items-center"><BuildingIcon className="h-5 w-5 mr-2 text-muted-foreground" /> Partenaires Ajoutés ({member.partners.length})</h3>
               <ul className="space-y-1 list-disc list-inside text-sm bg-secondary/30 p-2 rounded-md">
                {member.partners.map(p => <li key={p.id}>{p.name} - <span className="italic text-muted-foreground">{p.type}</span></li>)}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTeamMemberViewModal;