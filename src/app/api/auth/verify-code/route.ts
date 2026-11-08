import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendFounderSignupAlertEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_FREE_ACCOUNTS = Number(process.env.NEXT_PUBLIC_FREE_ACCOUNT_CAP || 75);
const SESSION_COOKIE_NAME = 'audiment_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Authentication services are temporarily unavailable.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { email, code, password, checkOnly } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Please provide your work email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = typeof code === 'string' ? code.trim() : '';

    // ── 1. Fetch and validate pending verification document ──────────────────
    const pendingRef = adminDb.collection('pendingVerifications').doc(normalizedEmail);
    const pendingSnap = await pendingRef.get();

    if (!pendingSnap.exists) {
      return NextResponse.json(
        { error: 'No pending verification found for this email. Please sign up again.' },
        { status: 400 }
      );
    }

    const pendingData = pendingSnap.data()!;

    // Check expiration (15 minutes)
    if (Date.now() > pendingData.expiresAt) {
      await pendingRef.delete();
      return NextResponse.json(
        { error: 'Verification code has expired. Please sign up again to receive a fresh code.' },
        { status: 400 }
      );
    }

    // Check max attempts
    if (pendingData.attempts >= 5) {
      await pendingRef.delete();
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please sign up again.' },
        { status: 429 }
      );
    }

    // Check code match if not yet verified
    const isAlreadyVerified = Boolean(pendingData.verified);
    if (!isAlreadyVerified) {
      if (!normalizedCode) {
        return NextResponse.json(
          { error: 'Please enter the 6-digit verification code.' },
          { status: 400 }
        );
      }
      if (pendingData.otpCode !== normalizedCode) {
        await pendingRef.update({ attempts: FieldValue.increment(1) });
        return NextResponse.json(
          { error: 'Incorrect verification code.' },
          { status: 400 }
        );
      }
      // OTP verified successfully! Mark in Firestore
      await pendingRef.update({ verified: true, verifiedAt: Date.now() });
    }

    // If no password provided or verification check only, return verified status
    if (!password || checkOnly) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Email verified successfully. Please choose your password.',
      });
    }

    // Validate password when setting at final stage
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // ── 2. Check Global Launch Cap inside a write operation ──────────────────
    const globalConfigRef = adminDb.collection('system').doc('globalConfig');
    const globalConfigSnap = await globalConfigRef.get();
    let currentFreeCount = 0;
    if (globalConfigSnap.exists) {
      currentFreeCount = Number(globalConfigSnap.data()?.freeAccountCount || 0);
    }

    if (currentFreeCount >= MAX_FREE_ACCOUNTS) {
      // Put on waitlist
      await adminDb.collection('waitlist').doc(normalizedEmail).set({
        fullName: pendingData.fullName,
        companyName: pendingData.companyName,
        email: normalizedEmail,
        createdAt: FieldValue.serverTimestamp(),
      });
      await pendingRef.delete();

      return NextResponse.json({
        waitlisted: true,
        message: `Our Early Access Beta has reached the ${MAX_FREE_ACCOUNTS}-workspace launch cap. You have been placed on the priority waitlist!`,
      });
    }

    // ── 3. Create Firebase Auth user ─────────────────────────────────────────
    const userRecord = await adminAuth.createUser({
      email: normalizedEmail,
      password: password,
      displayName: pendingData.fullName,
    });

    const uid = userRecord.uid;
    const orgRef = adminDb.collection('organizations').doc();
    const orgId = orgRef.id;

    // Set custom claims: role=admin, organizationId, plan=free
    await adminAuth.setCustomUserClaims(uid, {
      role: 'admin',
      organizationId: orgId,
      plan: 'free',
    });

    // ── 4. Atomic batch writes for tenant provisioning ───────────────────────
    const batch = adminDb.batch();

    // A. Organization document
    batch.set(orgRef, {
      id: orgId,
      name: pendingData.companyName,
      industry: pendingData.industry || '',
      phone: pendingData.phone || '',
      plan: 'free',
      planVersion: '2026.1',
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      limits: {
        maxOutlets: 1,
        maxUsers: 3,
        maxAuditsPerMonth: 30,
        maxPhotosPerMonth: 150,
        maxCustomTemplates: 5,
        historyDays: 60,
        flashmobAllowed: false,
        recurringAllowed: false,
      },
    });

    // B. User document
    const userDocRef = adminDb.collection('users').doc(uid);
    batch.set(userDocRef, {
      uid,
      email: normalizedEmail,
      name: pendingData.fullName,
      phone: pendingData.phone || '',
      industry: pendingData.industry || '',
      role: 'ADMIN',
      organizationId: orgId,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    // C. Initial Flagship Location
    const locRef = adminDb.collection('locations').doc();
    batch.set(locRef, {
      name: `${pendingData.companyName} - Flagship`,
      address: 'Primary Location',
      city: '',
      organizationId: orgId,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    // D. Initial Monthly Usage Counter (YYYYMM format)
    const currentYYYYMM = new Date().toISOString().slice(0, 7).replace('-', '');
    const usageRef = adminDb.collection('usage').doc(`${orgId}_${currentYYYYMM}`);
    batch.set(usageRef, {
      organizationId: orgId,
      month: currentYYYYMM,
      auditsStarted: 0,
      photosUploaded: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    // E. Update global account counter
    batch.set(
      globalConfigRef,
      {
        freeAccountCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // F. Clean up pending verification record
    batch.delete(pendingRef);

    // Commit all provisioning operations
    await batch.commit();

    // ── 5. Create client custom token & session cookie ───────────────────────
    const customToken = await adminAuth.createCustomToken(uid, {
      role: 'admin',
      organizationId: orgId,
      plan: 'free',
    });

    const sessionPayload = JSON.stringify({
      uid,
      role: 'admin',
      email: normalizedEmail,
      organizationId: orgId,
      plan: 'free',
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(sessionPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    // ── 6. Deliver Founder Alert Email via Resend ────────────────────────────
    const newCount = currentFreeCount + 1;
    sendFounderSignupAlertEmail({
      fullName: pendingData.fullName,
      companyName: pendingData.companyName,
      email: normalizedEmail,
      phone: pendingData.phone || '',
      industry: pendingData.industry || '',
      orgId,
      freeAccountCount: newCount,
      maxCap: MAX_FREE_ACCOUNTS,
    }).catch((alertErr) => {
      console.error('[verify-code] Founder alert background send failed:', alertErr);
    });

    return NextResponse.json({
      success: true,
      uid,
      organizationId: orgId,
      customToken,
      redirectUrl: '/dashboard/admin',
    });

  } catch (err: any) {
    console.error('[verify-code] Unexpected error during verification:', err);
    return NextResponse.json(
      { error: err.message || 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

