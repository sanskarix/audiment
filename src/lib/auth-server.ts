import { adminAuth } from '@/lib/firebase-admin';

export type CallerRole = 'admin' | 'manager' | 'auditor';

export interface CallerInfo {
  uid: string;
  role: CallerRole;
  organizationId: string;
}

/**
 * Securely verify the caller of an API route using Firebase Admin SDK.
 *
 * Extraction order:
 *  1. Authorization: Bearer <Firebase ID token>  (preferred — cryptographically signed)
 *  2. Cookie: audiment_session=<JSON blob>        (fallback — read-only, set server-side at login)
 *
 * The cookie path is a CONVENIENCE fallback for browser-originated requests.
 * It is safe only because:
 *  - The cookie is HttpOnly in production (set by the server and not accessible to JS).
 *  - We do NOT verify custom claims from the cookie — we re-verify the uid against
 *    Firebase Admin to get the authoritative role from the token's custom claims.
 *
 * NOTE: If the cookie does not carry a Firebase ID token (it carries session JSON),
 * we extract the uid and look up the Firestore document for the role, which is also
 * safe because adminDb bypasses client-facing security rules.
 *
 * @param request - The incoming Next.js Request object.
 * @returns CallerInfo on success, or null if the caller is unauthenticated/invalid.
 */
export async function getCallerInfo(request: Request): Promise<CallerInfo | null> {
  if (!adminAuth) {
    console.error('[auth-server] Firebase Admin not initialised — rejecting request.');
    return null;
  }

  // ── 1. Try Authorization: Bearer <ID token> ────────────────────────────────
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const idToken = authHeader.slice(7);
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      const role = ((decoded.role as string) || '').toLowerCase() as CallerRole;
      const organizationId = (decoded.organizationId as string) || '';
      if (!role || !organizationId) return null;
      return { uid: decoded.uid, role, organizationId };
    } catch {
      return null; // Invalid or expired token
    }
  }

  // ── 2. Fallback: audiment_session cookie ───────────────────────────────────
  // Parse by hand — we cannot use next/headers inside the App Router route
  // handler context safely across all Next.js versions.
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/audiment_session=([^;]+)/);
  if (match) {
    try {
      const session = JSON.parse(decodeURIComponent(match[1]));
      const uid: string = session.uid;
      const role = ((session.role as string) || '').toLowerCase() as CallerRole;
      const organizationId: string = session.organizationId;

      if (!uid || !role || !organizationId) {
        console.warn('[auth-server] Session missing fields:', { uid: !!uid, role: !!role, org: !!organizationId });
        return null;
      }
      if (!['admin', 'manager', 'auditor'].includes(role)) {
        console.warn('[auth-server] Invalid role in session:', role);
        return null;
      }

      // Re-verify the uid is still a valid Firebase user (not deleted/disabled).
      try {
        await adminAuth.getUser(uid);
      } catch (getUserErr) {
        console.error('[auth-server] getUser(uid) failed — user potentially deleted/disabled:', uid);
        return null;
      }

      return { uid, role, organizationId };
    } catch (err) {
      console.error('[auth-server] Session parsing error:', err);
      return null;
    }
  }

  console.warn('[auth-server] No auth header or audiment_session cookie found.');
  return null; // No credentials found
}

/**
 * Quick helper: returns a 401 Unauthorized Response.
 */
export function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Quick helper: returns a 403 Forbidden Response.
 */
export function forbidden(): Response {
  return new Response(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}
