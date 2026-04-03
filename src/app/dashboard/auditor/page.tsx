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
      <div className="dashboard-page-container px-4 md:px-10">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Overview</h1>
            <p className="body-text">Manage your assigned audits and track your performance.</p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <Card className="standard-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <p className="section-heading text-[11px] md:text-[12px]">Completed</p>
              <FileCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[28px] md:text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{completedAudits.length}</div>
              <p className="body-text mt-1 text-[11px] md:text-[13px]">Finalized audits</p>
            </div>
          </Card>

          <Card className="standard-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <p className="section-heading text-[11px] md:text-[12px]">Avg. Score</p>
              <Target className="h-3.5 w-3.5 md:h-4 md:w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[28px] md:text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{avgScore}%</div>
              <p className="body-text mt-1 text-[11px] md:text-[13px]">Average score</p>
            </div>
          </Card>
        </div>

        {/* Active Assignments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="section-heading">Active Audits</h3>
              <p className="body-text">Assigned audits pending completion</p>
            </div>
            <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-3 text-[11px] font-semibold tabular-nums">
              {filteredAudits.length} Required
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by template or location..."
                className="pl-9 h-11 text-body font-normal bg-background border border-border/40 placeholder:text-muted-text/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-11 px-3 gap-2 font-medium text-[12px] border-border/40 text-muted-text hover:bg-muted/50 shrink-0 hidden md:flex">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="standard-card p-5 space-y-3">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : filteredAudits.length === 0 ? (
            <Card className="standard-card flex items-center justify-center" style={{ minHeight: '220px' }}>
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="bg-muted/10 p-5 rounded-full mb-4">
                  <FileCheck className="h-10 w-10 opacity-20" />
                </div>
                <p className="text-[13px] font-medium text-muted-text opacity-50">No active audits assigned.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-6">
              {filteredAudits.map((a) => (
                <Card key={a.id} className="standard-card bg-background border-border/40 hover:border-primary/20 transition-all duration-200 overflow-hidden">
                  <div className="h-1 w-full bg-muted/20 relative">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000",
                        a.status === 'in_progress' ? "bg-warning w-[60%]" : "bg-primary w-[20%]"
                      )}
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      {getStatusBadge(a.status)}
                      <span className="text-[10px] font-medium text-muted-text/40 tracking-wider">ID-{a.id.substring(0, 8)}</span>
                    </div>
                    <h4 className="text-[15px] font-semibold text-heading leading-snug mb-1.5">
                      {a.templateTitle}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-text/60 mb-4">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{a.locationName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] py-3 border-y border-border/40 mb-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-muted-text/60 font-medium">Scheduled</span>
                        <span className="text-heading font-semibold">{a.scheduledDate?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-muted-text/60 font-medium">Deadline</span>
                        <span className={cn(
                          "font-semibold",
                          a.deadline?.toDate() < new Date() ? "text-destructive" : "text-heading"
                        )}>{a.deadline?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <Button className="w-full h-11 font-semibold text-[13px] group" asChild>
                      <Link href={`/dashboard/auditor/audits/${a.id}`}>
                        {a.status === 'in_progress' ? 'Resume' : 'Start Audit'}
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
