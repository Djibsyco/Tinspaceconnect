import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage'; 
import ProspectsPage from '@/pages/ProspectsPage';
import PartnersPage from '@/pages/PartnersPage';
import ActivitiesPage from '@/pages/ActivitiesPage';
import TeamPage from '@/pages/TeamPage';
import SalesPage from '@/pages/SalesPage'; 
import SettingsPage from '@/pages/SettingsPage'; 
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ProfilePage from '@/pages/ProfilePage';

// Admin specific
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminTeamManagementPage from '@/pages/admin/AdminTeamManagementPage';
import AdminProspectsManagementPage from '@/pages/admin/AdminProspectsManagementPage';
import AdminMarketingPage from '@/pages/admin/AdminMarketingPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminProposalsPage from '@/pages/admin/AdminProposalsPage';
import AdminTeamActivityPage from '@/pages/admin/AdminTeamActivityPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage'; 
import AdminEventsManagementPage from '@/pages/admin/AdminEventsManagementPage';
import AdminAnnouncementsPage from '@/pages/admin/AdminAnnouncementsPage';


// Role-specific dashboards
import ProspectorDashboardPage from '@/pages/dashboards/ProspectorDashboardPage';
import PartnerSpaceDashboardPage from '@/pages/dashboards/PartnerSpaceDashboardPage';
import TicketingDashboardPage from '@/pages/dashboards/TicketingDashboardPage';
import SupportDashboardPage from '@/pages/dashboards/SupportDashboardPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';


import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background"><p className="text-lg text-foreground">Chargement de votre espace...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profile?.role;

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            <Route 
              element={
                <ProtectedRoute allowedRoles={['prospecteur', 'partenaire', 'billetterie', 'support', 'commercial', 'manager', 'admin']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<NavigateToRoleDashboard />} />
              <Route path="dashboard" element={<DashboardPage />} /> 
              <Route path="dashboard/prospecteur" element={<ProtectedRoute allowedRoles={['prospecteur', 'admin']}><ProspectorDashboardPage /></ProtectedRoute>} />
              <Route path="dashboard/partenaire" element={<ProtectedRoute allowedRoles={['partenaire', 'admin']}><PartnerSpaceDashboardPage /></ProtectedRoute>} />
              <Route path="dashboard/billetterie" element={<ProtectedRoute allowedRoles={['billetterie', 'admin']}><TicketingDashboardPage /></ProtectedRoute>} />
              <Route path="dashboard/support" element={<ProtectedRoute allowedRoles={['support', 'admin']}><SupportDashboardPage /></ProtectedRoute>} />
              
              <Route path="prospects" element={<ProtectedRoute allowedRoles={['prospecteur', 'commercial', 'manager', 'admin']}><ProspectsPage /></ProtectedRoute>} />
              <Route path="partners" element={<ProtectedRoute allowedRoles={['prospecteur', 'partenaire', 'commercial', 'manager', 'admin']}><PartnersPage /></ProtectedRoute>} />
              <Route path="activities" element={<ProtectedRoute allowedRoles={['prospecteur', 'partenaire', 'billetterie', 'commercial', 'manager', 'admin']}><ActivitiesPage /></ProtectedRoute>} />
              <Route path="team" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><TeamPage /></ProtectedRoute>} />
              <Route path="tickets" element={<ProtectedRoute allowedRoles={['billetterie', 'commercial', 'manager', 'admin']}><SalesPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProfilePage />} /> 
              <Route path="settings" element={<SettingsPage />} /> 
            </Route>

            <Route 
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="team-management" element={<AdminTeamManagementPage />} />
              <Route path="events-management" element={<AdminEventsManagementPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="prospects-management" element={<AdminProspectsManagementPage />} />
              <Route path="marketing" element={<AdminMarketingPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="proposals" element={<AdminProposalsPage />} />
              <Route path="team-activity" element={<AdminTeamActivityPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

const NavigateToRoleDashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background"><p className="text-lg text-foreground">Chargement...</p></div>;
  }

  const userRole = profile?.role;
  let path = '/dashboard'; 

  switch (userRole) {
    case 'admin':
      path = '/admin/dashboard';
      break;
    case 'prospecteur':
      path = '/dashboard/prospecteur';
      break;
    case 'partenaire':
      path = '/dashboard/partenaire';
      break;
    case 'billetterie':
      path = '/dashboard/billetterie';
      break;
    case 'support':
      path = '/dashboard/support';
      break;
    case 'commercial': 
    case 'manager':
      path = '/dashboard'; 
      break;
    default:
      path = '/dashboard'; 
  }
  return <Navigate to={path} replace />;
};

export default App;