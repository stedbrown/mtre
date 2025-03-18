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
  
  // IMPORTANTE: bypass speciale per accesso diretto alla pagina di login
  // Questo permette di accedere alla pagina di login senza autenticazione
  // sia con /it/admin/login che con /en/admin/login che con /admin/login
  const isLoginPage = pathname === '/admin/login' || 
    pathname === '/it/admin/login' || 
    pathname === '/en/admin/login' ||
    pathname.endsWith('/admin/login');
  
  if (isLoginPage) {
    console.log(`[Middleware] Login page directly accessed: ${pathname} - ALLOWING ACCESS`);
    return intlMiddleware(request);
  }
  
  // Gestisci i percorsi /admin senza locale
  if (pathname === '/admin' || pathname === '/admin/') {
    console.log(`[Middleware] Redirecting from /admin/ to /${defaultLocale}/admin/dashboard`);
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/dashboard`, request.url));
  }
  
  // Gestisci altri percorsi /admin/* senza locale
  if (pathname.startsWith('/admin/') && !isLoginPage) {
    const subPath = pathname.slice(7); // rimuove '/admin/'
    console.log(`[Middleware] Redirecting from /admin/${subPath} to /${defaultLocale}/admin/${subPath}`);
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/${subPath}`, request.url));
  }
  
  // Verifica autenticazione solo per percorsi /{locale}/admin/* (ma non login)
  if (pathname.includes('/admin/') && !isLoginPage) {
    // Verifica se l'utente è autenticato
    const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
    const isAuthenticated = !!authCookie?.value;
    console.log(`[Middleware] Auth check for ${pathname}: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    
    if (!isAuthenticated) {
      // Ottieni il locale dall'URL
      const parts = pathname.split('/');
      const localeFromPath = parts[1] || '';
      
      // Verifica se il locale è supportato, altrimenti usa quello di default
      const locale = locales.includes(localeFromPath as any) 
        ? localeFromPath 
        : defaultLocale;
      
      // Previeni redirect loop controllando se siamo già in un ciclo di redirect
      const url = new URL(request.url);
      const isRedirectLoop = url.searchParams.has('redirectTo') && 
                             url.searchParams.get('redirectTo')?.includes('/admin/');
      
      if (isRedirectLoop) {
        console.log(`[Middleware] Detected redirect loop, forcing to login page without params`);
        return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
      }
      
      const redirectUrl = new URL(`/${locale}/admin/login`, request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      
      console.log(`[Middleware] Redirecting to login: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // Per tutti gli altri percorsi
  console.log(`[Middleware] Passing to intl middleware: ${pathname}`);
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 