import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, DollarSign, MapPin, Users, Building, Zap, Info, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ActivityViewModal = ({ activity, isOpen, onClose }) => {
  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card shadow-2xl border-l-4 border-orange-500">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
             <div className="p-3 rounded-full bg-orange-100">
                <Zap className="h-7 w-7 text-orange-500" />
             </div>
             <div>
                <DialogTitle className="text-2xl font-bold text-orange-600">{activity.name}</DialogTitle>
                <DialogDescription className="text-md text-muted-foreground">{activity.type || 'Activité Générale'}</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-6 max-h-[60vh] overflow-y-auto px-2">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-orange-500/90 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Date</p>
              <p className="text-md text-muted-foreground">{new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-orange-500/90 flex-shrink-0" />
             <div>
              <p className="text-sm font-semibold text-foreground">Lieu</p>
              <p className="text-md text-muted-foreground">{activity.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-green-500/90 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Prix</p>
                <Badge variant="secondary" className="text-md">{activity.price || 0} €</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-500/90 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Capacité</p>
                 <Badge variant="secondary" className="text-md">{activity.capacity || 'N/A'} personnes</Badge>
              </div>
            </div>
          </div>

          {activity.partner_id && activity.partner_name && (
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-purple-500/90 flex-shrink-0" />
              <div>
                  <p className="text-sm font-semibold text-foreground">Partenaire Associé</p>
                  <p className="text-md text-muted-foreground">{activity.partner_name}</p>
              </div>
            </div>
          )}
          
          {activity.description && (
            <div className="pt-2">
              <div className="flex items-center space-x-3 mb-1">
                <Info className="h-5 w-5 text-gray-500/90 flex-shrink-0" />
                <p className="text-sm font-semibold text-foreground">Description Détaillée</p>
              </div>
              <div className="text-md text-muted-foreground bg-secondary/30 p-4 rounded-lg border border-border whitespace-pre-wrap max-h-40 overflow-y-auto">
                {activity.description}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="mr-auto">Fermer</Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center">
            <Ticket className="h-4 w-4 mr-2"/> Acheter des Billets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityViewModal;