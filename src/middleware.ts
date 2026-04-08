import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/admin') || 
                           request.nextUrl.pathname.startsWith('/manager') ||
                           request.nextUrl.pathname.startsWith('/auditor');

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get('audiment_session')?.value;
    let isValidSession = false;

    if (sessionCookie) {
      try {
        // The cookie is URI encoded JSON from our auth flow
        const data = JSON.parse(decodeURIComponent(sessionCookie));
        if (data && data.uid && data.role) {
          isValidSession = true;
        }
      } catch (e) {
        // Invalid cookie structure
        console.error('Failed to parse session cookie in middleware:', e);
      }
    }

    if (!isValidSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'You need to login to access the page');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/manager/:path*', 
    '/auditor/:path*'
  ],
};
