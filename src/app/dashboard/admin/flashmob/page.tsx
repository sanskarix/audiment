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
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Flashmob Logs</h1>
          <p className="text-muted-foreground">
            Review video evidence and compliance verification from the field. Total audits: {flashmobs.length}
          </p>
        </div>

        {flashmobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Video className="h-12 w-12 mb-4 text-muted" />
              <p>No flashmob audits reported yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flashmobs.map((audit) => (
              <Card key={audit.id} className="overflow-hidden flex flex-col">
                <div className="relative aspect-video bg-zinc-100">
                   <video 
                     src={audit.videoUrl} 
                     className="h-full w-full object-cover"
                     muted
                     loop
                     onMouseOver={e => e.currentTarget.play()}
                     onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                     }}
                   />
                   <div className="absolute top-2 left-2 flex gap-2">
                     <Badge variant="secondary" className="shadow-sm">
                        {audit.locationName}
                     </Badge>
                   </div>
                   <div className="absolute top-2 right-2 flex gap-2">
                      <div className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-zinc-200">
                         <img src={audit.selfieUrl} alt="Selfie" className="h-full w-full object-cover" />
                      </div>
                   </div>
                </div>
                
                <CardHeader className="py-4">
                   <CardTitle className="text-lg">
                     {audit.locationName} Audit
                   </CardTitle>
                   <CardDescription className="flex flex-col gap-1 mt-1">
                     <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Auditor: {audit.auditorName || 'Unknown'}</span>
                     <span className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> {audit.submittedAt?.toDate().toLocaleString()}</span>
                   </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto pt-0 pb-4">
                   <Link href={`/dashboard/admin/flashmob/${audit.id}`} passHref>
                     <Button variant="outline" className="w-full">
                       View Full Details
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
