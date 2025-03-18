import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Crea la risposta con le stesse intestazioni della richiesta
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Crea un client Supabase che utilizzerà i cookie per l'autenticazione
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Imposta i cookie sia nella richiesta che nella risposta
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
          // Rimuove i cookie sia dalla richiesta che dalla risposta
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
    }
  );

  // Questo verifica e aggiorna automaticamente la sessione se necessario
  const { data: { user } } = await supabase.auth.getUser();
  
  // Percorso attuale della richiesta
  const path = request.nextUrl.pathname;
  
  // Verifica se il percorso richiede autenticazione
  const isAdminPath = path.includes('/admin') && !path.includes('/admin/login');
  
  // Se è un percorso amministrativo e l'utente non è autenticato, reindirizza al login
  if (isAdminPath && !user) {
    // Determina la locale e reindirizza all'URL appropriato
    const locale = path.split('/')[1] || 'it';
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  return response;
}

// Specifiche per le rotte a cui applicare il middleware
export const config = {
  matcher: [
    // Escludi risorse statiche e API route
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 