import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          try {
            const cookieStore = await cookies();
            cookieStore.set(name, value, options);
          } catch (error) {
            // Può fallire in componenti Server ma va bene
            // perché il middleware gestirà l'aggiornamento dei cookie
          }
        },
        async remove(name: string, options: any) {
          try {
            const cookieStore = await cookies();
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Può fallire in componenti Server ma va bene
          }
        },
      },
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        name: 'sb-mtre-auth'
      }
    }
  );
} 