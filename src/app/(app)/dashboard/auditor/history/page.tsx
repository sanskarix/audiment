'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
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
} from '@/components/app-ui/card';
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
import { Skeleton } from "@/components/app-ui/skeleton";
import { Badge } from '@/components/app-ui/badge';
import { Button } from '@/components/app-ui/button';
import { Input } from '@/components/app-ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/app-ui/table';
import { format } from 'date-fns';
import Link from 'next/link';
import { useAuthSync } from '@/components/AuthProvider';

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
  const { isSynced, orgId, uid } = useAuthSync();
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // No longer needed

  useEffect(() => {
    if (!isSynced || !uid || !orgId) return;

    // Fetch standard completed audits
    const qAudits = query(
      collection(db, 'audits'),
      where('organizationId', '==', orgId),
      where('assignedAuditorId', '==', uid),
      where('status', '==', 'completed')
    );

    // Fetch flashmob audits
    const qFlashmob = query(
      collection(db, 'flashmobAudits'),
      where('organizationId', '==', orgId),
      where('auditorId', '==', uid)
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

    const fetchHistory = async () => {
      try {
        const [auditsSnap, flashmobSnap] = await Promise.all([
          getDocs(qAudits),
          getDocs(qFlashmob)
        ]);
        
        auditsData = auditsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        flashmobData = flashmobSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        updateHistory();
      } catch (err) {
        console.error('Error fetching history:', err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [uid, orgId, isSynced]);

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
      <DashboardShell role="auditor">
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
    <DashboardShell role="auditor">
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
              <p className="stat-label">Total Audits</p>
              <FileCheck className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-heading">{history.length}</div>
              <p className="stat-sub">Successfully finalized audits</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Avg. Performance</p>
              <Target className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-success">{avgScore}%</div>
              <p className="stat-sub">Overall average score</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Personal Best</p>
              <Trophy className="h-4 w-4 text-warning/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-warning">{highestScore}%</div>
              <p className="stat-sub">Highest score achieved</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="search-wrapper max-w-md">
            <Search className="search-icon" />
            <Input
              placeholder="Search history by template or location..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="filter-btn">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* History Table Section */}
        <Card className="standard-card overflow-hidden">
          <div className="p-6 border-b border-border/40">
            <div className="flex flex-col gap-1">
              <h3 className="card-section-title">Completed Audits</h3>
              <p className="card-section-subtitle">View all previously submitted reports</p>
            </div>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="standard-table-head pl-6">Template</TableHead>
                  <TableHead className="standard-table-head">Location</TableHead>
                  <TableHead className="standard-table-head">Date</TableHead>
                  <TableHead className="standard-table-head text-center">Score</TableHead>
                  <TableHead className="standard-table-head text-right pr-6">Action</TableHead>
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
