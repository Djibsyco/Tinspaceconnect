import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { Activity, Users, Briefcase, TrendingUp, Search, CalendarDays, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const initialActivities = [
  { id: 1, userId: 1, userName: 'Alice Wonderland', type: 'PROSPECT_CREATED', details: 'Nouveau prospect "Événements Festifs Plus" ajouté.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, userId: 2, userName: 'Bob L\'éponge', type: 'INTERACTION_LOGGED', details: 'Appel téléphonique avec "Laser Game 75".', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 3, userId: 1, userName: 'Alice Wonderland', type: 'PROSPECT_STATUS_CHANGED', details: '"Événements Festifs Plus" passé à "Contacté".', timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: 4, userId: 3, userName: 'Charles Xavier', type: 'PARTNER_SIGNED', details: 'Nouveau partenariat signé avec "ChâteauForm Events".', timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString() },
  { id: 5, userId: 2, userName: 'Bob L\'éponge', type: 'TASK_COMPLETED', details: 'Rappel de suivi pour "Laser Game 75" complété.', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
];

const AdminTeamActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all'); // Placeholder for date filtering

  useEffect(() => {
    // Load activities from local storage or use initial
    const storedActivities = localStorage.getItem('teamActivities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities).map(a => ({...a, timestamp: new Date(a.timestamp)})));
    } else {
      setActivities(initialActivities.map(a => ({...a, timestamp: new Date(a.timestamp)})));
      localStorage.setItem('teamActivities', JSON.stringify(initialActivities));
    }

    // Load team members for filtering options
    const storedTeam = localStorage.getItem('teamMembers');
    if (storedTeam) {
      setTeamMembers(JSON.parse(storedTeam));
    } else {
      // Fallback if team members not found, use unique names from activities
      const uniqueUsers = [...new Set(initialActivities.map(a => a.userName))];
      setTeamMembers(uniqueUsers.map((name, idx) => ({ id: idx + 1, name })));
    }
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'PROSPECT_CREATED': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'INTERACTION_LOGGED': return <Activity className="h-5 w-5 text-green-500" />;
      case 'PROSPECT_STATUS_CHANGED': return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'PARTNER_SIGNED': return <Users className="h-5 w-5 text-yellow-600" />;
      case 'TASK_COMPLETED': return <Activity className="h-5 w-5 text-teal-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredActivities = activities
    .filter(activity => {
      const activityUserName = activity.userName || '';
      const activityDetails = activity.details || '';

      const matchesSearch = activityDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            activityUserName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = filterUser === 'all' || activity.userId?.toString() === filterUser || activityUserName === filterUser; // Handle if userId is not present
      const matchesType = filterType === 'all' || activity.type === filterType;
      // Date filtering logic would go here
      return matchesSearch && matchesUser && matchesType;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const activityTypes = ['all', ...new Set(activities.map(a => a.type))];

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
      >
        Suivi de l'Activité de l'Équipe
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-4 bg-card rounded-lg shadow-md space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Rechercher détails, utilisateur..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filtrer par utilisateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Utilisateurs</SelectItem>
                {teamMembers.map(member => (
                  <SelectItem key={member.id || member.name} value={member.id ? member.id.toString() : member.name}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

           <div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filtrer par type d'activité" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type === 'all' ? 'Tous les Types' : type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="w-full justify-start text-left font-normal" disabled>
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Filtrer par date (Bientôt)</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Journal d'Activité</CardTitle>
            <CardDescription>Liste des dernières actions effectuées par l'équipe.</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredActivities.length > 0 ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start space-x-3 p-3 border rounded-md bg-background hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">
                        Par {activity.userName} - {new Date(activity.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucune activité correspondante aux filtres.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminTeamActivityPage;