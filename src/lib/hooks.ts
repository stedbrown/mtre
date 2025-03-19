import { createClient } from './supabase/server-client';
import { redirect } from 'next/navigation';

export async function checkServerSession(redirectPath?: string) {
  const supabase = await createClient();
  
  // Usa getUser invece di getSession per maggiore sicurezza
  // In Next.js 15, è importante attendere tutte le operazioni asincrone
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    if (redirectPath) {
      redirect(redirectPath);
    }
    return null;
  }
  
  return user;
} 