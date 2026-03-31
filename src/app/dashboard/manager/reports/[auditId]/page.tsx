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
        <div className="page-header-section mb-xl flex flex-col md:flex-row md:items-start justify-between gap-xl">
          <div className="flex flex-col gap-xs">
            <Button variant="ghost" asChild className="-ml-4 gap-2 text-muted-text font-medium uppercase tracking-widest text-xs hover:bg-transparent hover:text-primary transition-colors">
              <Link href="/dashboard/manager/reports">
                <ArrowLeft className="h-4 w-4" /> Performance Archive
              </Link>
            </Button>
            <h1 className="page-heading mt-2">Analytical Intelligence</h1>
            <p className="body-text">Comprehensive verification of location quality standards</p>
          </div>
          <Button 
            onClick={exportToPDF} 
            disabled={isExporting}
            className="font-medium gap-2 h-10 px-6 uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 mt-4 md:mt-0"
          >
            {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? 'Compiling PDF...' : 'Export Intelligence'}
          </Button>
        </div>

        <div ref={reportRef} className="standard-card p-xl md:p-2xl bg-background border border-border/50">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-xl mb-xl gap-xl">
            <div className="flex flex-col gap-md flex-1">
              <div className="flex items-center gap-3">
                 <Badge variant="outline" className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 border-border text-muted-text bg-muted/30">STRATEGIC DOSSIER</Badge>
                 <Badge variant="outline" className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 bg-success/10 text-success border-success/30">VERIFIED</Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-heading uppercase">{audit.templateTitle}</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-lg pt-2">
                <div className="flex flex-col gap-xs">
                  <p className="text-[10px] font-normal text-muted-text uppercase tracking-widest">Inspected Location</p>
                  <p className="text-sm font-normal text-heading flex items-center gap-2"><MapPin className="h-4 w-4 text-primary opacity-60" /> {audit.locationName}</p>
                </div>
                <div className="flex flex-col gap-xs">
                  <p className="text-[10px] font-normal text-muted-text uppercase tracking-widest">Submission Date</p>
                  <p className="text-sm font-normal text-heading flex items-center gap-2"><Calendar className="h-4 w-4 text-primary opacity-60" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                </div>
                <div className="flex flex-col gap-xs col-span-2 md:col-span-1">
                   <p className="text-[10px] font-normal text-muted-text uppercase tracking-widest">Field Auditor</p>
                   <p className="text-sm font-normal text-heading flex items-center gap-2"><User className="h-4 w-4 text-primary opacity-60" /> {audit.assignedAuditorName || 'System Generated'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-muted/10 border border-border/50 p-xl rounded-2xl min-w-[200px] shadow-sm">
               <p className="text-[10px] font-normal tracking-widest uppercase text-muted-text">SCORE INDEX</p>
               <div className="text-6xl font-medium tracking-tight py-2 text-heading">{audit.scorePercentage}%</div>
               <div className="h-2 w-full bg-muted/30 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        audit.scorePercentage >= 90 ? "bg-success" : audit.scorePercentage >= 70 ? "bg-primary" : "bg-warning"
                    )} 
                    style={{ width: `${audit.scorePercentage}%` }} 
                  />
               </div>
            </div>
          </div>

          {/* Response Details */}
          <div className="flex flex-col gap-lg">
            <h3 className="section-heading text-lg">Verification Insights</h3>
            <div className="grid gap-xl">
               {responses.sort((a,b) => (a.order || 0) - (b.order || 0)).map((resp, i) => (
                 <div key={resp.id} className="border-b border-border/50 pb-xl last:border-0 hover:bg-muted/10 transition-colors p-md -mx-md rounded-xl group/row">
                   <div className="flex flex-col md:flex-row gap-xl">
                      <div className="flex flex-col gap-md flex-1">
                         <div className="flex flex-col md:flex-row md:items-start justify-between gap-xl">
                            <div className="flex flex-col gap-sm">
                               <p className="text-lg font-medium text-heading leading-snug">{resp.questionText}</p>
                               <div className="flex flex-wrap items-center gap-3">
                                  <Badge variant="outline" className="text-[10px] font-medium uppercase py-0.5 px-2 border-border text-muted-text tracking-widest">
                                     {resp.severity} CRITICALITY
                                  </Badge>
                                  {resp.notes && (
                                    <div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-md border border-border/50">
                                       <span className="text-[11px] font-normal text-muted-text">
                                         Observation: "{resp.notes}"
                                       </span>
                                    </div>
                                  )}
                               </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-1.5 min-w-[120px]">
                               <div className={cn(
                                 "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-widest border",
                                 resp.answer === 'yes' ? "bg-success/10 text-success border-success/30" : 
                                 resp.answer === 'no' ? "bg-destructive/10 text-destructive border-destructive/30 shadow-sm shadow-destructive/10" : 
                                 "bg-muted/10 text-muted-text border-border/50"
                               )}>
                                 {resp.answer === 'yes' ? <CheckCircle2 className="h-4 w-4" /> : resp.answer === 'no' ? <XCircle className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                                 {resp.answer}
                               </div>
                               <p className="text-[10px] font-normal text-muted-text uppercase tracking-widest opacity-60 tabular-nums">{resp.score} / {resp.maxScore || 10} PTS</p>
                            </div>
                         </div>

                         {/* Response Photos */}
                         {resp.photoUrls && resp.photoUrls.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md mt-sm">
                               {resp.photoUrls.map((url: string, pi: number) => (
                                 <div key={pi} className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-sm bg-muted/10 transition-transform hover:scale-105 active:scale-95">
                                    <img src={url} alt={`Evidence ${pi+1}`} className="h-full w-full object-cover transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <ImageIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-0.5 rounded-md text-[9px] font-medium text-muted-text uppercase tracking-widest border border-border/50">IMG_{pi+1}</div>
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

          {/* Footer Signature */}
          <div className="mt-xl pt-xl border-t border-border/50 flex flex-col md:flex-row items-center justify-between text-[10px] text-muted-text font-normal uppercase tracking-widest gap-md">
             <div className="flex flex-col gap-1 text-center md:text-left">
                <p>Intelligence Generated On {format(new Date(), 'MMM d, yyyy h:mm a')}</p>
                <p>Audiment SaaS Platform &trade;</p>
             </div>
             <div className="flex flex-col gap-1 text-center md:text-right">
                <p>Reference ID: {audit.id}</p>
                <p>Location ID: {audit.locationId}</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
