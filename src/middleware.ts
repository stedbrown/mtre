import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/navigation';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ignora risorse statiche, API e file
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') || 
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth/callback')
  ) {
    return NextResponse.next();
  }
  
  // Per la pagina di login, permetti l'accesso diretto senza verifiche di autenticazione
  if (pathname.includes('/admin/login')) {
    // Se siamo sulla pagina di login, controlla solo per la localizzazione
    // ma NON eseguire reindirizzamenti basati sull'autenticazione
    
    // Controlla se il percorso ha già una locale valida
    const pathnameHasValidLocale = locales.some(locale => 
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );
    
    // Se il percorso non ha una locale valida, aggiungi il locale predefinito
    if (!pathnameHasValidLocale) {
      return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
    }
    
    // Permetti l'accesso alla pagina di login
    return NextResponse.next();
  }
  
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
  
  // Reindirizza la root alla homepage con il locale predefinito
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Controlla se il percorso ha già una locale valida
  const pathnameHasValidLocale = locales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  // Se il percorso non ha una locale valida, aggiungi il locale predefinito
  if (!pathnameHasValidLocale && pathname !== '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  // Verifica accesso alle sezioni admin (ma NON per la pagina di login)
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    // Verifica la sessione utente usando getUser
    const { data: { user } } = await supabase.auth.getUser();
    
    // Se l'utente non è autenticato, reindirizza al login
    if (!user) {
      const redirectUrl = new URL(`/${defaultLocale}/admin/login`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 