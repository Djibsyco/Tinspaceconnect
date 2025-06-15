import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Mail, Phone, Award, DollarSign, Briefcase, Building as BuildingIcon } from 'lucide-react';

const POINT_VALUE_FOR_COMMISSION = 10; // Consistent with TeamPage

const TeamMemberViewModal = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{member.name}</DialogTitle>
          <DialogDescription>{member.role}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <p className="flex items-center"><Mail className="h-5 w-5 mr-3 text-primary/80" /> {member.email}</p>
          {member.phone && <p className="flex items-center"><Phone className="h-5 w-5 mr-3 text-primary/80" /> {member.phone}</p>}
          <p className="flex items-center"><Award className="h-5 w-5 mr-3 text-yellow-500" /> Points: {member.points}</p>
          <p className="flex items-center"><DollarSign className="h-5 w-5 mr-3 text-green-500" /> Commission Estimée: {(member.points * POINT_VALUE_FOR_COMMISSION * member.commissionRate).toFixed(2)} €</p>
          
          {member.prospects && member.prospects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground flex items-center"><Briefcase className="h-5 w-5 mr-2 text-primary/80" /> Prospects Assignés ({member.prospects.length})</h3>
              <ul className="space-y-1 list-disc list-inside text-sm bg-secondary/30 p-3 rounded-md">
                {member.prospects.map(p => <li key={p.id}>{p.name} - <span className="italic text-muted-foreground">{p.status}</span></li>)}
              </ul>
            </div>
          )}

          {member.partners && member.partners.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground flex items-center"><BuildingIcon className="h-5 w-5 mr-2 text-primary/80" /> Partenaires Ajoutés ({member.partners.length})</h3>
                <ul className="space-y-1 list-disc list-inside text-sm bg-secondary/30 p-3 rounded-md">
                {member.partners.map(p => <li key={p.id}>{p.name} - <span className="italic text-muted-foreground">{p.type}</span></li>)}
              </ul>
            </div>
          )}

            {(member.prospects?.length === 0 && member.partners?.length === 0) && (
              <p className="text-sm text-muted-foreground italic mt-4">Aucun prospect ou partenaire assigné/ajouté par ce membre.</p>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberViewModal;