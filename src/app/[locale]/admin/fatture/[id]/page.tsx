import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

// Definizione dei tipi
interface DettaglioFattura {
  id: string;
  fattura_id: string;
  servizio_id?: string;
  descrizione: string;
  quantita: number;
  prezzo_unitario: number;
  importo: number;
}

interface Fattura {
  id: string;
  numero: string;
  data_emissione: string;
  data_scadenza?: string;
  cliente_id: string;
  importo_totale: number;
  stato: 'pagata' | 'non_pagata' | 'in_ritardo' | 'annullata';
  note?: string;
  cliente?: {
    nome: string;
    cognome?: string;
    email?: string;
    telefono?: string;
    indirizzo?: string;
  };
  dettagli?: DettaglioFattura[];
}

export default async function DettaglioFatturaPage({
  params
}: {
  params: Promise<{ id: string, locale: string }>
}) {
  // In Next.js 15 dobbiamo awaittare params anche se non è una Promise
  const { id, locale } = await params;
  
  // Verifica l'autenticazione tramite cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  
  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login`);
  }
  
  // Se l'id è "nuovo" o "nuova", reindirizza alla pagina di creazione nuova fattura
  if (id === 'nuovo' || id === 'nuova') {
    console.log('Reindirizzamento a nuova fattura da id:', id);
    redirect(`/${locale}/admin/fatture/nuovo`);
  }
  
  const supabase = await createClient();
  
  try {
    console.log('Recupero fattura con ID:', id);
    
    // Recupera la fattura con i dettagli del cliente
    const { data: fattura, error } = await supabase
      .from('fatture')
      .select(`
        *,
        cliente:cliente_id (
          nome,
          cognome,
          email,
          telefono,
          indirizzo
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Errore nel recupero della fattura:', error);
      // Se la fattura non è stata trovata o è un UUID non valido, mostra la pagina 404
      if (error.code === 'PGRST116' || error.code === '22P02') {
        console.log('UUID non valido o risorsa non trovata:', id);
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Fattura non trovata</h1>
            <p className="text-gray-600">La fattura richiesta non esiste o l'identificativo non è valido.</p>
            <Link href={`/${locale}/admin/fatture`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              Torna all'elenco delle fatture
            </Link>
          </div>
        );
      }
      
      return (
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Errore</h1>
          <p className="text-gray-600">Si è verificato un errore nel recupero della fattura: {error.message}</p>
          <Link href={`/${locale}/admin/fatture`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Torna all'elenco delle fatture
          </Link>
        </div>
      );
    }
    
    if (!fattura) {
      console.error('Fattura non trovata, ID:', id);
      notFound();
    }
    
    // Recupera i dettagli della fattura
    const { data: dettagli, error: dettagliError } = await supabase
      .from('dettagli_fattura')
      .select('*')
      .eq('fattura_id', id)
      .order('id');
      
    if (dettagliError) {
      console.error('Errore nel recupero dei dettagli della fattura:', dettagliError);
    }
    
    // Aggiungi i dettagli alla fattura
    fattura.dettagli = dettagli || [];
    
    // Funzione per ottenere il colore del badge in base allo stato
    const getStatusColor = (stato: string) => {
      switch (stato) {
        case 'pagata':
          return 'bg-green-100 text-green-800';
        case 'non_pagata':
          return 'bg-yellow-100 text-yellow-800';
        case 'in_ritardo':
          return 'bg-red-100 text-red-800';
        case 'annullata':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    // Funzione per formattare lo stato
    const formatStatus = (stato: string) => {
      switch (stato) {
        case 'pagata':
          return 'Pagata';
        case 'non_pagata':
          return 'Non pagata';
        case 'in_ritardo':
          return 'In ritardo';
        case 'annullata':
          return 'Annullata';
        default:
          return stato;
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dettaglio Fattura #{fattura.numero}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(fattura.data_emissione)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/admin/fatture/${id}/modifica`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Modifica
            </Link>
            <a
              href={`/api/fatture/${id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              Scarica PDF
            </a>
            <Link
              href={`/${locale}/admin/fatture`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Torna alle fatture
            </Link>
          </div>
        </div>
        
        {/* Stato della fattura */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Stato</h2>
              <span className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(fattura.stato)}`}>
                {formatStatus(fattura.stato)}
              </span>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900">Importo totale</h2>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(fattura.importo_totale)}</span>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900">Data scadenza</h2>
              <span className="text-gray-700">{fattura.data_scadenza ? formatDate(fattura.data_scadenza) : 'Non specificata'}</span>
            </div>
          </div>
        </div>
        
        {/* Informazioni cliente */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informazioni cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-base text-gray-900">{`${fattura.cliente?.nome || ''} ${fattura.cliente?.cognome || ''}`}</p>
            </div>
            
            {fattura.cliente?.email && (
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{fattura.cliente.email}</p>
              </div>
            )}
            
            {fattura.cliente?.telefono && (
              <div>
                <p className="text-sm font-medium text-gray-500">Telefono</p>
                <p className="text-base text-gray-900">{fattura.cliente.telefono}</p>
              </div>
            )}
            
            {fattura.cliente?.indirizzo && (
              <div>
                <p className="text-sm font-medium text-gray-500">Indirizzo</p>
                <p className="text-base text-gray-900">{fattura.cliente.indirizzo}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Dettagli fattura */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="text-lg font-medium text-gray-900 p-4 border-b border-gray-200">Dettagli fattura</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantità
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prezzo unitario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Totale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fattura.dettagli && fattura.dettagli.length > 0 ? (
                  fattura.dettagli.map((dettaglio: DettaglioFattura) => (
                    <tr key={dettaglio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dettaglio.descrizione}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dettaglio.quantita}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(dettaglio.prezzo_unitario)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(dettaglio.importo)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nessun dettaglio disponibile
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Totale
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(fattura.importo_totale)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Note */}
        {fattura.note && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Note</h2>
            <p className="text-gray-700 whitespace-pre-line">{fattura.note}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Errore generico nel recupero della fattura:', error);
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-gray-600">Si è verificato un errore nel recupero della fattura.</p>
        <Link href={`/${locale}/admin/fatture`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Torna all'elenco delle fatture
        </Link>
      </div>
    );
  }
} 