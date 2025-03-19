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
  const pathname = usePathname();
  const router = useRouter();
  
  const supabase = createClient();

  const checkAuth = async () => {
    try {
      console.log('[AdminLayoutClient] Checking authentication status...');
      
      // Verifica la sessione con Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session) {
        console.log('[AdminLayoutClient] User authenticated');
        setIsAuthenticated(true);
        setUserEmail(session.user?.email || null);
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
    }
  };

  useEffect(() => {
    // Verifica l'autenticazione all'avvio
    checkAuth();
    
    // Ascolta i cambiamenti di stato dell'autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AdminLayoutClient] Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserEmail(session.user?.email || null);
        setAuthError(null);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });
    
    // Pulizia
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('[AdminLayoutClient] Logging out...');
      await supabase.auth.signOut();
      
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