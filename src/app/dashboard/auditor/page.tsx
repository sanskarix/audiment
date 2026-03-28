'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  orderBy,
  doc
} from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Clock, 
  MapPin, 
  AlertCircle,
  Play,
  CheckCircle2,
  Calendar as CalendarIcon,
  TrendingUp,
  Target,
  FileCheck,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AuditorDashboardPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId, uid: data.uid });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', session.uid), (d) => {
      setUserData(d.data());
    });
    return () => unsub();
  }, [session]);

  useEffect(() => {
    if (!session?.uid) return;

    console.log('Auditor Dashboard - Session:', session);
    const q = query(
      collection(db, 'audits'),
      where('organizationId', '==', session.orgId),
      where('assignedAuditorId', '==', session.uid)
    );
    console.log('Auditor Dashboard - Fetching audits for auditor:', session.uid, 'in org:', session.orgId);

    const unsubscribe = onSnapshot(q, (snap) => {
      console.log('Auditor Dashboard - Docs found in snapshot:', snap.size);
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      fetched.sort((a, b) => {
        const dateA = a.scheduledDate?.toMillis() || 0;
        const dateB = b.scheduledDate?.toMillis() || 0;
        return dateA - dateB;
      });
      setAudits(fetched);
      setLoading(false);
    }, (err) => {
      console.error('Firestore subscription error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const activeAudits = audits.filter(a => a.status === 'assigned' || a.status === 'in_progress');
  const completedAudits = audits.filter(a => a.status === 'completed');
  const missedAudits = audits.filter(a => a.status === 'missed');
  
  const avgScore = completedAudits.length > 0 
    ? Math.round(completedAudits.reduce((acc, curr) => acc + (curr.scorePercentage || 0), 0) / completedAudits.length)
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned': return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Pending Start</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">In Progress</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Missed</Badge>;
      default: return <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Auditor">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Personal Performance</h1>
            <p className="body-text">Detailed summary of your auditing activity and quality metrics</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="standard-card overflow-hidden relative border-success/20 bg-success/5">
              <CardHeader className="pb-2">
                <CardDescription className="text-success font-black uppercase tracking-[0.2em] text-[10px] opacity-70">Average Score</CardDescription>
                <CardTitle className="text-5xl font-black italic tracking-tighter tabular-nums text-success">
                  {avgScore}%
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[10px] text-success/60 font-bold uppercase tracking-widest">QUALITY ACCURACY</p>
              </CardContent>
           </Card>

           <Card className="standard-card bg-foreground text-background overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-50" />
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-muted-foreground/60 font-black uppercase tracking-[0.2em] text-[10px]">Compliance Rate</CardDescription>
                <CardTitle className="text-5xl font-black italic tracking-tighter tabular-nums text-white">
                  {completedAudits.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-2">
                <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest">SUCCESSFUL DEPLOYMENTS</p>
              </CardContent>
           </Card>

           <Card className="standard-card overflow-hidden relative border-warning/20 bg-warning/5">
              <CardHeader className="pb-2">
                <CardDescription className="text-warning font-black uppercase tracking-[0.2em] text-[10px] opacity-70">Active Assignments</CardDescription>
                <CardTitle className="text-5xl font-black italic tracking-tighter tabular-nums text-warning">{activeAudits.length}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[10px] text-warning/60 font-bold uppercase tracking-widest">IMMEDIATE MISSIONS</p>
              </CardContent>
           </Card>
        </div>

        {/* Flashmob Section (Conditional) */}
        {userData?.hasFlashmobAccess && (
          <Card className="bg-zinc-950 text-white border border-zinc-800 shadow-2xl overflow-hidden relative group rounded-3xl p-2">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Play className="h-48 w-48" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-warning hover:bg-warning text-warning-foreground font-black border-none text-[10px] px-3 py-1">ULTRA-PRIORITY</Badge>
                  <Badge variant="outline" className="text-white border-white/20 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1">COVERT MISSION</Badge>
                </div>
                <CardTitle className="text-4xl font-black italic tracking-tighter uppercase leading-none">Flashmob Intelligence</CardTitle>
                <CardDescription className="text-zinc-400 font-medium text-lg tracking-tight max-w-xl">
                  Deploy immediate compliance checks. Record a rapid 20-second visual proof of any branch for real-time verification.
                </CardDescription>
              </div>
              <Button size="lg" className="h-16 px-12 font-black uppercase tracking-widest text-xs bg-white text-black hover:bg-zinc-200 shadow-2xl rounded-2xl group/btn transition-all hover:scale-105 active:scale-95" asChild>
                <Link href="/dashboard/auditor/flashmob">
                  Deploy Mission Control <Play className="ml-3 h-4 w-4 fill-current group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Active Assignments Section */}
        <div className="section-gap">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Mission Queue</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Assignments requiring immediate field deployment</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[10px] font-black text-primary border-primary/20 bg-primary/5 px-3 py-1 uppercase tracking-widest">
                 {activeAudits.length} Pending Actions
              </Badge>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-24 standard-card bg-muted/5 border-dashed border-2">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                <p className="text-xl font-black italic tracking-tighter uppercase text-foreground/40 animate-pulse">Synchronizing Mission Data</p>
              </div>
            </div>
          ) : activeAudits.length === 0 ? (
            <div className="standard-card flex flex-col items-center justify-center p-24 text-center bg-muted/5 border-dashed border-2">
               <div className="bg-primary/5 p-6 rounded-full mb-6">
                <FileCheck className="h-12 w-12 text-primary opacity-20" />
               </div>
               <p className="text-2xl font-black italic tracking-tighter uppercase text-foreground/40">Queue Crystal Clear</p>
               <p className="text-sm font-medium text-muted-foreground mt-2 max-w-[320px]">Zero pending missions detected. Enjoy the downtime until next deployment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeAudits.map((a) => (
                <Card key={a.id} className="standard-card overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-muted/30">
                  <div className="h-2 w-full bg-muted/20 relative overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000 relative z-10",
                        a.status === 'in_progress' ? "bg-warning w-[60%]" : "bg-primary w-[20%]"
                      )} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                  <CardHeader className="pb-4 px-6 pt-6">
                    <div className="flex items-center justify-between mb-4">
                       {getStatusBadge(a.status)}
                       <span className="text-[10px] font-black tabular-nums text-muted-foreground opacity-40 uppercase tracking-widest">{a.id.substring(0, 8)}</span>
                    </div>
                    <CardTitle className="text-lg font-black italic tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors">
                      {a.templateTitle}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-tight text-foreground/70">{a.locationName}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8 px-6 space-y-6 pt-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                        <CalendarIcon className="h-4 w-4 opacity-40" />
                        <span>Scheduled <span className="text-foreground">{a.scheduledDate?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-3 font-black text-[10px] px-4 py-2 rounded-xl w-full justify-center uppercase tracking-widest transition-all",
                        a.deadline?.toDate() < new Date() ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-muted text-muted-foreground border border-muted-foreground/10"
                      )}>
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {a.deadline?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <Button className="w-full h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 group-hover:scale-105 transition-all active:scale-95" asChild>
                       <Link href={`/dashboard/auditor/audits/${a.id}`}>
                        {a.status === 'in_progress' ? 'RESUME MISSION' : 'START DEPLOYMENT'}
                       </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
