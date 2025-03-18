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

// Funzione per stampare i log nei Response Headers per debug
function createDebugResponse(request: NextRequest, message: string) {
  const headers = new Headers();
  headers.set('x-debug-url', request.url);
  headers.set('x-debug-path', request.nextUrl.pathname);
  headers.set('x-debug-message', message);
  
  // Aggiunge tutti i cookie per debug
  request.cookies.getAll().forEach(cookie => {
    headers.set(`x-cookie-${cookie.name}`, cookie.value.substring(0, 30) + '...');
  });
  
  const response = NextResponse.next({ headers });
  
  // Anche se ridirezionati, manteniamo i debug headers
  if (message.includes('redirect')) {
    const locale = request.nextUrl.locale || defaultLocale;
    const redirectUrl = new URL(`/${locale}/admin/login`, request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    headers.forEach((value, key) => {
      redirectResponse.headers.set(key, value);
    });
    
    return redirectResponse;
  }
  
  return response;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  console.log(`[Middleware] Processing: ${pathname}`);
  
  // CASO SPECIALE: tratta la pagina di login come un caso completamente separato
  // Controlla esplicitamente tutti i percorsi possibili di login
  if (
    pathname === '/admin/login' || 
    pathname === '/it/admin/login' || 
    pathname === '/en/admin/login' ||
    pathname.endsWith('/admin/login')
  ) {
    console.log(`[Middleware] Login page detected: ${pathname} - ALLOWING ACCESS`);
    return intlMiddleware(request);
  }
  
  // Se l'utente accede a /admin o /admin/ senza locale, reindirizza a /{locale}/admin/dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    url.pathname = `/${defaultLocale}/admin/dashboard`;
    return NextResponse.redirect(url);
  }
  
  // Per tutti gli altri percorsi /admin/* (eccetto login che è già stato gestito)
  if (pathname.includes('/admin/')) {
    // Verifica se l'utente è autenticato
    const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
    const isAuthenticated = !!authCookie?.value;
    
    // Se non è autenticato, reindirizza alla pagina di login
    if (!isAuthenticated) {
      const locale = url.locale || defaultLocale;
      url.pathname = `/${locale}/admin/login`;
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Per tutte le altre pagine, applica solo il middleware di internazionalizzazione
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 