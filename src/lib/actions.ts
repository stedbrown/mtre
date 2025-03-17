'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

// Funzione helper per creare un client Supabase con i cookie
async function createSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // @ts-ignore - In Next.js 15, cookies() è una funzione sincrona
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // @ts-ignore - In Next.js 15, cookies() è una funzione sincrona
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          // @ts-ignore - In Next.js 15, cookies() è una funzione sincrona
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string;
  
  const supabase = await createSupabaseClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  if (redirectTo) {
    redirect(redirectTo);
  } else {
    redirect('/it/admin/dashboard');
  }
}

export async function logout() {
  const supabase = await createSupabaseClient();
  
  await supabase.auth.signOut();
  redirect('/it/admin/login');
} 