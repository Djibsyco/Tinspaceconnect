import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Eye, Building, Mail, Phone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const PartnerCard = ({ partner, index, onView, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex"
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full flex flex-col bg-gradient-to-br from-card to-secondary/10">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-primary">{partner.name}</CardTitle>
            {partner.contractLink && (
              <a href={partner.contractLink} target="_blank" rel="noopener noreferrer" className="text-primary/70 hover:text-primary">
                <FileText className="h-5 w-5" />
              </a>
            )}
          </div>
          <CardDescription className="text-sm text-muted-foreground">{partner.type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          {partner.contact && <p className="text-sm flex items-center"><Building className="h-4 w-4 mr-2 text-primary/70" /> {partner.contact}</p>}
          <p className="text-sm flex items-center"><Mail className="h-4 w-4 mr-2 text-primary/70" /> {partner.email}</p>
          {partner.phone && <p className="text-sm flex items-center"><Phone className="h-4 w-4 mr-2 text-primary/70" /> {partner.phone}</p>}
          <p className="text-xs text-muted-foreground pt-2">Partenaire depuis: {new Date(partner.partnershipDate).toLocaleDateString()}</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
          <Button variant="ghost" size="icon" onClick={() => onView(partner)} aria-label="Voir détails">
            <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(partner)} aria-label="Modifier">
            <Edit3 className="h-5 w-5 text-green-500 hover:text-green-700" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Supprimer">
                <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card">
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer le partenaire "{partner.name}" ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => onDelete(partner.id)}>Supprimer</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PartnerCard;