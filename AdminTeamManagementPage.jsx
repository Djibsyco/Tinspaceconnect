import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as UiDialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit3, Trash2, Eye, Filter, Search, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import AdminTeamMemberForm from '@/components/admin/team/AdminTeamMemberForm';
import AdminTeamMemberViewModal from '@/components/admin/team/AdminTeamMemberViewModal';
import { supabase } from '@/lib/supabaseClient'; 

export const POINT_VALUE_FOR_COMMISSION = 10; 

export const ALL_PERMISSIONS = [
  { id: 'view_dashboard', label: 'Voir Tableau de Bord (Utilisateur)' },
  { id: 'manage_prospects', label: 'Gérer Prospects (Créer/Modifier/Voir)' },
  { id: 'manage_partners', label: 'Gérer Partenaires (Créer/Modifier/Voir)' },
  { id: 'manage_activities', label: 'Gérer Activités & Événements' },
  { id: 'manage_sales_tickets', label: 'Gérer Ventes & Billetterie' },
  { id: 'access_user_profile', label: 'Accéder à Mon Profil' },
  { id: 'access_user_settings', label: 'Accéder à Mes Paramètres' },
  
  { id: 'admin_view_dashboard', label: 'Voir Dashboard Admin' },
  { id: 'manage_users', label: 'Gérer Utilisateurs (Admin)' },
  { id: 'admin_manage_prospects', label: 'Gérer Tous Prospects (Admin)' },
  { id: 'manage_marketing_campaigns', label: 'Gérer Campagnes Marketing (Admin/Marketing)' },
  { id: 'generate_proposals', label: 'Générer Propositions Commerciales (Admin)' },
  { id: 'export_data', label: 'Exporter Données (Admin)' },
  { id: 'view_team_activity', label: 'Voir Suivi Activité Équipe (Admin)' },
  { id: 'manage_global_settings', label: 'Gérer Paramètres Globaux (Admin)' },
  { id: 'manage_platform_events', label: 'Gérer Événements Plateforme (Admin)' },
  { id: 'manage_internal_announcements', label: 'Gérer Annonces Internes (Admin)' },
  { id: 'all_access', label: 'Accès Complet Administrateur' },
];


const AdminTeamManagementPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [prospects, setProspects] = useState([]); 
  const [partners, setPartners] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tous');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
      toast({ title: "Erreur de chargement des utilisateurs", description: error.message, variant: "destructive" });
      return;
    }
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.user_metadata?.full_name || user.email.split('@')[0],
      email: user.email,
      phone: user.phone || '',
      role: user.user_metadata?.role || 'commercial',
      points: user.user_metadata?.points || 0,
      commissionRate: user.user_metadata?.commission_rate || 0.03,
      permissions: user.user_metadata?.permissions || (user.user_metadata?.role === 'admin' ? ['all_access'] : [])
    }));
    setTeamMembers(formattedUsers);
  };
  
  const fetchRelatedData = async () => {
    const { data: prospectsData, error: prospectsError } = await supabase.from('prospects').select('id, name, assigned_user_id');
    if (prospectsError) console.error("Error fetching prospects for admin team page:", prospectsError);
    else setProspects(prospectsData || []);

    const { data: partnersData, error: partnersError } = await supabase.from('partners').select('id, name, managed_by_user_id');
    if (partnersError) console.error("Error fetching partners for admin team page:", partnersError);
    else setPartners(partnersData || []);
  };


  useEffect(() => {
    fetchTeamMembers();
    fetchRelatedData();
  }, []);


  const handleAddMember = async (memberData) => {
    const { name, email, password, phone, role, permissions, points, commissionRate } = memberData;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true, 
      user_metadata: { full_name: name, role, permissions: role === 'admin' ? ['all_access'] : permissions, points, commission_rate: commissionRate }
    });

    if (error) {
      toast({ title: "Erreur de création", description: error.message, variant: "destructive" });
    } else {
      fetchTeamMembers(); 
      setIsFormOpen(false);
      toast({ title: "Utilisateur créé", description: `${name} a été ajouté à l'équipe.` });
    }
  };

  const handleEditMember = async (memberData) => {
    const { id, name, email, phone, role, permissions, points, commissionRate } = memberData;
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { full_name: name, role, permissions: role === 'admin' ? ['all_access'] : permissions, points, commission_rate: commissionRate }
    });

    if (error) {
      toast({ title: "Erreur de mise à jour", description: error.message, variant: "destructive" });
    } else {
      fetchTeamMembers(); 
      setIsFormOpen(false);
      setEditingMember(null);
      toast({ title: "Utilisateur mis à jour", description: `Les informations de ${name} ont été mises à jour.` });
    }
  };

  const handleDeleteMember = async (memberId) => {
    const memberToDelete = teamMembers.find(m => m.id === memberId);
    if (memberToDelete?.role === 'admin') {
        toast({ title: "Action non autorisée", description: "Impossible de supprimer un administrateur principal.", variant: "destructive" });
        return;
    }
    const { error } = await supabase.auth.admin.deleteUser(memberId);
    if (error) {
      toast({ title: "Erreur de suppression", description: error.message, variant: "destructive" });
    } else {
      fetchTeamMembers(); 
      toast({ title: "Utilisateur supprimé", description: `${memberToDelete?.name} a été retiré de l'équipe.`, variant: "destructive" });
    }
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

  const filteredTeamMembers = teamMembers.filter(member => {
    const nameMatch = member.name ? member.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const emailMatch = member.email ? member.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = nameMatch || emailMatch;
    const matchesRole = filterRole === 'Tous' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
          Gestion des Utilisateurs ({filteredTeamMembers.length})
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingMember(null); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Créer un Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-foreground">{editingMember ? 'Modifier l\'Utilisateur' : 'Créer un Nouvel Utilisateur'}</DialogTitle>
              <UiDialogDescription>
                {editingMember ? `Mettez à jour les informations et permissions de ${editingMember.name}.` : "Remplissez les informations et assignez les permissions."}
              </UiDialogDescription>
            </DialogHeader>
            <AdminTeamMemberForm
              member={editingMember}
              onSubmit={editingMember ? handleEditMember : handleAddMember}
              onCancel={() => { setIsFormOpen(false); setEditingMember(null); }}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Rechercher par nom, email..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-10 pr-4 py-2 h-10 w-full md:w-auto rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {memberRoles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredTeamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex"
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full flex flex-col bg-gradient-to-br from-card to-secondary/10 border-l-4" style={{borderColor: member.role === 'admin' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}}>
                <CardHeader className="pb-4">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${member.role === 'admin' ? 'from-red-500 to-orange-500' : 'from-primary to-purple-500'} flex items-center justify-center text-white text-xl font-bold`}>
                        {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{member.role}</CardDescription>
                      </div>
                    </div>
                    {member.role === 'admin' && <ShieldCheck className="h-6 w-6 text-red-500" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow">
                  <p className="text-sm">Email: {member.email}</p>
                  {member.phone && <p className="text-sm">Téléphone: {member.phone}</p>}
                  <p className="text-sm">Points: {member.points}</p>
                  <p className="text-sm">Commission Est.: {(member.points * POINT_VALUE_FOR_COMMISSION * (member.commissionRate || 0)).toFixed(2)} €</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
                  <Button variant="ghost" size="icon" onClick={() => openViewModal(member)} aria-label="Voir détails">
                    <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(member)} aria-label="Modifier">
                    <Edit3 className="h-5 w-5 text-green-500 hover:text-green-700" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="ghost" size="icon" aria-label="Supprimer" disabled={member.role === 'admin'}>
                        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card">
                      <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <UiDialogDescription>
                          Êtes-vous sûr de vouloir supprimer {member.name} de l'équipe ? Cette action est irréversible.
                        </UiDialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                        <DialogClose asChild><Button variant="destructive" onClick={() => handleDeleteMember(member.id)}>Supprimer</Button></DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {viewingMember && (
        <AdminTeamMemberViewModal 
            member={viewingMember} 
            isOpen={!!viewingMember} 
            onClose={() => setViewingMember(null)} 
        />
      )}
    </div>
  );
};

export default AdminTeamManagementPage;