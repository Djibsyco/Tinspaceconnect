import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Settings2, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const AdminProposalsPage = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState([]);
  const [selectedProspectId, setSelectedProspectId] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [template, setTemplate] = useState('standard_event');

  useEffect(() => {
    const storedProspects = localStorage.getItem('prospects');
    if (storedProspects) {
      setProspects(JSON.parse(storedProspects));
    } else {
      // Mock data if nothing in local storage
      const mockProspects = [
        { id: '1', name: 'Entreprise Événementielle Alpha', contactEmail: 'alpha@event.com', type: 'Événementiel' },
        { id: '2', name: 'Club de Loisirs Beta', contactEmail: 'beta@loisirs.com', type: 'Activité Ludique' },
      ];
      setProspects(mockProspects);
      localStorage.setItem('prospects', JSON.stringify(mockProspects));
    }
  }, []);
  
  const selectedProspect = prospects.find(p => p.id.toString() === selectedProspectId);

  const handleGenerateProposal = () => {
    if (!selectedProspectId) {
      toast({
        title: "Aucun prospect sélectionné",
        description: "Veuillez choisir un prospect pour générer la proposition.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Proposition Générée (Simulation)",
      description: `Une proposition PDF pour ${selectedProspect?.name} avec le modèle "${template}" serait téléchargée.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => alert('Visualisation de la proposition (simulation)')}>
          <Eye className="mr-2 h-4 w-4" /> Prévisualiser
        </Button>
      )
    });
    // In a real app, this would involve:
    // 1. Fetching detailed prospect data
    // 2. Fetching template structure
    // 3. Compiling data + template + customContent
    // 4. Calling a PDF generation service (e.g., pdf-lib on client or a backend service)
    // 5. Triggering download
  };

  const proposalTemplates = [
    { value: 'standard_event', label: 'Modèle Événement Standard' },
    { value: 'activity_package', label: 'Modèle Forfait Activité' },
    { value: 'custom_partnership', label: 'Modèle Partenariat Personnalisé' },
  ];

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
      >
        Générateur de Propositions Commerciales
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-yellow-500" /> Créer une Nouvelle Proposition
            </CardTitle>
            <CardDescription>Personnalisez et générez des propositions commerciales en PDF.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="prospectSelect">Sélectionner un Prospect</Label>
              <select 
                id="prospectSelect" 
                value={selectedProspectId} 
                onChange={(e) => setSelectedProspectId(e.target.value)}
                className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">-- Choisir un prospect --</option>
                {prospects.map(prospect => (
                  <option key={prospect.id} value={prospect.id}>{prospect.name} ({prospect.type})</option>
                ))}
              </select>
            </div>

            {selectedProspect && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 border rounded-md bg-secondary/30 space-y-2"
              >
                <p className="text-sm"><span className="font-semibold">Entreprise:</span> {selectedProspect.name}</p>
                <p className="text-sm"><span className="font-semibold">Email Contact:</span> {selectedProspect.contactEmail || 'Non renseigné'}</p>
                <p className="text-sm"><span className="font-semibold">Type:</span> {selectedProspect.type}</p>
              </motion.div>
            )}

            <div>
              <Label htmlFor="templateSelect">Choisir un Modèle de Proposition</Label>
              <select 
                id="templateSelect" 
                value={template} 
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:ring-primary focus:border-primary"
              >
                {proposalTemplates.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div>
              <Label htmlFor="customContent">Contenu Personnalisé (Optionnel)</Label>
              <textarea
                id="customContent"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Ajoutez ici des notes spécifiques, des offres spéciales, ou des ajustements pour ce prospect..."
                className="w-full min-h-[100px] border border-input bg-background rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                rows={4}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleGenerateProposal} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                <Download className="mr-2 h-5 w-5" /> Générer la Proposition PDF (Simulation)
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings2 className="mr-2 h-5 w-5" /> Gérer les Modèles (Bientôt)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
            <CardHeader>
                <CardTitle>Propositions Récentes (Bientôt)</CardTitle>
                <CardDescription>Retrouvez ici les dernières propositions générées.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Aucune proposition récente.</p>
            </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default AdminProposalsPage;