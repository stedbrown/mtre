import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/navigation';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ignora risorse statiche, API e file
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth/callback')
  ) {
    return NextResponse.next();
  }
  
  // Crea una risposta con NextResponse.next() per poter modificare i cookies più tardi
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  // Crea client Supabase con supporto per cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          
          // Aggiorna la response con i nuovi cookie
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  
  // Aggiorna la sessione di auth
  const { data: { user } } = await supabase.auth.getUser();
  
  // Reindirizza la root al locale predefinito
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Controlla se il percorso ha già una locale valida
  const pathnameHasValidLocale = locales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  // Se il percorso non ha una locale valida, aggiungi il locale predefinito
  if (!pathnameHasValidLocale && pathname !== '/') {
    // Reindirizza all'URL con locale predefinita
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  // Se è un'area protetta (admin) verifica se l'utente è autenticato
  if (pathname.includes('/admin') && 
      pathname !== `/${defaultLocale}/admin/login` && 
      !pathname.includes('/api/login')) {
    if (!user) {
      // Utente non autenticato, reindirizza al login
      return NextResponse.redirect(new URL(`/${defaultLocale}/admin/login`, request.url));
    }
  }

  // Se è già nella pagina di login ed è autenticato, reindirizza alla dashboard
  if (pathname === `/${defaultLocale}/admin/login` && user) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin/dashboard`, request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)', '/'],
}; 