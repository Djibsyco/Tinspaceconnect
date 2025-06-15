import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ShieldCheck } from 'lucide-react'; // Using ShieldCheck for admin
import { motion } from 'framer-motion';

const UserAdminCard = () => {
  const { profile, isAuthenticated } = useAuth();

  if (!isAuthenticated || !profile || profile.role !== 'admin') {
    return null; // Don't render anything if not an admin or not authenticated
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="ml-auto" // Added ml-auto to push it to the right in the header
    >
      <Card className="bg-gradient-to-r from-red-500/10 via-orange-500/5 to-yellow-500/10 border-primary/30 shadow-lg">
        <CardHeader className="p-3 flex flex-row items-center space-x-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <CardTitle className="text-md font-semibold text-primary">Espace Administrateur</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Accéder au panneau admin
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserAdminCard;