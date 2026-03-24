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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="-ml-3 gap-2 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            <Link href="/dashboard/manager/reports">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Link>
          </Button>
          <Button 
            onClick={exportToPDF} 
            disabled={isExporting}
            className="font-bold gap-2 bg-zinc-950 hover:bg-zinc-800 text-white shadow-xl hover:-translate-y-0.5 transition-all text-xs h-10 px-6"
          >
            {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? 'Preparing PDF...' : 'GENERATE PDF'}
          </Button>
        </div>

        <div ref={reportRef} className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-zinc-100 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-50 pb-10 mb-10 gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                 <Badge variant="outline" className="text-[10px] font-black tracking-[0.1em] uppercase px-3 py-1 border-blue-100 text-blue-600 bg-blue-50/50 rounded-full">QUALITY AUDIT VERIFIED</Badge>
                 <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                 <p className="text-xs font-bold text-zinc-400">ID: {audit.id.toUpperCase()}</p>
              </div>
              <div>
                <h1 className="text-5xl font-black text-zinc-950 tracking-tight leading-[1] uppercase max-w-2xl">{audit.templateTitle}</h1>
                <p className="text-zinc-400 mt-2 font-medium tracking-tight">Professional inspection outcome for official documentation.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em]">Location</p>
                  <p className="text-md font-bold text-zinc-950 flex items-center gap-2 pr-4">{audit.locationName}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em]">Submitted</p>
                  <p className="text-md font-bold text-zinc-950 flex items-center gap-2">{audit.completedAt ? format(audit.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</p>
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1 border-l border-zinc-50 pl-0 md:pl-8">
                   <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em]">Auditor</p>
                   <p className="text-md font-bold text-zinc-800">{audit.assignedAuditorName || 'Field Team'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-zinc-50 p-8 rounded-[2rem] min-w-[200px] border border-zinc-100">
               <p className="text-[10px] font-black tracking-[.25em] text-zinc-400 uppercase mb-4">Total Score</p>
               <div className={cn(
                  "text-7xl font-black tabular-nums tracking-tighter",
                  audit.scorePercentage >= 90 ? "text-emerald-500" : audit.scorePercentage >= 70 ? "text-indigo-500" : "text-rose-500"
               )}>{audit.scorePercentage}<span className="text-2xl text-zinc-300">%</span></div>
               <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn(
                      "h-1 w-6 rounded-full",
                      (i * 20) < audit.scorePercentage 
                        ? (audit.scorePercentage >= 90 ? "bg-emerald-500" : audit.scorePercentage >= 70 ? "bg-indigo-500" : "bg-rose-500")
                        : "bg-zinc-200"
                    )} />
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-10">
            <h3 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-4">
              Detailed Findings
              <div className="h-px bg-zinc-100 flex-1" />
            </h3>
            <div className="space-y-12">
               {responses.sort((a,b) => (a.order || 0) - (b.order || 0)).map((resp, i) => (
                 <div key={resp.id} className="group">
                   <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 space-y-5">
                         <div className="flex items-start justify-between gap-6">
                            <div className="space-y-2">
                               <div className="flex items-center gap-3">
                                  <div className="h-6 w-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                  <h4 className="text-lg font-bold text-zinc-900 leading-tight tracking-tight">{resp.questionText}</h4>
                               </div>
                               <div className="flex items-center gap-3 pl-9">
                                  <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase tracking-widest border-0 p-0",
                                    resp.severity === 'critical' ? "text-rose-500" : "text-zinc-400"
                                  )}>
                                     {resp.severity} SEVERITY
                                  </Badge>
                                  {resp.notes && (
                                    <>
                                      <div className="h-1 w-1 rounded-full bg-zinc-200" />
                                      <p className="text-xs text-zinc-500 font-medium italic">
                                        "{resp.notes}"
                                      </p>
                                    </>
                                  )}
                               </div>
                            </div>
                            <div className="text-right min-w-[120px]">
                               <p className="text-2xl font-black text-zinc-900 leading-none tabular-nums tracking-tighter">{resp.score}<span className="text-zinc-300 text-xs ml-1">/ {resp.maxScore || 10}</span></p>
                               <div className={cn(
                                 "mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                                 resp.answer === 'yes' ? "bg-emerald-500 text-white" : 
                                 resp.answer === 'no' ? "bg-rose-500 text-white" : 
                                 "bg-zinc-900 text-white"
                               )}>
                                 {resp.answer}
                               </div>
                            </div>
                         </div>

                         {resp.photoUrls && resp.photoUrls.length > 0 && (
                            <div className="flex flex-wrap gap-4 pl-9">
                               {resp.photoUrls.map((url: string, pi: number) => (
                                 <div key={pi} className="relative h-24 w-24 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm bg-zinc-50 ring-4 ring-white">
                                    <img src={url} alt={`Evidence ${pi+1}`} className="h-full w-full object-cover" />
                                 </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>
                   {i < responses.length - 1 && <div className="h-px bg-zinc-50 w-full mt-10" />}
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 font-black uppercase tracking-[0.2em] gap-6">
             <div className="space-y-1">
                <p>Audiment Intelligence v1.0 &copy; 2024</p>
                <p className="text-zinc-300">Confidential Audit Documentation</p>
             </div>
             <div className="text-center sm:text-right border border-zinc-100 px-6 py-4 rounded-2xl bg-zinc-50/30">
                <p>Digital Stamp</p>
                <p className="text-zinc-600 mt-1">{audit.id.toUpperCase()}</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
