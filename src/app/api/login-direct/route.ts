import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirectTo') as string | null;

    console.log('Login attempt via direct API:', { 
      email, 
      hasRedirect: !!redirectTo 
    });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono richiesti' },
        { status: 400 }
      );
    }

    // Crea una risposta vuota per impostare i cookie
    const response = new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Inizializzazione in corso...',
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    );

    // Crea il client Supabase con i cookie custom per RSC/Route Handler
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
          set(name: string, value: string, options) {
            // Imposta il cookie nella risposta
            response.cookies.set(name, value, options);
          },
          remove(name: string, options) {
            // Rimuovi il cookie dalla risposta
            response.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // Esegui il login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      
      // Risposta di errore
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    // Login riuscito
    console.log('Login successful, user:', data.user?.email);

    // Determina l'URL di redirect
    const redirectPath = redirectTo || '/it/admin/dashboard';
    
    // Imposta la risposta di successo
    response.headers.set('content-type', 'application/json');
    response.cookies.set(
      'login-success', 
      'true', 
      { maxAge: 5, path: '/' }
    );

    const responseData = JSON.stringify({
      success: true,
      redirectUrl: redirectPath,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      }
    });

    // Costruisci la risposta finale
    return new NextResponse(responseData, {
      status: 200,
      headers: response.headers,
    });
  } catch (error: any) {
    console.error('Unexpected error in API login-direct:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Si è verificato un errore durante il login' 
      },
      { status: 500 }
    );
  }
} 