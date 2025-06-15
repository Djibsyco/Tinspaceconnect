import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, Briefcase } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('prospecteur'); // Default role
  const { signup, loading: authLoading, isAuthenticated } = useAuth(); // Renamed loading to authLoading
  const navigate = useNavigate();
  const { toast } = useToast();

  const availableRoles = [
    { value: 'prospecteur', label: 'Prospecteur' },
    { value: 'partenaire', label: 'Partenaire' },
    { value: 'billetterie', label: 'Billetterie' },
    { value: 'support', label: 'Support' },
    // 'admin' role should typically be assigned manually or through a separate process
  ];

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role after signup, similar to login
      // For now, a generic dashboard redirect. AuthContext will handle role-based redirect on next load.
      navigate('/dashboard'); 
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    try {
      await signup({ name, email, password, role });
      toast({ title: "Inscription réussie", description: "Veuillez vérifier votre email pour confirmer votre compte. Vous serez ensuite redirigé." });
      // Supabase handles email confirmation. After confirmation, user can login.
      // navigate('/login'); // Or a page indicating to check email
    } catch (error) {
      toast({ title: "Erreur d'inscription", description: error.message || "Une erreur est survenue.", variant: "destructive" });
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
              Créer un compte
            </CardTitle>
            <CardDescription>Rejoignez Tin Space Connect dès aujourd'hui.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="Votre nom complet" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="votreadresse@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Je suis un</Label>
                <div className="relative">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role" className="pl-10">
                      <SelectValue placeholder="Sélectionnez votre rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(r => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white text-lg py-3" disabled={authLoading}>
                {authLoading ? 'Création en cours...' : <><UserPlus className="mr-2 h-5 w-5" /> S'inscrire</>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;