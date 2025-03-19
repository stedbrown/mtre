import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl;
  
  // Consenti sempre l'accesso alle risorse statiche e API
  if (
    nextUrl.pathname.startsWith('/_next') || 
    nextUrl.pathname.startsWith('/api') ||
    nextUrl.pathname.includes('.') ||
    nextUrl.pathname.startsWith('/images') ||
    nextUrl.pathname.startsWith('/fonts')
  ) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 