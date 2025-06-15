import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as UiCardDescription } from '@/components/ui/card';
import { Award, DollarSign, Briefcase, Building as BuildingIcon } from 'lucide-react';

export const POINT_VALUE_FOR_COMMISSION = 10;

const TeamPerformanceCard = ({ memberDetails, prospects, partners }) => {
  if (!memberDetails) {
    return (
      <Card className="shadow-lg bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500 text-center p-8">
        <CardHeader>
          <CardTitle className="text-xl text-red-700">Données Utilisateur Indisponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Les informations pour cet utilisateur n'ont pas pu être chargées. Veuillez contacter un administrateur.</p>
        </CardContent>
      </Card>
    );
  }

  const myProspects = prospects.filter(p => p.assigned_user_id === memberDetails.id);
  const myPartners = partners.filter(p => p.managed_by_user_id === memberDetails.id);
  const commission = (memberDetails.points * POINT_VALUE_FOR_COMMISSION * (memberDetails.commissionRate || 0.03)).toFixed(2);

  return (
    <Card className="shadow-xl bg-gradient-to-br from-card to-secondary/20 border-l-4 border-primary">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {memberDetails.name ? memberDetails.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">{memberDetails.name || 'Utilisateur Anonyme'}</CardTitle>
            <UiCardDescription className="text-md text-muted-foreground">{memberDetails.role || 'Rôle non défini'}</UiCardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-background/50 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center text-yellow-600"><Award className="mr-2 h-5 w-5" />Points Obtenus</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold text-yellow-700">{memberDetails.points || 0}</p></CardContent>
          </Card>
          <Card className="bg-background/50 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center text-green-600"><DollarSign className="mr-2 h-5 w-5" />Commission Estimée</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold text-green-700">{commission} €</p></CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground flex items-center"><Briefcase className="mr-3 h-6 w-6 text-blue-500" />Mes Prospects ({myProspects.length})</h3>
          {myProspects.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2 bg-blue-500/5 p-4 rounded-lg border border-blue-500/20 custom-scrollbar">
              {myProspects.map(p => (
                <div key={p.id} className="text-sm p-2 bg-background rounded shadow-sm hover:shadow-md transition-shadow">
                  {p.name} - <span className="italic text-muted-foreground">{p.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground italic p-4 bg-secondary/20 rounded-md">Aucun prospect assigné pour le moment.</p>}
        </div>

        <div>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground flex items-center"><BuildingIcon className="mr-3 h-6 w-6 text-purple-500" />Mes Partenaires ({myPartners.length})</h3>
          {myPartners.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2 bg-purple-500/5 p-4 rounded-lg border border-purple-500/20 custom-scrollbar">
              {myPartners.map(p => (
                 <div key={p.id} className="text-sm p-2 bg-background rounded shadow-sm hover:shadow-md transition-shadow">
                  {p.name} - <span className="italic text-muted-foreground">{p.type}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-muted-foreground italic p-4 bg-secondary/20 rounded-md">Aucun partenaire géré pour le moment.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceCard;