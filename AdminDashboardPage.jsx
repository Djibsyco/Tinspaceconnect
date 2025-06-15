import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, BarChart2, Activity, ShieldAlert, DollarSign, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const AdminStatCard = ({ title, value, icon: Icon, description, color, prefix = '', suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
  >
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4" style={{borderColor: color || 'hsl(var(--primary))'}}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color ? '' : 'text-primary'}`} style={{color: color}} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{prefix}{value}{suffix}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProspects: 0,
    totalPartners: 0,
    totalActivities: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw usersError;

        const { count: prospectsCount, error: prospectsError } = await supabase.from('prospects').select('*', { count: 'exact', head: true });
        if (prospectsError) throw prospectsError;
        
        const { count: partnersCount, error: partnersError } = await supabase.from('partners').select('*', { count: 'exact', head: true });
        if (partnersError) throw partnersError;

        const { count: activitiesCount, error: activitiesError } = await supabase.from('activities').select('*', { count: 'exact', head: true });
        if (activitiesError) throw activitiesError;

        const { data: salesData, error: salesError } = await supabase.from('sales').select('total_price');
        if (salesError) throw salesError;
        const totalRevenue = salesData.reduce((acc, sale) => acc + (sale.total_price || 0), 0);

        setStats({
          totalUsers: usersData.users?.length || 0,
          totalProspects: prospectsCount || 0,
          totalPartners: partnersCount || 0,
          totalActivities: activitiesCount || 0,
          totalRevenue: totalRevenue || 0,
        });
      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        // Optionally set some error state to display to user
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p>Chargement des statistiques...</p></div>;
  }

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
      >
        Tableau de Bord Administrateur
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <AdminStatCard title="Utilisateurs Actifs" value={stats.totalUsers} icon={Users} description="Membres de l'équipe" color="hsl(var(--primary))" />
        <AdminStatCard title="Total Prospects" value={stats.totalProspects} icon={Briefcase} description="Entreprises en prospection" color="hsl(var(--chart-2))" />
        <AdminStatCard title="Total Partenaires" value={stats.totalPartners} icon={Users} description="Partenariats établis" color="hsl(var(--chart-3))" />
        <AdminStatCard title="Événements Créés" value={stats.totalActivities} icon={CalendarDays} description="Événements sur la plateforme" color="hsl(var(--chart-4))" />
        <AdminStatCard title="Chiffre d'Affaires" value={stats.totalRevenue.toFixed(2)} icon={DollarSign} description="Revenu total généré" color="hsl(var(--chart-5))" prefix="€" />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Activité Récente du Système</CardTitle>
              <CardDescription>Dernières actions importantes sur la plateforme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-2 border rounded-md">
                <ShieldAlert className="h-5 w-5 text-yellow-500" />
                <p className="text-sm">Nouvel utilisateur "Commercial Test" créé.</p>
                <span className="text-xs text-muted-foreground ml-auto">Il y a 15min</span>
              </div>
              <div className="flex items-center space-x-3 p-2 border rounded-md">
                <Activity className="h-5 w-5 text-blue-500" />
                <p className="text-sm">Rapport mensuel des ventes généré.</p>
                <span className="text-xs text-muted-foreground ml-auto">Il y a 1h</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Statistiques Clés</CardTitle>
              <CardDescription>Aperçu des performances globales.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Graphiques et statistiques détaillées à venir ici.</p>
              <div className="mt-4 h-40 bg-secondary/50 rounded-md flex items-center justify-center">
                <BarChart2 className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;