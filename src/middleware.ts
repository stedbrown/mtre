import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/navigation';

// Funzione di supporto per controllare se un percorso è un percorso admin
function isAdminPath(path: string): boolean {
  return path.includes('/admin') && !path.includes('/admin/login');
}

// Funzione di supporto per estrarre la locale dal percorso
function getLocaleFromPath(path: string): string | undefined {
  const segments = path.split('/').filter(Boolean);
  return segments.length > 0 && locales.includes(segments[0] as any) ? segments[0] : undefined;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Gestione della redirezione root a locale predefinita
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // 2. Gestione accesso diretto senza locale
  const pathnameHasLocale = locales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  
  if (!pathnameHasLocale) {
    // Se il percorso non include una locale, verifica se è un percorso admin
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
    }
    
    // Per altri percorsi senza locale, aggiungi la locale predefinita
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
    }
  }
  
  // 3. Preparazione della risposta
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  // 4. Configurazione del client Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.delete({
            name,
            ...options,
          });
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      }
    }
  );
  
  // 5. Verifica l'autenticazione utente
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("[Middleware] Errore durante il recupero dell'utente:", error.message);
  }
  
  // 6. Gestione protezione percorsi admin
  if (isAdminPath(pathname) && !user) {
    // Estrai la locale o usa quella predefinita
    const locale = getLocaleFromPath(pathname) || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }
  
  // 7. Ritorna la risposta elaborata
  return response;
}

// Specifiche per le rotte a cui applicare il middleware
export const config = {
  matcher: [
    // Applica a tutti i percorsi tranne risorse statiche e API
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 