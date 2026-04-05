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
  doc,
  getDoc
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
  Filter,
  ChevronRight
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
    const fetchUserData = async () => {
      const d = await getDoc(doc(db, 'users', session.uid));
      setUserData(d.data());
    };
    fetchUserData();
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
      const toDate = (val: any): Date => {
        if (!val) return new Date(0);
        if (typeof val.toDate === 'function') return val.toDate();
        return new Date(val);
      };

      fetched.sort((a, b) => {
        // 1. Deadline (closest first)
        const deadA = toDate(a.deadline).getTime();
        const deadB = toDate(b.deadline).getTime();
        if (deadA !== deadB) return deadA - deadB;

        // 2. Status (Pending/Missed first)
        const statusMap: any = { missed: 0, published: 1, assigned: 1, in_progress: 2, completed: 3 };
        const statusA = statusMap[a.status] ?? 99;
        const statusB = statusMap[b.status] ?? 99;
        return statusA - statusB;
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
    switch (status) { }
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
              <p className="section-heading text-[11px] md:text-[12px]">Avg. score</p>
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
              <h3 className="section-heading">Active audits</h3>
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
            <div className="flex flex-col gap-3">
              {filteredAudits.map((a) => {
                const isFuture = a.scheduledDate?.toDate() > new Date();
                const deadline = a.deadline?.toDate();
                const isOverdue = deadline && deadline < new Date();
                
                return (
                  <Card key={a.id} className="standard-card border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-300 group overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 gap-4">
                      {/* Left: Title and Location */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <h3 className="text-[14px] md:text-[15px] font-semibold text-heading leading-tight group-hover:text-primary transition-colors truncate">
                          {a.templateTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-[12px] text-muted-text">
                          <MapPin className="h-3.5 w-3.5 opacity-40 shrink-0" />
                          <span className="truncate">{a.locationName}</span>
                        </div>
                      </div>

                      {/* Middle: Conditional Dates */}
                      <div className="flex items-center gap-8 md:gap-12 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                        {isFuture ? (
                          <div className="flex flex-col gap-0.5 md:items-end">
                            <span className="text-[12px] font-medium text-heading tabular-nums">
                              {format(a.scheduledDate?.toDate(), 'MMM d, yyyy')}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-0.5 md:items-end">
                            <span className={cn("text-[10px] font-medium tracking-tight", isOverdue ? "text-destructive" : "text-muted-text/50")}>
                              Deadline
                            </span>
                            <span className={cn(
                              "text-[12px] font-semibold tabular-nums",
                              isOverdue ? "text-destructive" : "text-heading"
                            )}>
                              {format(deadline, 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="shrink-0 flex items-center pt-1 md:pt-0">
                        {isFuture ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-muted/10 rounded-lg opacity-60">
                             <Clock className="h-3.5 w-3.5 text-muted-text" />
                             <span className="text-[11px] font-medium text-muted-text">Locked</span>
                          </div>
                        ) : (
                          <Button size="sm" className="h-9 px-5 font-semibold text-[13px] shadow-lg shadow-primary/10 active:scale-95 transition-all" asChild>
                            <Link href={`/dashboard/auditor/audits/${a.id}`}>
                              {a.status === 'in_progress' ? 'Resume' : 'Start audit'}
                              <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
