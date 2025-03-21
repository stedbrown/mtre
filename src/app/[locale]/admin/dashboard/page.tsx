// Dashboard file

import { createClient } from '@/lib/supabase/server-client';
import { checkServerSession } from '@/lib/hooks';
import dynamic from 'next/dynamic';

// Importa i componenti client per la dashboard
const StatsCards = dynamic(() => import('@/components/StatsCards'), { ssr: true });
const DashboardCharts = dynamic(() => import('@/components/DashboardCharts'), { ssr: true });
const RecentActivity = dynamic(() => import('@/components/RecentActivity'), { ssr: true });

// Tipi dati
interface FattureMensile {
  mese: string;
  anno: string;
  totale: string;
}

interface StatoFattura {
  stato: string;
  totale: string;
}

interface ClienteFattura {
  id: string;
  nome: string;
  cognome: string;
}

interface Fattura {
  id: string;
  numero: string;
  data: string;
  importo_totale: number | string;
  stato: string;
  cliente?: ClienteFattura;
}

// Funzione per formattare i nomi dei mesi
const getMonthName = (monthNum: number) => {
  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  return months[monthNum - 1];
};

export default async function DashboardPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // In Next.js 15 dobbiamo gestire locale
  const { locale } = await params;
  
  // Verifica l'autenticazione usando il metodo
  const user = await checkServerSession(`/${locale}/admin/login?redirectTo=/${locale}/admin/dashboard`);
  
  // Ottieni il client Supabase
  const supabase = await createClient();
  
  // Ottieni i conteggi
  const [
    { count: clientiCount }, 
    { count: preventiviCount }, 
    { count: fattureCount },
    { data: aziendaInfo },
    { data: attivitaRecenti },
    { data: statoFatture },
    { data: fattureMensili },
    { data: topClienti },
    { data: fattureTotali }
  ] = await Promise.all([
    supabase.from('clienti').select('*', { count: 'exact', head: true }),
    supabase.from('preventivi').select('*', { count: 'exact', head: true }),
    supabase.from('fatture').select('*', { count: 'exact', head: true }),
    supabase.from('azienda_info').select('*').single(),
    supabase.from('fatture')
      .select(`
        id, 
        numero, 
        data, 
        importo_totale, 
        stato,
        cliente:clienti(id, nome, cognome)
      `)
      .order('data', { ascending: false })
      .limit(5),
    supabase.rpc('count_fatture_by_stato'),
    supabase.rpc('sum_fatture_by_month_last_12_months'),
    supabase.rpc('top_clienti_by_fatturato', { limit_num: 5 }),
    supabase.from('fatture').select('importo_totale')
  ]);

  // Calcola il fatturato totale dalle fatture
  const fatturato_totale = fattureTotali?.reduce((acc, fattura) => {
    return acc + parseFloat(fattura.importo_totale.toString() || '0');
  }, 0) || 0;

  // Prepara i dati per il grafico a barre delle fatture mensili
  const datiMensili = (fattureMensili as FattureMensile[] || []).map(item => ({
    mese: getMonthName(parseInt(item.mese)),
    fatturato: parseFloat(item.totale),
    anno: item.anno
  }));

  // Prepara i dati per il grafico a torta dello stato fatture
  const datiStati = (statoFatture as StatoFattura[] || []).map(item => ({
    stato: item.stato.charAt(0).toUpperCase() + item.stato.slice(1).replace('_', ' '),
    valore: parseInt(item.totale)
  }));

  // Colori per i grafici
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Converte attivitaRecenti in formato compatibile con il tipo Fattura
  const formattedAttivita = (attivitaRecenti || []).map((fattura: any) => ({
    ...fattura,
    cliente: fattura.cliente ? {
      id: fattura.cliente.id,
      nome: fattura.cliente.nome,
      cognome: fattura.cliente.cognome
    } : undefined
  })) as Fattura[];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Benvenuto, {user?.email}
          </p>
        </div>
      </div>
      
      {/* Statistiche */}
      <StatsCards 
        clientiCount={clientiCount || 0} 
        preventiviCount={preventiviCount || 0} 
        fattureCount={fattureCount || 0}
        fatturato_totale={fatturato_totale}
      />

      {/* Grafici Finanziari */}
      <DashboardCharts 
        datiMensili={datiMensili} 
        datiStati={datiStati} 
        topClienti={topClienti || []} 
        COLORS={COLORS} 
      />
      
      {/* Attività Recenti */}
      <RecentActivity 
        attivitaRecenti={formattedAttivita} 
        locale={locale} 
      />
    </div>
  );
}
