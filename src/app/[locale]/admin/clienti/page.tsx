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
      <AdminHeader
        title="Clienti"
        description="Gestisci i tuoi clienti e visualizza le loro informazioni"
        actionLabel="Nuovo cliente"
        actionHref={`/admin/clienti/nuovo`}
        locale={locale}
      />
      
      {/* Filtri */}
      <AdminFilterContainer action={filterClienti}>
        <AdminSearchField
          id="search"
          name="search"
          defaultValue={searchParams.search || ''}
          placeholder="Cerca per nome, email, telefono..."
          label="Cerca"
        />
        
        <div className="w-full md:w-auto flex items-end">
          <AdminButton
            type="submit"
            variant="outline"
            icon={
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            }
          >
            Filtra
          </AdminButton>
        </div>
      </AdminFilterContainer>
      
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