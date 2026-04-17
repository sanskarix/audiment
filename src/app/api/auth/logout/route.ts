import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/auth/logout
 *
 * Clears the HttpOnly session cookie server-side.
 * Called by the client before Firebase signOut() so the server-side session
 * is always destroyed, even if the client-side call fails.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('audiment_session');
  return NextResponse.json({ success: true });
}
