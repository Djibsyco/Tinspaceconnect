import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Eye, Mail, Phone, Award, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const POINT_VALUE_FOR_COMMISSION = 10;

const TeamMemberCard = ({ member, index, onView, onEdit, onDelete, canManage }) => {
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
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-xl text-primary">{member.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{member.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          <p className="text-sm flex items-center"><Mail className="h-4 w-4 mr-2 text-primary/70" /> {member.email}</p>
          {member.phone && <p className="text-sm flex items-center"><Phone className="h-4 w-4 mr-2 text-primary/70" /> {member.phone}</p>}
          <p className="text-sm flex items-center"><Award className="h-4 w-4 mr-2 text-yellow-500" /> Points: {member.points}</p>
          <p className="text-sm flex items-center"><DollarSign className="h-4 w-4 mr-2 text-green-500" /> Commission Est.: {(member.points * POINT_VALUE_FOR_COMMISSION * member.commissionRate).toFixed(2)} €</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
          <Button variant="ghost" size="icon" onClick={() => onView(member)} aria-label="Voir détails">
            <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700" />
          </Button>
          {canManage && onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(member)} aria-label="Modifier">
              <Edit3 className="h-5 w-5 text-green-500 hover:text-green-700" />
            </Button>
          )}
          {canManage && onDelete && (
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
                    Êtes-vous sûr de vouloir supprimer {member.name} de l'équipe ? Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                  <DialogClose asChild><Button variant="destructive" onClick={() => onDelete(member.id)}>Supprimer</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard;