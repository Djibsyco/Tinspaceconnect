import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter as ModalFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit3, Trash2, Eye, Send, Filter, Search, Users, BarChartHorizontalBig, Mail as MailIcon, MessageSquare, Percent, Cog, RefreshCw, FileText as FileTextIcon, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialCampaigns = [
  { id: 1, name: 'Lancement Estival', type: 'Email', segmentId: 1, status: 'Envoyée', date: '2025-05-01', content: 'Découvrez nos offres exclusives pour cet été !', sent: 1200, opens: 450, clicks: 120, responses: 15 },
  { id: 2, name: 'Promo Rentrée Scolaire', type: 'SMS', segmentId: 2, status: 'Programmée', date: '2025-08-15', content: 'Préparez la rentrée avec nos packs avantageux.', sent: 0, opens: 0, clicks: 0, responses: 0 },
  { id: 3, name: 'Offre Spéciale Hiver', type: 'WhatsApp', segmentId: 3, status: 'Brouillon', date: '2025-11-01', content: 'Restez au chaud avec nos solutions hivernales.', sent: 0, opens: 0, clicks: 0, responses: 0 },
];

const initialSegments = [
  { id: 1, name: 'Clubs de sport (Paris)', criteria: { type: 'Club', region: 'Paris', city: '', engagement: 'Haut' }, count: 150 },
  { id: 2, name: 'Bars actifs (Lyon)', criteria: { type: 'Bar', city: 'Lyon', region: '', engagement: 'Moyen' }, count: 85 },
  { id: 3, name: 'Prospects Événementiel (Sud)', criteria: { type: 'Événementiel', region: 'Sud', city: '', engagement: 'Bas' }, count: 220 },
];

const structureTypes = ['Club', 'Bar', 'Salle de Jeux', 'Restaurant', 'Hôtel', 'Événementiel', 'Autre'];
const regions = ['Nord', 'Sud', 'Est', 'Ouest', 'Centre', 'Paris', 'Lyon', 'Marseille', 'Toutes'];
const engagementLevels = ['Haut', 'Moyen', 'Bas', 'Tous'];

const CampaignForm = ({ campaign, onSubmit, onCancel, segments }) => {
  const [formData, setFormData] = useState(
    campaign || { name: '', type: 'Email', segmentId: '', date: new Date().toISOString().split('T')[0], content: '' }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.segmentId) {
      toast({ title: "Champs requis", description: "Nom et segment sont obligatoires.", variant: "destructive" });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div><Label htmlFor="name">Nom de la Campagne</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
      <div><Label htmlFor="type">Type de Canal</Label>
        <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
          <SelectTrigger><SelectValue placeholder="Choisir un canal..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label htmlFor="segmentId">Segment Cible</Label>
        <Select name="segmentId" value={formData.segmentId.toString()} onValueChange={(value) => handleSelectChange('segmentId', value)}>
          <SelectTrigger><SelectValue placeholder="Choisir un segment..." /></SelectTrigger>
          <SelectContent>
            {segments.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.count} contacts)</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label htmlFor="date">Date d'envoi/programmation</Label><Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} /></div>
      <div><Label htmlFor="content">Contenu du Message</Label><textarea name="content" id="content" value={formData.content} onChange={handleChange} rows="4" className="w-full border border-input rounded-md p-2 bg-background text-foreground" placeholder="Personnalisez votre message ici..."></textarea></div>
      <ModalFooter><Button type="button" variant="outline" onClick={onCancel}>Annuler</Button><Button type="submit">{campaign ? 'Mettre à jour' : 'Créer Campagne'}</Button></ModalFooter>
    </form>
  );
};

