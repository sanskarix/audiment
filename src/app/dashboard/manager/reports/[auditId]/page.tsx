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
          <Clock className="h-4 w-4 animate-spin text-zinc-300" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="Manager">
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground font-medium">This report was not found or is no longer available.</p>
          <Button variant="link" asChild className="mt-2 text-blue-600">
            <Link href="/dashboard/manager/reports">Return to Archive</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <Button variant="ghost" asChild className="-ml-4 gap-2 text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] hover:bg-transparent hover:text-primary transition-colors">
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
            className="font-black gap-3 h-12 px-8 uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? 'Compiling PDF...' : 'Export Intelligence'}
          </Button>
        </div>

        <div ref={reportRef} className="standard-card p-10 bg-background">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-muted/20 pb-10 mb-10 gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                 <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 border-muted/50 text-muted-foreground">STRATEGIC DOSSIER</Badge>
                 <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 bg-success/10 text-success border-success/20 italic">VERIFIED</Badge>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter leading-none uppercase text-foreground">{audit.templateTitle}</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Inspected Location</p>
                  <p className="text-sm font-bold text-foreground flex items-center gap-2.5 whitespace-nowrap"><MapPin className="h-4 w-4 text-primary opacity-50" /> {audit.locationName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Submission Date</p>
                  <p className="text-sm font-bold text-foreground flex items-center gap-2.5 whitespace-nowrap"><Calendar className="h-4 w-4 text-primary opacity-50" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Field Auditor</p>
                   <p className="text-sm font-bold text-foreground flex items-center gap-2.5 whitespace-nowrap"><User className="h-4 w-4 text-primary opacity-50" /> {audit.assignedAuditorName || 'System Generated'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-foreground text-background p-8 rounded-3xl min-w-[200px] shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-50" />
               <p className="text-[10px] font-black tracking-[0.3em] relative z-10 opacity-60">SCORE INDEX</p>
               <div className="text-7xl font-black italic tabular-nums tracking-tighter relative z-10 py-1 text-white">{audit.scorePercentage}%</div>
               <div className="h-1.5 shadow-sm w-full bg-muted/20 rounded-full mt-4 relative z-10 overflow-hidden">
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
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 opacity-60">Verification Insights</h3>
            <div className="grid gap-6">
               {responses.sort((a,b) => (a.order || 0) - (b.order || 0)).map((resp, i) => (
                 <div key={resp.id} className="border-b border-muted/10 pb-10 last:border-0 hover:bg-muted/5 transition-all p-4 rounded-2xl group/row">
                   <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-6">
                         <div className="flex items-start justify-between gap-6">
                            <div className="space-y-3">
                               <p className="text-lg font-bold text-foreground leading-tight tracking-tight uppercase italic">{resp.questionText}</p>
                               <div className="flex flex-wrap items-center gap-4">
                                  <Badge variant="outline" className="text-[9px] font-black uppercase py-1 px-3 rounded-lg border-muted-foreground/20 text-muted-foreground tracking-widest">
                                     {resp.severity} CRITICALITY
                                  </Badge>
                                  {resp.notes && (
                                    <div className="flex items-center gap-2.5 bg-muted/10 px-3 py-1.5 rounded-xl border border-muted/20">
                                       <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                       <span className="text-[11px] font-bold text-muted-foreground tracking-tight">
                                         OBSERVATION: "{resp.notes}"
                                       </span>
                                    </div>
                                  )}
                               </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 min-w-[120px]">
                               <div className={cn(
                                 "flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-tighter italic",
                                 resp.answer === 'yes' ? "bg-success/10 text-success border border-success/20" : 
                                 resp.answer === 'no' ? "bg-destructive/10 text-destructive border border-destructive/20 shadow-lg shadow-destructive/5" : 
                                 "bg-muted/10 text-muted-foreground border border-muted/20"
                               )}>
                                 {resp.answer === 'yes' ? <CheckCircle2 className="h-4 w-4" /> : resp.answer === 'no' ? <XCircle className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                                 {resp.answer}
                               </div>
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pt-1 opacity-50 tabular-nums">{resp.score} / {resp.maxScore || 10} PTS</p>
                            </div>
                         </div>

                         {/* Response Photos */}
                         {resp.photoUrls && resp.photoUrls.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                               {resp.photoUrls.map((url: string, pi: number) => (
                                 <div key={pi} className="group relative aspect-square rounded-2xl overflow-hidden border border-muted/20 shadow-xl bg-muted/5 transition-all hover:scale-105">
                                    <img src={url} alt={`Evidence ${pi+1}`} className="h-full w-full object-cover transition-transform grayscale hover:grayscale-0 duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <ImageIcon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-muted-foreground uppercase tracking-widest border border-border">IMG_{pi+1}</div>
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
          <div className="mt-20 pt-16 border-t border-muted/20 flex flex-col md:flex-row items-center justify-between text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] gap-8 opacity-40">
             <div className="space-y-2 text-center md:text-left">
                <p>Intelligence Generated On {format(new Date(), 'MMMM d, yyyy h:mm a')}</p>
                <p>Audiment Strategic Platform &trade;</p>
             </div>
             <div className="text-center md:text-right space-y-2">
                <p>Dossier Reference ID: {audit.id}</p>
                <p>Mission Grid Node: {audit.locationId}</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
