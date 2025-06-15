import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, TrendingUp, PlusCircle, Filter, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext'; // If needed for user-specific data

const ProspectorDashboardPage = () => {
  // const { user, profile } = useAuth(); // Example if user data is needed

  // Placeholder data - replace with actual data fetching logic
  const stats = {
    newLeadsToday: 5,
    activeProspects: 120,
    conversionRate: '15%',
    upcomingTasks: 3,
  };

  const recentProspects = [
    { id: 1, name: 'Entreprise Alpha', status: 'Contacté', lastInteraction: '2024-05-22' },
    { id: 2, name: 'Société Beta', status: 'Nouveau', lastInteraction: '2024-05-23' },
    { id: 3, name: 'Groupe Gamma', status: 'En négociation', lastInteraction: '2024-05-20' },
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord Prospecteur</h1>
          <p className="text-muted-foreground">Votre centre de commande pour la prospection.</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <Link to="/prospects/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Ajouter un Prospect
          </Link>
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} title="Nouveaux Leads (Jour)" value={stats.newLeadsToday} color="text-blue-500" />
        <StatCard icon={Target} title="Prospects Actifs" value={stats.activeProspects} color="text-indigo-500" />
        <StatCard icon={TrendingUp} title="Taux de Conversion" value={stats.conversionRate} color="text-green-500" />
        <StatCard icon={ListChecks} title="Tâches à Venir" value={stats.upcomingTasks} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-lg h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mes Prospects Récents</CardTitle>
                <CardDescription>Suivez vos dernières interactions.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/prospects">
                  <Filter className="mr-2 h-4 w-4" /> Voir Tous
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProspects.map((prospect) => (
                  <div key={prospect.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md hover:bg-secondary/80 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{prospect.name}</p>
                      <p className="text-sm text-muted-foreground">Statut: {prospect.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Dernier contact</p>
                      <p className="text-sm font-medium text-foreground">{prospect.lastInteraction}</p>
                    </div>
                  </div>
                ))}
                {recentProspects.length === 0 && <p className="text-muted-foreground text-center py-4">Aucun prospect récent.</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle>Objectifs & Performance</CardTitle>
              <CardDescription>Suivi de vos indicateurs clés.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Prospects contactés ce mois</span>
                  <span className="font-semibold">35 / 50</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Contrats signés ce mois</span>
                  <span className="font-semibold">5 / 10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Voir les rapports détaillés</Button>
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

export default ProspectorDashboardPage;