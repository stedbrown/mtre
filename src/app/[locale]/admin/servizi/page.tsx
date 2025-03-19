import { createClient } from '@/lib/supabase/server-client';
import Link from 'next/link';
import { formatCurrency, truncateText } from '@/lib/utils';
import DeleteButton from '@/components/DeleteButton';
import ClickableCard from '@/components/ClickableCard';
import ClientCardActions from '@/components/ClientCardActions';
import { checkServerSession } from '@/lib/hooks';

// Definizione dei tipi
interface Servizio {
  id: string;
  nome: string;
  descrizione?: string;
  prezzo: number;
  durata?: number;
  categoria?: string;
  attivo: boolean;
}

export default async function ServiziPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // In Next.js 15 dobbiamo awaittare params anche se non è una Promise
  const { locale } = await params;
  
  // Verifica l'autenticazione usando il nuovo metodo
  const user = await checkServerSession(`/${locale}/admin/login?redirectTo=/${locale}/admin/servizi`);
  
  // Se non siamo autenticati, il checkServerSession farà il redirect automaticamente
  
  // Ottieni il client Supabase
  const supabase = await createClient();
  
  // Recupera i servizi
  const { data: servizi, error } = await supabase
    .from('servizi')
    .select('*')
    .order('nome', { ascending: true });
  
  if (error) {
    console.error('Errore nel recupero dei servizi:', error);
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-gray-600">Si è verificato un errore nel recupero dei servizi.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servizi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestisci i tuoi servizi e prodotti offerti
          </p>
        </div>
        <Link
          href={`/${locale}/admin/servizi/nuovo`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuovo servizio
        </Link>
      </div>
      
      {/* Filtri */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Cerca per nome, categoria..."
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              id="categoria"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tutte le categorie</option>
              {/* Estrai categorie uniche dai servizi */}
              {servizi
                ?.filter((s: Servizio) => s.categoria)
                .reduce((acc: string[], s: Servizio) => {
                  if (s.categoria && !acc.includes(s.categoria)) {
                    acc.push(s.categoria);
                  }
                  return acc;
                }, [])
                .map((categoria: string) => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))
              }
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label htmlFor="stato" className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              id="stato"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Tutti</option>
              <option value="attivo">Attivo</option>
              <option value="inattivo">Inattivo</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto flex items-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtra
            </button>
          </div>
        </div>
      </div>
      
      {/* Visualizzazione a griglia dei servizi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servizi && servizi.length > 0 ? (
          servizi.map((servizio: Servizio) => (
            <ClickableCard 
              key={servizio.id}
              href={`/${locale}/admin/servizi/${servizio.id}`}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md ${
                servizio.attivo ? 'border-gray-100' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-indigo-600">{servizio.nome}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    servizio.attivo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {servizio.attivo ? 'Attivo' : 'Inattivo'}
                  </span>
                </div>
                
                {servizio.categoria && (
                  <div className="text-sm text-gray-500 mb-2">
                    Categoria: {servizio.categoria}
                  </div>
                )}
                
                {servizio.descrizione && (
                  <p className="text-sm text-gray-600 mb-4">
                    {truncateText(servizio.descrizione, 120)}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                    {formatCurrency(servizio.prezzo)}
                  </div>
                  
                  {servizio.durata && (
                    <div className="text-sm text-gray-500">
                      Durata: {servizio.durata} min
                    </div>
                  )}
                </div>
                
                <ClientCardActions>
                  <Link
                    href={`/${locale}/admin/servizi/${servizio.id}`}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <span className="sr-only">Visualizza</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                  <Link
                    href={`/${locale}/admin/servizi/${servizio.id}/modifica`}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <span className="sr-only">Modifica</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <DeleteButton 
                    id={servizio.id} 
                    table="servizi" 
                    locale={locale} 
                    returnPath="admin/servizi" 
                    itemName="servizio"
                  />
                </ClientCardActions>
              </div>
            </ClickableCard>
          ))
        ) : (
          <div className="col-span-full p-6 bg-white rounded-lg shadow text-center">
            <p className="text-gray-500">Nessun servizio trovato</p>
            <Link
              href={`/${locale}/admin/servizi/nuovo`}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Aggiungi il primo servizio
            </Link>
          </div>
        )}
      </div>
      
      {/* Paginazione */}
      {servizi && servizi.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{servizi.length}</span> di{' '}
                <span className="font-medium">{servizi.length}</span> risultati
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 