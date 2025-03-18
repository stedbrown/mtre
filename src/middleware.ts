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
  const url = request.url;
  
  // Log completo della richiesta
  console.log(`DEBUG - Middleware called for: ${url}`);
  console.log(`DEBUG - Pathname: ${pathname}`);
  console.log(`DEBUG - Locale: ${request.nextUrl.locale || 'none'}`);
  console.log(`DEBUG - Cookies: ${request.cookies.getAll().map(c => c.name).join(', ') || 'none'}`);
  
  // Verifica specifica per la pagina di login con diversi metodi
  const loginPathCheck1 = pathname.includes('/admin/login');
  const loginPathCheck2 = pathname.indexOf('/admin/login') !== -1;
  const loginPathCheck3 = pathname.endsWith('/admin/login');
  const loginPathCheck4 = /\/admin\/login/.test(pathname);
  
  console.log(`DEBUG - Login path checks:
    includes: ${loginPathCheck1}
    indexOf: ${loginPathCheck2}
    endsWith: ${loginPathCheck3}
    regex: ${loginPathCheck4}
    pathname: '${pathname}'
  `);
  
  // Gestione speciale per /admin senza locale
  if (pathname === '/admin' || pathname === '/admin/') {
    console.log('DEBUG - Redirecting from root /admin to dashboard');
    const redirectUrl = new URL(`/${defaultLocale}/admin/dashboard`, request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('x-debug-redirect', 'Root admin to dashboard');
    return response;
  }

  // Determina se il percorso è la pagina di login
  const isLoginPage = pathname.includes('/admin/login');
  console.log('DEBUG - isLoginPage:', isLoginPage);
  
  // Test alternativo specifico per la pagina di login
  if (
    pathname === '/admin/login' || 
    pathname === '/it/admin/login' ||
    pathname === '/en/admin/login' ||
    pathname.endsWith('/admin/login')
  ) {
    console.log('DEBUG - DIRECT LOGIN PAGE MATCH');
    const response = intlMiddleware(request);
    response.headers.set('x-debug-action', 'Direct login page match');
    return response;
  }
  
  // Se è la pagina di login, consenti sempre l'accesso
  if (isLoginPage) {
    console.log('DEBUG - Allowing access to login page');
    const response = intlMiddleware(request);
    response.headers.set('x-debug-action', 'Allow login page');
    return response;
  }

  // Verifica se il percorso richiede autenticazione (tutti i percorsi /admin/ tranne login)
  const isAdminPath = pathname.includes('/admin/');
  console.log('DEBUG - isAdminPath:', isAdminPath);

  // Se non è un percorso admin, usa solo il middleware di internazionalizzazione
  if (!isAdminPath) {
    console.log('DEBUG - Not an admin path, using only intl middleware');
    const response = intlMiddleware(request);
    response.headers.set('x-debug-action', 'Not admin path');
    return response;
  }
  
  // Per i percorsi admin, verifica l'autenticazione tramite cookie
  const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  console.log('DEBUG - isAuthenticated:', isAuthenticated);
  
  // Se non autenticato e richiede un percorso admin, reindirizza al login
  if (!isAuthenticated) {
    console.log('DEBUG - Not authenticated, redirecting to login');
    const locale = request.nextUrl.locale || defaultLocale;
    const redirectUrl = new URL(`/${locale}/admin/login`, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('x-debug-action', 'Redirect to login');
    response.headers.set('x-debug-redirectTo', redirectUrl.toString());
    return response;
  }
  
  // Applica il middleware di internazionalizzazione
  console.log('DEBUG - Authenticated, applying intl middleware');
  const response = intlMiddleware(request);
  response.headers.set('x-debug-action', 'Authenticated user');
  return response;
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 