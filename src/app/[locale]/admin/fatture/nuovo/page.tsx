'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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

interface DettaglioFattura {
  id?: string;
  servizio_id: string;
  descrizione: string;
  quantita: number;
  prezzo_unitario: number;
  totale: number;
}

export default function NuovaFatturaPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [servizi, setServizi] = useState<Servizio[]>([]);
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    data: new Date().toISOString().split('T')[0],
    scadenza: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    numero: `F-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    stato: 'emessa',
    note: '',
    importo_totale: 0,
    valuta: 'CHF'
  });
  
  const [dettagli, setDettagli] = useState<DettaglioFattura[]>([]);
  
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
        totale: 0
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
        const servizio = servizi.find(s => s.id === value);
        if (servizio) {
          nuoviDettagli[index] = {
            ...nuoviDettagli[index],
            servizio_id: value,
            descrizione: servizio.descrizione,
            prezzo_unitario: servizio.prezzo,
            totale: servizio.prezzo * nuoviDettagli[index].quantita
          };
        }
      } else if (name === 'quantita') {
        const quantita = parseFloat(value) || 0;
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          quantita,
          totale: quantita * nuoviDettagli[index].prezzo_unitario
        };
      } else if (name === 'prezzo_unitario') {
        const prezzo = parseFloat(value) || 0;
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          prezzo_unitario: prezzo,
          totale: prezzo * nuoviDettagli[index].quantita
        };
      } else {
        nuoviDettagli[index] = {
          ...nuoviDettagli[index],
          [name]: value
        };
      }
      
      return nuoviDettagli;
    });
    
    calcolaTotale();
  };
  
  const calcolaTotale = () => {
    const totale = dettagli.reduce((sum, item) => sum + item.totale, 0);
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
      setError('Aggiungi almeno un servizio alla fattura');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Crea la fattura
      const fatturaResponse = await fetch('/api/fatture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dettagli
        }),
      });
      
      if (!fatturaResponse.ok) {
        const errorData = await fatturaResponse.json();
        throw new Error(errorData.message || 'Si è verificato un errore durante la creazione della fattura');
      }
      
      router.push(`/${locale}/admin/fatture`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante la creazione della fattura');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuova Fattura</h1>
        <Link
          href={`/${locale}/admin/fatture`}
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
                Numero Fattura <span className="text-red-500">*</span>
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
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Data <span className="text-red-500">*</span>
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
              <label htmlFor="scadenza" className="block text-sm font-medium text-gray-700 mb-1">
                Scadenza <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="scadenza"
                name="scadenza"
                value={formData.scadenza}
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
                <option value="emessa">Emessa</option>
                <option value="pagata">Pagata</option>
                <option value="scaduta">Scaduta</option>
                <option value="annullata">Annullata</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="valuta" className="block text-sm font-medium text-gray-700 mb-1">
                Valuta <span className="text-red-500">*</span>
              </label>
              <select
                id="valuta"
                name="valuta"
                value={formData.valuta}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Dettagli Fattura</h3>
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
                            value={dettaglio.servizio_id}
                            onChange={(e) => handleDettaglioChange(index, e)}
                            required
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
                          {formData.valuta} {dettaglio.totale.toFixed(2)}
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
              placeholder="Aggiungi eventuali note o condizioni per la fattura..."
            />
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva Fattura'}
          </button>
        </div>
      </form>
    </div>
  );
} 