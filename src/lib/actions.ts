'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server-client';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/it/admin/login');
} 