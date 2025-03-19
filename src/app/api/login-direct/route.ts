import { createClient } from '@/lib/supabase/server-client';
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
    console.log(`[API] Creating Supabase client for login...`);
    
    // Crea un client Supabase semplice
    const supabase = createClient();
    
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
      refreshToken: data?.session?.refresh_token ? 'Present' : 'Missing',
      accessToken: data?.session?.access_token ? 'Present' : 'Missing'
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
    
    // Assicurati che i cookie vengano impostati in modo coerente
    // Imposta manualmente il cookie di Supabase con formato completo
    const token = data.session.access_token;
    const refreshToken = data.session.refresh_token;
    const expiresAt = data.session.expires_at || Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    
    // Imposta anche i cookie individuali per debug
    response.cookies.set('sb-access-token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });
    
    response.cookies.set('sb-refresh-token', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });
    
    // Setup anche un cookie di debug per verificare se il login è avvenuto
    response.cookies.set('mtre-login-success', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 ore
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
      { error: 'Si è verificato un errore durante il login: ' + error.message },
      { status: 500 }
    );
  }
} 