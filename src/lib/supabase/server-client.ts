import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  // Next.js 15 richiede l'attesa dei cookie
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        async set(name, value, options) {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore errors when cookies cannot be modified
          }
        },
        async remove(name, options) {
          try {
            await cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignore errors when cookies cannot be modified
          }
        },
      },
    }
  );
} 