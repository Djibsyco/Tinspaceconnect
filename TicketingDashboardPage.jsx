import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, DollarSign, Users, QrCode, Percent, PlusCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

const TicketingDashboardPage = () => {
  // const { user, profile } = useAuth();

  // Placeholder data
  const salesToday = { count: 150, revenue: 4500.75 };
  const activeEvents = 5;
  const totalAttendees = 2500;

  const recentSales = [
    { id: 'SALE001', eventName: 'Festival de Musique', customer: 'Alice Dupont', amount: 75.00, time: 'Il y a 15min' },
    { id: 'SALE002', eventName: 'Salon Tech Innov', customer: 'Bob Martin', amount: 25.50, time: 'Il y a 45min' },
    { id: 'SALE003', eventName: 'Concert Rock', customer: 'Carla Jean', amount: 120.00, time: 'Il y a 1h' },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord Billetterie</h1>
          <p className="text-muted-foreground">Gérez les ventes, les participants et les événements.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
            <Link to="/tickets/new"> {/* Assuming a route to create new sales/tickets */}
              <PlusCircle className="mr-2 h-5 w-5" /> Nouvelle Vente
            </Link>
          </Button>
           <Button variant="outline">
            <QrCode className="mr-2 h-5 w-5" /> Scanner un Billet
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Ticket} title="Ventes Aujourd'hui" value={salesToday.count} color="text-purple-500" />
        <StatCard icon={DollarSign} title="Revenus Aujourd'hui" value={`€${salesToday.revenue.toFixed(2)}`} color="text-pink-500" />
        <StatCard icon={Users} title="Participants (Total Actif)" value={totalAttendees} color="text-indigo-500" />
        <StatCard icon={Percent} title="Codes Promo Actifs" value="12" color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-lg h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ventes Récentes</CardTitle>
                <CardDescription>Suivez les dernières transactions.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/tickets"> {/* Link to full sales list */}
                  Voir Toutes les Ventes
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md hover:bg-secondary/80 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{sale.eventName}</p>
                      <p className="text-sm text-muted-foreground">Client: {sale.customer} - ID: {sale.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-pink-600">€{sale.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{sale.time}</p>
                    </div>
                  </div>
                ))}
                {recentSales.length === 0 && <p className="text-muted-foreground text-center py-4">Aucune vente récente.</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle>Outils Rapides</CardTitle>
              <CardDescription>Accès direct aux fonctionnalités clés.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/tickets/manage-registrations"><Users className="mr-2 h-4 w-4" /> Gérer les Inscriptions</Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/tickets/refunds"><DollarSign className="mr-2 h-4 w-4" /> Traiter les Remboursements</Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/tickets/promo-codes"><Percent className="mr-2 h-4 w-4" /> Gérer les Codes Promo</Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/tickets/invitations"><PlusCircle className="mr-2 h-4 w-4" /> Envoyer des Invitations</Link>
              </Button>
              <Button className="w-full mt-4" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exporter les Données de Vente
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div whileHover={{ y: -5 }} className="h-full">
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color || 'text-primary'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

export default TicketingDashboardPage;