'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface ConvertToInvoiceButtonProps {
  id: string;
  className?: string;
}

export default function ConvertToInvoiceButton({ id, className }: ConvertToInvoiceButtonProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleConvert = async () => {
    if (isConverting) return;
    
    if (!confirm('Sei sicuro di voler convertire questo preventivo in fattura? Questa azione non può essere annullata.')) {
      return;
    }
    
    setIsConverting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/preventivi/${id}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Si è verificato un errore durante la conversione');
      }
      
      // Mostra un messaggio di successo
      alert(`Preventivo convertito in fattura con successo! Numero fattura: ${data.fattura.numero}`);
      
      // Reindirizza alla pagina della fattura
      router.push(`/${locale}/admin/fatture/${data.fattura.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante la conversione');
      alert(err.message || 'Si è verificato un errore durante la conversione');
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <button
      onClick={handleConvert}
      disabled={isConverting}
      className={`${className} ${isConverting ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isConverting ? 'Conversione...' : 'Converti in Fattura'}
    </button>
  );
} 