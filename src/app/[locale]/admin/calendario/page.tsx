import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';
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

// Definizione dell'interfaccia Appuntamento
interface Appuntamento {
  id: string;
  titolo: string;
  data: string;
  ora_inizio: string;
  ora_fine: string;
  stato: string;
  cliente?: {
    nome: string;
    cognome: string;
  };
}

// Funzione per formattare l'orario
const formatTime = (timeString: string) => {
  return timeString ? timeString.substring(0, 5) : '';
};

// Funzione per formattare lo stato dell'appuntamento
const formatStatus = (stato: string) => {
  switch (stato) {
    case 'confermato':
      return 'Confermato';
    case 'in_attesa':
      return 'In attesa';
    case 'annullato':
      return 'Annullato';
    default:
      return stato;
  }
};

// Funzione per ottenere il colore del badge in base allo stato
const getStatusColor = (stato: string) => {
  switch (stato) {
    case 'confermato':
      return 'success';
    case 'in_attesa':
      return 'warning';
    case 'annullato':
      return 'danger';
    default:
      return 'default';
  }
};

export default async function CalendarioPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>,
  searchParams: any
}) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { locale } = await params;
  
  // Funzione per filtrare gli appuntamenti
  async function filterAppuntamenti(formData: FormData) {
    'use server';
    
    const search = formData.get('search') as string || '';
    const stato = formData.get('stato') as string || '';
    const periodo = formData.get('periodo') as string || '';
    
    const searchParams = new URLSearchParams();
    if (search) searchParams.set('search', search);
    if (stato) searchParams.set('stato', stato);
    if (periodo) searchParams.set('periodo', periodo);
    
    redirect(`/${locale}/admin/calendario?${searchParams.toString()}`);
  }
  
  // Simulare appuntamenti per debugging
  const dummyAppuntamenti: Appuntamento[] = [
    {
      id: '1',
      titolo: 'Incontro con nuovo cliente',
      data: '2023-09-15',
      ora_inizio: '09:30:00',
      ora_fine: '10:30:00',
      stato: 'confermato',
      cliente: {
        nome: 'Mario',
        cognome: 'Rossi'
      }
    },
    {
      id: '2',
      titolo: 'Revisione progetto',
      data: '2023-09-16',
      ora_inizio: '14:00:00',
      ora_fine: '15:00:00',
      stato: 'in_attesa',
      cliente: {
        nome: 'Luigi',
        cognome: 'Verdi'
      }
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Calendario Appuntamenti"
        description="Gestisci gli appuntamenti e le attività programmate"
        actionLabel="Nuovo appuntamento"
        actionHref={`/admin/calendario/nuovo`}
        locale={locale}
      />
      
      {/* Filtri */}
      <AdminFilterContainer action={filterAppuntamenti}>
        <AdminSearchField
          id="search"
          name="search"
          defaultValue={searchParams.search || ''}
          placeholder="Cerca per titolo, cliente..."
          label="Cerca"
        />
        
        <AdminSelectField
          id="stato"
          name="stato"
          defaultValue={searchParams.stato || ''}
          label="Stato"
          options={[
            { value: '', label: 'Tutti gli stati' },
            { value: 'confermato', label: 'Confermato' },
            { value: 'in_attesa', label: 'In attesa' },
            { value: 'annullato', label: 'Annullato' }
          ]}
        />
        
        <AdminSelectField
          id="periodo"
          name="periodo"
          defaultValue={searchParams.periodo || ''}
          label="Periodo"
          options={[
            { value: '', label: 'Tutti' },
            { value: 'oggi', label: 'Oggi' },
            { value: 'domani', label: 'Domani' },
            { value: 'settimana', label: 'Questa settimana' },
            { value: 'mese', label: 'Questo mese' }
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
      
      {/* Vista Calendario */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        {/* Vista a calendario qui */}
        <div className="mb-4 text-center">
          <p className="text-gray-500 text-sm">
            La visualizzazione a calendario verrà implementata prossimamente.
          </p>
        </div>
      </div>
      
      {/* Prossimi Appuntamenti */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Prossimi appuntamenti</h2>
        
        <AdminTableContainer>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titolo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Cliente
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
              {dummyAppuntamenti && dummyAppuntamenti.length > 0 ? (
                dummyAppuntamenti.map((appuntamento: Appuntamento) => (
                  <tr key={appuntamento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(appuntamento.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(appuntamento.ora_inizio)} - {formatTime(appuntamento.ora_fine)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appuntamento.titolo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {appuntamento.cliente ? `${appuntamento.cliente.nome} ${appuntamento.cliente.cognome}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AdminBadge variant={getStatusColor(appuntamento.stato)}>
                        {formatStatus(appuntamento.stato)}
                      </AdminBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <AdminInlineActions>
                        <AdminActionButton
                          label="Visualizza"
                          href={`/${locale}/admin/calendario/${appuntamento.id}`}
                          icon={AdminIcons.view}
                          variant="primary"
                        />
                        <AdminActionButton
                          label="Modifica"
                          href={`/${locale}/admin/calendario/${appuntamento.id}/modifica`}
                          icon={AdminIcons.edit}
                          variant="primary"
                        />
                        <DeleteButton 
                          id={appuntamento.id} 
                          table="appuntamenti" 
                          locale={locale} 
                          returnPath="admin/calendario" 
                          itemName="appuntamento"
                        />
                      </AdminInlineActions>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Nessun appuntamento trovato</p>
                      <AdminButton 
                        href={`/${locale}/admin/calendario/nuovo`}
                        variant="secondary"
                        className="mt-2"
                      >
                        Crea il tuo primo appuntamento
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </AdminTableContainer>
      </div>
    </div>
  );
} 