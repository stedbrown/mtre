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
  console.log(`
=== DEBUG MIDDLEWARE ===
URL: ${request.url}
Pathname: ${request.nextUrl.pathname}
Locale: ${request.nextUrl.locale || 'none'}
Cookies: ${request.cookies.getAll().map(c => c.name).join(', ') || 'none'}
User-Agent: ${request.headers.get('user-agent') || 'none'}
Referer: ${request.headers.get('referer') || 'none'}
===================
  `);
}

export async function middleware(request: NextRequest) {
  // Log per debug
  debugRequest(request);
  
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Processing: ${pathname}`);
  
  // Disattiva temporaneamente il redirect per la pagina di login
  if (pathname === '/it/admin/login' || pathname === '/admin/login') {
    console.log(`[Middleware] Login page accessed: ${pathname} - ALLOWING DIRECT ACCESS`);
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
  
  // === GESTIONE PAGINA DI LOGIN ===
  
  // Consenti accesso diretto alla pagina di login con locale
  if (pathname.includes('/admin/login')) {
    console.log(`[Middleware] Login page accessed: ${pathname} - ALLOWING ACCESS`);
    if (!hasValidLocale) {
      // Se non ha un locale valido, aggiungi il locale predefinito
      return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, request.url));
    }
    return NextResponse.next();
  }
  
  // === VERIFICA AUTENTICAZIONE ===
  
  // Verifica autenticazione per tutte le pagine admin (tranne login)
  if (pathname.includes('/admin/') && !pathname.includes('/admin/login')) {
    const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
    const isAuthenticated = !!authCookie?.value;
    console.log(`[Middleware] Auth check: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    
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