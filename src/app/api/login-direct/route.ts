import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  // Ottieni i valori dal form
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Log dell'informazione iniziale
  console.log(`[API] Login attempt for user: ${email}`);
  
  // Verifica che i campi email e password siano presenti
  if (!email || !password) {
    console.log(`[API] Login error: missing email or password`);
    return NextResponse.json(
      { error: 'Email e password sono richiesti' },
      { status: 400 }
    );
  }
  
  try {
    // Crea il client Supabase
    const supabase = await createClient();
    
    // Effettua il login
    console.log(`[API] Attempting Supabase signInWithPassword for: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Log dettagliato della risposta di Supabase
    console.log(`[API] Supabase login response:`, {
      success: !error,
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      sessionExpires: data?.session?.expires_at || 'N/A',
      error: error ? error.message : null,
      cookieString: data?.session?.cookieString ? 'Present' : 'Missing',
    });
    
    // Gestisci eventuali errori di login
    if (error) {
      console.log(`[API] Login error: ${error.message}`);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (!data.session) {
      console.log(`[API] Login error: No session returned from Supabase`);
      return NextResponse.json(
        { error: 'Autenticazione fallita: sessione non creata' },
        { status: 401 }
      );
    }
    
    // Se il login ha successo, ottieni la sessione e imposta la risposta
    console.log(`[API] Login successful for user: ${email}`);
    
    // Crea la risposta con il redirect alla dashboard
    const redirectTo = '/it/admin/dashboard';
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    
    // Imposta manualmente il cookie di Supabase
    const token = data.session.access_token;
    const refreshToken = data.session.refresh_token;
    const cookieName = 'sb-pehacdouexhebskdbpxp-auth-token';
    
    // Configura i cookie per sessione sicura
    const cookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    };
    
    // Crea il valore del cookie JSON
    const cookieValue = JSON.stringify({
      access_token: token,
      refresh_token: refreshToken,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    });
    
    // Imposta il cookie di autenticazione nella risposta
    response.cookies.set(cookieName, cookieValue, cookieOptions);
    console.log(`[API] Set auth cookie manually: ${cookieName}`);
    
    // Setup anche un cookie di debug per verificare se il login è avvenuto
    response.cookies.set('mtre-login-success', 'true', {
      path: '/',
      maxAge: 60 * 5, // 5 minuti
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    console.log(`[API] Redirecting to: ${redirectTo}`);
    return response;
  } catch (error: any) {
    // Gestisci errori generici
    console.error(`[API] Login unexpected error:`, error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante il login' },
      { status: 500 }
    );
  }
} 