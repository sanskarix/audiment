'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Play,
  MapPin,
  User,
  Calendar as CalendarIcon,
  ExternalLink,
  ChevronRight,
  Loader2,
  Video,
  ImageIcon,
  Search,
  Filter,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminFlashmobPage() {
  const [flashmobs, setFlashmobs] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId });
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.orgId) return;

    const q = query(
      collection(db, 'flashmobAudits'),
      where('organizationId', '==', session.orgId),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFlashmobs(fetched);
      setLoading(false);
    }, (err) => {
      console.error('Firestore subscription error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'flashmobAudits', id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Admin">
        <div className="dashboard-page-container">
          <div className="page-header-section mb-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-[32px] w-[200px]" />
              <Skeleton className="h-[18px] w-[300px]" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="standard-card flex flex-col gap-4 p-0 overflow-hidden">
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[140px]" />
                    <Skeleton className="h-4 w-[180px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardShell>
    );
  }

  const filteredFlashmobs = flashmobs.filter((audit) =>
    audit.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.auditorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Session Logs</h1>
            <p className="body-text text-muted-text">Review real-time visual proof and rapid deployments from the field.</p>
          </div>
          <Badge variant="secondary" className="h-7 rounded-full bg-primary/10 text-primary border-none px-4 text-[12px] font-medium">
            {flashmobs.length} ACTIVE SESSIONS
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search logs by location or auditor..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {filteredFlashmobs.length === 0 ? (
          <Card className="standard-card">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center text-muted-text/40">
              <div className="bg-muted/10 p-6 rounded-full mb-6">
                <Video className="h-12 w-12 opacity-20" />
              </div>
              <p className="page-heading opacity-40">No flashmob audits reported yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFlashmobs.map((audit) => (
              <Card key={audit.id} className="standard-card flex flex-col group hover:scale-[1.01] transition-all duration-300">
                <div className="relative aspect-video bg-muted overflow-hidden rounded-t-xl">
                  <video
                    src={audit.videoUrl}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    muted
                    loop
                    onMouseOver={e => e.currentTarget.play()}
                    onMouseOut={e => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted shadow-lg ring-4 ring-primary/5">
                      <img src={audit.selfieUrl} alt="Selfie" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-primary/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-2 shadow-lg">
                      <Play className="h-2 w-2 text-white fill-white" />
                      <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Live Preview</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-5">
                  <div className="space-y-1">
                    <h3 className="section-heading line-clamp-1 group-hover:text-primary transition-colors text-[16px] font-medium">
                      {audit.locationName}
                    </h3>
                    <div className="flex flex-col gap-1.5 pt-2">
                      <div className="flex items-center gap-2 text-muted-text/50">
                        <User className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-[13px]">{audit.auditorName || 'Unknown auditor'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-text/50">
                        <CalendarIcon className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-[13px]">{format(audit.submittedAt?.toDate(), 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <Link href={`/dashboard/admin/flashmob/${audit.id}`} passHref className="flex-1">
                      <Button variant="secondary" className="w-full h-10 shadow-lg shadow-black/5 active:scale-95 transition-all font-medium text-[13px]">
                        Review Log <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant={confirmDeleteId === audit.id ? "destructive" : "ghost"}
                      size="icon"
                      onClick={() => handleDelete(audit.id)}
                      disabled={isDeleting && confirmDeleteId === audit.id}
                      className={cn("h-10 w-10 shrink-0", confirmDeleteId === audit.id && "w-fit px-4 gap-2 text-[12px]")}
                    >
                      {isDeleting && confirmDeleteId === audit.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : confirmDeleteId === audit.id
                          ? <span className="text-[12px] font-medium">Confirm?</span>
                          : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
