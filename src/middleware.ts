import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (pathname.startsWith('/api/auth') || 
      pathname === '/' ||
      pathname.startsWith('/auth/') ||
      pathname.startsWith('/admin/setup') ||
      pathname.startsWith('/events') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/_next/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Require auth for protected routes
  if (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/attendance')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // Check admin access for admin routes
    if (pathname.startsWith('/admin/') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};