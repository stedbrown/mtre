'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { useRouter, usePathname } from 'next/navigation';

export default function GestisciUtentiPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  const supabase = createClient();
  
  // Verifica dell'autenticazione
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setIsAuthenticated(false);
          const locale = pathname.split('/')[1];
          router.push(`/${locale}/admin/login?redirectTo=${pathname}`);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        const locale = pathname.split('/')[1];
        router.push(`/${locale}/admin/login?redirectTo=${pathname}`);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, [router, pathname]);
  
  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Crea un nuovo utente con Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(`Utente ${email} creato con successo`);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Errore durante la creazione dell\'utente:', err);
      setError(err.message || 'Si è verificato un errore durante la creazione dell\'utente');
    } finally {
      setIsLoading(false);
    }
  }
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">Accesso negato</h1>
        <p>Non hai i permessi per accedere a questa pagina.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Utenti</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crea nuovi utenti amministratori
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aggiungi nuovo amministratore</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>{success}</p>
          </div>
        )}
        
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              La password deve essere lunga almeno 8 caratteri
            </p>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'Creazione in corso...' : 'Crea utente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 