'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { calculateAuditScore, ScoreInputQuestion, QuestionType, Severity } from '@/lib/scoring';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/app-ui/dialog';
import { Button } from '@/components/app-ui/button';
import {
  Download,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  MapPin,
  User,
  Calendar,
  Hash,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { exportElementToPDF, buildAuditPDFFilename } from '@/lib/pdf-export';
import { useAuthSync } from '@/components/AuthProvider';

// Grade config using design-system tokens only (no hardcoded palette colors)
function getGradeConfig(grade: string) {
  switch (grade) {
    case 'excellent': return { label: 'Excellent', scoreClass: 'text-success', badgeClass: 'badge-success', barClass: 'bg-success' };
    case 'good': return { label: 'Good', scoreClass: 'text-primary', badgeClass: 'badge-primary', barClass: 'bg-primary' };
    case 'needs_improvement': return { label: 'Needs Improvement', scoreClass: 'text-warning', badgeClass: 'badge-warning', barClass: 'bg-warning' };
    case 'critical_fail': return { label: 'Critical Fail', scoreClass: 'text-destructive', badgeClass: 'badge-danger', barClass: 'bg-destructive' };
    default: return { label: 'Fail', scoreClass: 'text-destructive', badgeClass: 'badge-danger', barClass: 'bg-destructive' };
  }
}

export default function AuditReportDetailPage() {
  const { isSynced } = useAuthSync();
  const { auditId } = useParams();
  const [audit, setAudit] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSynced) return;
    async function fetchReportData() {
      try {
        const auditDoc = await getDoc(doc(db, 'audits', auditId as string));
        if (!auditDoc.exists()) return;
        const auditData = { id: auditDoc.id, ...auditDoc.data() } as any;

        // Fetch responses
        const responsesSnap = await getDocs(query(
          collection(db, 'auditResponses'),
          where('auditId', '==', auditId)
        ));
        const responsesData = responsesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

        // Fetch template questions to enrich responses with missing fields
        let templateQuestions: Record<string, any> = {};
        if (auditData.templateId) {
          try {
            const qSnap = await getDocs(query(
              collection(db, 'auditTemplates', auditData.templateId, 'questions'),
              orderBy('order', 'asc')
            ));
            qSnap.docs.forEach(d => { templateQuestions[d.id] = { id: d.id, ...d.data() }; });
          } catch (_) { /* template may be deleted */ }
        }

        // Enrich responses: fill missing questionText, severity, questionType from template
        const enriched = responsesData.map((r: any) => {
          const tq = templateQuestions[r.questionId];
          return {
            ...r,
            questionText: r.questionText || tq?.questionText || '—',
            severity: r.severity || tq?.severity || 'medium',
            questionType: r.questionType || tq?.questionType || 'yes_no',
            order: r.order ?? tq?.order ?? 0,
          };
        });

        // Always recalculate score from actual answered responses only
        const scoringInput: ScoreInputQuestion[] = enriched
          .filter((r: any) => {
            if (r.questionType === 'yes_no') return r.answer === 'yes' || r.answer === 'no';
            return r.score !== null && r.score !== undefined;
          })
          .map((r: any) => ({
            questionId: r.questionId,
            questionText: r.questionText,
            questionType: r.questionType as QuestionType,
            severity: (r.severity || 'medium') as Severity,
            answer: r.questionType === 'yes_no'
              ? (r.answer === 'yes' ? 'Yes' : 'No')
              : (r.score ?? null),
          }));

        if (scoringInput.length > 0) {
          const reScore = calculateAuditScore(scoringInput);
          auditData.finalScore = reScore.finalScore;
          auditData.scorePercentage = reScore.finalScore;
          auditData.grade = reScore.grade;
          auditData.hasCriticalFailure = reScore.hasCriticalFailure;
          auditData.criticalFailureCount = reScore.criticalFailureCount;
          auditData.scoringTrace = reScore.trace;
          auditData.weightedEarned = reScore.weightedEarned;
          auditData.weightedMax = reScore.weightedMax;

          // Patch Firestore if stored score differs (fixes reports list display)
          const storedScore = auditDoc.data().scorePercentage ?? auditDoc.data().finalScore;
          if (storedScore !== reScore.finalScore) {
            try {
              await updateDoc(doc(db, 'audits', auditId as string), {
                finalScore: reScore.finalScore,
                scorePercentage: reScore.finalScore,
                grade: reScore.grade,
                hasCriticalFailure: reScore.hasCriticalFailure,
                criticalFailureCount: reScore.criticalFailureCount,
              });
            } catch (_) { /* non-critical; ignore permission errors */ }
          }
        }

        setAudit(auditData);
        setResponses(enriched);
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
      alert('Failed to generate PDF: ' + (error?.message || error));
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-5 w-5 animate-spin text-muted-foreground/40" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="admin">
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">Audit report not found.</p>
        </div>
      </DashboardShell>
    );
  }

  const score = audit.finalScore ?? audit.scorePercentage ?? 0;
  const grade = getGradeConfig(audit.grade ?? '');

  const sortedResponses = [...responses].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Sort findings: critical fails → other fails → passes → unanswered
  const isCritFail = (r: any) => {
    const t = audit.scoringTrace?.find((x: any) => x.questionId === r.questionId);
    if (t) return t.isCriticalFailure;
    return r.severity === 'critical' && (
      (r.questionType === 'yes_no' && r.answer === 'no') ||
      (r.questionType !== 'yes_no' && r.score < 6)
    );
  };
  const isPassed = (r: any) =>
    r.answer === 'yes' || (r.questionType !== 'yes_no' && (r.score ?? 0) >= 7);
  const isFailed = (r: any) =>
    r.answer === 'no' || (r.questionType !== 'yes_no' && r.score !== null && r.score !== undefined && (r.score ?? 0) < 7);

  const orderedFindings = [
    ...sortedResponses.filter(isCritFail),
    ...sortedResponses.filter(r => !isCritFail(r) && isFailed(r)),
    ...sortedResponses.filter(r => !isCritFail(r) && !isFailed(r) && isPassed(r)),
    ...sortedResponses.filter(r => !isCritFail(r) && !isFailed(r) && !isPassed(r)),
  ];

  const filteredFindings = selectedSeverity === 'all'
    ? orderedFindings
    : orderedFindings.filter(r => r.severity === selectedSeverity);

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">

        {/* ── Breadcrumb + action row ─────────────────────── */}
        <div className="flex items-center justify-between -mt-2">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/reports"
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 active:scale-90"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="text-muted-foreground/60">Reports</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              <span className="text-foreground font-medium truncate max-w-[240px]">{audit.templateTitle}</span>
            </div>
          </div>
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1.5 text-xs font-medium"
          >
            {isExporting ? <Clock className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            {isExporting ? 'Exporting…' : 'Export PDF'}
          </Button>
        </div>

        {/* ── Report content ──────────────────────────────── */}
        <div ref={reportRef} className="flex flex-col gap-5">

          {/* ── Hero card ─────────────────────────────────── */}
          <div className="standard-card overflow-hidden">



            <div className="p-6 md:p-8">
              {/* Title */}
              <div className="mb-6">
                <h1 className="text-[20px] font-semibold text-heading leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {audit.templateTitle}
                </h1>
              </div>

              {/* Metadata + score */}
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">

                {/* Meta grid */}
                <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                  <ReportMeta icon={MapPin} label="Location" value={audit.locationName || '—'} />
                  <ReportMeta icon={Calendar} label="Completed" value={audit.completedAt ? format(audit.completedAt.toDate(), 'MMM d, yyyy') : '—'} />
                  <ReportMeta icon={User} label="Auditor" value={audit.assignedAuditorName || 'System'} />
                  <ReportMeta icon={Hash} label="Audit ID" value={String(audit.id).slice(0, 16)} mono />
                </div>

                {/* Score panel */}
                <div className="shrink-0 flex flex-col items-start md:items-end gap-2.5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Compliance Score</p>
                  <div className={cn('text-[52px] font-bold tabular-nums leading-none', grade.scoreClass)} style={{ letterSpacing: '-0.035em' }}>
                    {score}<span className="text-[26px] font-semibold opacity-50">%</span>
                  </div>
                  <span className={cn('status-badge-sm', grade.badgeClass)}>
                    {grade.label}
                  </span>
                  {/* Progress bar */}
                  <div className="w-full md:w-40 h-[3px] bg-border rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-[width] duration-700', grade.barClass)} style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Severity Breakdown & Filter (Merged) ───── */}
            {sortedResponses.length > 0 && (
              <div className="border-t border-border/50 p-6 md:p-8 bg-muted/[0.08]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <p className="card-section-title">Severity Breakdown</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Click any severity level to filter the findings list below.</p>
                  </div>
                  {selectedSeverity !== 'all' && (
                    <button
                      onClick={() => setSelectedSeverity('all')}
                      className="text-[11.5px] font-medium text-primary hover:underline text-left sm:text-right"
                    >
                      Reset filter (show all)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['critical', 'medium', 'low'] as const).map((sev) => {
                    const sevResponses = sortedResponses.filter(
                      (r) => (r.severity || 'medium').toLowerCase() === sev
                    );
                    const count = sevResponses.length;
                    if (count === 0) return null;

                    const passedInSev = sevResponses.filter(isPassed).length;
                    const failedInSev = sevResponses.filter(isFailed).length;
                    const passRate = Math.round((passedInSev / count) * 100);
                    const isSelected = selectedSeverity === sev;

                    const label = sev === 'critical' ? 'Critical' : sev === 'medium' ? 'Medium' : 'Low';
                    const barColor = sev === 'critical' ? 'bg-destructive' : sev === 'medium' ? 'bg-warning' : 'bg-primary';

                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSelectedSeverity(isSelected ? 'all' : sev)}
                        className={cn(
                          'text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-center group cursor-pointer',
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.04]'
                            : 'border-border/60 hover:border-border hover:bg-muted/40 bg-background'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[13px] font-semibold text-heading">{label}</span>
                          <span className={cn(
                            'text-[13px] font-bold tabular-nums',
                            failedInSev === 0 ? 'text-success' : 'text-foreground'
                          )}>
                            {passedInSev} / {count} passed
                          </span>
                        </div>

                        {/* Progress Bar (Pass Rate) */}
                        <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', barColor)}
                            style={{ width: `${passRate}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Findings ─────────────────────────────────────── */}
          <div className="standard-card">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <p className="card-section-title">Findings</p>
                {selectedSeverity !== 'all' && (
                  <span className="status-badge-xs badge-primary capitalize">
                    {selectedSeverity} only
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {selectedSeverity !== 'all' && (
                  <button
                    onClick={() => setSelectedSeverity('all')}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear filter
                  </button>
                )}
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {filteredFindings.length} of {sortedResponses.length} items
                </span>
              </div>
            </div>

            <div className="divide-y divide-border/40">
              {filteredFindings.map((resp) => {
                const isCrit = isCritFail(resp);
                const isYes = resp.answer === 'yes';
                const isNo = resp.answer === 'no';
                const isRating = resp.questionType !== 'yes_no';
                const passed = isPassed(resp);
                const unanswered = !isYes && !isNo && !isRating;

                // Filter out automated system boilerplate notes
                const noteText = resp.notes?.trim();
                const isSystemBoilerplate =
                  !noteText ||
                  noteText === 'Verified compliant.' ||
                  noteText.startsWith('Non-compliance logged during inspection:');
                const showUserNote = !isSystemBoilerplate;

                return (
                  <div
                    key={resp.id}
                    className={cn(
                      'px-6 md:px-8 py-3.5 transition-colors',
                      isCrit ? 'bg-destructive/[0.04]' : 'hover:bg-muted/15'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">

                      {/* Question Text & Critical Fail Indicator */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={cn('text-[13.5px] leading-snug', resp.questionText === '—' ? 'text-muted-foreground italic' : 'text-heading font-medium')}>
                            {resp.questionText}
                          </p>
                          {isCrit && (
                            <span className="status-badge-xs badge-danger flex items-center gap-1 shrink-0">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              Critical fail
                            </span>
                          )}
                        </div>

                        {/* Real user/auditor notes only */}
                        {showUserNote && (
                          <p className="mt-2 text-[12px] body-text leading-relaxed pl-2.5 border-l-2 border-border/60">
                            {noteText}
                          </p>
                        )}

                        {/* Evidence photos */}
                        {resp.photoUrls?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {resp.photoUrls.map((url: string, pi: number) => (
                              <button
                                key={pi}
                                onClick={() => setSelectedImage(url)}
                                className="h-12 w-12 rounded-lg overflow-hidden border border-border/50 bg-muted/20 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
                              >
                                <Image src={url} alt={`Evidence ${pi + 1}`} width={48} height={48} className="h-full w-full object-cover" unoptimized />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Answer – right side */}
                      <div className="shrink-0 flex items-center">
                        {unanswered ? (
                          <span className="text-[12px] text-muted-foreground/50 font-medium">N/A</span>
                        ) : isRating ? (
                          <span className={cn('text-[15px] font-semibold tabular-nums', passed ? 'text-success' : 'text-destructive')}>
                            {resp.score ?? 0}<span className="text-[11px] text-muted-foreground/50 font-normal">/10</span>
                          </span>
                        ) : (
                          <span className={cn(
                            'status-badge-sm flex items-center gap-1.5',
                            passed ? 'badge-success' : 'badge-danger'
                          )}>
                            {passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {isYes ? 'Yes' : 'No'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-[11px] text-muted-foreground/40">Generated {format(new Date(), 'MMM d, yyyy · h:mm a')}</p>
              <p className="text-[11px] text-muted-foreground/30">Audiment © 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-muted-foreground/30">{audit.id}</p>
              <p className="text-[10px] font-mono text-muted-foreground/20">{audit.locationId}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Image lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Evidence Photo</DialogTitle>
          <DialogDescription className="sr-only">Full-size view of the audit response evidence.</DialogDescription>
          <div className="p-6">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Full-size evidence"
                width={1200}
                height={800}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                unoptimized
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

function ReportMeta({ icon: Icon, label, value, mono = false }: {
  icon: any; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-md bg-muted/50 shrink-0">
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
        <p className={cn('text-[13px] text-heading font-medium truncate', mono && 'font-mono text-[11px] text-muted-foreground')}>
          {value}
        </p>
      </div>
    </div>
  );
}
