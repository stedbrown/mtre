'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Cliente {
  id: string;
  nome: string;
  cognome: string;
}

interface Servizio {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: number;
}

interface DettaglioPreventivo {
  id?: string;
  servizio_id: string;
  descrizione: string;
  quantita: number;
  prezzo_unitario: number;
  totale: number;
  importo?: number;
  is_custom?: boolean;
}

export default function NuovoPreventivoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [servizi, setServizi] = useState<Servizio[]>([]);
  
  // Genera un numero di preventivo più affidabile e significativo
  const generatePreventiveNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // Usiamo timestamp per garantire unicità anche in caso di creazione simultanea
    const timestamp = Date.now().toString().slice(-5);
    return `PREV-${year}${month}-${timestamp}`;
  };
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    data_emissione: new Date().toISOString().split('T')[0],
    data_scadenza: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    numero: generatePreventiveNumber(),
    stato: 'in attesa',
    note: '',
    importo_totale: 0,
    valuta: 'CHF'
  });
  
  const [dettagli, setDettagli] = useState<DettaglioPreventivo[]>([]);
  
  // Aggiungi stato per il modale
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [modalText, setModalText] = useState('');
  
  useEffect(() => {
    // Carica clienti e servizi
    const fetchData = async () => {
      try {
        const [clientiRes, serviziRes] = await Promise.all([
          fetch('/api/clienti'),
          fetch('/api/servizi')
        ]);
        
        if (!clientiRes.ok || !serviziRes.ok) {
          throw new Error('Errore durante il caricamento dei dati');
        }
        
        const clientiData = await clientiRes.json();
        const serviziData = await serviziRes.json();
        
        setClienti(clientiData);
        setServizi(serviziData);
      } catch (err: any) {
        setError(err.message || 'Errore durante il caricamento dei dati');
      }
    };
    
    fetchData();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const aggiungiDettaglio = () => {
    setDettagli(prev => [
      ...prev,
      {
        servizio_id: '',
        descrizione: '',
        quantita: 1,
        prezzo_unitario: 0,
        totale: 0,
        is_custom: false
      }
    ]);
  };
  
  const rimuoviDettaglio = (index: number) => {
    setDettagli(prev => prev.filter((_, i) => i !== index));
    calcolaTotale();
  };
  
  const handleDettaglioChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setDettagli(prev => {
      const nuoviDettagli = [...prev];
      
      if (name === 'servizio_id') {
        if (value === 'custom') {
          // Servizio personalizzato
          nuoviDettagli[index] = {
            ...nuoviDettagli[index],
            servizio_id: 'custom',
            descrizione: '',
            prezzo_unitario: 0,
            totale: 0,
            is_custom: true
          };
        } else if (value) {
          // Servizio esistente
          const servizio = servizi.find(s => s.id === value);
          if (servizio) {
            nuoviDettagli[index] = {
              ...nuoviDettagli[index],
              servizio_id: value,
              descrizione: servizio.descrizione || '',
              prezzo_unitario: servizio.prezzo || 0,
              totale: (servizio.prezzo || 0) * (nuoviDettagli[index].quantita || 1),
              is_custom: false
            };
          }
        } else {
          // Nessun servizio selezionato
          nuoviDettagli[index] = {
            ...nuoviDettagli[index],
            servizio_id: '',
            descrizione: '',
            prezzo_unitario: 0,
            totale: 0,
            is_custom: false
          };
        }
      } else if (name === 'quantita') {
        const quantita = parseFloat(value) || 0;
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          quantita,
          totale: quantita * (nuoviDettagli[index].prezzo_unitario || 0)
        };
      } else if (name === 'prezzo_unitario') {
        const prezzo = parseFloat(value) || 0;
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          prezzo_unitario: prezzo,
          totale: prezzo * (nuoviDettagli[index].quantita || 1)
        };
      } else {
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          [name]: value || ''
        };
      }
      
      return nuoviDettagli;
    });
    
    calcolaTotale();
  };
  
  const calcolaTotale = () => {
    const totale = dettagli.reduce((sum, item) => sum + (item.totale || 0), 0);
    setFormData(prev => ({
      ...prev,
      importo_totale: totale
    }));
  };
  
  useEffect(() => {
    calcolaTotale();
  }, [dettagli]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (dettagli.length === 0) {
      setError('Aggiungi almeno un servizio al preventivo');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepara i dettagli per l'invio, gestendo i servizi personalizzati
      const dettagliToSend = dettagli.map(dettaglio => {
        if (dettaglio.is_custom) {
          // Per i servizi personalizzati, non inviamo servizio_id
          const { is_custom, ...rest } = dettaglio;
          return {
            ...rest,
            servizio_id: 'custom', // Sarà convertito a null nell'API
            importo: dettaglio.totale // Mappiamo totale a importo per il database
          };
        }
        // Per i servizi normali, inviamo tutto
        const { is_custom, ...rest } = dettaglio;
        return {
          ...rest,
          importo: dettaglio.totale // Mappiamo totale a importo per il database
        };
      });
      
      // Crea il preventivo
      const preventivoResponse = await fetch('/api/preventivi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dettagli: dettagliToSend
        }),
      });
      
      if (!preventivoResponse.ok) {
        const errorData = await preventivoResponse.json();
        throw new Error(errorData.message || 'Si è verificato un errore durante la creazione del preventivo');
      }
      
      router.push(`/${locale}/admin/preventivi`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante la creazione del preventivo');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Funzione per aprire il modale di modifica descrizione
  const openDescriptionModal = (index: number) => {
    setCurrentEditIndex(index);
    setModalText(dettagli[index].descrizione || '');
    setModalOpen(true);
  };
  
  // Funzione per salvare la descrizione dal modale
  const saveModalDescription = () => {
    if (currentEditIndex !== null) {
      handleDettaglioChange(currentEditIndex, {
        target: {
          name: 'descrizione',
          value: modalText
        }
      } as React.ChangeEvent<HTMLTextAreaElement>);
      setModalOpen(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuovo Preventivo</h1>
        <Link
          href={`/${locale}/admin/preventivi`}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annulla
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente <span className="text-red-500">*</span>
              </label>
              <select
                id="cliente_id"
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Seleziona un cliente</option>
                {clienti.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} {cliente.cognome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                Numero Preventivo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Il numero preventivo viene generato automaticamente</p>
            </div>
            
            <div>
              <label htmlFor="data_emissione" className="block text-sm font-medium text-gray-700 mb-1">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="data_emissione"
                name="data_emissione"
                value={formData.data_emissione}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="data_scadenza" className="block text-sm font-medium text-gray-700 mb-1">
                Scadenza <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="data_scadenza"
                name="data_scadenza"
                value={formData.data_scadenza}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="stato" className="block text-sm font-medium text-gray-700 mb-1">
                Stato <span className="text-red-500">*</span>
              </label>
              <select
                id="stato"
                name="stato"
                value={formData.stato}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="in attesa">In attesa</option>
                <option value="approvato">Approvato</option>
                <option value="rifiutato">Rifiutato</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="valuta" className="block text-sm font-medium text-gray-700 mb-1">
                Valuta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="valuta"
                name="valuta"
                value="CHF"
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">I preventivi possono essere emessi solo in Franchi Svizzeri (CHF)</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Dettagli Preventivo</h3>
              <button
                type="button"
                onClick={aggiungiDettaglio}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-100"
              >
                Aggiungi Servizio
              </button>
            </div>
            
            {dettagli.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nessun servizio aggiunto. Clicca su "Aggiungi Servizio" per iniziare.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servizio
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrizione
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantità
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prezzo Unitario
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totale
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dettagli.map((dettaglio, index) => (
                      <tr key={index}>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <select
                            name="servizio_id"
                            value={dettaglio.servizio_id || ''}
                            onChange={(e) => handleDettaglioChange(index, e)}
                            required
                            className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">Seleziona un servizio</option>
                            <option value="custom" className="font-medium text-indigo-600">Servizio personalizzato</option>
                            <optgroup label="Servizi disponibili">
                              {servizi.map(servizio => (
                                <option key={servizio.id} value={servizio.id}>
                                  {servizio.nome}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <div className="relative">
                            <textarea
                              name="descrizione"
                              value={dettaglio.descrizione || ''}
                              onChange={(e) => handleDettaglioChange(index, e)}
                              placeholder={dettaglio.is_custom ? "Inserisci descrizione personalizzata" : ""}
                              rows={3}
                              className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y min-h-[70px]"
                            />
                            <button
                              type="button"
                              onClick={() => openDescriptionModal(index)}
                              className="absolute bottom-2 right-2 p-1 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                              title="Modifica in modalità ampia"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="quantita"
                            value={dettaglio.quantita || 1}
                            onChange={(e) => handleDettaglioChange(index, e)}
                            min="1"
                            step="1"
                            required
                            className="block w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">{formData.valuta}</span>
                            <input
                              type="number"
                              name="prezzo_unitario"
                              value={dettaglio.prezzo_unitario || 0}
                              onChange={(e) => handleDettaglioChange(index, e)}
                              min="0"
                              step="0.01"
                              required
                              className="block w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formData.valuta} {(dettaglio.totale || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => rimuoviDettaglio(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Rimuovi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                        Totale:
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formData.valuta} {formData.importo_totale.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              value={formData.note}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Aggiungi eventuali note o condizioni per il preventivo..."
            />
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva Preventivo'}
          </button>
        </div>
      </form>

      {/* Modale per modifica descrizione */}
      {modalOpen && currentEditIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Modifica descrizione</h3>
            </div>
            <div className="p-4">
              <textarea
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                placeholder="Inserisci una descrizione dettagliata..."
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={saveModalDescription}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Salva descrizione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 