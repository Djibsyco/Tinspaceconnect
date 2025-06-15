import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const ProspectViewModal = ({ prospect, isOpen, onClose }) => {
  if (!prospect) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{prospect.name}</DialogTitle>
          <DialogDescription>{prospect.type}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <p className="flex items-center"><Briefcase className="h-5 w-5 mr-3 text-primary/80" /> <strong>Contact:</strong> {prospect.contact || 'N/A'}</p>
          <p className="flex items-center"><Mail className="h-5 w-5 mr-3 text-primary/80" /> <strong>Email:</strong> {prospect.email}</p>
          <p className="flex items-center"><Phone className="h-5 w-5 mr-3 text-primary/80" /> <strong>Téléphone:</strong> {prospect.phone || 'N/A'}</p>
          <p className="flex items-center"><MapPin className="h-5 w-5 mr-3 text-primary/80" /> <strong>Statut:</strong> {prospect.status}</p>
          <p className="text-sm text-muted-foreground"><strong>Dernière interaction:</strong> {new Date(prospect.lastInteraction).toLocaleDateString()}</p>
          {prospect.notes && (
            <div className="pt-2">
              <strong className="text-sm">Notes:</strong>
              <p className="text-sm bg-secondary/50 p-3 rounded-md mt-1 whitespace-pre-wrap">{prospect.notes}</p>
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

export default ProspectViewModal;