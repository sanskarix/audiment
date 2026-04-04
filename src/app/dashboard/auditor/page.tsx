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
            <div className="flex flex-col gap-4 pb-10">
              {filteredAudits.map((a) => {
                const isFuture = a.scheduledDate?.toDate() > new Date();
                return (
                  <Card key={a.id} className="standard-card flex flex-col md:flex-row border-border/40 hover:border-primary/20 transition-all duration-300">
                    <div className="flex-1 flex flex-col md:flex-row">
                      <CardHeader className="flex flex-col p-6 min-w-[300px]">
                        <div className="space-y-1.5">
                          <CardTitle className="text-[17px] font-semibold text-heading leading-tight line-clamp-2">
                            {a.templateTitle}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-6 pt-0 md:pt-6 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div className="flex items-center gap-2.5 text-sm text-body">
                            <MapPin className="h-4 w-4 text-muted-text shrink-0 opacity-60" />
                            <span className="truncate">{a.locationName}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-text/50 uppercase tracking-widest">
                                <CalendarIcon className="h-3 w-3" />
                                Scheduled
                              </div>
                              <div className="text-[13px] text-heading font-semibold tabular-nums">
                                {format(a.scheduledDate?.toDate(), 'MMM d, yyyy')}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-text/50 uppercase tracking-widest">
                                <Clock className="h-3 w-3" />
                                Deadline
                              </div>
                              <div className={cn(
                                "text-[13px] font-semibold tabular-nums",
                                a.deadline?.toDate() < new Date() ? "text-destructive" : "text-heading"
                              )}>
                                {format(a.deadline?.toDate(), 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    <CardFooter className="p-6 pt-2 md:pt-6 border-t md:border-t-0 md:border-l border-border/10 bg-muted/5 md:bg-transparent min-w-[200px] flex items-center">
                      {isFuture ? (
                        <Button disabled className="w-full h-11 bg-muted/50 text-muted-text/50 border-border/20 cursor-not-allowed">
                          <Clock className="mr-2 h-4 w-4" />
                          Locked
                        </Button>
                      ) : (
                        <Button className="w-full h-11 font-semibold text-[14px] group shadow-lg shadow-primary/5 transition-all hover:translate-y-[-1px] active:translate-y-[1px]" asChild>
                          <Link href={`/dashboard/auditor/audits/${a.id}`}>
                            {a.status === 'in_progress' ? 'Resume' : 'Start Audit'}
                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
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
