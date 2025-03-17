'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function NuovoServizioPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [formData, setFormData] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    unita: 'ora', // Default: ora
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validazione
      if (!formData.nome || !formData.prezzo) {
        throw new Error('Nome e prezzo sono obbligatori');
      }
      
      // Converti il prezzo in numero
      const prezzo = parseFloat(formData.prezzo);
      if (isNaN(prezzo) || prezzo <= 0) {
        throw new Error('Il prezzo deve essere un numero positivo');
      }
      
      // Invia i dati all'API
      const response = await fetch('/api/servizi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          prezzo: prezzo,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante la creazione del servizio');
      }
      
      // Reindirizza alla lista dei servizi
      router.push(`/${locale}/admin/servizi`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nuovo Servizio</h1>
        <Link 
          href={`/${locale}/admin/servizi`}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Torna alla lista
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="descrizione" className="block text-gray-700 font-medium mb-2">
            Descrizione
          </label>
          <textarea
            id="descrizione"
            name="descrizione"
            value={formData.descrizione}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="prezzo" className="block text-gray-700 font-medium mb-2">
              Prezzo *
            </label>
            <input
              type="number"
              id="prezzo"
              name="prezzo"
              value={formData.prezzo}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="unita" className="block text-gray-700 font-medium mb-2">
              Unità
            </label>
            <select
              id="unita"
              name="unita"
              value={formData.unita}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ora">Ora</option>
              <option value="giorno">Giorno</option>
              <option value="pezzo">Pezzo</option>
              <option value="forfait">Forfait</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva Servizio'}
          </button>
        </div>
      </form>
    </div>
  );
} 