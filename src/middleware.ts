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
  const { pathname } = request.nextUrl;
  
  // LOG
  console.log(`REQUEST PATH: ${pathname}`);
  
  // 1. Gestione esplicita della pagina di login - DEVE VENIRE PRIMA DI TUTTO
  if (pathname === '/admin/login' || pathname.endsWith('/admin/login')) {
    console.log('LOGIN PAGE DETECTED - ALLOWING ACCESS');
    return intlMiddleware(request);
  }
  
  // 2. Gestione di /admin senza locale
  if (pathname === '/admin' || pathname === '/admin/') {
    const redirectUrl = new URL(`/${defaultLocale}/admin/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // 3. Se è un percorso admin (ma non la pagina di login che è già stata gestita)
  if (pathname.includes('/admin/')) {
    // Verifica autenticazione
    const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
    const isAuthenticated = !!authCookie?.value;
    
    if (!isAuthenticated) {
      // Reindirizza al login con il locale corretto
      const locale = request.nextUrl.locale || defaultLocale;
      const redirectUrl = new URL(`/${locale}/admin/login`, request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // 4. In tutti gli altri casi, applica solo il middleware di internazionalizzazione
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 