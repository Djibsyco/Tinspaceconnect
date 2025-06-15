import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500/10 via-background to-yellow-500/10 p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10, duration: 0.7 }}
        className="bg-card p-8 sm:p-12 rounded-xl shadow-2xl max-w-md w-full"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror", ease:"easeInOut" }}
        >
          <ShieldAlert className="h-20 w-20 sm:h-28 sm:w-28 text-destructive mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-destructive mb-3">Accès Refusé</h1>
        <p className="text-md sm:text-lg text-muted-foreground mb-8">
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white text-lg py-3">
            <Link to="/dashboard">Retour au Tableau de Bord</Link>
          </Button>
        </motion.div>
        
        <p className="text-xs text-muted-foreground mt-8">
          Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre administrateur.
        </p>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;