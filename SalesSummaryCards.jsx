import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Ticket } from 'lucide-react';

const SalesSummaryCards = ({ totalRevenue, totalTicketsSold }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Revenu Total</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{totalRevenue.toFixed(2)} €</div>
          <p className="text-xs text-green-500">Basé sur les ventes payées filtrées</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Billets Vendus</CardTitle>
          <Ticket className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{totalTicketsSold}</div>
          <p className="text-xs text-blue-500">Pour les ventes payées filtrées</p>
        </CardContent>
      </Card>
      {/* Add more summary cards if needed, e.g., average sale value, top event */}
    </div>
  );
};

export default SalesSummaryCards;