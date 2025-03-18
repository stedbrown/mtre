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

// Funzione di debug per stampare informazioni dettagliate sulla richiesta
function debugRequest(request: NextRequest) {
  const cookieNames = request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`).join('; ');
  
  console.log(`
=== DEBUG MIDDLEWARE ===
URL: ${request.url}
Pathname: ${request.nextUrl.pathname}
Locale: ${request.nextUrl.locale || 'none'}
Cookies: ${cookieNames || 'none'}
User-Agent: ${request.headers.get('user-agent')?.substring(0, 50) || 'none'}
Referer: ${request.headers.get('referer') || 'none'}
===================
  `);
}

// Funzione per verificare se un utente è autenticato
function isUserAuthenticated(request: NextRequest): boolean {
  // Verifica il cookie di autenticazione di Supabase
  const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
  const hasAuthCookie = !!authCookie?.value;
  
  // Log per debug
  console.log(`[Middleware] Auth check:`, {
    hasAuthCookie,
    cookieValue: hasAuthCookie ? 'Present (not shown)' : 'Missing',
    url: request.nextUrl.pathname
  });
  
  return hasAuthCookie;
}

export async function middleware(request: NextRequest) {
  // Log per debug
  debugRequest(request);
  
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Processing: ${pathname}`);
  
  // Verifica se è una pagina di login con o senza locale
  const isLoginPage = pathname === '/admin/login' || 
                     pathname === '/it/admin/login' || 
                     pathname.endsWith('/admin/login');
  
  if (isLoginPage) {
    // Per le pagine di login, controlla se l'utente è già autenticato
    const isAuthenticated = isUserAuthenticated(request);
    
    if (isAuthenticated) {
      // Se è già autenticato, reindirizza alla dashboard
      console.log(`[Middleware] User already authenticated, redirecting to dashboard`);
      return NextResponse.redirect(new URL(`/${defaultLocale}/admin/dashboard`, request.url));
    }
    
    // Se non è autenticato e la pagina è /admin/login (senza locale), reindirizza con locale
    if (pathname === '/admin/login') {
      console.log(`[Middleware] Redirecting /admin/login to /${defaultLocale}/admin/login`);
      return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, request.url));
    }
    
    // Altrimenti permetti l'accesso diretto
    console.log(`[Middleware] Allowing access to login page: ${pathname}`);
    return NextResponse.next();
  }
  
  // Verifica se il percorso contiene già un locale valido
  const hasValidLocale = locales.some(locale => pathname.startsWith(`/${locale}/`));
  
  // === GESTIONE PERCORSI SENZA LOCALE ===
  
  // Redirect da /admin alla dashboard con locale
  if ((pathname === '/admin' || pathname === '/admin/') && !hasValidLocale) {
    console.log(`[Middleware] Redirecting /admin to /${defaultLocale}/admin/dashboard`);
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/dashboard`, request.url));
  }
  
  // === VERIFICA AUTENTICAZIONE ===
  
  // Verifica autenticazione per tutte le pagine admin (tranne login)
  if (pathname.includes('/admin/') && !pathname.includes('/admin/login')) {
    const isAuthenticated = isUserAuthenticated(request);
    
    if (!isAuthenticated) {
      // Se non è autenticato, reindirizza alla pagina di login
      const localeToUse = hasValidLocale ? pathname.split('/')[1] : defaultLocale;
      console.log(`[Middleware] Not authenticated, redirecting to login page with locale: ${localeToUse}`);
      return NextResponse.redirect(new URL(`/${localeToUse}/admin/login`, request.url));
    }
  }
  
  // === GESTIONE DEFAULT ===
  
  // Per tutti gli altri percorsi, usa il middleware intl standard
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 