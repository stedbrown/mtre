import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  // Creazione di un client browser standard senza opzioni personalizzate
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
} 