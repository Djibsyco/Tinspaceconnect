import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Zap, BarChart3, PlusCircle, Edit3, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

const PartnerSpaceDashboardPage = () => {
  // const { user, profile } = useAuth(); // Example if user data is needed

  // Placeholder data
  const upcomingEvents = [
    { id: 1, name: "Festival de Musique Urbaine", date: "2025-07-15", status: "Confirmé", ticketsSold: 1250, capacity: 2000 },
    { id: 2, name: "Salon de l'Artisanat Local", date: "2025-08-02", status: "En attente de validation", ticketsSold: 0, capacity: 300 },
    { id: 3, name: "Compétition eSport Pro", date: "2025-09-10", status: "Confirmé", ticketsSold: 450, capacity: 500 },
  ];

  const stats = {
    totalEventsManaged: 15,
    totalTicketsSold: 8750,
    averageRating: 4.7,
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Espace Partenaire</h1>
          <p className="text-muted-foreground">Gérez vos événements et suivez vos performances.</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
          <Link to="/activities/new"> {/* Assuming a route to create new activities/events */}
            <PlusCircle className="mr-2 h-5 w-5" /> Proposer un Nouvel Événement
          </Link>
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Zap} title="Événements Gérés" value={stats.totalEventsManaged} color="text-green-500" />
        <StatCard icon={CalendarDays} title="Billets Vendus (Total)" value={stats.totalTicketsSold} color="text-teal-500" />
        <StatCard icon={BarChart3} title="Note Moyenne" value={`${stats.averageRating} / 5`} color="text-yellow-500" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mes Événements à Venir</CardTitle>
            <CardDescription>Suivez le statut et les performances de vos prochains événements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-secondary/30 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      event.status === "Confirmé" ? "bg-green-100 text-green-700" : 
                      event.status === "En attente de validation" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <CardDescription>Date: {new Date(event.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Billets Vendus</p>
                    <p className="font-semibold">{event.ticketsSold}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capacité</p>
                    <p className="font-semibold">{event.capacity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Taux Remplissage</p>
                    <p className="font-semibold">{event.capacity > 0 ? ((event.ticketsSold / event.capacity) * 100).toFixed(0) : 0}%</p>
                  </div>
                  <div className="flex items-end justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/activities/${event.id}/edit`}> {/* Placeholder link */}
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                     <Button variant="outline" size="sm" asChild>
                      <Link to={`/activities/${event.id}/comments`}> {/* Placeholder link */}
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {upcomingEvents.length === 0 && <p className="text-muted-foreground text-center py-4">Aucun événement à venir programmé.</p>}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/activities">Voir tous mes événements</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center p-4 bg-secondary/50 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold mb-2">Mode Délégation</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Laissez l'équipe Tin Space créer et gérer vos événements. Vous n'aurez qu'à valider les propositions.
        </p>
        <Button variant="secondary">Activer la Délégation Totale (Bientôt disponible)</Button>
      </motion.div>

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

export default PartnerSpaceDashboardPage;