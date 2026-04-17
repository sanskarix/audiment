import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  // ── Security: validate Vercel / platform cron secret ──────────────────────
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch completed audits that are recurring and haven't generated a next instance
    const snapshot = await adminDb.collection('audits')
      .where('status', '==', 'completed')
      .where('nextInstanceGenerated', '==', false)
      .get();

    // Also fetch audits where nextInstanceGenerated is not set (legacy documents)
    const snapshotLegacy = await adminDb.collection('audits')
      .where('status', '==', 'completed')
      .get();

    const seen = new Set<string>();
    const auditsToProcess: any[] = [];

    for (const d of [...snapshot.docs, ...snapshotLegacy.docs]) {
      if (seen.has(d.id)) continue;
      seen.add(d.id);
      const data = { id: d.id, ...d.data() };
      const a = data as any;
      if (a.recurring && a.recurring !== 'none' && !a.nextInstanceGenerated) {
        auditsToProcess.push(a);
      }
    }

    let generatedCount = 0;

    for (const audit of auditsToProcess) {
      // Calculate next scheduled date
      let nextDate = new Date();
      const baseDate: Date = audit.scheduledDate ? audit.scheduledDate.toDate() : new Date();

      if (audit.recurring === 'daily') {
        nextDate = new Date(baseDate);
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (audit.recurring === 'weekly') {
        nextDate = new Date(baseDate);
        nextDate.setDate(nextDate.getDate() + 7);
        if (audit.recurringDay !== undefined) {
          const currentDay = nextDate.getDay();
          const diff = audit.recurringDay - currentDay;
          nextDate.setDate(nextDate.getDate() + diff);
        }
      } else if (audit.recurring === 'monthly') {
        nextDate = new Date(baseDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        if (audit.recurringDay !== undefined) {
          nextDate.setDate(Math.min(audit.recurringDay, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()));
        }
      }

      // Calculate next deadline mapping the original duration
      const durationMs = audit.deadline && audit.scheduledDate
        ? audit.deadline.toDate().getTime() - audit.scheduledDate.toDate().getTime()
        : 7 * 24 * 60 * 60 * 1000;

      const nextDeadline = new Date(nextDate.getTime() + durationMs);

      // Create the new audit instance
      const newAudit = {
        organizationId: audit.organizationId,
        templateId: audit.templateId,
        templateTitle: audit.templateTitle,
        locationId: audit.locationId,
        locationName: audit.locationName,
        assignedManagerId: audit.assignedManagerId,
        isSurprise: audit.isSurprise || false,
        recurring: audit.recurring,
        recurringDay: audit.recurringDay || null,
        scheduledDate: Timestamp.fromDate(nextDate),
        deadline: Timestamp.fromDate(nextDeadline),
        publishedBy: audit.publishedBy || 'cron',
        assignedAuditorId: '',
        status: 'published',
        createdAt: FieldValue.serverTimestamp(),
        totalScore: 0,
        maxPossibleScore: 0,
        scorePercentage: 0,
        nextInstanceGenerated: false,
      };

      const docRef = await adminDb.collection('audits').add(newAudit);

      // Create notification for Manager
      await adminDb.collection('notifications').add({
        organizationId: audit.organizationId,
        recipientId: audit.assignedManagerId,
        recipientRole: 'manager',
        type: newAudit.isSurprise ? 'surprise_audit' : 'audit_assigned',
        title: `Recurring Audit Published: ${audit.templateTitle}`,
        message: `A new recurring audit has been generated for ${audit.locationName}. Please assign an auditor.`,
        relatedId: docRef.id,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Mark original as having generated its next instance
      await adminDb.collection('audits').doc(audit.id).update({
        nextInstanceGenerated: true,
      });

      generatedCount++;
    }

    return NextResponse.json(
      { success: true, message: `Generated ${generatedCount} recurring audits` },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error generating recurring audits:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
