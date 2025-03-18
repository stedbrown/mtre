import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

// Azione server per filtrare i clienti
async function filterClienti(formData: FormData) {
  'use server';
  
  const searchQuery = formData.get('search') as string;
  
  // Crea i parametri di ricerca da aggiungere all'URL
  const searchParams = new URLSearchParams();
  if (searchQuery) searchParams.set('search', searchQuery);
  
  // Revalidate the path with the search params
  revalidatePath('/admin/clienti');
  
  // Redirect to the same page with search params
  const redirectUrl = `/admin/clienti${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  redirect(redirectUrl);
}

export default async function ClientiPage({
  params,
  searchParams: searchParamsPromise
}: {
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ search?: string; tipo?: string }>
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
  let query = supabase.from('clienti').select('*');
  
  // Applica i filtri dalla query di ricerca
  if (searchParams.search) {
    const searchValue = searchParams.search.trim();
    query = query.or(
      `nome.ilike.%${searchValue}%,` +
      `cognome.ilike.%${searchValue}%,` +
      `email.ilike.%${searchValue}%,` +
      `telefono.ilike.%${searchValue}%,` +
      `citta.ilike.%${searchValue}%`
    );
  }
  
  // Tipo cliente (privato o azienda) è stato rimosso perché la colonna azienda non esiste
  
  // Ordina per nome
  query = query.order('nome');
  
  // Recupera i clienti
  const { data: clienti, error } = await query;
  
  if (error) {
    console.error('Errore nel recupero dei clienti:', error);
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-gray-600">Si è verificato un errore nel recupero dei clienti.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienti</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestisci i tuoi clienti e visualizza le loro informazioni
          </p>
        </div>
        <Link
          href={`/${locale}/admin/clienti/nuovo`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuovo cliente
        </Link>
      </div>
      
      {/* Filtri */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form action={filterClienti} className="flex flex-wrap gap-4">
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
                placeholder="Cerca per nome, email, telefono..."
              />
            </div>
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
      
      {/* Tabella clienti */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Telefono
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Indirizzo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Città
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clienti && clienti.length > 0 ? (
                clienti.map((cliente: Cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {cliente.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cliente.nome} {cliente.cognome || ''}</div>
                          {cliente.azienda && (
                            <div className="text-sm text-gray-500">{cliente.azienda}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {cliente.email ? (
                        <a href={`mailto:${cliente.email}`} className="text-indigo-600 hover:text-indigo-900">
                          {cliente.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {cliente.telefono ? (
                        <a href={`tel:${cliente.telefono}`} className="text-indigo-600 hover:text-indigo-900">
                          {cliente.telefono}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {cliente.indirizzo || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {cliente.citta || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/${locale}/admin/clienti/${cliente.id}`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <span className="sr-only">Visualizza</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/${locale}/admin/clienti/${cliente.id}/modifica`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <span className="sr-only">Modifica</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nessun cliente trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginazione */}
        {clienti && clienti.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Visualizzazione di <span className="font-medium">{clienti.length}</span> clienti
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