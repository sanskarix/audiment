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
          <p className="text-muted-foreground">Audit report not found.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="-ml-4 gap-2 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            <Link href="/dashboard/admin/reports">
              <ArrowLeft className="h-4 w-4" /> Back to archive
            </Link>
          </Button>
          <Button 
            onClick={exportToPDF} 
            disabled={isExporting}
            className="font-bold gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md"
          >
            {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? 'GENERATING PDF...' : 'EXPORT PDF'}
          </Button>
        </div>

        <div ref={reportRef} className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-100 pb-8 mb-8 gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                 <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border-zinc-200 text-zinc-400">OFFICIAL AUDIT REPORT</Badge>
                 <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-100 italic">VERIFIED</Badge>
              </div>
              <h1 className="text-4xl font-black text-zinc-950 tracking-tight leading-none uppercase">{audit.templateTitle}</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Location</p>
                  <p className="text-md font-bold text-zinc-950 flex items-center gap-1.5 whitespace-nowrap"><MapPin className="h-4 w-4 text-rose-500" /> {audit.locationName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submission Date</p>
                  <p className="text-md font-bold text-zinc-950 flex items-center gap-1.5 whitespace-nowrap"><Calendar className="h-4 w-4 text-blue-500" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Assigned Auditor</p>
                   <p className="text-md font-bold text-zinc-950 flex items-center gap-1.5 whitespace-nowrap"><User className="h-4 w-4 text-violet-500" /> {audit.assignedAuditorName || 'System Generated'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-zinc-950 text-white p-6 rounded-2xl min-w-[180px] shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-50" />
               <p className="text-[10px] font-black tracking-[0.2em] relative z-10 opacity-70">FINAL GRADE</p>
               <div className="text-6xl font-black tabular-nums tracking-tighter relative z-10 py-1">{audit.scorePercentage}%</div>
               <div className="h-1 shadow-sm w-full bg-zinc-800 rounded-full mt-2 relative z-10 overflow-hidden">
                  <div 
                    className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        audit.scorePercentage >= 90 ? "bg-emerald-400" : audit.scorePercentage >= 70 ? "bg-indigo-400" : "bg-rose-400"
                    )} 
                    style={{ width: `${audit.scorePercentage}%` }} 
                  />
               </div>
            </div>
          </div>

          {/* Response Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.1em] mb-4">Detailed Question Analysis</h3>
            <div className="grid gap-4">
               {responses.sort((a,b) => (a.order || 0) - (b.order || 0)).map((resp, i) => (
                 <Card key={resp.id} className="border-0 shadow-none border-b border-zinc-100 rounded-none pb-6 last:border-0 hover:bg-zinc-50/50 transition-colors">
                   <CardContent className="p-0 pt-4 flex gap-6">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                               <p className="text-md font-bold text-zinc-950 leading-snug">{resp.questionText}</p>
                               <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="text-[9px] font-bold uppercase py-0 px-2 h-5 rounded-md border-zinc-200 text-zinc-500 tracking-wider">
                                     {resp.severity} CRITICALITY
                                  </Badge>
                                  {resp.notes && (
                                    <p className="text-[11px] text-zinc-400 italic flex items-center gap-1">
                                      Observed: "{resp.notes}"
                                    </p>
                                  )}
                               </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 min-w-[80px]">
                               <div className={cn(
                                 "flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-widest",
                                 resp.answer === 'yes' ? "bg-emerald-100 text-emerald-700" : 
                                 resp.answer === 'no' ? "bg-rose-100 text-rose-700 font-black ring-2 ring-rose-500/20" : 
                                 "bg-zinc-100 text-zinc-700"
                               )}>
                                 {resp.answer === 'yes' ? <CheckCircle2 className="h-4 w-4" /> : resp.answer === 'no' ? <XCircle className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                                 {resp.answer}
                               </div>
                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pt-1">{resp.score} / {resp.maxScore || 10} pts</p>
                            </div>
                         </div>

                         {/* Response Photos */}
                         {resp.photoUrls && resp.photoUrls.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                               {resp.photoUrls.map((url: string, pi: number) => (
                                 <div key={pi} className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-200 shadow-sm bg-zinc-50">
                                    <img src={url} alt={`Evidence ${pi+1}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <ImageIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-white/90 px-1 py-0.5 rounded text-[8px] font-bold text-zinc-500">IMG_{pi+1}</div>
                                 </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-16 pt-12 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
             <div className="space-y-1">
                <p>Report Generated On {format(new Date(), 'MMMM d, yyyy h:mm a')}</p>
                <p>Audiment Compliance Platform &copy; 2024</p>
             </div>
             <div className="text-right space-y-1 opacity-40">
                <p>Document Security ID: {audit.id}</p>
                <p>Branch Coordinates: {audit.locationId}</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
