'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { calculateAuditScore, ScoreInputQuestion, QuestionType, Severity, SCORING_VERSION } from '@/lib/scoring';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/app-ui/dialog';
import { Button } from '@/components/app-ui/button';
import {
  FileText,
  Download,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { exportElementToPDF, buildAuditPDFFilename } from '@/lib/pdf-export';
import { useAuthSync } from '@/components/AuthProvider';

export default function AuditReportDetailPage() {
  const { isSynced } = useAuthSync();
  const { auditId } = useParams();
  const [audit, setAudit] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSynced) return;
    async function fetchReportData() {
      try {
        const auditDoc = await getDoc(doc(db, 'audits', auditId as string));
        if (auditDoc.exists()) {
          const auditData = { id: auditDoc.id, ...auditDoc.data() } as any;

          const responsesSnap = await getDocs(query(
            collection(db, 'auditResponses'),
            where('auditId', '==', auditId)
          ));
          const responsesData = responsesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          if (auditData.scoringVersion !== SCORING_VERSION) {
            const input: ScoreInputQuestion[] = responsesData.map((r: any) => ({
              questionId: r.questionId,
              questionText: r.questionText,
              questionType: r.questionType as QuestionType,
              severity: (r.severity || 'medium') as Severity,
              answer: r.questionType === 'yes_no'
                ? (r.answer === 'yes' ? 'Yes' : r.answer === 'no' ? 'No' : null)
                : (r.score ?? null)
            }));
            const reScore = calculateAuditScore(input);
            auditData.finalScore = reScore.finalScore;
            auditData.scorePercentage = reScore.finalScore;
            auditData.grade = reScore.grade;
            auditData.hasCriticalFailure = reScore.hasCriticalFailure;
            auditData.criticalFailureCount = reScore.criticalFailureCount;
            auditData.scoringTrace = reScore.trace;
          }

          setAudit(auditData);
          setResponses(responsesData);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [auditId, isSynced]);

  const exportToPDF = async () => {
    if (!reportRef.current || !audit) return;
    setIsExporting(true);
    try {
      const filename = buildAuditPDFFilename(audit.locationName, audit.templateTitle);
      await exportElementToPDF(reportRef.current, filename);
    } catch (error: any) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF: ' + (error?.message || error));
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-5 w-5 animate-spin text-muted-text/40" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="admin">
        <div className="text-center py-20">
          <p className="text-muted-text text-sm">Audit report not found.</p>
        </div>
      </DashboardShell>
    );
  }

  const score = audit.finalScore ?? audit.scorePercentage ?? 0;
  const scoreColor = score >= 90 ? 'text-success' : score >= 70 ? 'text-primary' : 'text-destructive';
  const trackColor = score >= 90 ? 'bg-success' : score >= 70 ? 'bg-primary' : 'bg-destructive';

  const sortedResponses = [...responses].sort((a, b) => (a.order || 0) - (b.order || 0));
  const passedCount = sortedResponses.filter(r => r.answer === 'yes' || (r.questionType === 'rating' && (r.score ?? 0) >= 7)).length;
  const failedCount = sortedResponses.filter(r => r.answer === 'no' || (r.questionType === 'rating' && (r.score ?? 0) < 7)).length;

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin/reports"
              className="text-muted-text/50 hover:text-heading transition-colors duration-150 active:scale-95"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
            <span className="text-border/60 select-none">/</span>
            <h1 className="text-sm font-medium text-muted-text">Report</h1>
          </div>
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            variant="outline"
            className="h-9 px-4 gap-2 text-xs font-medium border-border/50 text-muted-text hover:text-heading hover:border-border transition-all duration-150 active:scale-[0.98]"
          >
            {isExporting
              ? <Clock className="h-3.5 w-3.5 animate-spin" />
              : <Download className="h-3.5 w-3.5" />
            }
            {isExporting ? 'Exporting…' : 'Export PDF'}
          </Button>
        </div>

        {/* Report body */}
        <div ref={reportRef} className="standard-card bg-card">

          {/* ── Report hero ───────────────────────────────────── */}
          <div className="px-8 pt-10 pb-8 border-b border-border/40">

            {/* Critical failure notice – only when needed */}
            {audit.hasCriticalFailure && (
              <div className="flex items-start gap-3 mb-7 px-4 py-3.5 rounded-xl bg-destructive/5 border border-destructive/15">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-[13px] text-destructive leading-snug">
                  <span className="font-semibold">{audit.criticalFailureCount} critical failure{audit.criticalFailureCount !== 1 ? 's' : ''}</span>
                  {' '}– immediate action required.
                </p>
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Title + metadata */}
              <div className="space-y-5 flex-1 min-w-0">
                <div>
                  <p className="text-[11px] font-medium text-muted-text/50 uppercase tracking-[0.08em] mb-2">
                    Compliance Audit
                  </p>
                  <h2
                    className="text-[22px] font-semibold text-heading leading-[1.2]"
                    style={{ letterSpacing: '-0.015em' }}
                  >
                    {audit.templateTitle}
                  </h2>
                </div>

                {/* Metadata – plain text rows, no icon boxes */}
                <dl className="space-y-2.5">
                  <div className="flex items-baseline gap-3">
                    <dt className="text-[11px] font-medium text-muted-text/40 uppercase tracking-[0.07em] w-24 shrink-0">Location</dt>
                    <dd className="text-[13px] text-heading font-medium truncate" title={audit.locationName}>
                      {audit.locationName}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="text-[11px] font-medium text-muted-text/40 uppercase tracking-[0.07em] w-24 shrink-0">Completed</dt>
                    <dd className="text-[13px] text-body">
                      {audit.completedAt ? format(audit.completedAt.toDate(), 'MMMM d, yyyy') : '–'}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="text-[11px] font-medium text-muted-text/40 uppercase tracking-[0.07em] w-24 shrink-0">Auditor</dt>
                    <dd className="text-[13px] text-body">{audit.assignedAuditorName || 'System'}</dd>
                  </div>
                </dl>
              </div>

              {/* Score panel – clean number, no decorative ring */}
              <div className="lg:text-right shrink-0 space-y-3">
                <p className="text-[11px] font-medium text-muted-text/40 uppercase tracking-[0.07em]">
                  Compliance score
                </p>
                <div className={cn('text-[52px] font-bold tabular-nums leading-none', scoreColor)}
                  style={{ letterSpacing: '-0.03em' }}>
                  {score}<span className="text-[28px] font-semibold opacity-60">%</span>
                </div>
                {audit.grade && (
                  <p className={cn('text-[12px] font-medium capitalize', scoreColor)}>
                    {audit.grade.replace('_', ' ')}
                  </p>
                )}
                {/* Hairline progress track */}
                <div className="h-[3px] w-full lg:w-48 bg-muted/20 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700 ease-out', trackColor)}
                    style={{ width: `${score}%` }}
                  />
                </div>
                {/* Quick counts */}
                <div className="flex lg:justify-end gap-4 pt-1">
                  <span className="text-[11px] text-success font-medium tabular-nums">{passedCount} passed</span>
                  <span className="text-[11px] text-destructive font-medium tabular-nums">{failedCount} failed</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Findings list ─────────────────────────────────── */}
          <div className="px-8 py-6">

            <div className="flex items-center justify-between mb-1 pb-4 border-b border-border/30">
              <h3
                className="text-[13px] font-semibold text-heading"
                style={{ letterSpacing: '-0.01em' }}
              >
                Findings
              </h3>
              <span className="text-[11px] text-muted-text/50 tabular-nums">{sortedResponses.length} items</span>
            </div>

            <div className="divide-y divide-border/25">
              {sortedResponses.map((resp) => {
                const traceItem = audit.scoringTrace?.find((t: any) => t.questionId === resp.questionId);
                const isCriticalFail = traceItem
                  ? traceItem.isCriticalFailure
                  : (resp.severity === 'critical' && (
                    (resp.questionType === 'yes_no' && resp.answer === 'no') ||
                    (resp.questionType === 'rating' && resp.score < 6)
                  ));
                const isYes = resp.answer === 'yes';
                const isNo = resp.answer === 'no';
                const pts = resp.questionType === 'yes_no' ? (isYes ? 10 : 0) : (resp.score ?? 0);

                return (
                  <div key={resp.id} className="py-5 group">
                    <div className="flex items-start gap-4">

                      {/* Status dot – the one piece of color that matters */}
                      <div className={cn(
                        'mt-[5px] h-2 w-2 rounded-full shrink-0',
                        isCriticalFail ? 'bg-destructive ring-4 ring-destructive/10' :
                          isNo ? 'bg-destructive/70' :
                          isYes ? 'bg-success' :
                          'bg-muted/50'
                      )} />

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-[13.5px] text-heading leading-snug font-normal">
                          {resp.questionText}
                        </p>

                        {/* Inline tags – only what's meaningful */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] text-muted-text/50 capitalize">
                            {String(resp.severity ?? '').toLowerCase()} severity
                          </span>
                          {isCriticalFail && (
                            <span className="text-[10px] font-semibold text-destructive uppercase tracking-[0.06em]">
                              · Critical fail
                            </span>
                          )}
                        </div>

                        {/* Note callout – only when present */}
                        {resp.notes && (
                          <p className="text-[12px] text-muted-text leading-relaxed mt-2 pl-3 border-l-2 border-border/40">
                            {resp.notes}
                          </p>
                        )}

                        {/* Evidence thumbnails */}
                        {resp.photoUrls && resp.photoUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {resp.photoUrls.map((url: string, pi: number) => (
                              <button
                                key={pi}
                                onClick={() => setSelectedImage(url)}
                                className="group/img relative h-14 w-14 rounded-lg overflow-hidden border border-border/40 bg-muted/10 transition-opacity hover:opacity-80 active:scale-95 active:opacity-70"
                                style={{ transition: 'transform 120ms ease-out, opacity 120ms ease-out' }}
                              >
                                <Image
                                  src={url}
                                  alt={`Evidence ${pi + 1}`}
                                  width={56}
                                  height={56}
                                  className="h-full w-full object-cover"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Answer + score – right-aligned, no badge box */}
                      <div className="shrink-0 text-right space-y-0.5 pt-0.5">
                        <p className={cn(
                          'text-[13px] font-semibold capitalize leading-none',
                          isYes ? 'text-success' : isNo ? 'text-destructive' : 'text-muted-text'
                        )}>
                          {resp.answer || '–'}
                        </p>
                        <p className="text-[11px] text-muted-text/40 tabular-nums">
                          {pts}/10
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div className="px-8 py-6 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-text/30 font-medium">
                Generated {format(new Date(), 'MMMM d, yyyy · h:mm a')}
              </p>
              <p className="text-[11px] text-muted-text/25">Audiment © 2026</p>
            </div>
            <div className="text-right space-y-0.5">
              <p className="text-[11px] text-muted-text/30 font-mono">{audit.id}</p>
              <p className="text-[11px] text-muted-text/25 font-mono">{audit.locationId}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Image lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Evidence Photo</DialogTitle>
          <DialogDescription className="sr-only">Full-size view of the audit response evidence.</DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center p-6">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Full-size evidence"
                width={1200}
                height={800}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                style={{ animation: 'none' }}
                unoptimized
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