const SegmentForm = ({ segment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    segment || { name: '', criteria: { type: '', region: '', city: '', engagement: '' } }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('criteria.')) {
      const criterionKey = name.split('.')[1];
      setFormData(prev => ({ ...prev, criteria: { ...prev.criteria, [criterionKey]: value }}));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
     if (name.startsWith('criteria.')) {
      const criterionKey = name.split('.')[1];
      setFormData(prev => ({ ...prev, criteria: { ...prev.criteria, [criterionKey]: value }}));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: "Nom requis", description: "Le nom du segment est obligatoire.", variant: "destructive" });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div><Label htmlFor="name">Nom du Segment</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="criteria.type">Type de Structure</Label>
          <Select name="criteria.type" value={formData.criteria.type} onValueChange={(value) => handleSelectChange('criteria.type', value)}>
            <SelectTrigger><SelectValue placeholder="Filtrer par type..." /></SelectTrigger>
            <SelectContent>
              {structureTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div><Label htmlFor="criteria.region">Région</Label>
          <Select name="criteria.region" value={formData.criteria.region} onValueChange={(value) => handleSelectChange('criteria.region', value)}>
            <SelectTrigger><SelectValue placeholder="Filtrer par région..." /></SelectTrigger>
            <SelectContent>
              {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><Label htmlFor="criteria.city">Ville (Optionnel)</Label><Input id="criteria.city" name="criteria.city" value={formData.criteria.city} onChange={handleChange} placeholder="Ex: Paris, Lyon..." /></div>
      <div><Label htmlFor="criteria.engagement">Niveau d'Engagement</Label>
         <Select name="criteria.engagement" value={formData.criteria.engagement} onValueChange={(value) => handleSelectChange('criteria.engagement', value)}>
            <SelectTrigger><SelectValue placeholder="Filtrer par engagement..." /></SelectTrigger>
            <SelectContent>
              {engagementLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
            </SelectContent>
          </Select>
      </div>
      <ModalFooter><Button type="button" variant="outline" onClick={onCancel}>Annuler</Button><Button type="submit">{segment ? 'Mettre à jour' : 'Créer Segment'}</Button></ModalFooter>
    </form>
  )
}


const AdminMarketingPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [segments, setSegments] = useState([]);
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isSegmentFormOpen, setIsSegmentFormOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCampaigns = localStorage.getItem('marketingCampaigns');
    setCampaigns(storedCampaigns ? JSON.parse(storedCampaigns) : initialCampaigns);
    const storedSegments = localStorage.getItem('marketingSegments');
    setSegments(storedSegments ? JSON.parse(storedSegments) : initialSegments);
  }, []);

  const updateLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSaveCampaign = (campaignData) => {
    let updatedCampaigns;
    if (editingCampaign) {
      updatedCampaigns = campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...campaignData, segmentId: parseInt(campaignData.segmentId), status: c.status || 'Brouillon' } : c);
      toast({ title: "Campagne mise à jour", description: `${campaignData.name} a été modifiée.` });
    } else {
      const newCampaign = { ...campaignData, id: Date.now(), segmentId: parseInt(campaignData.segmentId), status: 'Brouillon', sent:0, opens:0, clicks:0, responses:0 };
      updatedCampaigns = [...campaigns, newCampaign];
      toast({ title: "Campagne créée", description: `${campaignData.name} a été ajoutée.` });
    }
    setCampaigns(updatedCampaigns);
    updateLocalStorage('marketingCampaigns', updatedCampaigns);
    setIsCampaignFormOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaignId) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
    setCampaigns(updatedCampaigns);
    updateLocalStorage('marketingCampaigns', updatedCampaigns);
    toast({ title: "Campagne supprimée", variant: "destructive" });
  };
  
  const handleLaunchCampaign = (campaignId) => {
    const campaignToLaunch = campaigns.find(c => c.id === campaignId);
    if (!campaignToLaunch) return;
    
    const segment = segments.find(s => s.id === campaignToLaunch.segmentId);
    const sentCount = segment ? segment.count : Math.floor(Math.random() * 500) + 50; // Simulate sent count

    const updatedCampaigns = campaigns.map(c => c.id === campaignId ? {
        ...c, 
        status: 'Envoyée', 
        sent: sentCount, 
        opens: Math.floor(sentCount * (Math.random() * 0.3 + 0.1)), // Simulate 10-40% open rate
        clicks: Math.floor(sentCount * (Math.random() * 0.1 + 0.02)), // Simulate 2-12% click rate relative to sent
        responses: Math.floor(sentCount * (Math.random() * 0.05 + 0.01)) // Simulate 1-6% response rate relative to sent
    } : c);
    setCampaigns(updatedCampaigns);
    updateLocalStorage('marketingCampaigns', updatedCampaigns);
    toast({ title: "Campagne Lancée!", description: `La campagne "${campaignToLaunch.name}" a été envoyée à ${sentCount} contacts.` });
  };


  const handleSaveSegment = (segmentData) => {
    let updatedSegments;
    // Simulate count based on criteria (very basic)
    const criteriaCount = Object.values(segmentData.criteria).filter(v => v && v !== 'Tous').length;
    const randomBase = segmentData.id ? segments.find(s => s.id === segmentData.id).count : 100;
    segmentData.count = Math.max(10, Math.floor(randomBase * (1 - criteriaCount * 0.1) * (Math.random() * 0.4 + 0.8)));


    if (editingSegment) {
      updatedSegments = segments.map(s => s.id === editingSegment.id ? { ...s, ...segmentData } : s);
      toast({ title: "Segment mis à jour", description: `${segmentData.name} a été modifié.` });
    } else {
      const newSegment = { ...segmentData, id: Date.now() };
      updatedSegments = [...segments, newSegment];
      toast({ title: "Segment créé", description: `${segmentData.name} a été ajouté.` });
    }
    setSegments(updatedSegments);
    updateLocalStorage('marketingSegments', updatedSegments);
    setIsSegmentFormOpen(false);
    setEditingSegment(null);
  };

  const handleDeleteSegment = (segmentId) => {
    if (campaigns.some(c => c.segmentId === segmentId)) {
        toast({ title: "Segment Utilisé", description: "Ce segment est utilisé par une ou plusieurs campagnes. Veuillez d'abord les modifier ou supprimer.", variant: "destructive"});
        return;
    }
    const updatedSegments = segments.filter(s => s.id !== segmentId);
    setSegments(updatedSegments);
    updateLocalStorage('marketingSegments', updatedSegments);
    toast({ title: "Segment supprimé", variant: "destructive" });
  };


  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
        Marketing & Campagnes
      </motion.h1>

      {/* Segments Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.1}}>
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 border-b">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-red-500" />
              <div>
                <CardTitle className="text-xl">Segments de Prospects</CardTitle>
                <CardDescription>Gérez vos listes de diffusion ciblées.</CardDescription>
              </div>
            </div>
            <Dialog open={isSegmentFormOpen} onOpenChange={(isOpen) => { setIsSegmentFormOpen(isOpen); if(!isOpen) setEditingSegment(null);}}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => { setEditingSegment(null); setIsSegmentFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4"/>Nouveau Segment</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle className="text-xl">{editingSegment ? "Modifier" : "Nouveau"} Segment</DialogTitle></DialogHeader>
                <SegmentForm segment={editingSegment} onSubmit={handleSaveSegment} onCancel={() => setIsSegmentFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
            {segments.map(seg => (
              <motion.div key={seg.id} layout initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.5}} transition={{duration:0.3}}>
                <Card className="bg-card hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardHeader className="p-3"><CardTitle className="text-md">{seg.name}</CardTitle></CardHeader>
                  <CardContent className="p-3 text-xs space-y-1 flex-grow">
                    <p><span className="font-semibold">Type:</span> {seg.criteria.type || 'N/A'}</p>
                    <p><span className="font-semibold">Région:</span> {seg.criteria.region || 'N/A'}</p>
                    <p><span className="font-semibold">Ville:</span> {seg.criteria.city || 'N/A'}</p>
                    <p><span className="font-semibold">Engagement:</span> {seg.criteria.engagement || 'N/A'}</p>
                    <p className="font-bold text-red-600 pt-1">{seg.count} prospects</p>
                  </CardContent>
                  <CardFooter className="p-2 flex justify-end gap-1 border-t mt-auto">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {setEditingSegment(seg); setIsSegmentFormOpen(true);}}><Edit3 className="h-4 w-4 text-blue-600"/></Button>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive"/></Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader><DialogTitle>Supprimer Segment</DialogTitle><DialogDescription>Voulez-vous vraiment supprimer "{seg.name}"? Cela peut affecter les campagnes associées.</DialogDescription></DialogHeader>
                            <ModalFooter><DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose><Button variant="destructive" onClick={() => handleDeleteSegment(seg.id)}>Supprimer</Button></ModalFooter>
                        </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Campaigns Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.2}}>
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 border-b">
            <div className="flex items-center gap-2">
                <Send className="h-6 w-6 text-red-500" />
                <div>
                    <CardTitle className="text-xl">Campagnes Marketing</CardTitle>
                    <CardDescription>Créez et suivez vos campagnes (Email, SMS, WhatsApp).</CardDescription>
                </div>
            </div>
            <Dialog open={isCampaignFormOpen} onOpenChange={(isOpen) => { setIsCampaignFormOpen(isOpen); if(!isOpen) setEditingCampaign(null);}}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingCampaign(null); setIsCampaignFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4"/>Nouvelle Campagne</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle className="text-xl">{editingCampaign ? "Modifier" : "Nouvelle"} Campagne</DialogTitle></DialogHeader>
                <CampaignForm campaign={editingCampaign} onSubmit={handleSaveCampaign} onCancel={() => setIsCampaignFormOpen(false)} segments={segments} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
             <AnimatePresence>
            {campaigns.map(camp => (
              <motion.div key={camp.id} layout initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{camp.name}</CardTitle>
                        <CardDescription>{camp.type} pour "{segments.find(s=>s.id === camp.segmentId)?.name || 'Segment Supprimé'}" - {new Date(camp.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${camp.status === 'Envoyée' ? 'bg-green-100 text-green-700' : camp.status === 'Programmée' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{camp.status}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><Users className="inline mr-1 h-3 w-3 text-muted-foreground"/>Envoyés: <strong>{camp.sent}</strong></div>
                    <div><MailIcon className="inline mr-1 h-3 w-3 text-muted-foreground"/>Ouvertures: <strong>{camp.opens}</strong> ({(camp.sent > 0 ? (camp.opens/camp.sent*100) : 0).toFixed(0)}%)</div>
                    <div><Percent className="inline mr-1 h-3 w-3 text-muted-foreground"/>Clics: <strong>{camp.clicks}</strong> ({(camp.opens > 0 ? (camp.clicks/camp.opens*100) : 0).toFixed(0)}%)</div>
                    <div><MessageSquare className="inline mr-1 h-3 w-3 text-muted-foreground"/>Réponses: <strong>{camp.responses || 0}</strong></div>
                  </CardContent>
                  <CardFooter className="p-2 flex justify-end gap-1 border-t">
                    {camp.status !== 'Envoyée' && <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleLaunchCampaign(camp.id)}><Send className="mr-1 h-4 w-4"/>Lancer</Button>}
                    <Button variant="ghost" size="sm" onClick={() => { setEditingCampaign(camp); setIsCampaignFormOpen(true);}}><Edit3 className="mr-1 h-4 w-4"/>Modifier</Button>
                    <Dialog>
                      <DialogTrigger asChild><Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700"><Trash2 className="mr-1 h-4 w-4"/>Supprimer</Button></DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Supprimer Campagne</DialogTitle><DialogDescription>Voulez-vous vraiment supprimer "{camp.name}"?</DialogDescription></DialogHeader>
                        <ModalFooter><DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose><Button variant="destructive" onClick={() => handleDeleteCampaign(camp.id)}>Supprimer</Button></ModalFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            </AnimatePresence>
            {campaigns.length === 0 && <p className="text-center text-muted-foreground py-4">Aucune campagne pour le moment.</p>}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tools Section */}
       <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.3}}>
        <Card className="shadow-lg">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b">
            <div className="flex items-center gap-2">
                <Cog className="h-6 w-6 text-red-500" />
                <div>
                    <CardTitle className="text-xl">Outils Marketing Intelligents</CardTitle>
                    <CardDescription>Optimisez vos actions marketing.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid md:grid-cols-2 gap-4">
            <Card className="bg-card">
              <CardHeader><CardTitle className="text-lg flex items-center"><RefreshCw className="mr-2 h-5 w-5 text-blue-500"/>Outil de Relance Automatique</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Configurez des séquences de relance automatiques par segment pour maximiser l'engagement.</p></CardContent>
              <CardFooter><Button variant="outline" disabled>Configurer (Bientôt)</Button></CardFooter>
            </Card>
            <Card className="bg-card">
              <CardHeader><CardTitle className="text-lg flex items-center"><FileTextIcon className="mr-2 h-5 w-5 text-green-500"/>Générateur de Contenu</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Générez des idées et des modèles de contenu personnalisés pour vos propositions et campagnes.</p></CardContent>
              <CardFooter><Button variant="outline" disabled>Accéder (Bientôt)</Button></CardFooter>
            </Card>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default AdminMarketingPage;