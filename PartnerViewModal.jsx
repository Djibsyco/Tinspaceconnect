import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, Link as LinkIcon } from 'lucide-react';

const PartnerViewModal = ({ partner, isOpen, onClose }) => {
  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{partner.name}</DialogTitle>
          <DialogDescription>{partner.type}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <p className="flex items-center"><Building className="h-5 w-5 mr-3 text-primary/80" /> <strong>Contact:</strong> {partner.contact || 'N/A'}</p>
          <p className="flex items-center"><Mail className="h-5 w-5 mr-3 text-primary/80" /> <strong>Email:</strong> {partner.email}</p>
          <p className="flex items-center"><Phone className="h-5 w-5 mr-3 text-primary/80" /> <strong>Téléphone:</strong> {partner.phone || 'N/A'}</p>
          <p className="text-sm text-muted-foreground"><strong>Partenaire depuis:</strong> {new Date(partner.partnershipDate).toLocaleDateString()}</p>
          {partner.contractLink && (
            <p className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-3 text-primary/80" /> 
              <strong>Contrat:</strong> 
              <a href={partner.contractLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:underline">
                Voir le contrat
              </a>
            </p>
          )}
          {partner.notes && (
            <div className="pt-2">
              <strong className="text-sm">Notes:</strong>
              <p className="text-sm bg-secondary/50 p-3 rounded-md mt-1 whitespace-pre-wrap">{partner.notes}</p>
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

export default PartnerViewModal;