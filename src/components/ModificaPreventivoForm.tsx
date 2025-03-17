'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

// Definizione dei tipi
interface Cliente {
  id: string;
  nome: string;
  cognome?: string;
}

interface Servizio {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: number;
}

interface DettaglioPreventivo {
  id?: string;
  preventivo_id?: string;
  servizio_id?: string;
  descrizione: string;
  quantita: number;
  prezzo_unitario: number;
  importo: number;
}

interface Preventivo {
  id: string;
  numero: string;
  data: string;
  data_scadenza?: string;
  cliente_id: string;
  importo_totale: number;
  stato: 'approvato' | 'in_attesa' | 'rifiutato' | 'scaduto';
  note?: string;
  valuta: string;
  cliente?: {
    id: string;
    nome: string;
    cognome?: string;
  };
}

interface ModificaPreventivoFormProps {
  preventivo: Preventivo;
  dettagli: DettaglioPreventivo[];
  clienti: Cliente[];
  servizi: Servizio[];
  locale: string;
}

export default function ModificaPreventivoForm({ preventivo, dettagli, clienti, servizi, locale }: ModificaPreventivoFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<Omit<Preventivo, 'id' | 'cliente'>>({
    numero: preventivo.numero,
    data: preventivo.data,
    data_scadenza: preventivo.data_scadenza || '',
    cliente_id: preventivo.cliente_id,
    importo_totale: preventivo.importo_totale,
    stato: preventivo.stato,
    note: preventivo.note || '',
    valuta: preventivo.valuta || '€',
  });
  
  const [dettagliForm, setDettagliForm] = useState<DettaglioPreventivo[]>(
    dettagli.length > 0 
      ? dettagli 
      : [{ descrizione: '', quantita: 1, prezzo_unitario: 0, importo: 0 }]
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Calcola il totale ogni volta che i dettagli cambiano
  useEffect(() => {
    calcolaTotale();
  }, [dettagliForm]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDettaglioChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setDettagliForm(prev => {
      const nuoviDettagli = [...prev];
      
      if (name === 'servizio_id') {
        const servizio = servizi.find(s => s.id === value);
        if (servizio) {
          nuoviDettagli[index] = {
            ...nuoviDettagli[index],
            servizio_id: value,
            descrizione: servizio.descrizione,
            prezzo_unitario: servizio.prezzo,
            importo: servizio.prezzo * nuoviDettagli[index].quantita
          };
        }
      } else if (name === 'quantita') {
        const quantita = parseFloat(value) || 0;
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          quantita,
          importo: quantita * nuoviDettagli[index].prezzo_unitario
        };
      } else if (name === 'prezzo_unitario') {
        const prezzo = parseFloat(value) || 0;
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          prezzo_unitario: prezzo,
          importo: prezzo * nuoviDettagli[index].quantita
        };
      } else {
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          [name]: value
        };
      }
      
      return nuoviDettagli;
    });
  };
  
  const aggiungiDettaglio = () => {
    setDettagliForm(prev => [
      ...prev,
      {
        servizio_id: '',
        descrizione: '',
        quantita: 1,
        prezzo_unitario: 0,
        importo: 0
      }
    ]);
  };
  
  const rimuoviDettaglio = (index: number) => {
    if (dettagliForm.length === 1) {
      setError('Devi avere almeno un dettaglio nel preventivo');
      return;
    }
    
    setDettagliForm(prev => prev.filter((_, i) => i !== index));
  };
  
  const calcolaTotale = () => {
    const totale = dettagliForm.reduce((sum, item) => sum + item.importo, 0);
    setFormData(prev => ({
      ...prev,
      importo_totale: totale
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validazione
      if (!formData.numero || !formData.data || !formData.cliente_id) {
        throw new Error('Compila tutti i campi obbligatori');
      }
      
      if (dettagliForm.some(d => !d.descrizione || d.quantita <= 0 || d.prezzo_unitario <= 0)) {
        throw new Error('Verifica che tutti i dettagli abbiano descrizione, quantità e prezzo validi');
      }
      
      // Prima aggiorna il preventivo
      const preventivoPatch = {
        numero: formData.numero,
        data: formData.data,
        data_scadenza: formData.data_scadenza || null,
        cliente_id: formData.cliente_id,
        importo_totale: formData.importo_totale,
        stato: formData.stato,
        note: formData.note || null,
        valuta: formData.valuta
      };
      
      const response = await fetch(`/api/preventivi/${preventivo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preventivoPatch),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore durante l'aggiornamento del preventivo");
      }
      
      // Ora gestisci i dettagli - prima eliminando quelli esistenti
      const deleteResponse = await fetch(`/api/preventivi/${preventivo.id}/dettagli`, {
        method: 'DELETE',
      });
      
      if (!deleteResponse.ok) {
        throw new Error('Errore durante l\'eliminazione dei dettagli esistenti');
      }
      
      // Poi crea i nuovi dettagli
      const dettagliToCreate = dettagliForm.map(d => ({
        preventivo_id: preventivo.id,
        servizio_id: d.servizio_id || null,
        descrizione: d.descrizione,
        quantita: d.quantita,
        prezzo_unitario: d.prezzo_unitario,
        importo: d.importo
      }));
      
      const createResponse = await fetch(`/api/preventivi/${preventivo.id}/dettagli`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dettagliToCreate),
      });
      
      if (!createResponse.ok) {
        throw new Error('Errore durante la creazione dei nuovi dettagli');
      }
      
      setSuccess(true);
      
      // Reindirizza alla pagina di dettaglio del preventivo
      setTimeout(() => {
        router.push(`/${locale}/admin/preventivi/${preventivo.id}`);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Preventivo aggiornato con successo! Sarai reindirizzato a breve...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informazioni preventivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
              Numero preventivo *
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
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
                  {`${cliente.nome} ${cliente.cognome || ''}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
              Data emissione *
            </label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="data_scadenza" className="block text-sm font-medium text-gray-700 mb-1">
              Data scadenza
            </label>
            <input
              type="date"
              id="data_scadenza"
              name="data_scadenza"
              value={formData.data_scadenza}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="stato" className="block text-sm font-medium text-gray-700 mb-1">
              Stato *
            </label>
            <select
              id="stato"
              name="stato"
              value={formData.stato}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="in_attesa">In attesa</option>
              <option value="approvato">Approvato</option>
              <option value="rifiutato">Rifiutato</option>
              <option value="scaduto">Scaduto</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="valuta" className="block text-sm font-medium text-gray-700 mb-1">
              Valuta
            </label>
            <select
              id="valuta"
              name="valuta"
              value={formData.valuta}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="€">Euro (€)</option>
              <option value="$">Dollaro USA ($)</option>
              <option value="£">Sterlina (£)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Dettagli preventivo</h2>
          <button
            type="button"
            onClick={aggiungiDettaglio}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Aggiungi voce
          </button>
        </div>
        
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
                  Prezzo
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Totale
                </th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dettagliForm.map((dettaglio, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      name="servizio_id"
                      value={dettaglio.servizio_id || ''}
                      onChange={(e) => handleDettaglioChange(index, e)}
                      className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Seleziona un servizio</option>
                      {servizi.map(servizio => (
                        <option key={servizio.id} value={servizio.id}>
                          {servizio.nome}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-4">
                    <input
                      type="text"
                      name="descrizione"
                      value={dettaglio.descrizione}
                      onChange={(e) => handleDettaglioChange(index, e)}
                      required
                      placeholder="Descrizione"
                      className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="quantita"
                      value={dettaglio.quantita}
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
                        value={dettaglio.prezzo_unitario}
                        onChange={(e) => handleDettaglioChange(index, e)}
                        min="0"
                        step="0.01"
                        required
                        className="block w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formData.valuta} {dettaglio.importo.toFixed(2)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <button
                      type="button"
                      onClick={() => rimuoviDettaglio(index)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-3 py-4 text-right text-sm font-medium text-gray-900">
                  Totale preventivo
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formData.valuta} {formData.importo_totale.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Note</h2>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Aggiungi eventuali note al preventivo..."
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/preventivi/${preventivo.id}`)}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Salvataggio in corso...' : 'Salva modifiche'}
        </button>
      </div>
    </form>
  );
} 