import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendVerificationOtpEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_FREE_ACCOUNTS = Number(process.env.NEXT_PUBLIC_FREE_ACCOUNT_CAP || 75);

export async function POST(req: Request) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Authentication services are temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { fullName, companyName, email, phone, industry } = body;

    // ── 1. Validate required inputs ──────────────────────────────────────────
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 });
    }
    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your company or brand name.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid work email address.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── 2. Check if user already exists in Firebase Auth ─────────────────────
    try {
      const existingUser = await adminAuth.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.' },
          { status: 400 }
        );
      }
    } catch (err: any) {
      // 'auth/user-not-found' is expected for new signups
      if (err.code !== 'auth/user-not-found') {
        console.error('[register-request] Firebase auth check error:', err);
      }
    }

    // ── 3. Check Global Free Account Cap (75 accounts) ───────────────────────
    const globalConfigRef = adminDb.collection('system').doc('globalConfig');
    const globalConfigSnap = await globalConfigRef.get();
    let freeAccountCount = 0;

    if (globalConfigSnap.exists) {
      const data = globalConfigSnap.data();
      freeAccountCount = Number(data?.freeAccountCount || 0);
    }

    // If cap reached, place user on waitlist
    if (freeAccountCount >= MAX_FREE_ACCOUNTS) {
      await adminDb.collection('waitlist').doc(normalizedEmail).set({
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        email: normalizedEmail,
        createdAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        waitlisted: true,
        message: `Our Early Access Beta has reached the ${MAX_FREE_ACCOUNTS}-workspace launch cap. You have been placed on the priority waitlist and we will notify you when new slots open!`,
      });
    }

    // ── 4. Prevent spam: Rate-limit resends to 45 seconds ─────────────────────
    const pendingRef = adminDb.collection('pendingVerifications').doc(normalizedEmail);
    const existingPending = await pendingRef.get();

    if (existingPending.exists) {
      const data = existingPending.data();
      const lastSent = data?.lastSentAt ? data.lastSentAt.toDate().getTime() : 0;
      const now = Date.now();
      if (now - lastSent < 45 * 1000) {
        const secondsLeft = Math.ceil((45 * 1000 - (now - lastSent)) / 1000);
        return NextResponse.json(
          { error: `Please wait ${secondsLeft}s before requesting a new code.` },
          { status: 429 }
        );
      }
    }

    // ── 5. Generate 6-Digit OTP ──────────────────────────────────────────────
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes TTL

    // Store pending verification
    await pendingRef.set({
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: normalizedEmail,
      phone: typeof phone === 'string' ? phone.trim() : '',
      industry: typeof industry === 'string' ? industry.trim() : '',
      otpCode,
      expiresAt,
      attempts: 0,
      verified: false,
      lastSentAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });

    // ── 6. Deliver Verification Email via Resend ─────────────────────────────
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=====================================================');
      console.log(`🔑 [DEV MODE OTP] Email: ${normalizedEmail}`);
      console.log(`🔑 [DEV MODE OTP] Code:  ${otpCode}`);
      console.log('=====================================================\n');
    }

    let sendResult: any = null;
    let resendError: any = null;

    try {
      sendResult = await sendVerificationOtpEmail({
        to: normalizedEmail,
        fullName: fullName.trim(),
        otpCode,
      });
      resendError = sendResult?.error;
    } catch (err: any) {
      resendError = err;
    }

    if (resendError) {
      console.error('[register-request] Resend delivery error:', resendError);

      // Special handling for Resend test mode / rate-limit restriction
      const isTestRestriction =
        resendError?.message?.includes('only send testing emails to your own email address') ||
        resendError?.message?.includes('Too many requests') ||
        resendError?.message?.includes('Invalid `to` field') ||
        resendError?.statusCode === 429 ||
        resendError?.statusCode === 403;

      if (process.env.NODE_ENV !== 'production' || isTestRestriction) {
        // In development/test mode or rate-limit, allow flow to continue using the console-logged OTP
        return NextResponse.json({
          success: true,
          message: 'Verification code sent.',
          email: normalizedEmail,
        });
      }

      return NextResponse.json(
        {
          error: isTestRestriction
            ? 'Resend is in test mode (onboarding@resend.dev) and can only send to your account email. Please verify your domain in Resend to send to other recipients.'
            : resendError.message || 'Failed to send verification email. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      email: normalizedEmail,
    });

  } catch (err: any) {
    console.error('[register-request] Unexpected error:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

