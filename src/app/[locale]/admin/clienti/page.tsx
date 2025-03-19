import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';
import ClickableTableRow from '@/components/ClickableTableRow';
import ClientActionCell from '@/components/ClientActionCell';
import ClientEmailCell from '@/components/ClientEmailCell';
import ClientPhoneCell from '@/components/ClientPhoneCell';
import {
  AdminHeader,
  AdminButton,
  AdminFilterContainer,
  AdminSearchField,
  AdminTableContainer,
  AdminActionButton,
  AdminIcons,
  AdminInlineActions
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

export default async function ClientiPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ search?: string; tipo?: string }>
}) {
  // In Next.js 15, params e searchParams sono Promise che devono essere attese
  const { locale } = await params;
  const searchParamsData = await searchParams;
  
  // Funzione server per filtrare i clienti
  async function filterClienti(formData: FormData) {
    'use server';
    
    const search = formData.get('search') as string || '';
    const tipo = formData.get('tipo') as string || '';
    
    const searchParams = new URLSearchParams();
    if (search) searchParams.set('search', search);
    if (tipo) searchParams.set('tipo', tipo);
    
    redirect(`/${locale}/admin/clienti?${searchParams.toString()}`);
  }
  
  // Verifica l'autenticazione tramite cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  
  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login`);
  }
  
  // Ottieni il client Supabase
  const supabase = await createClient();
  
  // Preparazione della query di base
  let query = supabase
    .from('clienti')
    .select('*');
  
  // Applica i filtri dalla query di ricerca
  if (searchParamsData.search) {
    const searchValue = searchParamsData.search.trim();
    query = query.or(
      `nome.ilike.%${searchValue}%,` +
      `cognome.ilike.%${searchValue}%,` +
      `email.ilike.%${searchValue}%,` +
      `telefono.ilike.%${searchValue}%`
    );
  }
  
  if (searchParamsData.tipo && searchParamsData.tipo !== 'tutti') {
    query = query.eq('tipo', searchParamsData.tipo);
  }
  
  // Ordina per nome
  query = query.order('cognome', { ascending: true });
  
  // Esegui la query
  const { data: clienti, error } = await query;
  
  if (error) {
    console.error('Errore nel recupero dei clienti:', error);
    return (
      <div>Si è verificato un errore nel caricamento dei clienti.</div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienti</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestisci i tuoi clienti e i loro contatti
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
                defaultValue={searchParamsData.search || ''}
                placeholder="Cerca per nome, email, telefono..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              defaultValue={searchParamsData.tipo || ''}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="tutti">Tutti i tipi</option>
              <option value="privato">Privato</option>
              <option value="azienda">Azienda</option>
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
      
      {/* Tabella clienti */}
      <AdminTableContainer>
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
                <ClickableTableRow
                  key={cliente.id}
                  href={`/${locale}/admin/clienti/${cliente.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {cliente.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">{cliente.nome} {cliente.cognome || ''}</div>
                        {cliente.azienda && (
                          <div className="text-sm text-gray-500">{cliente.azienda}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <ClientEmailCell email={cliente.email} />
                  <ClientPhoneCell telefono={cliente.telefono} />
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {cliente.indirizzo || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {cliente.citta || <span className="text-gray-400">-</span>}
                  </td>
                  <ClientActionCell>
                    <AdminInlineActions>
                      <AdminActionButton
                        label="Visualizza"
                        href={`/${locale}/admin/clienti/${cliente.id}`}
                        icon={AdminIcons.view}
                        variant="primary"
                      />
                      <AdminActionButton
                        label="Modifica"
                        href={`/${locale}/admin/clienti/${cliente.id}/modifica`}
                        icon={AdminIcons.edit}
                        variant="primary"
                      />
                      <DeleteButton 
                        id={cliente.id} 
                        table="clienti" 
                        locale={locale} 
                        returnPath="admin/clienti" 
                        itemName="cliente"
                        cascadeDelete={true}
                      />
                    </AdminInlineActions>
                  </ClientActionCell>
                </ClickableTableRow>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p>Nessun cliente trovato</p>
                    <AdminButton 
                      href={`/${locale}/admin/clienti/nuovo`}
                      variant="secondary"
                      className="mt-2"
                    >
                      Crea il tuo primo cliente
                    </AdminButton>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableContainer>
        
      {/* Paginazione (se necessaria in futuro) */}
    </div>
  );
} 