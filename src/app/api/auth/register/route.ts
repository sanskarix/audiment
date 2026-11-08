import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendFounderSignupAlertEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_FREE_ACCOUNTS = Number(process.env.NEXT_PUBLIC_FREE_ACCOUNT_CAP || 75);
const SESSION_COOKIE_NAME = 'audiment_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(req: Request) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Authentication services are temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { email, phone, fullName, companyName, industry, password } = body;

    // ── 1. Validation ─────────────────────────────────────────────────────────
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid work email address.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your company or brand name.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedName = fullName.trim();
    const normalizedCompany = companyName.trim();
    const selectedIndustry = industry?.trim() || 'Other';

    // ── 2. Check if user already exists in Firebase Auth ─────────────────────
    try {
      const existingUser = await adminAuth.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 400 }
        );
      }
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') {
        console.error('[register] Auth check error:', err);
      }
    }

    // ── 3. Check Global Free Account Cap (75 accounts) ───────────────────────
    const globalConfigRef = adminDb.collection('system').doc('globalConfig');
    const globalConfigSnap = await globalConfigRef.get();
    let currentFreeCount = 0;

    if (globalConfigSnap.exists) {
      const data = globalConfigSnap.data();
      currentFreeCount = Number(data?.freeAccountCount || 0);
    }

    if (currentFreeCount >= MAX_FREE_ACCOUNTS) {
      await adminDb.collection('waitlist').doc(normalizedEmail).set({
        fullName: normalizedName,
        companyName: normalizedCompany,
        email: normalizedEmail,
        phone: normalizedPhone,
        industry: selectedIndustry,
        createdAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        waitlisted: true,
        message: `Our Early Access Beta has reached the ${MAX_FREE_ACCOUNTS}-workspace launch cap. You have been placed on the priority waitlist!`,
      });
    }

    // ── 4. Create Firebase Auth user ─────────────────────────────────────────
    const userRecord = await adminAuth.createUser({
      email: normalizedEmail,
      password,
      displayName: normalizedName,
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

    // ── 5. Atomic Batch Writes for Multi-Tenant Provisioning ──────────────────
    const batch = adminDb.batch();

    // A. Organization document
    batch.set(orgRef, {
      id: orgId,
      name: normalizedCompany,
      industry: selectedIndustry,
      phone: normalizedPhone,
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
      name: normalizedName,
      phone: normalizedPhone,
      industry: selectedIndustry,
      role: 'ADMIN',
      organizationId: orgId,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    // C. Initial Flagship Location
    const locRef = adminDb.collection('locations').doc();
    batch.set(locRef, {
      name: `${normalizedCompany} - Flagship`,
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

    // Commit all provisioning operations
    await batch.commit();

    // ── 6. Create client custom token & session cookie ───────────────────────
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

    // ── 7. Deliver Founder Alert Email in Background ─────────────────────────
    const newCount = currentFreeCount + 1;
    sendFounderSignupAlertEmail({
      fullName: normalizedName,
      companyName: normalizedCompany,
      email: normalizedEmail,
      phone: normalizedPhone,
      industry: selectedIndustry,
      orgId,
      freeAccountCount: newCount,
      maxCap: MAX_FREE_ACCOUNTS,
    }).catch((alertErr) => {
      console.error('[register] Founder alert background send failed:', alertErr);
    });

    return NextResponse.json({
      success: true,
      uid,
      organizationId: orgId,
      customToken,
      redirectUrl: '/dashboard/admin',
    });

  } catch (err: any) {
    console.error('[register] Unexpected error during registration:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

