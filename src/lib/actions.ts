'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

// Funzione helper per creare un client Supabase con i cookie
async function createSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().then(cookieStore => cookieStore.get(name)?.value);
        },
        set(name: string, value: string, options: any) {
          cookies().then(cookieStore => cookieStore.set({ name, value, ...options }));
        },
        remove(name: string, options: any) {
          cookies().then(cookieStore => cookieStore.set({ name, value: '', ...options }));
        },
      },
    }
  );
}

export async function redirectToLogin(redirectTo?: string) {
  const locale = 'it'; // Default locale
  let loginUrl = `/${locale}/admin/login`;
  
  if (redirectTo) {
    loginUrl += `?redirectTo=${encodeURIComponent(redirectTo)}`;
  }
  
  return redirect(loginUrl);
}

export async function logout() {
  const supabase = await createSupabaseClient();
  
  await supabase.auth.signOut();
  redirect('/it/admin/login');
} 