'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, MapPin, Calendar, Clock, Loader2, Trash2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { deleteDoc } from 'firebase/firestore';

export default function FlashmobAuditDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function fetchAudit() {
      if (!params?.flashmobId) return;
      try {
        const docRef = doc(db, 'flashmobAudits', params.flashmobId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAudit({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [params?.flashmobId]);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'flashmobAudits', params.flashmobId as string));
      router.push('/dashboard/admin/flashmob');
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="admin">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-text" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="admin">
        <div className="text-center py-12">
          <h2 className="page-heading mb-4">Audit not found</h2>
          <Link href="/dashboard/admin/flashmob" passHref>
            <Button>Return to flashmob logs</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const date = audit.submittedAt?.toDate();

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/admin/flashmob" className="text-muted-text hover:text-primary transition-colors flex items-center">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="h-5 w-[1px] bg-border/80"></div>
              <h1 className="text-xl font-semibold text-heading">Flashmob Log</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={confirmDelete ? "destructive" : "outline"}
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn("h-11 px-5 gap-2 transition-all active:scale-95", confirmDelete && "animate-in fade-in zoom-in-95")}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {confirmDelete ? "Click to confirm deletion" : "Delete Log"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Metadata Card - Redundant Header Removed */}
          <Card className="standard-card">
            <CardContent className="p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-widest">Auditor</p>
                  <p className="text-body flex items-center gap-2.5 font-medium">{audit.auditorName || 'Unknown'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-widest">Location</p>
                  <p className="text-body flex items-center gap-2.5 font-medium">{audit.locationName}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-widest">Completed On</p>
                  <p className="text-body flex items-center gap-2.5 font-medium">{date ? format(date, 'MMMM d, yyyy') : 'N/A'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-normal text-muted-text/50 uppercase tracking-widest">Timestamp</p>
                  <p className="text-body flex items-center gap-2.5 font-medium">{date ? format(date, 'h:mm:ss a') : 'N/A'}</p>
                </div>
              </div>

              {(audit.latitude && audit.longitude) && (
                <div className="mt-10 pt-10 border-t border-border/50  flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0 ring-4 ring-success/5">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-heading">Geo-location Verified</p>
                      <p className="text-[13px] text-muted-text/50">Coordinates: {audit.latitude}, {audit.longitude}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="h-11 px-6 gap-2" onClick={() => window.open(`https://www.google.com/maps?q=${audit.latitude},${audit.longitude}`, '_blank')}>
                    <MapPin className="h-4 w-4" /> View Map
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="standard-card md:col-span-2 overflow-hidden">
               <div className="bg-muted/5 border-b border-border/40 px-8 py-4 flex items-center justify-between">
                 <h2 className="text-[13px] font-semibold text-heading uppercase tracking-wider">Video Scan</h2>
                 <p className="text-[11px] text-muted-text/50">UNCUT FIELD EVIDENCE</p>
               </div>
               <CardContent className="p-0 bg-black aspect-video flex items-center justify-center relative group">
                 <video src={audit.videoUrl} controls className="h-full w-full object-contain z-10" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </CardContent>
            </Card>

            <Card className="standard-card overflow-hidden">
               <div className="bg-muted/5 border-b border-border/40 px-8 py-4">
                 <h2 className="text-[13px] font-semibold text-heading uppercase tracking-wider">Auditor ID</h2>
               </div>
               <CardContent className="p-0 aspect-[3/4] bg-muted relative group overflow-hidden">
                 <Image src={audit.selfieUrl} alt="Auditor Selfie" width={400} height={533} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
