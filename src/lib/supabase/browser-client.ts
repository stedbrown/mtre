import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Creazione di un client browser standard senza opzioni personalizzate
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
} 