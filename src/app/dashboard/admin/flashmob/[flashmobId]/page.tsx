'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Clock, Loader2, Trash2, ShieldCheck, ExternalLink, User, Video, Camera, History } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="dashboard-page-container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Skeleton className="md:col-span-2 aspect-video rounded-xl" />
            <Skeleton className="aspect-[3/4] rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="admin">
        <div className="dashboard-page-container flex flex-col items-center justify-center py-32 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
            <Video className="h-8 w-8 text-muted-text/30" />
          </div>
          <h2 className="section-heading mb-2">Audit record not found</h2>
          <p className="body-text text-muted-text/60 max-w-xs mb-8">The verification entry you are looking for might have been removed or moved.</p>
          <Link href="/dashboard/admin/flashmob">
            <Button variant="outline" className="h-11 px-6 gap-2 border-border/50">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const date = audit.submittedAt?.toDate ? audit.submittedAt.toDate() : new Date();

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-500">

        {/* Header Section */}
        <div className="page-header-section mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/flashmob"
              className="h-10 w-10 rounded-xl border border-border/50 flex items-center justify-center text-muted-text hover:text-heading hover:bg-muted/40 transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-8 w-px bg-border/40 hidden sm:block" />
            <div>
              <h1 className="page-heading truncate max-w-[200px] sm:max-w-md">{audit.locationName || 'Verification Log'}</h1>
              <p className="muted-label">Verified site check-in • {format(date, 'PPP')}</p>
            </div>
          </div>

          <Button
            variant={confirmDelete ? "destructive" : "outline"}
            className={cn(
              "h-11 px-5 gap-2 border-border/50 active:scale-95 transition-all",
              confirmDelete && "animate-in zoom-in-95 duration-200"
            )}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {confirmDelete ? "Confirm Deletion" : "Delete Log"}
          </Button>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Auditor', value: audit.auditorName || 'Anonymous', icon: User },
            { label: 'Site Location', value: audit.locationName || 'Unknown', icon: MapPin },
            { label: 'Verify Date', value: format(date, 'MMM d, yyyy'), icon: Calendar },
            { label: 'Timestamp', value: format(date, 'HH:mm:ss'), icon: Clock },
          ].map((item) => (
            <div key={item.label} className="standard-card p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="muted-label text-[10px] uppercase tracking-wider mb-1">{item.label}</p>
                <p className="body-text font-bold text-heading truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Geo Verification Banner */}
        {audit.latitude && audit.longitude && (
          <div className="standard-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-success/5 border-success/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="section-heading text-success">Geo-location Verified</h3>
                <p className="body-text text-success/70 font-mono tracking-tight">
                  Coordinates: {audit.latitude.toFixed(6)}, {audit.longitude.toFixed(6)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="h-11 px-5 gap-2 bg-background border-success/20 hover:bg-success/5 text-success transition-colors"
              onClick={() => window.open(`https://www.google.com/maps?q=${audit.latitude},${audit.longitude}`, '_blank')}
            >
              <MapPin className="h-4 w-4" />
              View on Map
              <ExternalLink className="h-3 w-3 opacity-40" />
            </Button>
          </div>
        )}

        {/* Media Evidence */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Video Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                <h3 className="section-heading">Video Evidence</h3>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                Unedited Stream
              </Badge>
            </div>
            <div className="standard-card p-0 overflow-hidden bg-black aspect-video ring-1 ring-border/40 shadow-2xl">
              <video
                src={audit.videoUrl}
                controls
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Selfie Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Camera className="h-4 w-4 text-primary" />
              <h3 className="section-heading">Identify Verification</h3>
            </div>
            <div className="standard-card p-0 overflow-hidden aspect-[3/4] relative group ring-1 ring-border/40 shadow-2xl">
              <Image
                src={audit.selfieUrl}
                alt="Auditor Selfie"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-[11px] font-semibold uppercase tracking-widest text-center">Auditor ID Confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
