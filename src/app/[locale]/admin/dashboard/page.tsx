// Dashboard file

import { createClient } from '@/lib/supabase/server-client';
import { checkServerSession } from '@/lib/hooks';
import Link from 'next/link';
import { 
  FiUsers, FiFileText, FiCheckSquare, FiPlus, 
  FiPhone, FiMail, FiMapPin
} from 'react-icons/fi';
import ClickableTableRow from '@/components/ClickableTableRow';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // In Next.js 15 dobbiamo awaittare params anche se non è una Promise
  const { locale } = await params;
  
  // Verifica l'autenticazione usando il nuovo metodo
  const user = await checkServerSession(`/${locale}/admin/login?redirectTo=/${locale}/admin/dashboard`);
  
  // Ottieni il client Supabase
  const supabase = await createClient();
  
  // Ottieni i conteggi
  const [
    { count: clientiCount }, 
    { count: preventiviCount }, 
    { count: fattureCount },
    { data: aziendaInfo },
    { data: attivitaRecenti }
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
      .limit(5)
  ]);
  
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clienti</p>
              <p className="text-2xl font-bold text-gray-900">{clientiCount || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FiCheckSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Preventivi</p>
              <p className="text-2xl font-bold text-gray-900">{preventiviCount || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FiFileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Fatture</p>
              <p className="text-2xl font-bold text-gray-900">{fattureCount || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
