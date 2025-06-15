import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, BarChart3, Calendar, Users, Briefcase, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

// Helper function to convert array of objects to CSV
const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let headerLine = '';
    if (array.length > 0) {
        headerLine = Object.keys(array[0]).join(',');
        str += headerLine + '\r\n';
    }

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ',';
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
};

const AdminReportsPage = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('sales_overview');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [exportFormat, setExportFormat] = useState('csv');

  const [mockData, setMockData] = useState({
    sales: [],
    prospects: [],
    team: []
  });

  useEffect(() => {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const prospects = JSON.parse(localStorage.getItem('prospects') || '[]');
    const team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    setMockData({ sales, prospects, team });
  }, []);


  const handleGenerateReport = () => {
    let dataToExport = [];
    let fileName = `${reportType}_${dateRange}`;

    switch(reportType) {
      case 'sales_overview':
        dataToExport = mockData.sales.map(({ id, eventName, customerName, totalPrice, saleDate, paymentStatus }) => ({ id, eventName, customerName, totalPrice, saleDate, paymentStatus }));
        break;
      case 'prospect_conversion':
        dataToExport = mockData.prospects.map(({ id, name, status, type, contactEmail, assignedTo }) => ({ id, name, status, type, contactEmail, assignedTo }));
        break;
      case 'team_performance':
        dataToExport = mockData.team.map(({ id, name, role, points, email }) => ({ id, name, role, points, email }));
        break;
      default:
        toast({ title: "Type de rapport non supporté", description: "Ce type de rapport n'a pas de données associées pour l'export.", variant: "destructive" });
        return;
    }

    if(dataToExport.length === 0){
        toast({ title: "Aucune donnée", description: `Aucune donnée à exporter pour ${reportType}.`, variant: "default" });
        return;
    }

    if (exportFormat === 'csv') {
      const csvData = convertToCSV(dataToExport);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Rapport CSV Généré",
        description: `Le fichier ${fileName}.csv a été téléchargé.`,
      });
    } else if (exportFormat === 'pdf') {
      // PDF generation is complex on client-side, this remains a simulation
      toast({
        title: "Génération PDF (Simulation)",
        description: `Un PDF pour "${reportType}" serait téléchargé.`,
      });
    }
  };

  const reportOptions = [
    { value: 'sales_overview', label: 'Aperçu des Ventes', icon: BarChart3 },
    { value: 'prospect_conversion', label: 'Conversion des Prospects', icon: Briefcase },
    { value: 'team_performance', label: 'Performance de l\'Équipe', icon: Users },
    { value: 'activity_summary', label: 'Résumé des Activités (Non implémenté)', icon: Calendar, disabled: true },
  ];

  const dateRangeOptions = [
    { value: 'all_time', label: 'Depuis le début' },
    { value: 'today', label: 'Aujourd\'hui (Non implémenté)', disabled: true},
    { value: 'last_7_days', label: '7 derniers jours (Non implémenté)', disabled: true },
    { value: 'last_30_days', label: '30 derniers jours (Non implémenté)', disabled: true },
  ];

  return (
    <div className="space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
      >
        Rapports & Exports
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Configuration de l'Export</CardTitle>
            <CardDescription>Sélectionnez les données, la période et le format d'export.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-foreground mb-1">Données à Exporter</label>
                <select 
                  id="reportType" 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:ring-primary focus:border-primary"
                >
                  {reportOptions.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-foreground mb-1">Période (Filtre non appliqué)</label>
                <select 
                  id="dateRange" 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:ring-primary focus:border-primary"
                >
                  {dateRangeOptions.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="exportFormat" className="block text-sm font-medium text-foreground mb-1">Format d'Export</label>
                <select 
                  id="exportFormat" 
                  value={exportFormat} 
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full h-10 border border-input bg-background rounded-md px-3 text-sm focus:ring-primary focus:border-primary"
                >
                  <option value="csv">CSV (Comma Separated Values)</option>
                  <option value="pdf">PDF (Simulation)</option>
                </select>
              </div>
            </div>
            
            <div className="flex pt-4">
              <Button onClick={handleGenerateReport} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white">
                {exportFormat === 'csv' ? <FileSpreadsheet className="mr-2 h-5 w-5" /> : <FileText className="mr-2 h-5 w-5" />}
                Exporter les Données
              </Button>
            </div>
             <p className="text-xs text-muted-foreground">* Le filtrage par date n'est pas encore fonctionnel pour les exports. Toutes les données disponibles pour le type sélectionné seront exportées.</p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
            <CardHeader>
                <CardTitle>Historique des Exports (Bientôt)</CardTitle>
                <CardDescription>Retrouvez ici vos rapports précédemment générés.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Aucun rapport dans l'historique pour le moment.</p>
            </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default AdminReportsPage;