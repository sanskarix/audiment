'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ManagerReportDetailPage() {
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
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // html2canvas CSS parser crashes on oklch/oklab. 
          // We must aggressively REMOVE all original styles before it scans them.
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach(s => s.remove());

          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            :root {
              --background: #ffffff;
              --foreground: #121317;
              --card: #ffffff;
              --card-foreground: #121317;
              --popover: #ffffff;
              --popover-foreground: #121317;
              --primary: #3B82F6;
              --primary-foreground: #ffffff;
              --secondary: #F4F4F5;
              --secondary-foreground: #18181b;
              --muted: #F4F4F5;
              --muted-foreground: #71717a;
              --accent: #F4F4F5;
              --accent-foreground: #18181b;
              --destructive: #EF4444;
              --destructive-foreground: #ffffff;
              --success: #22C55E;
              --success-foreground: #ffffff;
              --warning: #F59E0B;
              --warning-foreground: #ffffff;
              --border: #E5E7EB;
              --input: #E5E7EB;
              --ring: #3B82F6;
            }

            body, * {
              font-family: sans-serif !important;
              color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }

            .standard-card {
              border: 1px solid #E5E7EB !important;
              border-radius: 12px !important;
              background-color: #ffffff !important;
            }

            .badge {
              display: inline-flex !important;
              align-items: center !important;
              border-radius: 9999px !important;
              padding: 2px 8px !important;
              font-size: 11px !important;
              font-weight: 500 !important;
            }

            .bg-success { background-color: #22C55E !important; color: #ffffff !important; }
            .bg-primary { background-color: #3B82F6 !important; color: #ffffff !important; }
            .bg-destructive { background-color: #EF4444 !important; color: #ffffff !important; }
            .bg-warning { background-color: #F59E0B !important; color: #ffffff !important; }
            .bg-muted\\/5, .bg-muted\\/10, .bg-muted\\/20, .bg-muted\\/30 { background-color: #F4F4F5 !important; }
            .text-success { color: #22C55E !important; }
            .text-primary { color: #3B82F6 !important; }
            .text-destructive { color: #EF4444 !important; }
            .text-warning { color: #F59E0B !important; }
            .text-heading { color: #121317 !important; }
            .text-body { color: #45474D !important; }
            .text-muted-text { color: #6B7280 !important; }
            
            svg { stroke: currentColor; fill: none; }
            .fill-current { fill: currentColor; }
            
            /* Add structural layout support for the PDF */
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .items-center { align-items: center !important; }
            .items-start { align-items: flex-start !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-center { justify-content: center !important; }
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .gap-1\\.5 { gap: 0.375rem !important; }
            .gap-3 { gap: 0.75rem !important; }
            .gap-4 { gap: 1rem !important; }
            .gap-6 { gap: 1.5rem !important; }
            .gap-8 { gap: 2rem !important; }
            .gap-10 { gap: 2.5rem !important; }
            .p-10 { padding: 2.5rem !important; }
            .p-8 { padding: 2rem !important; }
            .pt-4 { padding-top: 1rem !important; }
            .pb-10 { padding-bottom: 2.5rem !important; }
            .mb-10 { margin-bottom: 2.5rem !important; }
            .mb-6 { margin-bottom: 1.5rem !important; }
            .border-b { border-bottom: 1px solid #E5E7EB !important; }
            .border-t { border-top: 1px solid #E5E7EB !important; }
            .border { border: 1px solid #E5E7EB !important; }
            .w-full { width: 100% !important; }
            .flex-1 { flex: 1 1 0% !important; }
            .rounded-xl { border-radius: 0.75rem !important; }
            .rounded-2xl { border-radius: 1rem !important; }
            .rounded-full { border-radius: 9999px !important; }
            .text-\\[28px\\] { font-size: 28px !important; }
            .text-\\[42px\\] { font-size: 42px !important; }
            .font-bold { font-weight: 700 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-medium { font-weight: 500 !important; }
            .uppercase { text-transform: uppercase !important; }
          `;
          clonedDoc.head.appendChild(style);

          // Also forcibly strip computed SVG styles that might have been copied inline 
          const svgs = clonedDoc.querySelectorAll('svg');
          svgs.forEach(svg => {
            svg.style.color = '';
            svg.style.stroke = '';
            svg.style.fill = '';
          });
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BranchAuditReport_${audit.locationName}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="h-4 w-4 animate-spin text-muted-text" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="Manager">
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
    <DashboardShell role="Manager">
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
