'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const router = useRouter();
  
  // Crea client Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const addDebugMessage = (message: string) => {
    console.log(message);
    setDebugMessages(prev => [...prev, message]);
  };
  
  // Check for existing session on page load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        addDebugMessage('[LoginPage] Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          addDebugMessage(`[LoginPage] Error checking session: ${error.message}`);
          return;
        }
        
        if (data.session) {
          addDebugMessage('[LoginPage] Found existing session, redirecting to dashboard');
          router.push(`/${locale}/admin/dashboard`);
        } else {
          addDebugMessage('[LoginPage] No existing session found');
        }
      } catch (err: any) {
        addDebugMessage(`[LoginPage] Session check error: ${err.message}`);
      }
    };
    
    checkExistingSession();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      addDebugMessage(`[LoginPage] Attempting login for: ${email}`);
      
      // Clear any existing cookies to avoid conflicts
      document.cookie = 'sb-pehacdouexhebskdbpxp-auth-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      document.cookie = 'sb-access-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      document.cookie = 'sb-refresh-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      
      // Esegui il login con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.session) {
        throw new Error('Nessuna sessione creata');
      }
      
      addDebugMessage('[LoginPage] Login successful, session created');
      
      // Salva il token manualmente in localStorage per avere un backup
      localStorage.setItem('mtre-auth-token', data.session.access_token);
      localStorage.setItem('mtre-refresh-token', data.session.refresh_token);
      localStorage.setItem('mtre-user-email', data.user?.email || '');
      
      addDebugMessage('[LoginPage] Tokens stored in localStorage');
      
      // Imposta un cookie per indicare il successo dell'operazione (aiuta con il debugging)
      document.cookie = `mtre-login-success=true; path=/; max-age=${60*60*24*30}; secure; samesite=lax`;
      
      addDebugMessage('[LoginPage] Debug cookie set, redirecting to dashboard...');
      
      // Reindirizza alla dashboard
      router.push(`/${locale}/admin/dashboard`);
    } catch (err: any) {
      console.error('[LoginPage] Login error:', err);
      setError(err.message || 'Errore durante il login');
      addDebugMessage(`[LoginPage] Login error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold">M.T.R.E. Admin</h1>
          <p className="mt-2 text-gray-600">Accedi all'area amministrativa</p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-md rounded-lg">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </button>
            </div>
          </form>
          
          {debugMessages.length > 0 && (
            <div className="mt-6 p-3 bg-gray-50 rounded-md text-xs font-mono text-gray-600 max-h-40 overflow-y-auto">
              <h3 className="font-bold mb-1">Debug Log:</h3>
              {debugMessages.map((msg, idx) => (
                <div key={idx} className="mb-1">{msg}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 