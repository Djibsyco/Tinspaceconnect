import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading: authLoading, isAuthenticated, profile } = useAuth(); // Renamed loading to authLoading
  const navigate = useNavigate();
  const { toast } = useToast();

  const getRedirectPath = (userRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'prospecteur':
        return '/dashboard/prospecteur';
      case 'partenaire':
        return '/dashboard/partenaire';
      case 'billetterie':
        return '/dashboard/billetterie';
      case 'support':
        return '/dashboard/support';
      case 'commercial': // Fallback for existing 'commercial' role
        return '/dashboard'; 
      case 'manager': // Fallback for existing 'manager' role
        return '/dashboard';
      default:
        return '/dashboard'; // Default dashboard
    }
  };

  useEffect(() => {
    if (isAuthenticated && profile) {
      const path = getRedirectPath(profile.role);
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { profile: userProfile } = await login({ email, password });
      toast({ title: "Connexion réussie", description: "Bienvenue !" });
      if (userProfile) {
        const path = getRedirectPath(userProfile.role);
        navigate(path, { replace: true });
      } else {
        // Fallback if profile is not immediately available, though AuthContext should handle it
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      toast({ title: "Erreur de connexion", description: error.message || "Veuillez vérifier vos identifiants.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto mb-4"
            >
              <img  alt="Logo Tin Space Connect" className="h-20 w-auto" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/796d1040-1f4d-4fda-8f30-65b64180b011/213bc6b00095f36ae97962019a4d6802.jpg" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Connexion
            </CardTitle>
            <CardDescription>Accédez à votre espace Tin Space Connect.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votreadresse@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                 <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="********" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white text-lg py-3" disabled={authLoading}>
                {authLoading ? 'Connexion en cours...' : <><LogIn className="mr-2 h-5 w-5" /> Se connecter</>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link to="#" className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;