'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
  ClipboardList
} from 'lucide-react';

interface Auditor {
  id: string;
  name: string;
  email: string;
  isActive?: boolean;
}

interface Audit {
  id: string;
  templateTitle: string;
  locationName: string;
  status: string;
  deadline?: any;
  createdAt?: any;
}

export default function PerformancePage() {
  const params = useParams();
  const router = useRouter();
  const auditorId = params.id as string;

  const [auditor, setAuditor] = useState<Auditor | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auditorId) return;

    const fetchAuditor = async () => {
      try {
        const docRef = doc(db, 'users', auditorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuditor({ id: docSnap.id, ...docSnap.data() } as Auditor);
        }
      } catch (e) {
        console.error("Error fetching auditor:", e);
      }
    };

    fetchAuditor();

    const q = query(
      collection(db, 'audits'),
      where('assignedAuditorId', '==', auditorId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Audit[];

      fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setAudits(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auditorId]);

  const stats = {
    total: audits.length,
    completed: audits.filter(a => a.status === 'completed').length,
    inProgress: audits.filter(a => a.status === 'in_progress' || a.status === 'assigned').length,
    missed: audits.filter(a => a.status === 'missed').length,
  };

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="secondary" className="h-6 rounded-full bg-warning/10 text-warning border-none px-2.5 text-[11px] font-normal">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[11px] font-normal">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="h-6 rounded-full bg-success/10 text-success border-none px-2.5 text-[11px] font-normal">Completed</Badge>;
      case 'missed':
        return <Badge variant="secondary" className="h-6 rounded-full bg-destructive/10 text-destructive border-none px-2.5 text-[11px] font-normal">SLA Breached</Badge>;
      default:
        return <Badge variant="secondary" className="h-6 rounded-full bg-muted/20 text-muted-text border-none px-2.5 text-[11px] font-normal">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/manager/auditors" className="text-muted-text hover:text-primary transition-colors flex items-center">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="h-5 w-[1px] bg-border/80"></div>
              <h1 className="text-xl font-semibold text-heading flex items-center gap-3">
                {auditor?.name || 'Loading Data...'}
                {auditor && (
                  <Badge variant="secondary" className={cn(
                    "h-6 rounded-full border-none px-2.5 text-[11px] font-normal",
                    auditor.isActive ? "bg-success/10 text-success" : "bg-muted/20 text-muted-text"
                  )}>
                    {auditor.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                )}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Total Assignments</p>
              <ClipboardList className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{stats.total}</div>
              <p className="body-text mt-2 font-normal">Total audits assigned</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Completion Rate</p>
              <Target className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{completionRate}%</div>
              <p className="body-text mt-2 font-normal">Average score</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">In Progress</p>
              <Clock className="h-4 w-4 text-warning/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-warning tabular-nums leading-tight">{stats.inProgress}</div>
              <p className="body-text mt-2 font-normal">Audits currently in progress</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">SLA Breaches</p>
              <AlertCircle className="h-4 w-4 text-destructive/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-destructive tabular-nums leading-tight">{stats.missed}</div>
              <p className="body-text mt-2 font-normal">Audits past the deadline</p>
            </div>
          </Card>
        </div>


        <Card className="standard-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="standard-table-head pl-6 py-5">Mission</TableHead>
                  <TableHead className="standard-table-head py-5">Location</TableHead>
                  <TableHead className="standard-table-head py-5">Deadline</TableHead>
                  <TableHead className="standard-table-head py-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="standard-table-cell h-32 text-center text-muted-text">
                      No missions found for this auditor.
                    </TableCell>
                  </TableRow>
                ) : (
                  audits.map((audit) => (
                    <TableRow key={audit.id} className="standard-table-row group h-[72px]">
                      <TableCell className="standard-table-cell pl-6">
                        <span className="text-[14px] font-normal text-heading block">{audit.templateTitle}</span>

                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <span className="text-[13px] font-normal text-body">{audit.locationName || 'N/A'}</span>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <span className="text-[13px] font-normal text-heading">
                          {audit.deadline ? audit.deadline.toDate().toLocaleDateString() : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        {getStatusBadge(audit.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
