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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Gestisci eventuali errori di login
    if (error) {
      console.log(`[API] Login error: ${error.message}`);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    // Se il login ha successo, ottieni la sessione e imposta la risposta
    console.log(`[API] Login successful for user: ${email}`);
    
    // Crea la risposta con il redirect alla dashboard
    const redirectTo = '/it/admin/dashboard';
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    
    // Configura i cookie per sessione sicura
    const cookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    };
    
    // Ottieni i cookie dalla risposta Supabase
    const setCookieHeader = data.session?.cookieString || '';
    
    if (setCookieHeader) {
      // Estrai i cookie da impostare
      const cookieParts = setCookieHeader.split(';');
      const mainPart = cookieParts[0];
      const [cookieName, cookieValue] = mainPart.split('=');
      
      if (cookieName && cookieValue) {
        // Imposta il cookie nella risposta con le opzioni di sicurezza
        response.cookies.set(cookieName, cookieValue, cookieOptions);
        console.log(`[API] Set secure cookie: ${cookieName}`);
      }
    }
    
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