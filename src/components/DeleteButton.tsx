'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { AdminIcons, AdminActionButton } from '@/components/AdminUI'; 

interface DeleteButtonProps {
  id: string;
  table: string;
  onSuccess?: () => void;
  locale: string;
  returnPath: string;
  itemName?: string;
  cascadeDelete?: boolean;
}

export default function DeleteButton({ 
  id, 
  table, 
  onSuccess, 
  locale, 
  returnPath,
  itemName = 'elemento',
  cascadeDelete = false
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);
      
      const supabase = createClient();
      
      // Se cascadeDelete è true, elimina prima i dati correlati in base alle relazioni
      if (cascadeDelete) {
        switch (table) {
          case 'clienti':
            // Elimina prima le fatture e i preventivi correlati
            // Prima elimina i dettagli delle fatture
            const { data: fatture } = await supabase
              .from('fatture')
              .select('id')
              .eq('cliente_id', id);
              
            if (fatture && fatture.length > 0) {
              const fattureIds = fatture.map(f => f.id);
              // Elimina i dettagli delle fatture
              await supabase
                .from('dettagli_fattura')
                .delete()
                .in('fattura_id', fattureIds);
              
              // Poi elimina le fatture
              await supabase
                .from('fatture')
                .delete()
                .eq('cliente_id', id);
            }
            
            // Poi elimina i preventivi
            const { data: preventivi } = await supabase
              .from('preventivi')
              .select('id')
              .eq('cliente_id', id);
              
            if (preventivi && preventivi.length > 0) {
              const preventiviIds = preventivi.map(p => p.id);
              // Elimina i dettagli dei preventivi
              await supabase
                .from('dettagli_preventivo')
                .delete()
                .in('preventivo_id', preventiviIds);
              
              // Poi elimina i preventivi
              await supabase
                .from('preventivi')
                .delete()
                .eq('cliente_id', id);
            }
            break;
            
          case 'preventivi':
            // Prima elimina i dettagli del preventivo
            await supabase
              .from('dettagli_preventivo')
              .delete()
              .eq('preventivo_id', id);
              
            // Verifica se ci sono fatture collegate
            const { data: fatturePreventivo } = await supabase
              .from('fatture')
              .select('id')
              .eq('preventivo_id', id);
              
            if (fatturePreventivo && fatturePreventivo.length > 0) {
              setErrorMessage(`Impossibile eliminare questo preventivo perché ci sono fatture collegate ad esso. Elimina prima le fatture correlate.`);
              setIsDeleting(false);
              return;
            }
            break;
            
          case 'fatture':
            // Elimina i dettagli della fattura
            await supabase
              .from('dettagli_fattura')
              .delete()
              .eq('fattura_id', id);
            break;
            
          case 'servizi':
            // Verifica prima se ci sono dettagli preventivo o fattura che usano questo servizio
            const { data: dettagliPreventivo } = await supabase
              .from('dettagli_preventivo')
              .select('id')
              .eq('servizio_id', id);
              
            const { data: dettagliFattura } = await supabase
              .from('dettagli_fattura')
              .select('id')
              .eq('servizio_id', id);
              
            if ((dettagliPreventivo && dettagliPreventivo.length > 0) || 
                (dettagliFattura && dettagliFattura.length > 0)) {
              setErrorMessage(`Impossibile eliminare questo servizio perché è utilizzato in preventivi o fatture. Rimuovi prima i riferimenti dai documenti.`);
              setIsDeleting(false);
              return;
            }
            break;
        }
      }
      
      // Ora elimina il record principale
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) {
        console.error('Errore durante l\'eliminazione:', error);
        
        // Verifica se l'errore è dovuto a foreign key constraint
        if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
          setErrorMessage(`Impossibile eliminare questo ${itemName} perché ci sono dati collegati ad esso. ${cascadeDelete ? 'Contatta l\'amministratore.' : 'Elimina prima i dati correlati o prova con l\'opzione di eliminazione in cascata.'}`);
        } else {
          // Altro tipo di errore
          setErrorMessage(`Errore durante l'eliminazione: ${error.message || 'Errore sconosciuto'}`);
        }
        setIsDeleting(false);
        return;
      }
      
      // Chiamata alla funzione di callback se fornita
      if (onSuccess) {
        onSuccess();
      } else {
        // Altrimenti, reindirizza alla pagina di ritorno
        router.refresh();
        router.push(`/${locale}/${returnPath}`);
      }
      
      // Chiudi la finestra modale se l'eliminazione è avvenuta con successo
      setShowConfirm(false);
      
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err);
      setErrorMessage('Si è verificato un errore durante l\'eliminazione.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
        title="Elimina"
        disabled={isDeleting}
      >
        <span className="sr-only">Elimina</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
      
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Conferma eliminazione</h3>
              <div className="space-y-2 text-sm text-gray-600 break-words">
                <p>Sei sicuro di voler eliminare questo {itemName}?</p>
                
                {cascadeDelete && table === 'clienti' && (
                  <p className="font-medium text-red-600 whitespace-normal">
                    Verranno eliminati anche tutti i preventivi e le fatture associati.
                  </p>
                )}
                
                {!cascadeDelete && (
                  <p className="italic">
                    Questa azione non può essere annullata.
                  </p>
                )}
              </div>
              
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs sm:text-sm break-words">
                  {errorMessage}
                </div>
              )}
              
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  className="flex-shrink-0 px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    setShowConfirm(false);
                    setErrorMessage(null);
                  }}
                  disabled={isDeleting}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  className="flex-shrink-0 px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminazione...' : 'Elimina'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 