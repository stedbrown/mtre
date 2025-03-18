import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/navigation';
import { NextResponse, type NextRequest } from 'next/server';

// Crea il middleware per la gestione delle lingue
const intlMiddleware = createMiddleware({
  // Una lista di tutte le lingue supportate
  locales,
  
  // Se la lingua richiesta non è supportata, viene utilizzata quella predefinita
  defaultLocale,
  
  // Se la lingua predefinita non è presente nell'URL, viene reindirizzato
  localePrefix: 'as-needed',
  
  // Assicura che il locale venga passato correttamente a tutti i componenti
  localeDetection: true
});

export async function middleware(request: NextRequest) {
  // Percorsi che richiedono autenticazione
  const adminPaths = ['/admin'];
  const { pathname } = request.nextUrl;
  
  // Gestione speciale per /admin senza locale
  if (pathname === '/admin' || pathname === '/admin/') {
    const redirectUrl = new URL(`/${defaultLocale}/admin/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Verifica se il percorso richiede autenticazione
  const isAdminPath = adminPaths.some(path => 
    pathname.startsWith(`/${request.nextUrl.locale}${path}`)
  );

  // Determina se il percorso è la pagina di login
  const isLoginPage = pathname.includes('/admin/login');
  
  // Se non è un percorso admin, usa solo il middleware di internazionalizzazione
  if (!isAdminPath) {
    return intlMiddleware(request);
  }
  
  // Per i percorsi admin, verifica l'autenticazione tramite cookie
  const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  
  // Se è la pagina di login, consenti l'accesso indipendentemente dall'autenticazione
  if (isLoginPage) {
    return intlMiddleware(request);
  }
  
  // Se non autenticato e richiede un percorso admin, reindirizza al login
  if (!isAuthenticated && isAdminPath) {
    // Determina il locale corretto
    const locale = request.nextUrl.locale || defaultLocale;
    const redirectUrl = new URL(`/${locale}/admin/login`, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Applica il middleware di internazionalizzazione
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 