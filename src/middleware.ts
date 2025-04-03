import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/navigation';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Pattern per ignorare: API, file statici, immagini, fonts, ecc.
  const ignorePatterns = [
    '/api/',             // Ignora le chiamate API
    '/_next/',           // Ignora le risorse interne di Next.js
    '/images/',          // Ignora la cartella delle immagini
    '/fonts/',           // Ignora la cartella dei font (se presente)
    '/manifest.json',    // Ignora il file manifest
    '/robots.txt',       // Ignora il file robots
    '/sitemap.xml',      // Ignora la sitemap (gestita da next-sitemap)
    '/sitemap-0.xml',    // Ignora la sitemap index
    '/favicon.ico',      // Ignora la favicon
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/auth/callback'     // Ignora il callback di autenticazione
  ];
  
  // Verifica se il percorso corrisponde a uno dei pattern da ignorare
  const shouldIgnore = ignorePatterns.some(pattern => pathname.startsWith(pattern)) || pathname.includes('.');
  
  if (shouldIgnore) {
    return NextResponse.next();
  }
  
  // Gestione della localizzazione
  const pathnameHasValidLocale = locales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  // Reindirizza la root alla homepage con il locale predefinito
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Se il percorso non ha una locale valida (e non è la root), aggiungi il locale predefinito
  if (!pathnameHasValidLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }
  
  // Estrai la locale dal percorso
  const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}`)) || defaultLocale;
  
  // Crea una risposta clonando l'URL corrente
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  // Crea client Supabase con cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Verifica accesso alle sezioni admin (ma NON per la pagina di login)
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    // Verifica la sessione utente usando getUser
    const { data: { user } } = await supabase.auth.getUser();
    
    // Se l'utente non è autenticato, reindirizza al login con la locale corrente
    if (!user) {
      const redirectUrl = new URL(`/${currentLocale}/admin/login`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return response;
}

// Aggiorna il matcher per escludere i file statici in modo più granulare
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (public images)
     * - favicon.ico (favicon file)
     * - other static files like manifest.json, robots.txt, etc.
     */
    '/((?!api|_next/static|_next/image|images|fonts|favicon.ico|manifest.json|robots.txt|sitemap.*\.xml|apple-touch-icon.png|android-chrome.*\.png).*)',
  ],
}; 