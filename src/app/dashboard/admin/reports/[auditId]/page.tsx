'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
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
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AuditReportDetailPage() {
  const { auditId } = useParams();
  const [audit, setAudit] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReportData() {
      try {
        const auditDoc = await getDoc(doc(db, 'audits', auditId as string));
        if (auditDoc.exists()) {
          setAudit({ id: auditDoc.id, ...auditDoc.data() });

          const responsesSnap = await getDocs(query(
            collection(db, 'auditResponses'),
            where('auditId', '==', auditId)
          ));
          setResponses(responsesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [auditId]);

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AuditReport_${audit.locationName}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="Admin">
        <div className="text-center py-20">
          <p className="text-muted-text font-normal">Audit report not found.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" asChild className="-ml-3 h-8 w-fit gap-2 text-muted-text hover:bg-transparent hover:text-primary transition-colors text-body">
              <Link href="/dashboard/admin/reports">
                <ArrowLeft className="h-4 w-4" /> Reports
              </Link>
            </Button>
            <h1 className="page-heading">Detailed Report</h1>
            <p className="body-text">Comprehensive findings and performance breakdown for this audit</p>
          </div>
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            className="h-11 font-medium gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>

        <div ref={reportRef} className="standard-card p-10 bg-background">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-10 mb-10 gap-10">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="h-6 rounded-full bg-muted/10 text-muted-text border-none px-2.5 text-[12px] font-normal">Audit Report</Badge>
                <Badge variant="secondary" className="h-6 rounded-full bg-success/10 text-success border-none px-2.5 text-[12px] font-normal">Verified</Badge>
              </div>
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
              <div className={cn(
                "text-[42px] font-bold tabular-nums leading-none",
                audit.scorePercentage >= 90 ? "text-success" : audit.scorePercentage >= 70 ? "text-primary" : "text-destructive"
              )}>{audit.scorePercentage}%</div>
              <div className="h-2 w-full bg-muted/20 rounded-full mt-6 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    audit.scorePercentage >= 90 ? "bg-success" : audit.scorePercentage >= 70 ? "bg-primary" : "bg-destructive"
                  )}
                  style={{ width: `${audit.scorePercentage}%` }}
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
                          <p className="text-[11px] font-normal text-muted-text/40 tabular-nums px-2">{resp.score} / {resp.maxScore || 10} pts</p>
                        </div>
                      </div>

                      {resp.photoUrls && resp.photoUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-border/30">
                          {resp.photoUrls.map((url: string, pi: number) => (
                            <div key={pi} className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-muted/5 transition-all hover:scale-[1.02]">
                              <img src={url} alt={`Evidence ${pi + 1}`} className="h-full w-full object-cover" />
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
    </DashboardShell>
  );
}
