import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
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

interface Prodotto {
  id: string;
  nome: string;
  codice?: string;
  prezzo: number;
  tipo: 'prodotto' | 'servizio';
  descrizione?: string;
}

export default async function ProdottiPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // In Next.js 15, params e searchParams sono Promise che devono essere attese
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const searchQuery = typeof searchParamsData.search === 'string' ? searchParamsData.search : undefined;
  const categoriaFilter = typeof searchParamsData.categoria === 'string' ? searchParamsData.categoria : undefined;
  
  // Funzione per filtrare i prodotti
  async function filterProdotti(formData: FormData) {
    'use server';
    
    const search = formData.get('search') as string || '';
    const categoria = formData.get('categoria') as string || '';
    
    const searchParams = new URLSearchParams();
    if (search) searchParams.set('search', search);
    if (categoria) searchParams.set('categoria', categoria);
    
    redirect(`/${locale}/admin/prodotti?${searchParams.toString()}`);
  }
  
  // Dati di esempio per i prodotti
  const prodotti: Prodotto[] = [
    {
      id: '1',
      nome: 'Consulenza web',
      codice: 'SRV001',
      prezzo: 120,
      tipo: 'servizio',
      descrizione: 'Consulenza per la realizzazione di siti web'
    },
    {
      id: '2',
      nome: 'Hosting annuale',
      codice: 'SRV002',
      prezzo: 99.90,
      tipo: 'servizio',
      descrizione: 'Servizio hosting annuale con dominio incluso'
    },
    {
      id: '3',
      nome: 'Laptop HP ProBook',
      codice: 'PRD001',
      prezzo: 899,
      tipo: 'prodotto',
      descrizione: 'Laptop professionale HP ProBook'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Prodotti e Servizi"
        description="Gestisci il tuo catalogo di prodotti e servizi"
        actionLabel="Nuovo prodotto"
        actionHref={`/admin/prodotti/nuovo`}
        locale={locale}
      />
      
      {/* Filtri */}
      <AdminFilterContainer action={filterProdotti}>
        <AdminSearchField
          id="search"
          name="search"
          defaultValue={searchQuery || ''}
          placeholder="Cerca per nome, codice..."
          label="Cerca"
        />
        
        <AdminSelectField
          id="categoria"
          name="categoria"
          defaultValue={categoriaFilter || ''}
          label="Categoria"
          options={[
            { value: '', label: 'Tutte le categorie' },
            { value: 'prodotto', label: 'Prodotti' },
            { value: 'servizio', label: 'Servizi' }
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
      
      {/* Tabella prodotti */}
      <AdminTableContainer>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Codice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Prezzo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prodotti && prodotti.length > 0 ? (
              prodotti.map((prodotto: Prodotto) => (
                <tr key={prodotto.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {prodotto.codice || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prodotto.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {formatCurrency(prodotto.prezzo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    <AdminBadge variant={prodotto.tipo === 'servizio' ? 'warning' : 'default'}>
                      {prodotto.tipo === 'prodotto' ? 'Prodotto' : 'Servizio'}
                    </AdminBadge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <AdminInlineActions>
                      <AdminActionButton
                        label="Visualizza"
                        href={`/${locale}/admin/prodotti/${prodotto.id}`}
                        icon={AdminIcons.view}
                        variant="primary"
                      />
                      <AdminActionButton
                        label="Modifica"
                        href={`/${locale}/admin/prodotti/${prodotto.id}/modifica`}
                        icon={AdminIcons.edit}
                        variant="primary"
                      />
                      <DeleteButton 
                        id={prodotto.id} 
                        table="prodotti" 
                        locale={locale} 
                        returnPath="admin/prodotti" 
                        itemName="prodotto"
                      />
                    </AdminInlineActions>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p>Nessun prodotto trovato</p>
                    <AdminButton 
                      href={`/${locale}/admin/prodotti/nuovo`}
                      variant="secondary"
                      className="mt-2"
                    >
                      Crea il tuo primo prodotto
                    </AdminButton>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableContainer>
    </div>
  )
} 