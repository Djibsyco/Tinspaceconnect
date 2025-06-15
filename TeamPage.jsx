import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as UiDialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Filter, Search, Users, AlertTriangle } from 'lucide-react';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import TeamMemberForm from '@/components/team/TeamMemberForm';
import TeamMemberViewModal from '@/components/team/TeamMemberViewModal';
import TeamPerformanceCard from '@/pages/team/TeamPerformanceCard'; 
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const currentUserSupabaseRole = user?.user_metadata?.role;
  const currentUserIsManagerOrAdmin = currentUserSupabaseRole === 'manager' || currentUserSupabaseRole === 'admin';

  const fetchTeamMembers = useCallback(async () => {
    if (!supabase || !isAuthenticated || !currentUserIsManagerOrAdmin) {
        // If not admin/manager, try to fetch current user's details if they exist in a 'profiles' table or similar
        // For now, we'll rely on localStorage or assume admin fetches all.
        const localUser = localStorage.getItem(`teamMember_${user?.id}`);
        if (localUser) setTeamMembers([JSON.parse(localUser)]);
        else setTeamMembers([]);
        return;
    }

    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      toast({ title: "Erreur Admin", description: "Impossible de lister les utilisateurs: " + usersError.message, variant: "destructive" });
      setTeamMembers([]);
    } else if (usersData?.users) {
      const crmUsers = usersData.users.map(u => ({
        id: u.id,
        name: u.user_metadata?.full_name || u.email.split('@')[0],
        email: u.email,
        phone: u.phone || '',
        role: u.user_metadata?.role || 'commercial',
        points: u.user_metadata?.points || 0,
        commissionRate: u.user_metadata?.commission_rate || 0.03,
      }));
      setTeamMembers(crmUsers);
      // Optionally cache all for admin, or individuals for users.
      // localStorage.setItem('allTeamMembers_crm', JSON.stringify(crmUsers));
    }
  }, [toast, isAuthenticated, currentUserIsManagerOrAdmin, user]);

  const fetchCurrentUserTeamDetails = useCallback(async () => {
    if (!supabase || !isAuthenticated || !user || currentUserIsManagerOrAdmin) return;
    // This logic is for a non-admin/manager fetching their own details
    // This assumes a 'profiles' table or that data is in user_metadata
    const { data: userData, error: userError } = await supabase
      .from('users') // Assuming a 'users' or 'profiles' table for additional data
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Error fetching current user details:", userError);
    } else if (userData) {
      setTeamMembers([{
        id: user.id,
        name: user.user_metadata?.full_name || userData.full_name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone || userData.phone || '',
        role: user.user_metadata?.role || userData.role || 'commercial',
        points: user.user_metadata?.points || userData.points || 0,
        commissionRate: user.user_metadata?.commission_rate || userData.commission_rate || 0.03,
      }]);
    } else { // Fallback if no profile table entry, use metadata
        setTeamMembers([{
        id: user.id,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone || '',
        role: user.user_metadata?.role || 'commercial',
        points: user.user_metadata?.points || 0,
        commissionRate: user.user_metadata?.commission_rate || 0.03,
      }]);
    }
  }, [user, isAuthenticated, currentUserIsManagerOrAdmin, toast]);


  const fetchProspectsAndPartners = useCallback(async () => {
    if (!supabase || !isAuthenticated || !user) return;
    let prospectsQuery = supabase.from('prospects').select('*');
    let partnersQuery = supabase.from('partners').select('*');

    if (!currentUserIsManagerOrAdmin) {
      prospectsQuery = prospectsQuery.eq('assigned_user_id', user.id);
      partnersQuery = partnersQuery.eq('managed_by_user_id', user.id);
    }

    const { data: prospectsData, error: prospectsError } = await prospectsQuery;
    if (prospectsError) toast({ title: "Erreur Prospects", description: prospectsError.message, variant: "destructive" });
    else setProspects(prospectsData || []);

    const { data: partnersData, error: partnersError } = await partnersQuery;
    if (partnersError) toast({ title: "Erreur Partenaires", description: partnersError.message, variant: "destructive" });
    else setPartners(partnersData || []);
  }, [toast, isAuthenticated, user, currentUserIsManagerOrAdmin]);

  useEffect(() => {
    if (currentUserIsManagerOrAdmin) {
      fetchTeamMembers();
    } else {
      fetchCurrentUserTeamDetails();
    }
    fetchProspectsAndPartners();
  }, [fetchTeamMembers, fetchCurrentUserTeamDetails, fetchProspectsAndPartners, currentUserIsManagerOrAdmin]);


  const handleAddMember = async (memberData) => {
    // This should only be callable by an admin. AdminTeamManagementPage has a more complete version.
    // This is a placeholder if this page were to allow adding (e.g. from a manager context).
    if (!currentUserIsManagerOrAdmin) return; // Guard
    toast({ title: "Action non implémentée", description: "La création de membre se fait via le panneau Admin.", variant: "default" });
  };

  const handleEditMember = async (memberData) => {
     if (!currentUserIsManagerOrAdmin && user?.id !== memberData.id) return; // Guard

    // For Supabase users, this would involve supabase.auth.admin.updateUserById() for admin
    // or user.updateUserMetadata() for self-update (limited)
    // This is simplified for the TeamPage scope
    const { error } = await supabase.auth.admin.updateUserById(
      memberData.id,
      { user_metadata: { full_name: memberData.name, role: memberData.role, points: memberData.points, commission_rate: memberData.commissionRate } }
    );

    if (error) {
        toast({ title: "Erreur de mise à jour", description: error.message, variant: "destructive" });
    } else {
        fetchTeamMembers(); // Refresh list
        toast({ title: "Membre mis à jour", description: `Les informations de ${memberData.name} ont été mises à jour.` });
    }
    setIsFormOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (memberId) => {
    if (!currentUserIsManagerOrAdmin) return; // Guard
    toast({ title: "Action non implémentée", description: "La suppression de membre se fait via le panneau Admin.", variant: "default" });
  };
  
  const openEditForm = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const openViewModal = (member) => {
    const memberProspects = prospects.filter(p => p.assigned_user_id === member.id);
    const memberPartners = partners.filter(p => p.managed_by_user_id === member.id);
    setViewingMember({ ...member, prospects: memberProspects, partners: memberPartners });
  };

  const memberRoles = ['Tous', ...new Set(teamMembers.map(m => m.role).filter(Boolean).sort())];

  let displayMembers = [];
  if (currentUserIsManagerOrAdmin) {
    displayMembers = teamMembers.filter(member => {
      const nameMatch = member.name ? member.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const emailMatch = member.email ? member.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      const matchesSearch = nameMatch || emailMatch;
      const matchesRole = filterRole === 'Tous' || member.role === filterRole;
      return matchesSearch && matchesRole;
    });
  } else if (user && teamMembers.length > 0) { // if non-admin, teamMembers should only contain their own data
    displayMembers = teamMembers;
  }

  if (!isAuthenticated) {
     return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center p-8">
          <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
          <h1 className="text-3xl font-bold text-destructive mb-3">Accès Interdit</h1>
          <p className="text-lg text-muted-foreground mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white">
            <a href="/login">Se Connecter</a>
          </Button>
        </div>
      );
  }

  if (!currentUserIsManagerOrAdmin && user) {
    const currentMemberDetails = teamMembers.find(tm => tm.id === user.id);
    return (
      <div className="space-y-10 pb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
        >
          Mes Performances Personnelles
        </motion.h1>
        <TeamPerformanceCard 
          memberDetails={currentMemberDetails} 
          prospects={prospects} 
          partners={partners} 
        />
      </div>
    );
  }


  return (
    <div className="space-y-10 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Gestion de l'Équipe ({displayMembers.length})
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Visualisez et gérez les membres de votre équipe.</p>
        </div>
        {currentUserIsManagerOrAdmin && (
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingMember(null); }}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 py-3 px-6 text-md">
                <PlusCircle className="mr-2 h-5 w-5" /> Ajouter un Membre
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card border-l-4 border-primary">
              <DialogHeader className="pb-4 border-b">
                <DialogTitle className="text-2xl font-semibold text-primary">{editingMember ? 'Modifier le Profil du Membre' : 'Ajouter un Nouveau Membre'}</DialogTitle>
                <UiDialogDescription className="text-md">
                  {editingMember ? `Mettez à jour les informations de ${editingMember.name}.` : "Remplissez les informations ci-dessous. Le mot de passe sera généré ou défini par l'utilisateur."}
                </UiDialogDescription>
              </DialogHeader>
              <TeamMemberForm
                member={editingMember}
                onSubmit={editingMember ? handleEditMember : handleAddMember}
                onCancel={() => { setIsFormOpen(false); setEditingMember(null); }}
                isManagerView={true}
              />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      {currentUserIsManagerOrAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-xl shadow-lg border"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Rechercher par nom, email..." 
              className="pl-12 h-11 text-md rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex items-center w-full md:w-auto">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="pl-12 h-11 text-md rounded-lg w-full md:w-52">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                {memberRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {displayMembers.length === 0 && currentUserIsManagerOrAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center py-16"
          >
            <Users className="mx-auto h-16 w-16 text-primary/70 mb-6 opacity-70" />
            <p className="text-2xl font-semibold text-foreground mb-2">Aucun membre d'équipe trouvé.</p>
            <p className="text-md text-muted-foreground">Essayez d'ajuster vos filtres ou d'ajouter un nouveau membre.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {currentUserIsManagerOrAdmin && (
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {displayMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                onView={openViewModal}
                onEdit={currentUserIsManagerOrAdmin ? openEditForm : undefined}
                onDelete={currentUserIsManagerOrAdmin ? handleDeleteMember : undefined}
                canManage={currentUserIsManagerOrAdmin}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {viewingMember && (
        <TeamMemberViewModal
          member={viewingMember}
          isOpen={!!viewingMember}
          onClose={() => setViewingMember(null)}
        />
      )}
    </div>
  );
};

export default TeamPage;