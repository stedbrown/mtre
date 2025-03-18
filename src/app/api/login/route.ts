import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirectTo') as string | null;

    // Log debug
    console.log('API login attempt:', { email, redirectToExists: !!redirectTo });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono richiesti' },
        { status: 400 }
      );
    }

    // Crea il client di Supabase
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
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
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Login riuscito
    console.log('Login successful, user:', data.user?.email);

    // Determina l'URL di redirect
    const redirectPath = redirectTo || '/it/admin/dashboard';
    
    return NextResponse.json({
      success: true,
      redirectUrl: redirectPath,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      }
    });
  } catch (error: any) {
    console.error('Unexpected error in API login:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante il login' },
      { status: 500 }
    );
  }
} 