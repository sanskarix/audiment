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
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AuditorDashboardPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAudits = audits.filter(a => a.status === 'assigned' || a.status === 'in_progress');

  const filteredAudits = activeAudits.filter(a =>
    a.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId, uid: data.uid });
      } catch (e) { }
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

  const completedAudits = audits.filter(a => a.status === 'completed');
  const missedAudits = audits.filter(a => a.status === 'missed');

  const avgScore = completedAudits.length > 0
    ? Math.round(completedAudits.reduce((acc, curr) => acc + (curr.scorePercentage || 0), 0) / completedAudits.length)
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned': return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-[10px] font-medium  tracking-wider">Pending Start</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-2 py-0.5 text-[10px] font-medium  tracking-wider">In Progress</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-2 py-0.5 text-[10px] font-medium  tracking-wider">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="px-2 py-0.5 text-[10px] font-medium  tracking-wider">Missed</Badge>;
      default: return <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-medium  tracking-wider">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Auditor">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Overview</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search active deployments by template or location..."
              className="pl-9 h-11 bg-background text-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Average Score</p>
              <h3 className="text-3xl font-medium tracking-tight text-success">
                {avgScore}%
              </h3>
            </div>
          </Card>

          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Completed Audits</p>
              <h3 className="text-3xl font-medium tracking-tight text-primary">
                {completedAudits.length}
              </h3>
            </div>
          </Card>

          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Active Tasks</p>
              <h3 className="text-3xl font-medium tracking-tight text-warning">
                {activeAudits.length}
              </h3>
            </div>
          </Card>
        </div>

        {/* Flashmob Section (Conditional) */}
        {userData?.hasFlashmobAccess && (
          <Card className="bg-foreground text-background border border-border/20 shadow-2xl overflow-hidden relative group rounded-3xl p-2 mb-6">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Play className="h-48 w-48 text-background" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-warning hover:bg-warning text-warning-foreground font-medium border-none text-[10px] px-3 py-1">ULTRA-PRIORITY</Badge>
                  <Badge variant="outline" className="text-background border-background/20 text-[10px] font-medium tracking-[0.2em]  px-3 py-1">COVERT MISSION</Badge>
                </div>
                <CardTitle className="text-4xl font-medium italic tracking-tighter  leading-none text-background">Flashmob Intelligence</CardTitle>
                <CardDescription className="text-background/70 font-normal text-lg tracking-tight max-w-xl">
                  Deploy immediate compliance checks. Record a rapid 20-second visual proof of any branch for real-time verification.
                </CardDescription>
              </div>
              <Button size="lg" className="h-16 px-12 font-normal  tracking-widest text-xs bg-background text-body hover:bg-background/90 shadow-2xl rounded-2xl group/btn transition-all hover:scale-105 active:scale-95" asChild>
                <Link href="/dashboard/auditor/flashmob">
                  Deploy Mission Control <Play className="ml-3 h-4 w-4 fill-current group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Active Assignments Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <h3 className="section-heading tracking-tight italic ">ACTIVE DEPLOYMENTS</h3>
              <p className="body-text">Your assigned audits to complete</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-medium text-[10px] tracking-widest  bg-primary text-white border-none shadow-lg shadow-primary/20">
              {filteredAudits.length} REQUIRED
            </Badge>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="standard-card p-6 space-y-4">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : filteredAudits.length === 0 ? (
            <Card className="standard-card">
              <CardContent className="flex flex-col items-center justify-center h-[300px] text-center p-12">
                <div className="bg-muted/10 p-6 rounded-full mb-6">
                  <FileCheck className="h-12 w-12 opacity-20" />
                </div>
                <p className="text-lg opacity-40 italic font-normal text-muted-text">No audits assigned to you right now.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAudits.map((a) => (
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
                      <span className="text-[10px] font-normal tabular-nums text-muted-text opacity-40  tracking-widest">{a.id.substring(0, 8)}</span>
                    </div>
                    <CardTitle className="text-lg font-medium italic tracking-tighter  leading-tight group-hover:text-primary transition-colors text-heading">
                      {a.templateTitle}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[11px] font-normal  tracking-tight text-muted-text">{a.locationName}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8 px-6 space-y-6 pt-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-muted-text font-normal text-[10px]  tracking-widest">
                        <CalendarIcon className="h-4 w-4 opacity-40" />
                        <span>Scheduled <span className="text-body">{a.scheduledDate?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-3 font-normal text-[10px] px-4 py-2 rounded-xl w-full justify-center  tracking-widest transition-all",
                        a.deadline?.toDate() < new Date() ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-muted text-muted-text border border-muted-foreground/10"
                      )}>
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {a.deadline?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <Button className="w-full h-12 font-medium  tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 group-hover:scale-105 transition-all active:scale-95" asChild>
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
