'use client';

import { createClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface ClienteFormProps {
  clienteId: string;
  locale: string;
}

export default function ClienteForm({ clienteId, locale }: ClienteFormProps) {
  const router = useRouter();
  
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    azienda: '',
    email: '',
    telefono: '',
    indirizzo: '',
    citta: '',
    cap: '',
    paese: '',
    note: '',
  });
  
  // Stato per il caricamento e gli errori
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inizializza Supabase
  const supabase = createClient();
  
  // Carica i dati del cliente al caricamento della pagina
  useEffect(() => {
    async function fetchCliente() {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        const { data, error } = await supabase
          .from('clienti')
          .select('*')
          .eq('id', clienteId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setFormData({
            nome: data.nome || '',
            cognome: data.cognome || '',
            azienda: data.azienda || '',
            email: data.email || '',
            telefono: data.telefono || '',
            indirizzo: data.indirizzo || '',
            citta: data.citta || '',
            cap: data.cap || '',
            paese: data.paese || '',
            note: data.note || '',
          });
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        setErrorMessage('Errore nel caricamento dei dati del cliente.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCliente();
  }, [clienteId, supabase]);
  
  // Gestisce i cambiamenti nei campi del form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gestisce l'invio del form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Aggiorna il cliente
      const { error } = await supabase
        .from('clienti')
        .update({
          nome: formData.nome,
          cognome: formData.cognome,
          azienda: formData.azienda,
          email: formData.email,
          telefono: formData.telefono,
          indirizzo: formData.indirizzo,
          citta: formData.citta,
          cap: formData.cap,
          paese: formData.paese,
          note: formData.note,
        })
        .eq('id', clienteId);
      
      if (error) {
        throw error;
      }
      
      // Reindirizza alla pagina del cliente
      router.push(`/${locale}/admin/clienti/${clienteId}`);
      router.refresh();
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
      setErrorMessage('Si è verificato un errore durante l\'aggiornamento del cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      {isLoading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Caricamento dati...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
              {errorMessage}
            </div>
          )}
          
          {/* Dati personali */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dati personali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome*
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-1">
                  Cognome
                </label>
                <input
                  type="text"
                  id="cognome"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="azienda" className="block text-sm font-medium text-gray-700 mb-1">
                  Azienda
                </label>
                <input
                  type="text"
                  id="azienda"
                  name="azienda"
                  value={formData.azienda}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          {/* Contatti */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contatti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          {/* Indirizzo */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Indirizzo</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700 mb-1">
                  Indirizzo
                </label>
                <input
                  type="text"
                  id="indirizzo"
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="citta" className="block text-sm font-medium text-gray-700 mb-1">
                    Città
                  </label>
                  <input
                    type="text"
                    id="citta"
                    name="citta"
                    value={formData.citta}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="cap" className="block text-sm font-medium text-gray-700 mb-1">
                    CAP
                  </label>
                  <input
                    type="text"
                    id="cap"
                    name="cap"
                    value={formData.cap}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="paese" className="block text-sm font-medium text-gray-700 mb-1">
                    Paese
                  </label>
                  <input
                    type="text"
                    id="paese"
                    name="paese"
                    value={formData.paese}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Note */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Note</h3>
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                Note aggiuntive
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                value={formData.note}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>
          
          {/* Azioni */}
          <div className="flex justify-end space-x-4 pt-4">
            <Link
              href={`/${locale}/admin/clienti/${clienteId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annulla
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvataggio...
                </>
              ) : (
                'Salva modifiche'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 