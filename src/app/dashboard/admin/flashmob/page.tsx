'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
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
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminFlashmobPage() {
  const [flashmobs, setFlashmobs] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredFlashmobs = flashmobs.filter((audit) =>
    audit.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.auditorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-xs">
            <h1 className="page-heading flex items-center gap-3">
              <Video className="h-6 w-6 text-primary" />
              Flash Logs
            </h1>
            <p className="body-text">
              Review video evidence and compliance verification from the field.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {flashmobs.length} sessions
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search logs by location or auditor..."
              className="pl-9 bg-background text-body font-normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-border/50 text-[#6b7280]">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="absolute top-4 left-4">
                    <div className="bg-background/80 backdrop-blur-xl px-3 py-1 rounded-lg border border-border/50 shadow-lg">
                      <span className="muted-label">{audit.locationName}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted shadow-lg">
                      <img src={audit.selfieUrl} alt="Selfie" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-primary/90 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-2 shadow-lg">
                      <Play className="h-2.5 w-2.5 text-white fill-white" />
                      <span className="muted-label text-white">Preview</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="space-y-1">
                    <h3 className="section-heading line-clamp-1 group-hover:text-primary transition-colors">
                      {audit.locationName}
                    </h3>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2 text-muted-text/60">
                        <User className="h-3.5 w-3.5 text-primary/60" />
                        <span>{audit.auditorName || 'Unknown auditor'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-text/60">
                        <CalendarIcon className="h-3.5 w-3.5 text-primary/60" />
                        <span>{format(audit.submittedAt?.toDate(), 'MMM d, p')}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/dashboard/admin/flashmob/${audit.id}`} passHref className="mt-auto">
                    <Button size="default" className="w-full shadow-lg shadow-primary/10 active:scale-95 transition-all font-medium">
                      Integrity Check <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
