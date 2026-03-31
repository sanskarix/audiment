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
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audit History</h1>
            <p className="body-text">Review your past performance and completed audit reports.</p>
          </div>
        </div>

        {/* Performance Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Total Completed</p>
              <h3 className="text-3xl font-medium tracking-tight text-primary">
                {history.length}
              </h3>
            </div>
          </Card>

          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Avg. Performance</p>
              <h3 className="text-3xl font-medium tracking-tight text-success">
                {avgScore}%
              </h3>
            </div>
          </Card>

          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Personal Best</p>
              <h3 className="text-3xl font-medium tracking-tight text-warning">{highestScore}%</h3>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search history by template or location..."
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

        {/* History Table Section */}
        <Card className="standard-card overflow-hidden">
          <div className="p-6 border-b border-border/40 bg-muted/30">
            <div className="flex flex-col gap-1">
              <h3 className="section-heading">Completed Audits</h3>
              <p className="body-text">Repository of your analytical deployments</p>
            </div>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="standard-table-head">Template</TableHead>
                  <TableHead className="standard-table-head">Location</TableHead>
                  <TableHead className="standard-table-head">Date</TableHead>
                  <TableHead className="standard-table-head text-center">Score</TableHead>
                  <TableHead className="standard-table-head text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="standard-table-cell h-64 text-center text-muted-text">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <History className="h-10 w-10 opacity-20" />
                        <p className="font-normal">{searchQuery ? "No matching history found." : "No audit history yet."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id} className="standard-table-row group cursor-pointer">
                      <TableCell className="standard-table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="font-normal text-heading">{item.templateTitle}</span>
                          <span className="text-[10px] text-muted-text font-normal  tracking-widest opacity-60">ID: {item.id.substring(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary opacity-60" />
                          <span className="text-sm font-normal text-body">{item.locationName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-normal text-heading">
                            {item.completedAt ? format(item.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                          </p>
                          <p className="text-[10px]  font-normal text-muted-text/60 tracking-widest">Completed</p>
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell text-center">
                        <Badge
                          className={cn(
                            "px-3 py-1 text-xs font-medium tracking-widest ml-auto",
                            item.scorePercentage >= 90 ? "bg-success text-success-foreground hover:bg-success/90" :
                              item.scorePercentage >= 70 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-warning text-warning-foreground hover:bg-warning/90"
                          )}
                        >
                          {item.scorePercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="standard-table-cell text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 gap-2 text-xs font-medium text-muted-text hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          <Link href={`/dashboard/auditor/audits/${item.id}`}>
                            <FileText className="h-4 w-4" /> View <ChevronRight className="h-3 w-3" />
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
