import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    if (!adminAuth) {
      return NextResponse.json({ exists: false });
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const user = await adminAuth.getUserByEmail(normalizedEmail);
      if (user) {
        return NextResponse.json({
          exists: true,
          message: 'An account with this email already exists. Please sign in.',
        });
      }
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') {
        console.error('[check-email] Error:', err);
      }
    }

    return NextResponse.json({ exists: false });
  } catch (error: any) {
    console.error('[check-email] Unexpected error:', error);
    return NextResponse.json({ exists: false });
  }
}

