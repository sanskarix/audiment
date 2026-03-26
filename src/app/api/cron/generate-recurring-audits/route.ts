import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore';

export async function GET(req: Request) {
  try {
    // 1. Fetch completed audits
    const auditsRef = collection(db, 'audits');
    const q = query(auditsRef, where('status', '==', 'completed'));
    const snapshot = await getDocs(q);
    
    // Filter locally for recurring ones that haven't generated next instance
    const auditsToProcess = snapshot.docs.map(d => ({ id: d.id, ...d.data() as any }))
      .filter(a => a.recurring && a.recurring !== 'none' && !a.nextInstanceGenerated);

    let generatedCount = 0;

    for (const audit of auditsToProcess) {
      // Calculate next scheduled date
      let nextDate = new Date();
      let baseDate = audit.scheduledDate ? audit.scheduledDate.toDate() : new Date();
      
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
        createdAt: serverTimestamp(),
        totalScore: 0,
        maxPossibleScore: 0,
        scorePercentage: 0
      };

      const docRef = await addDoc(collection(db, 'audits'), newAudit);

      // Create notification for Manager
      await addDoc(collection(db, 'notifications'), {
        organizationId: audit.organizationId,
        recipientId: audit.assignedManagerId,
        recipientRole: 'manager',
        type: newAudit.isSurprise ? 'surprise_audit' : 'audit_assigned',
        title: `Recurring Audit Published: ${audit.templateTitle}`,
        message: `A new recurring audit has been generated for ${audit.locationName}. Please assign an auditor.`,
        relatedId: docRef.id,
        isRead: false,
        createdAt: serverTimestamp()
      });

      // Mark original as having generated its next instance
      await updateDoc(doc(db, 'audits', audit.id), {
        nextInstanceGenerated: true
      });

      generatedCount++;
    }

    return NextResponse.json({ success: true, message: `Generated ${generatedCount} recurring audits` }, { status: 200 });

  } catch (error: any) {
    console.error('Error generating recurring audits:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
