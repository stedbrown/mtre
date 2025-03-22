'use client';

import { useState } from 'react';
import { removeLogo } from './actions';

export default function RemoveLogoButton({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false);
  
  const handleRemoveLogo = async () => {
    if (confirm('Sei sicuro di voler rimuovere il logo?')) {
      setLoading(true);
      await removeLogo(locale);
      setLoading(false);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleRemoveLogo}
      disabled={loading}
      className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {loading ? 'Rimozione...' : 'Rimuovi logo'}
    </button>
  );
} 