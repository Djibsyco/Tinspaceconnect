import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-secondary/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 bg-background/80 backdrop-blur-sm"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;