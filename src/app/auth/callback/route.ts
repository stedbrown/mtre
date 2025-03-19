import { createClient } from '@/lib/supabase/server-client';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL di redirect dopo il completamento del processo di accesso
  return NextResponse.redirect(new URL('/it/admin/dashboard', request.url));
} 