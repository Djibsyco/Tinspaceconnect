import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { User, Ticket, Percent, DollarSign, BarChart3, Calendar } from 'lucide-react';

const SaleViewModal = ({ sale, isOpen, onClose }) => {
  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{sale.eventName}</DialogTitle>
          <DialogDescription>{sale.ticketType}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <p className="flex items-center"><User className="h-5 w-5 mr-3 text-primary/80" /> <strong>Client:</strong> {sale.customerName || 'N/A'}</p>
          <p className="flex items-center"><Ticket className="h-5 w-5 mr-3 text-primary/80" /> <strong>Quantité:</strong> {sale.quantity}</p>
          <p className="flex items-center"><Percent className="h-5 w-5 mr-3 text-primary/80" /> <strong>Prix Unitaire:</strong> {sale.pricePerTicket.toFixed(2)} €</p>
          <p className="flex items-center"><DollarSign className="h-5 w-5 mr-3 text-primary/80" /> <strong>Total:</strong> {sale.totalPrice.toFixed(2)} €</p>
          <p className="flex items-center"><BarChart3 className="h-5 w-5 mr-3 text-primary/80" /> <strong>Statut Paiement:</strong> {sale.paymentStatus}</p>
          <p className="text-sm text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-2 text-primary/80" /><strong>Date de vente:</strong> {new Date(sale.saleDate).toLocaleDateString()}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaleViewModal;