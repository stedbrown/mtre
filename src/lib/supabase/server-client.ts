import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cache per il client Supabase
let supabaseClient: ReturnType<typeof createServerClient> | null = null;

export async function createClient() {
  // Se il client è già stato creato, lo restituiamo dalla cache
  if (supabaseClient) {
    return supabaseClient;
  }
  
  try {
    supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().then(cookieStore => cookieStore.get(name)?.value);
          },
          set(name: string, value: string, options: any) {
            // In Next.js 15, i cookie possono essere modificati solo in Server Actions o Route Handlers
            // Questa funzione verrà chiamata ma non modificherà effettivamente i cookie
            // L'autenticazione funzionerà comunque per la sessione corrente
            console.log(`Cookie ${name} would be set in a Server Action`);
          },
          remove(name: string, options: any) {
            // In Next.js 15, i cookie possono essere modificati solo in Server Actions o Route Handlers
            // Questa funzione verrà chiamata ma non modificherà effettivamente i cookie
            console.log(`Cookie ${name} would be removed in a Server Action`);
          },
        },
      }
    );
    
    return supabaseClient;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
} 