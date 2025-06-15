import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Users, Briefcase, BarChart2, Settings, FileText, Send, Activity as ActivityLog, CalendarDays, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const adminNavItems = [
  { to: '/admin/dashboard', icon: ShieldCheck, label: 'Dashboard Admin' },
  { to: '/admin/team-management', icon: Users, label: 'Gestion Utilisateurs' },
  { to: '/admin/events-management', icon: CalendarDays, label: 'Gestion Événements' },
  { to: '/admin/announcements', icon: Megaphone, label: 'Annonces Internes' },
  { to: '/admin/prospects-management', icon: Briefcase, label: 'Gestion Prospects' },
  { to: '/admin/marketing', icon: Send, label: 'Marketing & Campagnes' },
  { to: '/admin/proposals', icon: FileText, label: 'Générateur Propositions' },
  { to: '/admin/reports', icon: BarChart2, label: 'Rapports & Exports' },
  { to: '/admin/team-activity', icon: ActivityLog, label: 'Suivi Activité Équipe' },
  { to: '/admin/settings', icon: Settings, label: 'Paramètres Globaux' }, 
];

const AdminSidebar = () => {
  return (
    <aside className="w-72 bg-card text-card-foreground p-4 shadow-lg flex flex-col">
      <div className="mb-8 text-center">
        <NavLink to="/admin" className="flex items-center justify-center space-x-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <img  alt="Logo Admin Tin Space Connect" className="h-12 w-auto" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/796d1040-1f4d-4fda-8f30-65b64180b011/213bc6b00095f36ae97962019a4d6802.jpg" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-red-600"
          >
            Admin Panel
          </motion.h1>
        </NavLink>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {adminNavItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 100, damping: 15 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md',
                  isActive
                    ? 'bg-red-600/90 text-white shadow-lg -translate-x-1'
                    : 'hover:bg-red-500/10 hover:text-red-600 text-muted-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
      <motion.div 
        className="mt-auto pt-4 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Tin Space Connect (Admin)
        </p>
      </motion.div>
    </aside>
  );
};

export default AdminSidebar;