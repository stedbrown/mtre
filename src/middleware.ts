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
  
  // IMPORTANTE: Bypass per la pagina di login
  if (pathname.includes('/admin/login')) {
    console.log(`[Middleware] Login page accessed: ${pathname} - ALLOWING ACCESS`);
    return intlMiddleware(request);
  }
  
  // Gestisci i percorsi /admin senza locale - solo redirect di base
  if (pathname === '/admin' || pathname === '/admin/') {
    console.log(`[Middleware] Redirecting from /admin/ to /${defaultLocale}/admin/dashboard`);
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/dashboard`, request.url));
  }
  
  // Gestisci altri percorsi /admin/* senza locale - solo redirect di base
  if (pathname.startsWith('/admin/') && !pathname.includes('/admin/login')) {
    const subPath = pathname.slice(7); // rimuove '/admin/'
    console.log(`[Middleware] Redirecting from /admin/${subPath} to /${defaultLocale}/admin/${subPath}`);
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/${subPath}`, request.url));
  }
  
  // Verifica autenticazione molto semplificata per il percorso /admin/dashboard
  if (pathname.includes('/admin/') && !pathname.includes('/admin/login')) {
    // Verifica se l'utente è autenticato in modo molto basico
    const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
    const isAuthenticated = !!authCookie?.value;
    console.log(`[Middleware] Auth check: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    
    if (!isAuthenticated) {
      // Redirect semplice alla pagina di login senza parametri
      console.log(`[Middleware] Not authenticated, redirecting to basic login`);
      return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, request.url));
    }
  }
  
  // Per tutti gli altri percorsi, usa il middleware intl standard
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 