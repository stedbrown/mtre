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
  searchParams
}: {
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ search?: string; stato?: string; periodo?: string }>
}) {
  // In Next.js 15, params e searchParams sono Promise che devono essere attese
  const { locale } = await params;
  const searchParamsData = await searchParams;
  
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
  if (searchParamsData.search) {
    const searchValue = searchParamsData.search.trim();
    
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
  
  if (searchParamsData.stato && searchParamsData.stato !== '') {
    query = query.eq('stato', searchParamsData.stato);
  }
  
  if (searchParamsData.periodo) {
    const now = new Date();
    let date;
    
    switch (searchParamsData.periodo) {
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
        return 'success';
      case 'non_pagata':
        return 'warning';
      case 'in_ritardo':
        return 'danger';
      case 'annullata':
        return 'default';
      default:
        return 'default';
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
      <AdminHeader
        title="Fatture"
        description="Gestisci le tue fatture e monitora i pagamenti"
        actionLabel="Nuova fattura"
        actionHref={`/admin/fatture/nuova`}
        locale={locale}
      />
      
      {/* Filtri */}
      <AdminFilterContainer action={filterFatture}>
        <AdminSearchField
          id="search"
          name="search"
          defaultValue={searchParamsData.search || ''}
          placeholder="Cerca per numero, cliente..."
          label="Cerca"
        />
        
        <AdminSelectField
          id="stato"
          name="stato"
          defaultValue={searchParamsData.stato || ''}
          label="Stato"
          options={[
            { value: '', label: 'Tutti gli stati' },
            { value: 'pagata', label: 'Pagata' },
            { value: 'non_pagata', label: 'Non pagata' },
            { value: 'in_ritardo', label: 'In ritardo' },
            { value: 'annullata', label: 'Annullata' }
          ]}
        />
        
        <AdminSelectField
          id="periodo"
          name="periodo"
          defaultValue={searchParamsData.periodo || ''}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <ClickableTableRow 
                  key={fattura.id}
                  href={`/${locale}/admin/fatture/${fattura.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-indigo-600">
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
                    <AdminBadge variant={getStatusColor(fattura.stato)}>
                      {formatStatus(fattura.stato)}
                    </AdminBadge>
                  </td>
                  <ClientActionCell>
                    <AdminInlineActions>
                      <AdminActionButton
                        label="Visualizza"
                        href={`/${locale}/admin/fatture/${fattura.id}`}
                        icon={AdminIcons.view}
                        variant="primary"
                      />
                      <AdminActionButton
                        label="Modifica"
                        href={`/${locale}/admin/fatture/${fattura.id}/modifica`}
                        icon={AdminIcons.edit}
                        variant="primary"
                      />
                      <AdminActionButton
                        label="PDF"
                        href={`/api/fatture/${fattura.id}/pdf`}
                        icon={AdminIcons.pdf}
                        variant="danger"
                      />
                      <DeleteButton 
                        id={fattura.id} 
                        table="fatture" 
                        locale={locale} 
                        returnPath="admin/fatture" 
                        itemName="fattura"
                        cascadeDelete={true}
                      />
                    </AdminInlineActions>
                  </ClientActionCell>
                </ClickableTableRow>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Nessuna fattura trovata</p>
                    <AdminButton 
                      href={`/${locale}/admin/fatture/nuova`}
                      variant="secondary"
                      className="mt-2"
                    >
                      Crea la tua prima fattura
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