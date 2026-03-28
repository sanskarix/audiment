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
  TrendingUp,
  Award,
  FileText,
  Loader2
} from 'lucide-react';
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
  templateTitle: string;
  locationName: string;
  completedAt: any;
  scorePercentage: number;
  status: string;
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

    // Fetch completed audits for this auditor
    const q = query(
      collection(db, 'audits'),
      where('organizationId', '==', session.organizationId),
      where('assignedAuditorId', '==', session.uid),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedHistory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuditHistoryItem[];
      setHistory(fetchedHistory);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching audit history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const filteredHistory = history.filter(item =>
    item.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.locationName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Auditor">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Audit History</h1>
            <p className="body-text">Review your past performance and completed audit reports.</p>
          </div>
        </div>

        {/* Performance Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="standard-card bg-foreground text-background overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/30 to-transparent opacity-50" />
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-muted-foreground/60 text-xs font-medium text-muted-foreground">Total Completed</CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums text-white">
                {history.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-tight">SUCCESSFUL DEPLOYMENTS</p>
            </CardContent>
          </Card>

          <Card className="standard-card overflow-hidden relative border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary text-xs font-medium text-muted-foreground opacity-70">Avg. Performance</CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums text-primary">
                {avgScore}%
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-tight">STRATEGIC ACCURACY</p>
            </CardContent>
          </Card>

          <Card className="standard-card overflow-hidden relative border-warning/20 bg-warning/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-warning text-xs font-medium text-muted-foreground opacity-70">Personal Best</CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums text-warning">{highestScore}%</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-[10px] text-warning/60 font-bold uppercase tracking-tight">PEAK MISSION SCORE</p>
            </CardContent>
          </Card>
        </div>

        {/* History Table Section */}
        <Card className="standard-card">
          <CardHeader className="border-b border-muted/20 bg-muted/5 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-xl font-sans">Mission Archive</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground mt-1">Repository of your analytical deployments</CardDescription>
              </div>
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter by blueprint or sector..."
                  className="pl-9 h-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader >
                <TableRow >
                  <TableHead className="h-11 text-xs font-medium text-muted-foreground">Blueprint</TableHead>
                  <TableHead className="h-11 text-xs font-medium text-muted-foreground">Sector</TableHead>
                  <TableHead className="h-11 text-xs font-medium text-muted-foreground">Timeline</TableHead>
                  <TableHead className="h-11 text-xs font-medium text-muted-foreground text-center">Score</TableHead>
                  <TableHead className="py-5 px-8 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center text-muted-foreground bg-muted/5">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="bg-muted/10 p-4 rounded-full">
                          <History className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="page-heading text-lg opacity-40 uppercase tracking-tight">{searchQuery ? "No matching data points." : "Archive empty."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id} className="border-b last:border-0 transition-colors hover:bg-muted/40 cursor-pointer">
                      <TableCell className="px-8 py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{item.templateTitle}</span>
                          <span className="text-[10px] text-muted-foreground font-bold tracking-tight opacity-40 uppercase tabular-nums">{item.id.substring(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <MapPin className="h-3.5 w-3.5 text-primary opacity-50" />
                          <span className="text-[11px] font-bold uppercase tracking-tight text-foreground/80">{item.locationName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">
                            {item.completedAt ? format(item.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight opacity-50">FINALIZED</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className={cn(
                          "inline-flex items-center justify-center h-10 w-14 rounded-md font-bold text-[13px] tracking-tight tabular-nums shadow-lg shadow-black/5 mx-auto flex",
                          item.scorePercentage >= 90 ? "bg-success text-success-foreground" : item.scorePercentage >= 70 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                        )}>
                          {item.scorePercentage}%
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-9 px-4 gap-2 font-bold text-[10px] uppercase tracking-tight text-muted-foreground/40 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                          <Link href={`/dashboard/auditor/audits/${item.id}`}>
                            <FileText className="h-4 w-4" /> Inspect Report <ChevronRight className="h-3 w-3" />
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
