import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/audit/submit-notifications
 *
 * Called fire-and-forget after a successful audit submission batch commit.
 * Handles low-score alerts and 3-consecutive-low-score trend alerts using
 * the Admin SDK, which bypasses Firestore security rules. This avoids the
 * permission error that auditors would hit when querying other auditors'
 * completed audits from the client side.
 *
 * Body: { auditId, scorePercentage, locationId, locationName, assignedManagerId, organizationId }
 * Auth: Bearer <Firebase ID token> (validated server-side)
 */
export async function POST(request: Request) {
  try {
    // Validate the caller is an authenticated auditor
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const callerRole = (decodedToken.role as string || '').toLowerCase();
    if (callerRole !== 'auditor' && callerRole !== 'admin' && callerRole !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { auditId, scorePercentage, locationId, locationName, assignedManagerId, organizationId } = body;

    if (!auditId || scorePercentage === undefined || !locationId || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only process if score is below the alert threshold
    if (scorePercentage >= 60) {
      return NextResponse.json({ success: true, notificationsSent: 0, message: 'Score above threshold, no alerts needed.' });
    }

    const batch = adminDb.batch();
    let notificationsSent = 0;

    // ── 1. Low-score alert: notify manager + all admins ────────────────────
    const adminsSnap = await adminDb.collection('users')
      .where('organizationId', '==', organizationId)
      .where('role', '==', 'ADMIN')
      .get();

    const recipientIds = new Set<string>();
    if (assignedManagerId) recipientIds.add(assignedManagerId);
    adminsSnap.docs.forEach(d => recipientIds.add(d.id));

    for (const recipientId of Array.from(recipientIds)) {
      const notifRef = adminDb.collection('notifications').doc();
      batch.set(notifRef, {
        organizationId,
        recipientId,
        recipientRole: recipientId === assignedManagerId ? 'manager' : 'admin',
        type: 'low_score',
        title: `Low Audit Score: ${scorePercentage}%`,
        message: `Audit for ${locationName} completed with a low score of ${scorePercentage}%.`,
        relatedId: auditId,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      notificationsSent++;
    }

    // ── 2. Trend alert: 3 consecutive low scores for the same location ─────
    const recentAuditsSnap = await adminDb.collection('audits')
      .where('locationId', '==', locationId)
      .where('status', '==', 'completed')
      .orderBy('completedAt', 'desc')
      .limit(3)
      .get();

    const recentScores = recentAuditsSnap.docs.map(d => d.data().scorePercentage as number);
    // Include the current submission's score as the most recent one
    const allScores = [scorePercentage, ...recentScores];

    if (allScores.length >= 3 && allScores.slice(0, 3).every(s => s < 60)) {
      adminsSnap.docs.forEach(adminDoc => {
        const trendNotifRef = adminDb.collection('notifications').doc();
        batch.set(trendNotifRef, {
          organizationId,
          recipientId: adminDoc.id,
          recipientRole: 'admin',
          type: 'trend_alert',
          title: `Performance Trend Alert: ${locationName}`,
          message: `${locationName} has scored below 60% on 3 consecutive audits. Priority review required.`,
          relatedId: auditId,
          isRead: false,
          createdAt: FieldValue.serverTimestamp(),
        });
        notificationsSent++;
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, notificationsSent });
  } catch (error: any) {
    console.error('[submit-notifications] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
