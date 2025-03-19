import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';
import {
  AdminHeader,
  AdminButton,
  AdminActionButton,
  AdminIcons
} from '@/components/AdminUI';

interface Cliente {
  id: string;
  nome: string;
  cognome?: string;
  azienda?: string;
  email?: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  paese?: string;
  note?: string;
  created_at?: string;
}

export default async function DettaglioClientePage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  // In Next.js 15 dobbiamo awaittare params anche se non è una Promise
  const { locale, id } = await params;
  
  // Verifica l'autenticazione tramite cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  
  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Accesso negato</h1>
        <p className="text-gray-600">Devi effettuare l'accesso per visualizzare questa pagina.</p>
        <a href={`/${locale}/admin/login`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Vai alla pagina di login
        </a>
      </div>
    );
  }
  
  const supabase = await createClient();
  
  // Recupera il cliente
  const { data: cliente, error } = await supabase
    .from('clienti')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !cliente) {
    console.error('Errore nel recupero del cliente:', error);
    return notFound();
  }
  
  // Recupera i preventivi del cliente
  const { data: preventivi } = await supabase
    .from('preventivi')
    .select('id, numero, data_emissione, importo_totale, stato')
    .eq('cliente_id', id)
    .order('data_emissione', { ascending: false })
    .limit(5);
  
  // Recupera le fatture del cliente
  const { data: fatture } = await supabase
    .from('fatture')
    .select('id, numero, data_emissione, importo_totale, stato')
    .eq('cliente_id', id)
    .order('data_emissione', { ascending: false })
    .limit(5);
  
  // Formatta una data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Formatta un importo
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };
  
  // Formatta uno stato
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pagata':
        return 'Pagata';
      case 'non_pagata':
        return 'Non pagata';
      case 'in_ritardo':
        return 'In ritardo';
      case 'annullata':
        return 'Annullata';
      case 'accettato':
      case 'approvato':
        return 'Approvato';
      case 'inviato':
      case 'in attesa':
        return 'In attesa';
      case 'rifiutato':
        return 'Rifiutato';
      case 'bozza':
        return 'Bozza';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Ottiene il colore del badge in base allo stato
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagata':
      case 'accettato':
      case 'approvato':
        return 'text-green-800 bg-green-100';
      case 'non_pagata':
      case 'inviato':
      case 'in attesa':
        return 'text-yellow-800 bg-yellow-100';
      case 'in_ritardo':
      case 'rifiutato':
        return 'text-red-800 bg-red-100';
      case 'annullata':
      case 'bozza':
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title={`${cliente.nome} ${cliente.cognome || ''}`}
        description={cliente.azienda || 'Cliente privato'}
        actionLabel="Modifica cliente"
        actionHref={`/admin/clienti/${id}/modifica`}
        locale={locale}
        backButton={{
          href: `/admin/clienti`,
          label: 'Torna alla lista clienti'
        }}
      />
      
      {/* Informazioni cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dettagli contatto */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contatti</h3>
          <div className="space-y-3">
            {cliente.email && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <a href={`mailto:${cliente.email}`} className="text-base text-indigo-600 hover:text-indigo-800">
                  {cliente.email}
                </a>
              </div>
            )}
            
            {cliente.telefono && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Telefono</h4>
                <a href={`tel:${cliente.telefono}`} className="text-base text-indigo-600 hover:text-indigo-800">
                  {cliente.telefono}
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Indirizzo */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Indirizzo</h3>
          <div className="space-y-3">
            {cliente.indirizzo && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Via/Piazza</h4>
                <p className="text-base text-gray-900">{cliente.indirizzo}</p>
              </div>
            )}
            
            {(cliente.citta || cliente.cap) && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Città/CAP</h4>
                <p className="text-base text-gray-900">
                  {cliente.citta}{cliente.citta && cliente.cap ? ', ' : ''}{cliente.cap}
                </p>
              </div>
            )}
            
            {cliente.paese && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Paese</h4>
                <p className="text-base text-gray-900">{cliente.paese}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Note */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Note</h3>
          <p className="text-base text-gray-700 whitespace-pre-line">
            {cliente.note || 'Nessuna nota disponibile'}
          </p>
        </div>
      </div>
      
      {/* Preventivi recenti */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Preventivi recenti</h3>
          <AdminButton
            href={`/${locale}/admin/preventivi/nuovo?cliente=${id}`}
            variant="outline"
            icon={AdminIcons.add}
          >
            Nuovo preventivo
          </AdminButton>
        </div>
        
        {preventivi && preventivi.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numero
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preventivi.map((preventivo: any) => (
                  <tr key={preventivo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {preventivo.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(preventivo.data_emissione)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(preventivo.importo_totale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(preventivo.stato)}`}>
                        {formatStatus(preventivo.stato)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <AdminActionButton
                        label="Visualizza"
                        href={`/${locale}/admin/preventivi/${preventivo.id}`}
                        icon={AdminIcons.view}
                        variant="primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            Nessun preventivo trovato per questo cliente
          </div>
        )}
        
        {preventivi && preventivi.length > 0 && (
          <div className="mt-4 text-right">
            <Link href={`/${locale}/admin/preventivi?search=${encodeURIComponent(cliente.nome)}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Vedi tutti i preventivi →
            </Link>
          </div>
        )}
      </div>
      
      {/* Fatture recenti */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Fatture recenti</h3>
          <AdminButton
            href={`/${locale}/admin/fatture/nuova?cliente=${id}`}
            variant="outline"
            icon={AdminIcons.add}
          >
            Nuova fattura
          </AdminButton>
        </div>
        
        {fatture && fatture.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numero
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fatture.map((fattura: any) => (
                  <tr key={fattura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fattura.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(fattura.data_emissione)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(fattura.importo_totale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(fattura.stato)}`}>
                        {formatStatus(fattura.stato)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <AdminActionButton
                        label="Visualizza"
                        href={`/${locale}/admin/fatture/${fattura.id}`}
                        icon={AdminIcons.view}
                        variant="primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            Nessuna fattura trovata per questo cliente
          </div>
        )}
        
        {fatture && fatture.length > 0 && (
          <div className="mt-4 text-right">
            <Link href={`/${locale}/admin/fatture?search=${encodeURIComponent(cliente.nome)}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Vedi tutte le fatture →
            </Link>
          </div>
        )}
      </div>
      
      {/* Azioni */}
      <div className="flex justify-between items-center mt-8">
        <Link
          href={`/${locale}/admin/clienti`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla lista
        </Link>
        
        <div className="flex space-x-4">
          <AdminButton
            href={`/${locale}/admin/clienti/${id}/modifica`}
            variant="primary"
            icon={AdminIcons.edit}
          >
            Modifica
          </AdminButton>
          
          <DeleteButton 
            id={id} 
            table="clienti" 
            locale={locale} 
            returnPath="admin/clienti" 
            itemName="cliente"
            cascadeDelete={true}
          />
        </div>
      </div>
    </div>
  );
} 