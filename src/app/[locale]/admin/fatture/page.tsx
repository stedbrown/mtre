import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Definizione dei tipi
interface Cliente {
  id: string;
  nome: string;
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
  };
}

// Azione server per filtrare le fatture
async function filterFatture(formData: FormData) {
  'use server';
  
  const searchQuery = formData.get('search') as string;
  const stato = formData.get('stato') as string;
  const periodo = formData.get('periodo') as string;
  
  // Crea i parametri di ricerca da aggiungere all'URL
  const searchParams = new URLSearchParams();
  if (searchQuery) searchParams.set('search', searchQuery);
  if (stato) searchParams.set('stato', stato);
  if (periodo) searchParams.set('periodo', periodo);
  
  // Revalidate the path with the search params
  revalidatePath('/admin/fatture');
  
  // Redirect to the same page with search params
  const redirectUrl = `/admin/fatture${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  redirect(redirectUrl);
}

export default async function FatturePage({
  params,
  searchParams: searchParamsPromise
}: {
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ search?: string; stato?: string; periodo?: string }>
}) {
  // In Next.js 15, params e searchParams sono Promise che devono essere attese
  const { locale } = await params;
  const searchParams = await searchParamsPromise;
  
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
  
  // Prepara la query di base
  let query = supabase.from('fatture').select(`
    *,
    cliente:cliente_id (
      nome,
      cognome
    )
  `);
  
  // Applica i filtri dalla query di ricerca
  if (searchParams.search) {
    const searchValue = searchParams.search.trim();
    
    // Per le fatture, devo usare textSearch per cercare in relazioni
    // Cerca prima nella tabella fatture
    const { data: fattureIds, error: fattureError } = await supabase
      .from('fatture')
      .select('id')
      .or(`numero.ilike.%${searchValue}%`);
    
    if (fattureError) {
      console.error('Errore nella ricerca del testo:', fattureError);
    }
    
    // Cerca poi clienti che corrispondono alla ricerca
    const { data: clientiIds, error: clientiError } = await supabase
      .from('clienti')
      .select('id')
      .or(`nome.ilike.%${searchValue}%,cognome.ilike.%${searchValue}%`);
    
    if (clientiError) {
      console.error('Errore nella ricerca clienti:', clientiError);
    }
    
    // Crea un array di ID fatture da filtrare
    const idsToFilter = fattureIds?.map((f: { id: string }) => f.id) || [];
    
    // Aggiungi le fatture associate ai clienti trovati
    if (clientiIds && clientiIds.length > 0) {
      query = query.or(
        `id.in.(${idsToFilter.join(',')}),cliente_id.in.(${clientiIds.map((c: { id: string }) => c.id).join(',')})`
      );
    } else if (idsToFilter.length > 0) {
      query = query.in('id', idsToFilter);
    } else {
      // Se non ci sono risultati, aggiungi un filtro impossibile
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }
  
  if (searchParams.stato && searchParams.stato !== '') {
    query = query.eq('stato', searchParams.stato);
  }
  
  if (searchParams.periodo) {
    const now = new Date();
    let date;
    
    switch (searchParams.periodo) {
      case 'mese':
        date = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'trimestre':
        date = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'anno':
        date = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        date = null;
    }
    
    if (date) {
      query = query.gte('data_emissione', date.toISOString());
    }
  }
  
  // Ordina per data di emissione
  query = query.order('data_emissione', { ascending: false });
  
  // Esegui la query
  const { data: fatture, error } = await query;
  
  if (error) {
    console.error('Errore nel recupero delle fatture:', error);
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-gray-600">Si è verificato un errore nel recupero delle fatture.</p>
      </div>
    );
  }
  
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
          <h1 className="text-2xl font-bold text-gray-900">Fatture</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestisci le tue fatture e monitora i pagamenti
          </p>
        </div>
        <Link
          href={`/${locale}/admin/fatture/nuova`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuova fattura
        </Link>
      </div>
      
      {/* Filtri */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form action={filterFatture} className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto md:flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cerca</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                name="search"
                defaultValue={searchParams.search || ''}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Cerca per numero, cliente..."
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <label htmlFor="stato" className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              id="stato"
              name="stato"
              defaultValue={searchParams.stato || ''}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tutti gli stati</option>
              <option value="pagata">Pagata</option>
              <option value="non_pagata">Non pagata</option>
              <option value="in_ritardo">In ritardo</option>
              <option value="annullata">Annullata</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
            <select
              id="periodo"
              name="periodo"
              defaultValue={searchParams.periodo || ''}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tutti</option>
              <option value="mese">Ultimo mese</option>
              <option value="trimestre">Ultimo trimestre</option>
              <option value="anno">Ultimo anno</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto flex items-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtra
            </button>
          </div>
        </form>
      </div>
      
      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Totale fatture</h3>
              <p className="text-lg font-semibold text-gray-900">{fatture?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pagate</h3>
              <p className="text-lg font-semibold text-gray-900">
                {fatture?.filter((f: Fattura) => f.stato === 'pagata').length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-yellow-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Non pagate</h3>
              <p className="text-lg font-semibold text-gray-900">
                {fatture?.filter((f: Fattura) => f.stato === 'non_pagata').length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In ritardo</h3>
              <p className="text-lg font-semibold text-gray-900">
                {fatture?.filter((f: Fattura) => f.stato === 'in_ritardo').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabella fatture */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
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
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Importo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Scadenza
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
              {fatture && fatture.length > 0 ? (
                fatture.map((fattura: Fattura) => (
                  <tr key={fattura.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fattura.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(fattura.data_emissione)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${fattura.cliente?.nome || ''} ${fattura.cliente?.cognome || ''}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {formatCurrency(fattura.importo_totale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {fattura.data_scadenza ? formatDate(fattura.data_scadenza) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fattura.stato)}`}>
                        {formatStatus(fattura.stato)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/${locale}/admin/fatture/${fattura.id}`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <span className="sr-only">Visualizza</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/${locale}/admin/fatture/${fattura.id}/modifica`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <span className="sr-only">Modifica</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <a
                          href={`/api/fatture/${fattura.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <span className="sr-only">PDF</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nessuna fattura trovata
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginazione */}
        {fatture && fatture.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Visualizzazione di <span className="font-medium">{fatture.length}</span> fatture
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Precedente</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Successivo</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 