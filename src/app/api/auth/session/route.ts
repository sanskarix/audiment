import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SESSION_COOKIE_NAME = 'audiment_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * POST /api/auth/session
 *
 * Called by the client immediately after a successful Firebase sign-in.
 * Verifies the provided ID token and sets an HttpOnly session cookie so that
 * session data is never accessible to JavaScript (XSS-safe).
 *
 * Body: { idToken: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // Verify the ID token with Firebase Admin — this throws if the token
    // is invalid, expired, or revoked.
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired ID token' }, { status: 401 });
    }

    // Extract the authoritative session fields from the verified token.
    const uid: string = decoded.uid;
    const role = ((decoded.role as string) || '').toLowerCase();
    const organizationId = (decoded.organizationId as string) || '';
    const email = decoded.email || '';

    if (!role || !organizationId) {
      return NextResponse.json(
        { error: 'Account is missing role or organizationId. Contact your administrator.' },
        { status: 403 }
      );
    }

    // Build the session payload — same shape as before so the rest of the app
    // (middleware, server components) can parse it unchanged.
    const sessionPayload = JSON.stringify({ uid, role, email, organizationId });

    // Set the cookie server-side with HttpOnly — JavaScript in the browser
    // cannot read or modify this cookie.
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(sessionPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[session] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
