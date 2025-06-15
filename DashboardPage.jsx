import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase as BriefcaseBusiness, Zap, DollarSign, Activity, PlusCircle, ArrowRight, Bell, CalendarDays, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const StatCard = ({ title, value, icon: Icon, description, color, linkTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    whileHover={{ y: -6, boxShadow: "0px 12px 25px rgba(0,0,0,0.12), 0px 5px 10px rgba(0,0,0,0.08)" }}
    className="h-full"
  >
    <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border-l-4" style={{ borderColor: color || 'hsl(var(--primary))' }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-card to-secondary/10">
        <CardTitle className="text-md font-semibold text-foreground">{title}</CardTitle>
        <Icon className={`h-6 w-6 ${color || 'text-primary'}`} />
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-4xl font-bold text-foreground py-1">{value}</div>
        <p className="text-sm text-muted-foreground pt-1">{description}</p>
      </CardContent>
      {linkTo && (
         <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 w-full justify-start p-1" asChild>
            <Link to={linkTo}>Voir plus <ArrowRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  </motion.div>
);

const QuickActionButton = ({ label, icon: Icon, linkTo, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button 
      variant="outline"
      className={`w-full h-20 justify-start text-left shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${color}`}
      asChild
    >
      <Link to={linkTo} className="flex flex-col items-start p-3">
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          <span className="font-semibold">{label}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Accès rapide</p>
      </Link>
    </Button>
  </motion.div>
);


const DashboardPage = () => {
  const [counts, setCounts] = useState({ prospects: 0, partners: 0, activities: 0, sales: 0 });
  const { user } = useAuth();

  useEffect(() => {
    const fetchDataCounts = async () => {
      if (!supabase || !user || !user.id) return; // Ensure user and user.id are available

      // Using RPC calls for counts can be more efficient if policies are complex or joins are needed
      // Ensure RLS policies allow the user to count these records or create specific RPC functions

      const { count: prospectsCount, error: prospectError } = await supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_user_id', user.id); 

      const { count: partnersCount, error: partnerError } = await supabase
        .from('partners')
        .select('*', { count: 'exact', head: true })
        .eq('managed_by_user_id', user.id); 

      const { count: activitiesCount, error: activityError } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true }); // For now, all activities. Filter by user if needed.

      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('total_price')
        .eq('user_id', user.id)
        .eq('payment_status', 'Payé');
      
      if (prospectError) console.error("Error fetching prospects count:", prospectError.message);
      if (partnerError) console.error("Error fetching partners count:", partnerError.message);
      if (activityError) console.error("Error fetching activities count:", activityError.message);
      if (salesError) console.error("Error fetching sales data:", salesError.message);

      const totalSalesValue = salesData ? salesData.reduce((sum, sale) => sum + sale.total_price, 0) : 0;

      setCounts({
        prospects: prospectsCount || 0,
        partners: partnersCount || 0,
        activities: activitiesCount || 0,
        sales: totalSalesValue || 0,
      });
    };
    
    if (user && user.id) { // Ensure user object and id exist before fetching
      fetchDataCounts();
    }
  }, [user]);


  return (
    <div className="space-y-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Votre Espace de Travail
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Un aperçu de vos activités et performances.</p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 py-3 px-6 text-md">
          <PlusCircle className="h-5 w-5" /> Nouvelle Action Rapide
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Mes Prospects" value={counts.prospects} icon={Users} description="En cours de démarchage" color="border-blue-500 text-blue-500" linkTo="/prospects" />
        <StatCard title="Mes Partenaires" value={counts.partners} icon={BriefcaseBusiness} description="Collaborations actives" color="border-green-500 text-green-500" linkTo="/partners" />
        <StatCard title="Événements Gérés" value={counts.activities} icon={Zap} description="Activités planifiées" color="border-orange-500 text-orange-500" linkTo="/activities" />
        <StatCard title="Revenus (Payés)" value={`${counts.sales.toFixed(2)} €`} icon={DollarSign} description="Billetterie ce mois-ci" color="border-purple-500 text-purple-500" linkTo="/tickets" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center"><Activity className="mr-3 h-7 w-7 text-primary"/> Actions Rapides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickActionButton label="Nouveau Prospect" icon={PlusCircle} linkTo="/prospects" color="border-blue-500 text-blue-600" />
          <QuickActionButton label="Ajouter Partenaire" icon={PlusCircle} linkTo="/partners" color="border-green-500 text-green-600" />
          <QuickActionButton label="Créer Événement" icon={PlusCircle} linkTo="/activities" color="border-orange-500 text-orange-600" />
          <QuickActionButton label="Enregistrer Vente" icon={PlusCircle} linkTo="/tickets" color="border-purple-500 text-purple-600" />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full border">
            <CardHeader className="bg-gradient-to-l from-card to-secondary/20 border-b">
              <CardTitle className="text-xl flex items-center"><CalendarDays className="mr-2 h-6 w-6 text-primary" />Prochaines Tâches & Rappels</CardTitle>
              <CardDescription>Restez organisé et ne manquez aucune échéance importante.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {[
                { task: "Relancer Prospect 'Tech Innovators'", due: "Demain à 10h00", type: "Prospect", priority: "Haute" },
                { task: "Préparer présentation Partenaire 'Event Solutions'", due: "Dans 2 jours", type: "Partenaire", priority: "Moyenne" },
                { task: "Confirmer logistique pour 'Festival Local'", due: "Fin de semaine", type: "Événement", priority: "Haute" },
                { task: "Suivi paiement facture #1024", due: "Le 30/05", type: "Vente", priority: "Basse" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/70 hover:bg-secondary/40 transition-colors shadow-sm hover:shadow-md">
                  <div>
                    <p className="text-md font-medium text-foreground">{item.task}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold mr-2
                      ${item.type === 'Prospect' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'Partenaire' ? 'bg-green-100 text-green-700' :
                        item.type === 'Événement' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'}`}>{item.type}</span>
                     <span className={`text-xs px-2.5 py-1 rounded-full font-semibold
                      ${item.priority === 'Haute' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'}`}>{item.priority}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">{item.due}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary border-primary/30 text-primary">Voir toutes les tâches</Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1"
        >
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full border">
            <CardHeader className="bg-gradient-to-r from-card to-secondary/20 border-b">
              <CardTitle className="text-xl flex items-center"><Bell className="mr-2 h-6 w-6 text-primary" />Notifications Récentes</CardTitle>
              <CardDescription>Les dernières mises à jour importantes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
               {[
                { message: "Nouveau prospect 'FunTime Events' assigné.", time: "Il y a 30m", icon: Users, iconColor: "text-blue-500" },
                { message: "Contrat avec 'Animations Pro' signé.", time: "Il y a 2h", icon: BriefcaseBusiness, iconColor: "text-green-500" },
                { message: "Rappel: Appel avec 'Festyland' demain.", time: "Hier", icon: CalendarDays, iconColor: "text-orange-500" },
                { message: "Nouveau message de 'Alice Dupont'.", time: "Hier", icon: MessageSquare, iconColor: "text-purple-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg border border-border/70 hover:bg-secondary/40 transition-colors">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ${item.iconColor || 'text-primary'}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
             <CardFooter>
              <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary border-primary/30 text-primary">Toutes les notifications</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;