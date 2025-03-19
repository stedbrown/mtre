'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { 
  FiHome, FiUsers, FiFileText, FiCheckSquare, FiPackage, 
  FiSettings, FiLogOut, FiMenu, FiX, FiRefreshCw
} from 'react-icons/fi';

const montserrat = Montserrat({ subsets: ['latin'] });

// Helper function to read cookie value
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function AdminLayoutClient({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const supabase = createClient();

  const checkAuth = async () => {
    try {
      console.log('[AdminLayoutClient] Checking authentication status...');
      
      // Check for debug cookie
      const loginSuccessCookie = getCookie('mtre-login-success');
      console.log('[AdminLayoutClient] mtre-login-success cookie:', loginSuccessCookie);
      
      // Check for Supabase auth cookie
      const supabaseCookie = getCookie('sb-pehacdouexhebskdbpxp-auth-token');
      console.log('[AdminLayoutClient] Supabase auth cookie present:', !!supabaseCookie);
      
      // Check localStorage first
      const token = localStorage.getItem('mtre-auth-token');
      const userEmailStored = localStorage.getItem('mtre-user-email');
      const hasLocalStorageAuth = !!token;
      
      if (hasLocalStorageAuth) {
        console.log('[AdminLayoutClient] User authenticated via localStorage');
        
        // Try to set the session with the stored token if Supabase session is missing
        if (!supabaseCookie) {
          try {
            const refreshToken = localStorage.getItem('mtre-refresh-token');
            if (refreshToken) {
              console.log('[AdminLayoutClient] Attempting to restore session from localStorage tokens');
              await supabase.auth.setSession({
                access_token: token,
                refresh_token: refreshToken
              });
            }
          } catch (error) {
            console.error('[AdminLayoutClient] Failed to restore session:', error);
          }
        }
        
        setIsAuthenticated(true);
        setUserEmail(userEmailStored);
        setAuthError(null);
        setIsLoading(false);
        return;
      }
      
      // Then check Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('[AdminLayoutClient] Session check:', {
        hasSession: !!session,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        error: sessionError ? sessionError.message : null
      });
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (session) {
        console.log('[AdminLayoutClient] User authenticated via Supabase session');
        
        // Store session in localStorage as backup
        localStorage.setItem('mtre-auth-token', session.access_token);
        localStorage.setItem('mtre-refresh-token', session.refresh_token);
        
        // Get user details
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log('[AdminLayoutClient] User check:', {
          hasUser: !!user,
          email: user?.email || null,
          error: userError ? userError.message : null
        });
        
        if (userError) {
          throw userError;
        }
        
        if (user?.email) {
          localStorage.setItem('mtre-user-email', user.email);
        }
        
        setIsAuthenticated(true);
        setUserEmail(user?.email || null);
        setAuthError(null);
      } else {
        console.log('[AdminLayoutClient] No auth session found');
        setIsAuthenticated(false);
        setUserEmail(null);
        setAuthError('Sessione non trovata');
      }
    } catch (error: any) {
      console.error('[AdminLayoutClient] Authentication error:', error);
      setIsAuthenticated(false);
      setUserEmail(null);
      setAuthError(error.message || 'Errore durante il controllo dell\'autenticazione');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Check authentication on component mount
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AdminLayoutClient] Auth state changed:', event, session ? 'session exists' : 'no session');
      
      if (event === 'SIGNED_IN' && session) {
        // Update localStorage
        localStorage.setItem('mtre-auth-token', session.access_token);
        localStorage.setItem('mtre-refresh-token', session.refresh_token);
        if (session.user?.email) {
          localStorage.setItem('mtre-user-email', session.user.email);
        }
        
        setIsAuthenticated(true);
        setUserEmail(session.user?.email || null);
        setAuthError(null);
      } else if (event === 'SIGNED_OUT') {
        // Clear localStorage
        localStorage.removeItem('mtre-auth-token');
        localStorage.removeItem('mtre-refresh-token');
        localStorage.removeItem('mtre-user-email');
        
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshSession = async () => {
    setRefreshing(true);
    try {
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      await checkAuth();
    } catch (error: any) {
      console.error('[AdminLayoutClient] Error refreshing session:', error);
      setAuthError(`Errore durante l'aggiornamento della sessione: ${error.message}`);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('[AdminLayoutClient] Logging out...');
      await supabase.auth.signOut();
      
      // Clear localStorage
      localStorage.removeItem('mtre-auth-token');
      localStorage.removeItem('mtre-refresh-token');
      localStorage.removeItem('mtre-user-email');
      
      // Manually clear all cookies
      document.cookie = 'sb-pehacdouexhebskdbpxp-auth-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      document.cookie = 'sb-access-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      document.cookie = 'sb-refresh-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      document.cookie = 'mtre-login-success=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
      
      console.log('[AdminLayoutClient] Successfully logged out');
      router.push(`/${locale}/admin/login`);
    } catch (error: any) {
      console.error('[AdminLayoutClient] Logout error:', error);
      alert('Errore durante il logout: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">Accesso richiesto</h1>
          <p className="text-gray-600 mb-6 text-center">
            Devi effettuare l'accesso per visualizzare questa pagina.
          </p>
          {authError && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              <strong>Errore di autenticazione:</strong> {authError}
            </div>
          )}
          <div className="flex flex-col space-y-3 justify-center">
            <form action={`/${locale}/admin/login`} method="get">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Vai al login
              </button>
            </form>
            
            <button
              onClick={refreshSession}
              disabled={refreshing}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <FiRefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Aggiornamento in corso...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2 h-4 w-4" />
                  Aggiorna sessione
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: `/${locale}/admin/dashboard`, icon: FiHome },
    { name: 'Clienti', href: `/${locale}/admin/clienti`, icon: FiUsers },
    { name: 'Preventivi', href: `/${locale}/admin/preventivi`, icon: FiCheckSquare },
    { name: 'Fatture', href: `/${locale}/admin/fatture`, icon: FiFileText },
    { name: 'Servizi', href: `/${locale}/admin/servizi`, icon: FiPackage },
    { name: 'Impostazioni', href: `/${locale}/admin/impostazioni`, icon: FiSettings },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`flex h-screen bg-gray-50 admin-area ${montserrat.className}`}>
      {/* Sidebar per desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">MTRE Admin</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Disconnetti
          </button>
        </div>
      </aside>

      {/* Mobile header and sidebar */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm md:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-blue-600">MTRE Admin</h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">MTRE Admin</h1>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <nav className="py-4">
                <ul className="space-y-1 px-2">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Disconnetti
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 