import React from 'react';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ConvertToInvoiceButton from '@/components/ConvertToInvoiceButton';
import DownloadPdfButton from '@/components/DownloadPdfButton';

export default async function DettaglioPreventivoPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  // In Next.js 15, params è una Promise che deve essere awaited
  const { id, locale } = await params;
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().then(cookieStore => cookieStore.get(name)?.value);
        },
        set(name: string, value: string, options: any) {
          // Non possiamo impostare cookie qui
        },
        remove(name: string, options: any) {
          // Non possiamo rimuovere cookie qui
        },
      },
    }
  );
  
  // Verifica l'autenticazione
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accesso Richiesto</h1>
          <p className="text-gray-600 mb-6">Devi effettuare l'accesso per visualizzare questa pagina.</p>
          <Link
            href={`/${locale}/admin/login`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Vai al Login
          </Link>
        </div>
      </div>
    );
  }
  
  // Ottieni i dettagli del preventivo
  const { data: preventivo, error } = await supabase
    .from('preventivi')
    .select(`
      *,
      cliente:clienti(id, nome, cognome),
      dettagli:dettagli_preventivo(
        id,
        servizio_id,
        descrizione,
        quantita,
        prezzo_unitario,
        importo,
        servizio:servizi(id, nome)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error || !preventivo) {
    console.error('Errore durante il recupero del preventivo:', error);
    notFound();
  }
  
  // Funzione per ottenere il colore del badge in base allo stato
  const getStatoColor = (stato: string) => {
    switch (stato.toLowerCase()) {
      case 'approvato':
        return 'bg-green-100 text-green-800';
      case 'in attesa':
        return 'bg-yellow-100 text-yellow-800';
      case 'rifiutato':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Formatta la data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Calcola il totale
  const totale = preventivo.dettagli.reduce((sum: number, dettaglio: any) => sum + (dettaglio.importo || 0), 0);
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dettaglio Preventivo #{preventivo.numero}</h1>
        <div className="flex space-x-3">
          <Link
            href={`/${locale}/admin/preventivi`}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Torna alla Lista
          </Link>
          <DownloadPdfButton 
            id={id} 
            type="preventivo" 
            numero={preventivo.numero}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          />
          {preventivo.stato.toLowerCase() !== 'rifiutato' && (
            <ConvertToInvoiceButton 
              id={id} 
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            />
          )}
          <Link
            href={`/${locale}/admin/preventivi/${id}/modifica`}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Modifica
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informazioni Preventivo</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Dettagli e servizi inclusi nel preventivo.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cliente</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {preventivo.cliente.nome} {preventivo.cliente.cognome}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Numero Preventivo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{preventivo.numero}</dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data Emissione</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(preventivo.data_emissione)}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data Scadenza</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(preventivo.data_scadenza)}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Stato</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatoColor(preventivo.stato)}`}>
                  {preventivo.stato}
                </span>
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Importo Totale</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {preventivo.valuta} {preventivo.importo_totale.toFixed(2)}
              </dd>
            </div>
            
            {preventivo.note && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Note</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{preventivo.note}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Dettagli Servizi</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servizio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantità
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prezzo Unitario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preventivo.dettagli.map((dettaglio: any) => (
                  <tr key={dettaglio.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dettaglio.servizio ? dettaglio.servizio.nome : 'Servizio Personalizzato'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{dettaglio.descrizione}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dettaglio.quantita}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {preventivo.valuta} {dettaglio.prezzo_unitario.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {preventivo.valuta} {dettaglio.importo.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    Totale:
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    {preventivo.valuta} {totale.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 