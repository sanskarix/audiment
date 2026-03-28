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
      } catch (e) {}
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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Audit History</h2>
          <p className="text-muted-foreground">Review your past performance and completed audit reports.</p>
        </div>

        {/* Performance Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm border-muted">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{history.length}</div>
              <p className="text-xs text-muted-foreground pt-1">Audits successfully submitted</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-muted">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}%</div>
              <p className="text-xs text-muted-foreground pt-1">Across all completed assignments</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-muted">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Personal Best</CardTitle>
              <Award className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highestScore}%</div>
              <p className="text-xs text-muted-foreground pt-1">Highest individual audit score</p>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card className="shadow-sm border-muted overflow-hidden">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Completed Assignments</CardTitle>
                <CardDescription>Archive of all successfully performed audits.</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by blueprint or branch..."
                  className="pl-8 bg-zinc-50 border-zinc-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow>
                  <TableHead className="w-[300px] font-semibold">Audit Blueprint</TableHead>
                  <TableHead className="font-semibold">Branch Location</TableHead>
                  <TableHead className="font-semibold">Completed On</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="text-right font-semibold">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <History className="h-8 w-8 opacity-20" />
                        <p>{searchQuery ? "No history matching your search." : "No completed audits yet."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-zinc-50 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-zinc-900 group-hover:text-blue-700 transition-colors">{item.templateTitle}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">ID: {item.id.substring(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-zinc-600 text-sm font-medium uppercase tracking-tight">
                          <MapPin className="h-3 w-3" /> {item.locationName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.completedAt ? format(item.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black w-fit text-white uppercase",
                          item.scorePercentage >= 90 ? "bg-emerald-500" : item.scorePercentage >= 70 ? "bg-indigo-500" : "bg-rose-500"
                        )}>
                          {item.scorePercentage}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="h-8 gap-2 font-bold text-xs uppercase text-zinc-400 hover:text-blue-600 hover:bg-blue-50">
                           <Link href={`/dashboard/auditor/audits/${item.id}`}>
                             <FileText className="h-3 w-3" /> View Report
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
