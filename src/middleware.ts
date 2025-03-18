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
  
  // STEP 1: Gestisci i percorsi /admin senza locale (redirect a /{locale}/admin/...)
  if (pathname === '/admin' || pathname === '/admin/') {
    // Redirect to default locale dashboard
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/dashboard`, request.url));
  }
  
  if (pathname.startsWith('/admin/')) {
    // Se è un percorso /admin senza locale, redirect a /{locale}/admin/...
    // Preserva il resto del percorso dopo /admin/
    const subPath = pathname.slice(7); // rimuove '/admin/'
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/${subPath}`, request.url));
  }
  
  // STEP 2: Verifica l'autenticazione per i percorsi /{locale}/admin/...
  // Ma NON per /{locale}/admin/login
  if (pathname.includes('/admin/') && !pathname.endsWith('/admin/login')) {
    // Verifica autenticazione
    const authCookie = request.cookies.get('sb-pehacdouexhebskdbpxp-auth-token');
    const isAuthenticated = !!authCookie?.value;
    
    if (!isAuthenticated) {
      // Redirect a login mantenendo il locale già presente nell'URL
      const parts = pathname.split('/');
      const locale = parts[1]; // il locale è la prima parte dopo /
      
      const redirectUrl = new URL(`/${locale}/admin/login`, request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // STEP 3: Per tutti gli altri percorsi, usa il middleware di internazionalizzazione
  return intlMiddleware(request);
}

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 