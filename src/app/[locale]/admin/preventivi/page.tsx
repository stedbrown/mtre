import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';
import ClickableTableRow from '@/components/ClickableTableRow';
import ClientActionCell from '@/components/ClientActionCell';
import {
  AdminHeader,
  AdminButton,
  AdminFilterContainer,
  AdminSearchField,
  AdminSelectField,
  AdminTableContainer,
  AdminActionButton,
  AdminBadge,
  AdminIcons,
  AdminInlineActions
} from '@/components/AdminUI';

interface Preventivo {
  id: string;
  numero: string;
  data_emissione: string;
  cliente_id: string;
  importo_totale: number;
  stato: string;
  note?: string;
  clienti?: {
    nome: string;
    cognome?: string;
  };
}

// Azione server per filtrare i preventivi
async function filterPreventivi(formData: FormData) {
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
  revalidatePath('/admin/preventivi');
  
  // Redirect to the same page with search params
  const redirectUrl = `/admin/preventivi${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  redirect(redirectUrl);
}

export default async function PreventiviPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // In Next.js 15, params e searchParams sono Promise che devono essere attese
  const { locale } = await params;
  const searchParamsData = await searchParams;
  
  // Converti i parametri di ricerca in stringhe singole
  const searchQuery = typeof searchParamsData.search === 'string' ? searchParamsData.search : undefined;
  const statoFilter = typeof searchParamsData.stato === 'string' ? searchParamsData.stato : undefined;
  const periodoFilter = typeof searchParamsData.periodo === 'string' ? searchParamsData.periodo : undefined;
  
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
  let query = supabase.from('preventivi').select(`
    *,
    clienti (
      nome,
      cognome
    )
  `);
  
  // Applica i filtri dalla query di ricerca
  if (searchQuery) {
    const searchValue = searchQuery.trim();
    
    // Cerchiamo prima i numeri di preventivo
    const { data: preventiviIds, error: preventiviError } = await supabase
      .from('preventivi')
      .select('id')
      .ilike('numero', `%${searchValue}%`);
    
    if (preventiviError) {
      console.error('Errore nella ricerca preventivi:', preventiviError);
    }
    
    // Cerchiamo poi i clienti
    const { data: clientiIds, error: clientiError } = await supabase
      .from('clienti')
      .select('id')
      .or(`nome.ilike.%${searchValue}%,cognome.ilike.%${searchValue}%`);
    
    if (clientiError) {
      console.error('Errore nella ricerca clienti:', clientiError);
    }
    
    // Crea un array di ID preventivi da filtrare
    const idsToFilter = preventiviIds?.map((p: { id: string }) => p.id) || [];
    
    // Aggiungi i preventivi associati ai clienti trovati
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
  
  if (statoFilter && statoFilter !== '') {
    query = query.ilike('stato', `%${statoFilter}%`);
  }
  
  if (periodoFilter) {
    const now = new Date();
    let date;
    
    switch (periodoFilter) {
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
  
  // Recupera i preventivi
  const { data: preventivi, error } = await query;
  
  if (error) {
    console.error('Errore nel recupero dei preventivi:', error);
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-gray-600">Si è verificato un errore nel recupero dei preventivi.</p>
      </div>
    );
  }
  
  // Funzione per ottenere il colore del badge in base allo stato
  const getStatoColor = (stato: string) => {
    switch (stato.toLowerCase()) {
      case 'accettato':
      case 'approvato':
        return 'success';
      case 'inviato':
      case 'in attesa':
        return 'warning';
      case 'rifiutato':
        return 'danger';
      case 'bozza':
      default:
        return 'default';
    }
  };
  
  // Funzione per formattare lo stato
  const formatStato = (stato: string) => {
    switch (stato.toLowerCase()) {
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
        return stato;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Preventivi"
        description="Gestisci i tuoi preventivi e monitora il loro stato"
        actionLabel="Nuovo preventivo"
        actionHref={`/admin/preventivi/nuovo`}
        locale={locale}
      />
      
      {/* Filtri */}
      <AdminFilterContainer action={filterPreventivi}>
        <AdminSearchField
          id="search"
          name="search"
          defaultValue={searchQuery || ''}
          placeholder="Cerca per numero, cliente..."
          label="Cerca"
        />
        
        <AdminSelectField
          id="stato"
          name="stato"
          defaultValue={statoFilter || ''}
          label="Stato"
          options={[
            { value: '', label: 'Tutti gli stati' },
            { value: 'accettato', label: 'Approvato' },
            { value: 'inviato', label: 'In attesa' },
            { value: 'rifiutato', label: 'Rifiutato' },
            { value: 'bozza', label: 'Bozza' }
          ]}
        />
        
        <AdminSelectField
          id="periodo"
          name="periodo"
          defaultValue={periodoFilter || ''}
          label="Periodo"
          options={[
            { value: '', label: 'Tutti i periodi' },
            { value: 'mese', label: 'Ultimo mese' },
            { value: 'trimestre', label: 'Ultimo trimestre' },
            { value: 'anno', label: 'Ultimo anno' }
          ]}
        />
        
        <div className="w-full md:w-auto flex items-end">
          <AdminButton
            type="submit"
            variant="outline"
            icon={AdminIcons.filter}
          >
            Filtra
          </AdminButton>
        </div>
      </AdminFilterContainer>
      
      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Totale preventivi</h3>
              <p className="text-lg font-semibold text-gray-900">{preventivi?.length || 0}</p>
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
              <h3 className="text-sm font-medium text-gray-500">Accettati</h3>
              <p className="text-lg font-semibold text-gray-900">
                {preventivi?.filter((p: Preventivo) => 
                  p.stato.toLowerCase() === 'accettato' || p.stato.toLowerCase() === 'approvato'
                ).length || 0}
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
              <h3 className="text-sm font-medium text-gray-500">Inviati</h3>
              <p className="text-lg font-semibold text-gray-900">
                {preventivi?.filter((p: Preventivo) => 
                  p.stato.toLowerCase() === 'inviato' || p.stato.toLowerCase() === 'in attesa'
                ).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Rifiutati</h3>
              <p className="text-lg font-semibold text-gray-900">
                {preventivi?.filter((p: Preventivo) => 
                  p.stato.toLowerCase() === 'rifiutato'
                ).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabella preventivi */}
      <AdminTableContainer>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {preventivi && preventivi.length > 0 ? (
              preventivi.map((preventivo: Preventivo) => (
                <ClickableTableRow 
                  key={preventivo.id}
                  href={`/${locale}/admin/preventivi/${preventivo.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    {preventivo.numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(preventivo.data_emissione)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {`${preventivo.clienti?.nome || ''} ${preventivo.clienti?.cognome || ''}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {formatCurrency(preventivo.importo_totale)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdminBadge variant={getStatoColor(preventivo.stato)}>
                      {formatStato(preventivo.stato)}
                    </AdminBadge>
                  </td>
                  <ClientActionCell>
                    <AdminInlineActions>
                      <AdminActionButton
                        label="Visualizza"
                        href={`/${locale}/admin/preventivi/${preventivo.id}`}
                        icon={AdminIcons.view}
                        variant="primary"
                      />
                      <AdminActionButton
                        label="Modifica"
                        href={`/${locale}/admin/preventivi/${preventivo.id}/modifica`}
                        icon={AdminIcons.edit}
                        variant="primary"
                      />
                      <AdminActionButton
                        label="PDF"
                        href={`/api/preventivi/${preventivo.id}/pdf`}
                        icon={AdminIcons.pdf}
                        variant="danger"
                      />
                      <DeleteButton 
                        id={preventivo.id} 
                        table="preventivi" 
                        locale={locale} 
                        returnPath="admin/preventivi" 
                        itemName="preventivo"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Nessun preventivo trovato</p>
                    <AdminButton 
                      href={`/${locale}/admin/preventivi/nuovo`}
                      variant="secondary"
                      className="mt-2"
                    >
                      Crea il tuo primo preventivo
                    </AdminButton>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableContainer>
    </div>
  );
} 