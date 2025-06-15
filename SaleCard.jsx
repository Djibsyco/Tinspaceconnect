import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Eye, Ticket, Calendar, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const SaleCard = ({ sale, index, onView, onEdit, onDelete }) => {
  return (
    <motion.div
      key={sale.id}
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
            <CardTitle className="text-xl text-primary">{sale.eventName}</CardTitle>
              <span className={`px-2 py-1 text-xs rounded-full font-semibold
              ${sale.paymentStatus === 'Payé' ? 'bg-green-100 text-green-700' :
                sale.paymentStatus === 'En attente' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`}>
              {sale.paymentStatus}
            </span>
          </div>
          <CardDescription className="text-sm text-muted-foreground">{sale.ticketType}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          <p className="text-sm flex items-center"><User className="h-4 w-4 mr-2 text-primary/70" /> Client: {sale.customerName || 'N/A'}</p>
          <p className="text-sm flex items-center"><Ticket className="h-4 w-4 mr-2 text-primary/70" /> Quantité: {sale.quantity}</p>
          <p className="text-sm flex items-center"><DollarSign className="h-4 w-4 mr-2 text-primary/70" /> Total: {sale.totalPrice.toFixed(2)} €</p>
          <p className="text-xs text-muted-foreground pt-2 flex items-center"><Calendar className="h-3 w-3 mr-1" /> Vendu le: {new Date(sale.saleDate).toLocaleDateString()}</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
          <Button variant="ghost" size="icon" onClick={() => onView(sale)} aria-label="Voir détails">
            <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(sale)} aria-label="Modifier">
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
                  Êtes-vous sûr de vouloir supprimer cette vente pour "{sale.eventName}" ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                <DialogClose asChild><Button variant="destructive" onClick={() => onDelete(sale.id)}>Supprimer</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SaleCard;