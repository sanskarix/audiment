import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  auditor: '/dashboard/auditor',
};

function getSessionFromCookie(cookieString: string): { uid: string; role: string } | null {
  const match = cookieString.match(/audiment_session=([^;]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match[1]));
    if (data.uid && data.role && data.organizationId) {
      return { uid: data.uid, role: data.role };
    }
    return null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get('cookie') || '';
  const session = getSessionFromCookie(cookieHeader);

  // Protect all /dashboard/* routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const expectedBase = ROLE_ROUTES[session.role];

    // Prevent wrong-role access: redirect to correct dashboard
    if (expectedBase && !pathname.startsWith(expectedBase)) {
      return NextResponse.redirect(new URL(expectedBase, request.url));
    }
  }

  // If already logged in and tries to access /login, redirect to their dashboard
  if (pathname === '/login' && session) {
    const target = ROLE_ROUTES[session.role] || '/login';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
