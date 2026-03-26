import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  // Check for authorization (e.g. Vercel Cron Secret)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = Timestamp.now();
  const summary: any = {
    auditsProcessed: 0,
    missedAudits: 0,
    caRemindersSent: 0
  };

  try {
    // 1. Check for Missed Audits
    // Audits that are not completed or missed and the deadline has passed
    const auditsRef = adminDb.collection('audits');
    const missedAuditsQuery = auditsRef
      .where('status', 'in', ['published', 'assigned', 'in_progress'])
      .where('deadline', '<', now);
    
    const missedAuditsSnap = await missedAuditsQuery.get();
    summary.auditsProcessed = missedAuditsSnap.size;

    for (const doc of missedAuditsSnap.docs) {
      const audit = doc.data();
      const auditId = doc.id;

      // Update audit status
      await doc.ref.update({
        status: 'missed',
        updatedAt: FieldValue.serverTimestamp()
      });
      summary.missedAudits++;

      // Notify Manager & Admin
      // Fetch all admins for this organization
      const adminsSnap = await adminDb.collection('users')
        .where('organizationId', '==', audit.organizationId)
        .where('role', '==', 'ADMIN')
        .get();
      
      const adminIds = adminsSnap.docs.map(d => d.id);
      const recipientIds = new Set([audit.assignedManagerId, ...adminIds]);

      for (const recipientId of Array.from(recipientIds)) {
        if (!recipientId) continue;
        const recipientDoc = await adminDb.collection('users').doc(recipientId).get();
        const recipientRole = (recipientDoc.data()?.role || 'manager').toLowerCase();

        await adminDb.collection('notifications').add({
          organizationId: audit.organizationId,
          recipientId,
          recipientRole,
          type: 'audit_missed',
          title: `Audit Missed: ${audit.templateTitle}`,
          message: `The audit for ${audit.locationName} has passed its deadline and is now marked as missed.`,
          relatedId: auditId,
          isRead: false,
          createdAt: FieldValue.serverTimestamp()
        });
      }
    }

    // 2. Check for Corrective Action Deadlines (6 hours before)
    // Deadline is between (now) and (now + 6 hours)
    const sixHoursLater = new Timestamp(now.seconds + (6 * 60 * 60), now.nanoseconds);
    const caRef = adminDb.collection('correctiveActions');
    const caReminderQuery = caRef
      .where('status', 'in', ['open', 'in_progress'])
      .where('deadline', '>', now)
      .where('deadline', '<=', sixHoursLater);
    
    const caSnap = await caReminderQuery.get();

    for (const doc of caSnap.docs) {
      const ca = doc.data();
      // Only send if we haven't sent a deadline reminder recently
      if (ca.lastDeadlineReminderSentAt) {
        continue;
      }

      // Notify Manager
      await adminDb.collection('notifications').add({
        organizationId: ca.organizationId,
        recipientId: ca.assignedManagerId,
        recipientRole: 'manager',
        type: 'corrective_action',
        title: `Deadline Approaching: Corrective Action`,
        message: `The corrective action for ${ca.locationName} ("${ca.questionText}") is due in less than 6 hours.`,
        relatedId: ca.auditId,
        isRead: false,
        createdAt: FieldValue.serverTimestamp()
      });

      // Mark as reminded
      await doc.ref.update({
        lastDeadlineReminderSentAt: FieldValue.serverTimestamp()
      });
      summary.caRemindersSent++;
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toDate().toISOString(),
      summary
    });
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
