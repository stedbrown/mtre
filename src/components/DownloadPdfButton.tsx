'use client';

import { useState } from 'react';

interface DownloadPdfButtonProps {
  id: string;
  type: 'preventivo' | 'fattura';
  numero: string;
  className?: string;
}

export default function DownloadPdfButton({ id, type, numero, className }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Chiamata all'API per generare il PDF
      const response = await fetch(`/api/${type === 'preventivo' ? 'preventivi' : 'fatture'}/${id}/pdf`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Si è verificato un errore durante la generazione del PDF`);
      }
      
      // Ottieni il blob del PDF
      const blob = await response.blob();
      
      // Crea un URL per il blob
      const url = window.URL.createObjectURL(blob);
      
      // Crea un elemento <a> per scaricare il file
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type === 'preventivo' ? 'Preventivo' : 'Fattura'}_${numero}.pdf`;
      
      // Aggiungi l'elemento al DOM e simula il click
      document.body.appendChild(a);
      a.click();
      
      // Pulisci
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Errore durante il download del PDF:', err);
      alert(err.message || `Si è verificato un errore durante la generazione del PDF`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`${className} ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isGenerating ? 'Generazione PDF...' : 'Scarica PDF'}
    </button>
  );
} 