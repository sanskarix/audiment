import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── IN-MEMORY RATE LIMITER ──────────────────
// Resets naturally on each serverless cold start.
// Sufficient for current traffic — upgrade to 
// Upstash Redis when scaling beyond ~1000 DAU.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMIT_RULES = {
  // Auth endpoints — strict: 10 attempts per 15 min
  auth: { max: 10, windowMs: 15 * 60 * 1000 },
  // API endpoints — lenient: 60 requests per minute
  api: { max: 60, windowMs: 60 * 1000 },
  // Dashboard — moderate: 120 requests per minute
  dashboard: { max: 120, windowMs: 60 * 1000 },
}

function getRateLimitRule(pathname: string) {
  if (pathname.startsWith('/api/auth') || 
      pathname === '/login' ||
      pathname === '/api/login') {
    return RATE_LIMIT_RULES.auth
  }
  if (pathname.startsWith('/api/')) {
    return RATE_LIMIT_RULES.api
  }
  return RATE_LIMIT_RULES.dashboard
}

function checkRateLimit(ip: string, pathname: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const rule = getRateLimitRule(pathname)
  const key = `${ip}:${pathname.split('/')[1]}`
  const now = Date.now()
  
  const entry = rateLimitStore.get(key)
  
  // If no entry or window has expired, reset
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { 
      count: 1, 
      resetAt: now + rule.windowMs 
    })
    return { 
      allowed: true, 
      remaining: rule.max - 1, 
      resetAt: now + rule.windowMs 
    }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)
  
  const remaining = Math.max(0, rule.max - entry.count)
  const allowed = entry.count <= rule.max
  
  return { allowed, remaining, resetAt: entry.resetAt }
}

// Clean up expired entries every 5 minutes 
// to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}
// ─────────────────────────────────────────────

export function middleware(request: NextRequest) {
  // ─── RATE LIMITING ──────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    ?? request.headers.get('x-real-ip') 
    ?? 'unknown'

  const { allowed, remaining, resetAt } = checkRateLimit(
    ip, 
    request.nextUrl.pathname
  )

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(resetAt).toISOString(),
          'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
        },
      }
    )
  }
  // ─────────────────────────────────────────────

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
    '/auditor/:path*',
    '/api/:path*',
    '/login',
  ],
};
