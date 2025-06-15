import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Ajout de l'import manquant
import { MessageSquare, Inbox, CheckCircle, AlertTriangle, PlusCircle, Filter, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

const SupportDashboardPage = () => {
  // const { user, profile } = useAuth();

  // Placeholder data
  const ticketStats = {
    newTickets: 5,
    openTickets: 23,
    resolvedToday: 12,
    pendingResponse: 8,
  };

  const recentTickets = [
    { id: 'TKT001', subject: 'Problème de connexion', customer: 'Jean Dupont', status: 'Ouvert', priority: 'Haute', lastUpdate: 'Il y a 5min' },
    { id: 'TKT002', subject: 'Question sur la facturation', customer: 'Alice Martin', status: 'En attente', priority: 'Moyenne', lastUpdate: 'Il y a 2h' },
    { id: 'TKT003', subject: 'Remboursement événement annulé', customer: 'Bob Lefevre', status: 'Résolu', priority: 'Basse', lastUpdate: 'Hier' },
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord Support Client</h1>
          <p className="text-muted-foreground">Gérez les demandes et assistez vos utilisateurs.</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white">
          <Link to="/support/tickets/new"> {/* Assuming a route to create new tickets */}
            <PlusCircle className="mr-2 h-5 w-5" /> Nouveau Ticket
          </Link>
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} title="Nouveaux Tickets" value={ticketStats.newTickets} color="text-cyan-500" />
        <StatCard icon={AlertTriangle} title="Tickets Ouverts" value={ticketStats.openTickets} color="text-sky-500" />
        <StatCard icon={CheckCircle} title="Résolus Aujourd'hui" value={ticketStats.resolvedToday} color="text-green-500" />
        <StatCard icon={MessageSquare} title="En Attente Réponse Client" value={ticketStats.pendingResponse} color="text-orange-500" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tickets Récents</CardTitle>
              <CardDescription>Suivez les dernières demandes et leur statut.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/support/tickets"> {/* Link to full ticket list */}
                <Filter className="mr-2 h-4 w-4" /> Voir Tous les Tickets
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-secondary/50 rounded-md hover:bg-secondary/80 transition-colors">
                  <div className="flex-grow mb-2 sm:mb-0">
                    <p className="font-semibold text-foreground">{ticket.subject} <span className="text-xs text-muted-foreground">({ticket.id})</span></p>
                    <p className="text-sm text-muted-foreground">Client: {ticket.customer}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm w-full sm:w-auto">
                     <span className={`px-2 py-0.5 rounded-full font-semibold text-xs whitespace-nowrap ${
                        ticket.priority === "Haute" ? "bg-red-100 text-red-700" : 
                        ticket.priority === "Moyenne" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        Priorité: {ticket.priority}
                      </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-xs whitespace-nowrap ${
                        ticket.status === "Ouvert" ? "bg-blue-100 text-blue-700" : 
                        ticket.status === "En attente" ? "bg-orange-100 text-orange-700" : 
                        ticket.status === "Résolu" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {ticket.status}
                      </span>
                    <p className="text-xs text-muted-foreground whitespace-nowrap sm:text-right">{ticket.lastUpdate}</p>
                  </div>
                </div>
              ))}
              {recentTickets.length === 0 && <p className="text-muted-foreground text-center py-4">Aucun ticket récent.</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Base de Connaissances</CardTitle>
            <CardDescription>Accès rapide aux articles d'aide.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for knowledge base search or links */}
            <Input placeholder="Rechercher dans la base de connaissances..." className="mb-3" />
            <Link to="/support/kb/article1" className="text-sm text-primary hover:underline block">Comment réinitialiser mon mot de passe ?</Link>
            <Link to="/support/kb/article2" className="text-sm text-primary hover:underline block mt-1">Politique de remboursement</Link>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/support/knowledge-base">Explorer la Base de Connaissances</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>Rechercher et gérer les informations clients.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for user search */}
            <Input placeholder="Rechercher un utilisateur par email ou nom..." className="mb-3" />
            <Button className="w-full" variant="secondary">
              <Users className="mr-2 h-4 w-4" /> Rechercher un Utilisateur
            </Button>
          </CardContent>
        </Card>
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

export default SupportDashboardPage;