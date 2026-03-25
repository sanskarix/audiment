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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-amber-100 text-amber-900 border-none font-black text-[10px]">COVERT INTELLIGENCE</Badge>
              <div className="h-1 w-1 rounded-full bg-zinc-300" />
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{flashmobs.length} TOTAL SCANS</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter">FLASHMOB LOGS</h1>
            <p className="text-muted-foreground text-sm">Real-time video evidence and compliance verification from the field.</p>
          </div>
        </div>

        {flashmobs.length === 0 ? (
          <div className="bg-zinc-50 border border-dashed rounded-3xl p-24 text-center">
            <Video className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900">Zero covert audits reported</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto pt-1">
              When auditors with covert access submit flashmob evidence, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flashmobs.map((audit) => (
              <Card key={audit.id} className="shadow-smooth border-zinc-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                   <video 
                     src={audit.videoUrl} 
                     className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                     muted
                     loop
                     onMouseOver={e => e.currentTarget.play()}
                     onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                     }}
                   />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-white fill-current" />
                      </div>
                   </div>
                   <div className="absolute top-3 left-3 flex gap-2">
                     <Badge className="bg-black/60 backdrop-blur-md text-white border-none py-1 px-2 text-[10px] font-black uppercase">
                        {audit.locationName}
                     </Badge>
                   </div>
                </div>
                
                <CardHeader className="pb-3 px-5">
                   <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 mb-2">
                     <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {audit.submittedAt?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                     <div className="h-1 w-1 rounded-full bg-zinc-300" />
                     <span className="flex items-center gap-1"><User className="h-3 w-3" /> {audit.auditorName || 'Unknown'}</span>
                   </div>
                   <CardTitle className="text-lg font-black tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                     {audit.locationName} Verification
                   </CardTitle>
                </CardHeader>

                <CardContent className="px-5 pb-5">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 font-black text-[10px] h-9 tracking-widest border-zinc-200">
                          VIEW FULL SCAN
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-3xl">
                        <div className="grid md:grid-cols-3 bg-black">
                          <div className="md:col-span-2 relative aspect-video md:aspect-auto bg-black">
                            <video src={audit.videoUrl} controls autoPlay className="h-full w-full object-contain" />
                          </div>
                          <div className="p-8 bg-zinc-900 text-white space-y-8 flex flex-col justify-between">
                            <div className="space-y-6">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black">{audit.locationName}</DialogTitle>
                                <DialogDescription className="text-zinc-500">
                                  Covert audit captured by {audit.auditorName}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-black text-zinc-600 uppercase">Selfie Verification</span>
                                  <div className="aspect-square relative rounded-2xl overflow-hidden border border-zinc-800">
                                    <img src={audit.selfieUrl} alt="Auditor Selfie" className="h-full w-full object-cover" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time (PST)</span>
                                    <p className="text-xs font-bold">{audit.submittedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Location Verify</span>
                                    <p className="text-xs font-bold flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-emerald-500" /> VALID
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Button className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black" onClick={() => window.open(`https://www.google.com/maps?q=${audit.latitude},${audit.longitude}`, '_blank')}>
                              TRACK ON MAP
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
