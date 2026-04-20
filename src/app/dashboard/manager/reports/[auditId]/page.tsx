'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  MapPin,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { exportElementToPDF, buildAuditPDFFilename } from '@/lib/pdf-export';
import { useAuthSync } from '@/components/AuthProvider';

export default function ManagerReportDetailPage() {
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

          // Recalculate if version mismatch or missing to ensure consistency
          if (auditData.scoringVersion !== SCORING_VERSION) {
            console.log(`[ManagerReport] Scoring version mismatch (${auditData.scoringVersion} vs ${SCORING_VERSION}). Recalculating...`);
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
      alert('Failed to generate PDF: ' + (error?.message || error) + '\\n\\nPlease share this exact error message.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-4 w-4 animate-spin text-muted-text" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="manager">
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <p className="text-muted-text font-normal">This report was not found or is no longer available.</p>
          <Button variant="link" asChild className="mt-2 text-primary">
            <Link href="/dashboard/manager/reports">Return to Archive</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-8">
          <div className="flex items-center justify-between gap-6 w-full">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/manager/reports" className="text-muted-text hover:text-primary transition-colors flex items-center">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="h-5 w-[1px] bg-border/80"></div>
              <h1 className="text-xl font-semibold text-heading">Detailed Report</h1>
            </div>
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              className="font-medium gap-2 h-10 px-5 text-xs shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isExporting ? 'Compiling...' : 'Export'}
            </Button>
          </div>
        </div>

        <div ref={reportRef} className="standard-card p-10 bg-background">
          {/* Report Header */}
          {audit.hasCriticalFailure && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive text-destructive font-bold flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              ⚠️ {audit.criticalFailureCount} Critical Failure(s)
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-10 mb-10 gap-10">
            <div className="space-y-6 flex-1">
              <h1 className="text-[28px] font-semibold text-heading leading-tight">{audit.templateTitle}</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-wider">Location</p>
                  <p className="text-body flex items-center gap-2.5 whitespace-nowrap">{audit.locationName}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-wider">Completed On</p>
                  <p className="text-body flex items-center gap-2.5 whitespace-nowrap">{audit.completedAt ? format(audit.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-wider">Auditor</p>
                  <p className="text-body flex items-center gap-2.5 whitespace-nowrap">{audit.assignedAuditorName || 'System'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-muted/5 border border-border/50 min-w-[220px]">
              <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-wider mb-2">Final Score</p>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "text-[42px] font-bold tabular-nums leading-none",
                  (audit.finalScore ?? audit.scorePercentage) >= 90 ? "text-success" : (audit.finalScore ?? audit.scorePercentage) >= 75 ? "text-primary" : "text-destructive"
                )}>{audit.finalScore ?? audit.scorePercentage}%</div>
                {audit.grade && (
                  <Badge variant="outline" className={cn(
                    "uppercase tracking-wider font-bold",
                    audit.grade === 'critical_fail' ? "border-destructive text-destructive" :
                    audit.grade === 'fail' ? "border-destructive text-destructive" :
                    audit.grade === 'excellent' ? "border-success text-success" :
                    "border-primary text-primary"
                  )}>
                    {audit.grade.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <div className="h-2 w-full bg-muted/20 rounded-full mt-6 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    (audit.finalScore ?? audit.scorePercentage) >= 90 ? "bg-success" : (audit.finalScore ?? audit.scorePercentage) >= 75 ? "bg-primary" : "bg-destructive"
                  )}
                  style={{ width: `${audit.finalScore ?? audit.scorePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Response Details */}
          <div className="space-y-8">
            <h3 className="text-[14px] font-medium text-heading mb-6 px-1">Detailed Findings</h3>
            <div className="grid gap-4">
              {responses.sort((a, b) => (a.order || 0) - (b.order || 0)).map((resp, i) => (
                <div key={resp.id} className="border border-border/40 hover:bg-muted/5 transition-all p-8 rounded-xl group/row">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start justify-between gap-10">
                        <div className="space-y-3">
                          <p className="text-[16px] font-normal text-body leading-relaxed">{resp.questionText}</p>
                          <div className="flex flex-wrap items-center gap-3">
                             <Badge variant="secondary" className="h-6 rounded-full bg-muted/20 text-muted-text border-none px-2.5 text-[11px] font-normal capitalize">
                               {String(resp.severity ?? '').toLowerCase()} Quality
                             </Badge>
                             {(() => {
                               const traceItem = audit.scoringTrace?.find((t: any) => t.questionId === resp.questionId);
                               const isFailed = traceItem 
                                 ? traceItem.isCriticalFailure 
                                 : (resp.severity === 'critical' && (
                                     (resp.questionType === 'yes_no' && resp.answer === 'no') ||
                                     (resp.questionType === 'rating' && resp.score < 6)
                                   ));
                               return isFailed ? (
                                 <Badge variant="destructive" className="h-6 rounded-full px-2.5 text-[11px] font-bold uppercase tracking-wider">
                                   CRITICAL FAIL
                                 </Badge>
                               ) : null;
                             })()}
                            {resp.notes && (
                              <div className="flex items-center gap-2.5 bg-muted/5 px-3 py-1.5 rounded-lg border border-border/50">
                                <span className="body-text text-muted-text">
                                  <b>Note:</b> {resp.notes}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                          <div className={cn(
                            "h-8 rounded-full border-none px-4 text-[13px] font-medium flex items-center gap-2",
                            resp.answer === 'yes' ? "bg-success/10 text-success" :
                              resp.answer === 'no' ? "bg-destructive/10 text-destructive" :
                                "bg-muted/10 text-muted-text"
                          )}>
                            {resp.answer === 'yes' ? <CheckCircle2 className="h-3.5 w-3.5" /> : resp.answer === 'no' ? <XCircle className="h-3.5 w-3.5" /> : <HelpCircle className="h-3.5 w-3.5" />}
                            <span className="capitalize">{resp.answer}</span>
                          </div>
                          <p className="text-[11px] font-normal text-muted-text/40 tabular-nums px-2">
                            {resp.questionType === 'yes_no' 
                              ? (resp.answer === 'yes' ? 10 : 0) 
                              : (resp.score ?? 0)} / 10 pts
                          </p>
                        </div>
                      </div>

                      {resp.photoUrls && resp.photoUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-border/30">
                          {resp.photoUrls.map((url: string, pi: number) => (
                            <div 
                              key={pi} 
                              className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-muted/5 transition-all hover:scale-[1.02] cursor-pointer"
                              onClick={() => setSelectedImage(url)}
                            >
                              <Image src={url} alt={`Evidence ${pi + 1}`} width={150} height={150} className="h-full w-full object-cover" unoptimized />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between text-[11px] font-normal text-muted-text/30 gap-8 uppercase tracking-widest">
            <div className="space-y-1 text-center md:text-left">
              <p>Generated On {format(new Date(), 'MMMM d, yyyy h:mm a')}</p>
              <p>Audiment &copy; 2026</p>
            </div>
            <div className="text-center md:text-right space-y-1">
              <p>Report ID: {audit.id}</p>
              <p>Location ID: {audit.locationId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Evidence Photo</DialogTitle>
          <DialogDescription className="sr-only">Full-size view of the audit response evidence.</DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {selectedImage && (
              <Image 
                src={selectedImage} 
                alt="Full-size evidence" 
                width={1200}
                height={800}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
                unoptimized
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
