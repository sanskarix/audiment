'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  orderBy
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
  FileCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AuditorDashboardPage() {
  const [audits, setAudits] = useState<any[]>([]);
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

    const q = query(
      collection(db, 'audits'),
      where('assignedAuditorId', '==', session.uid),
      where('organizationId', '==', session.orgId)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
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
      case 'assigned': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 text-[10px]">Pending Start</Badge>;
      case 'in_progress': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-0.5 text-[10px]">In Progress</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 text-[10px]">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="border-none px-2 py-0.5 text-[10px]">Missed</Badge>;
      default: return <Badge variant="outline" className="px-2 py-0.5 text-[10px]">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Auditor">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Personal Performance</h2>
          <p className="text-muted-foreground">Detailed summary of your auditing activity and quality metrics</p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore}%</div>
              <p className="text-xs text-muted-foreground pt-1">Lifetime quality average across all completions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckSquare className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedAudits.length}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {completedAudits.length} Completed vs {missedAudits.length} Missed
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeAudits.length}</div>
              <p className="text-xs text-muted-foreground pt-1">Immediate tasks requiring your attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Assignments List */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900">Current Task Queue</h3>
            <Badge variant="outline" className="text-xs font-bold text-zinc-400">
               {activeAudits.length} PENDING
            </Badge>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-sm text-muted-foreground animate-pulse">Loading assignments...</p>
            </div>
          ) : activeAudits.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-12 text-center text-muted-foreground">
               <FileCheck className="h-8 w-8 mx-auto opacity-20 mb-2" />
               <p className="font-medium text-zinc-950">Zero pending tasks</p>
               <p className="text-xs pt-1">Everything is up to date. New audits will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeAudits.map((a) => (
                <Card key={a.id} className="shadow-sm border-zinc-200 overflow-hidden relative group">
                  <CardHeader className="pb-3 border-b border-zinc-50 bg-zinc-50/50">
                    <div className="flex items-center justify-between mb-2">
                       {getStatusBadge(a.status)}
                    </div>
                    <CardTitle className="text-md leading-tight group-hover:text-indigo-600 transition-colors">
                      {a.templateTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 pt-1 font-medium">
                      <MapPin className="h-3 w-3" /> {a.locationName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6 px-4 space-y-3">
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>Scheduled: {a.scheduledDate?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 font-bold",
                        a.deadline?.toDate() < new Date() ? "text-destructive" : "text-amber-700"
                      )}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>Deadline: {a.deadline?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-2 font-bold bg-indigo-600 hover:bg-indigo-700" asChild>
                       <Link href={`/dashboard/auditor/audits/${a.id}`}>
                        {a.status === 'in_progress' ? 'RESUME WORK' : 'START AUDIT'}
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
