'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  History,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Award,
  FileText,
  Target,
  Trophy,
  FileCheck
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import Link from 'next/link';

interface AuditHistoryItem {
  id: string;
  templateTitle?: string;
  locationName: string;
  completedAt?: any;
  submittedAt?: any;
  scorePercentage?: number;
  status: string;
  type?: 'standard' | 'flashmob';
}

export default function AuditorHistoryPage() {
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.uid || !session?.organizationId) return;

    // Fetch standard completed audits
    const qAudits = query(
      collection(db, 'audits'),
      where('organizationId', '==', session.organizationId),
      where('assignedAuditorId', '==', session.uid),
      where('status', '==', 'completed')
    );

    // Fetch flashmob audits
    const qFlashmob = query(
      collection(db, 'flashmobAudits'),
      where('organizationId', '==', session.organizationId),
      where('auditorId', '==', session.uid)
    );

    let auditsData: any[] = [];
    let flashmobData: any[] = [];

    const updateHistory = () => {
      const combined = [
        ...auditsData.map(a => ({ ...a, type: 'standard' as const })),
        ...flashmobData.map(f => ({ ...f, type: 'flashmob' as const, templateTitle: 'Flashmob Verification', completedAt: f.submittedAt }))
      ];

      combined.sort((a, b) => {
        const timeA = (a.completedAt || a.submittedAt)?.toMillis() || 0;
        const timeB = (b.completedAt || b.submittedAt)?.toMillis() || 0;
        return timeB - timeA;
      });

      setHistory(combined);
      setLoading(false);
    };

    const unsubAudits = onSnapshot(qAudits, (snap) => {
      auditsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      updateHistory();
    });

    const unsubFlashmob = onSnapshot(qFlashmob, (snap) => {
      flashmobData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      updateHistory();
    });

    return () => {
      unsubAudits();
      unsubFlashmob();
    };
  }, [session]);

  const filteredHistory = history.filter(item =>
    item.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.scorePercentage || 0), 0) / history.length)
    : 0;

  const highestScore = history.length > 0
    ? Math.max(...history.map(h => h.scorePercentage || 0))
    : 0;

  if (loading) {
    return (
      <DashboardShell role="Auditor">
        <div className="dashboard-page-container">
          <div className="page-header-section mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[40px] w-full" />
            <div className="border border-border/40 rounded-xl overflow-hidden">
              <Skeleton className="h-12 w-full rounded-none" />
              <Skeleton className="h-64 w-full rounded-none mt-2" />
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Auditor">
      <div className="dashboard-page-container px-6 md:px-10">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audit History</h1>
            <p className="body-text">View and review your completed audits.</p>
          </div>
        </div>

        {/* Performance Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Total Audits</p>
              <FileCheck className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{history.length}</div>
              <p className="body-text mt-2">Successfully finalized audits</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Avg. Performance</p>
              <Target className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{avgScore}%</div>
              <p className="body-text mt-2">Overall average score</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Personal Best</p>
              <Trophy className="h-4 w-4 text-warning/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-warning tabular-nums leading-tight">{highestScore}%</div>
              <p className="body-text mt-2">Highest score achieved</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search history by template or location..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/40 placeholder:text-muted-text/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-[12px] border-border/40 text-muted-text hover:bg-muted/50">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* History Table Section */}
        <Card className="standard-card overflow-hidden border-border/40">
          <div className="p-6 border-b border-border/40 bg-muted/5">
            <div className="flex flex-col gap-1">
              <h3 className="section-heading">Completed Audits</h3>
              <p className="body-text">View all previously submitted reports</p>
            </div>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40 bg-muted/5">
                  <TableHead className="h-12 px-6 text-[12px] font-medium text-muted-text uppercase tracking-wider">Template</TableHead>
                  <TableHead className="h-12 px-6 text-[12px] font-medium text-muted-text uppercase tracking-wider">Location</TableHead>
                  <TableHead className="h-12 px-6 text-[12px] font-medium text-muted-text uppercase tracking-wider">Date</TableHead>
                  <TableHead className="h-12 px-6 text-[12px] font-medium text-muted-text uppercase tracking-wider text-center">Score</TableHead>
                  <TableHead className="h-12 px-6 text-[12px] font-medium text-muted-text uppercase tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center text-muted-text">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="bg-muted/10 p-4 rounded-full">
                          <History className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="text-[14px] font-medium opacity-40">{searchQuery ? "No matching history found." : "No audit history yet."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id} className="group border-border/40 hover:bg-muted/5 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-heading text-[14px] leading-tight">{item.templateTitle}</span>
                            {item.type === 'flashmob' && (
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] h-4 px-1.5 font-bold uppercase">Flashmob</Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-text/60">ID-{item.id.substring(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-text/40" />
                          <span className="text-[13px] font-medium text-muted-text">{item.locationName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[13px] font-semibold text-heading">
                            {(item.completedAt || item.submittedAt) ? format((item.completedAt || item.submittedAt).toDate(), 'MMM d, yyyy') : 'N/A'}
                          </p>
                          <p className="text-[10px] font-medium text-success uppercase tracking-widest">Verified</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {item.type === 'standard' ? (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "h-6 px-3 rounded-full text-[11px] font-semibold tabular-nums border-none shadow-sm",
                              (item.scorePercentage || 0) >= 90 ? "bg-success/10 text-success" :
                                (item.scorePercentage || 0) >= 70 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                            )}
                          >
                            {item.scorePercentage}%
                          </Badge>
                        ) : (
                          <span className="text-muted-text/40 text-[13px] font-medium">–</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 px-3 gap-2 text-[12px] font-semibold text-primary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          <Link href={item.type === 'flashmob' ? `/dashboard/auditor/flashmob` : `/dashboard/auditor/audits/${item.id}`}>
                            View Log <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
