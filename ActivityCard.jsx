import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Eye, Calendar, DollarSign, MapPin, Users, Building, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as UiDialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const ActivityCard = ({ activity, index, onView, onEdit, onDelete }) => {
  return (
    <motion.div
      key={activity.id}
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex"
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full flex flex-col bg-gradient-to-br from-card to-secondary/10 border-l-4 border-orange-500">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-orange-600">{activity.name}</CardTitle>
            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center">
              <Zap className="h-3 w-3 mr-1" />{activity.type || 'Général'}
            </span>
          </div>
          <CardDescription className="text-sm text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-2"/> {new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          <p className="text-sm flex items-center"><MapPin className="h-4 w-4 mr-2 text-orange-500/80" /> {activity.location}</p>
          <p className="text-sm flex items-center"><DollarSign className="h-4 w-4 mr-2 text-green-500/80" /> Prix d'entrée: {activity.price || 0} €</p>
          <p className="text-sm flex items-center"><Users className="h-4 w-4 mr-2 text-blue-500/80" /> Capacité: {activity.capacity || 'N/A'}</p>
          {activity.partner_id && activity.partner_name && <p className="text-sm flex items-center"><Building className="h-4 w-4 mr-2 text-purple-500/80"/> Partenaire: {activity.partner_name}</p>}
          {activity.description && <p className="text-xs text-muted-foreground pt-2 line-clamp-3">{activity.description}</p>}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
          <Button variant="ghost" size="icon" onClick={() => onView(activity)} aria-label="Voir détails">
            <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(activity)} aria-label="Modifier">
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
                <UiDialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'activité "{activity.name}" ? Cette action est irréversible.
                </UiDialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => onDelete(activity.id)}>Supprimer</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default ActivityCard;