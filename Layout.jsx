import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-[100] lg:hidden w-72 bg-card shadow-xl"
          >
            <Sidebar onClose={toggleMobileMenu} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </Header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background/80 backdrop-blur-sm"
        >
          <Outlet />
        </motion.main>
      </div>
       {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[99] bg-black/30 lg:hidden" 
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;