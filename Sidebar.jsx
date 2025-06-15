import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase as BriefcaseBusiness, Users, BadgePercent as TicketPercent, Settings, Building, Zap, UserCircle, X as XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de Bord', roles: ['commercial', 'manager', 'admin'] },
  { to: '/prospects', icon: BriefcaseBusiness, label: 'Prospection', roles: ['commercial', 'manager', 'admin'] },
  { to: '/partners', icon: Building, label: 'Partenaires', roles: ['commercial', 'manager', 'admin'] },
  { to: '/activities', icon: Zap, label: 'Événements', roles: ['commercial', 'manager', 'admin'] },
  { to: '/tickets', icon: TicketPercent, label: 'Billetterie', roles: ['commercial', 'manager', 'admin'] },
  { to: '/team', icon: Users, label: 'Mon Équipe', roles: ['manager', 'admin', 'commercial'] },
  { to: '/profile', icon: UserCircle, label: 'Mon Profil', roles: ['commercial', 'manager', 'admin'] },
];

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'commercial'; 

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-72 bg-card text-card-foreground p-5 shadow-2xl flex flex-col border-r border-border/50 h-full">
      <div className="flex items-center justify-between mb-8">
        <NavLink to="/" className="flex items-center justify-center space-x-3 group" onClick={handleLinkClick}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out"
          >
            <img alt="Logo de l'application CRM Tin Space Connect" className="h-12 w-auto sm:h-14" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/796d1040-1f4d-4fda-8f30-65b64180b011/213bc6b00095f36ae97962019a4d6802.jpg" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 group-hover:tracking-wider transition-all duration-300"
          >
            Tin Space
          </motion.h1>
        </NavLink>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <XIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 100, damping: 15 }}
          >
            <NavLink
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md text-sm sm:text-base',
                  isActive
                    ? 'bg-primary/90 text-primary-foreground shadow-lg -translate-x-1'
                    : 'hover:bg-primary/10 hover:text-primary text-muted-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
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
          © {new Date().getFullYear()} Tin Space Connect
        </p>
      </motion.div>
    </aside>
  );
};

export default Sidebar;