'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Play,
  MapPin,
  User,
  Calendar as CalendarIcon,
  ExternalLink,
  ChevronRight,
  Loader2,
  Video,
  ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminFlashmobPage() {
  const [flashmobs, setFlashmobs] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string } | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading flex items-center gap-3">
              <Video className="h-8 w-8 text-primary" />
              Flashmob Logs
            </h1>
            <p className="body-text">
              Review video evidence and compliance verification from the field.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-4 py-1.5 text-[10px] tracking-tight uppercase">
              {flashmobs.length} TOTAL SESSIONS
            </Badge>
          </div>
        </div>

        {flashmobs.length === 0 ? (
          <Card className="standard-card">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground/40">
              <div className="bg-muted/10 p-6 rounded-full mb-6">
                <Video className="h-12 w-12 opacity-20" />
              </div>
              <p className="page-heading text-lg opacity-40 uppercase tracking-tight">No flashmob audits reported yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {flashmobs.map((audit) => (
              <Card key={audit.id} className="standard-card flex flex-col group hover:scale-[1.02] transition-all duration-300">
                <div className="relative aspect-video bg-muted overflow-hidden">
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
                  <div className="absolute top-4 left-4">
                    <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-2xl">
                      <span className="text-xs font-bold uppercase tracking-tight text-foreground">{audit.locationName}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted shadow-2xl">
                      <img src={audit.selfieUrl} alt="Selfie" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-primary px-2 py-1 rounded flex items-center gap-2 shadow-xl">
                      <Play className="h-3 w-3 text-white fill-white" />
                      <span className="text-[9px] font-bold text-white tracking-tight uppercase">Preview</span>
                    </div>
                  </div>
                </div>

                <CardHeader className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-sans text-foreground group-hover:text-primary transition-colors">
                        {audit.locationName}
                      </CardTitle>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-center gap-2.5 text-muted-foreground/60">
                          <User className="h-3.5 w-3.5 text-primary opacity-50" />
                          <span className="text-xs font-bold uppercase tracking-tight">{audit.auditorName || 'Unknown Auditor'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-muted-foreground/60">
                          <CalendarIcon className="h-3.5 w-3.5 text-primary opacity-50" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{format(audit.submittedAt?.toDate(), 'MMMM d, h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="mt-auto px-6 pb-6 pt-0">
                  <Link href={`/dashboard/admin/flashmob/${audit.id}`} passHref className="w-full">
                    <Button className="w-full h-12 rounded-md font-bold text-[11px] uppercase tracking-tight shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all active:scale-95">
                      Integrity Check <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
