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
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/app-ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/app-ui/table';
import { Button } from '@/components/app-ui/button';
import { Badge } from '@/components/app-ui/badge';
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
  ClipboardList
} from 'lucide-react';
import { Skeleton } from "@/components/app-ui/skeleton";
import { useAuthSync } from '@/components/AuthProvider';

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
  const { isSynced, uid, orgId } = useAuthSync();
  const params = useParams();
  const router = useRouter();
  const auditorId = params.id as string;

  const [auditor, setAuditor] = useState<Auditor | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isSynced) return;
    if (!auditorId || !orgId) {
      setLoading(false);
      return;
    }

    const fetchAuditor = async () => {
      try {
        const docRef = doc(db, 'users', auditorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuditor({ id: docSnap.id, ...docSnap.data() } as Auditor);
        }
      } catch (e) {
        console.error("[AuditorPerformance] Error fetching auditor:", e);
      }
    };

    const fetchAudits = async () => {
      try {
        const q = query(
          collection(db, 'audits'),
          where('organizationId', '==', orgId),
          where('assignedAuditorId', '==', auditorId)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((d: any) => ({
          id: d.id,
          ...d.data()
        })) as Audit[];

        fetched.sort((a, b: any) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });
        setAudits(fetched);
        setLoading(false);
      } catch (e) {
        console.error("[AuditorPerformance] Error fetching auditor audits:", e);
        setLoading(false);
      }
    };

    fetchAuditor();
    fetchAudits();
  }, [auditorId, orgId, isSynced]);

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
        return <Badge variant="secondary" className="status-badge-sm badge-warning">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="status-badge-sm badge-primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="status-badge-sm badge-success">Completed</Badge>;
      case 'missed':
        return <Badge variant="secondary" className="status-badge-sm badge-danger">SLA Breached</Badge>;
      default:
        return <Badge variant="secondary" className="status-badge-sm badge-muted">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardShell role="manager">
        <div className="dashboard-page-container">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-7 w-48 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/manager/auditors" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="h-5 w-[1px] bg-border/80"></div>
              <h1 className="text-xl font-semibold text-heading flex items-center gap-3">
                {auditor?.name || 'Auditor Profile'}
                {auditor && (
                  <Badge variant="secondary" className={cn(
                    "status-badge-sm font-normal",
                    auditor.isActive ? "badge-success" : "badge-muted"
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
              <p className="stat-label">Total Audits</p>
              <ClipboardList className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-heading">{stats.total}</div>
              <p className="stat-sub">Total assigned</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Completion Rate</p>
              <Target className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-success">{completionRate}%</div>
              <p className="stat-sub">Completion rate</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Pending</p>
              <Clock className="h-4 w-4 text-warning/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-warning">{stats.inProgress}</div>
              <p className="stat-sub">Pending audits</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Missed</p>
              <AlertCircle className="h-4 w-4 text-destructive/40 transition-colors" />
            </div>
            <div>
              <div className="stat-number text-destructive">{stats.missed}</div>
              <p className="stat-sub">Past deadline</p>
            </div>
          </Card>
        </div>


        <Card className="standard-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="standard-table-head pl-6 py-5">Audit</TableHead>
                  <TableHead className="standard-table-head py-5">Location</TableHead>
                  <TableHead className="standard-table-head py-5">Deadline</TableHead>
                  <TableHead className="standard-table-head py-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="standard-table-cell h-32 text-center text-muted-text">
                      No audits found for this auditor.
                    </TableCell>
                  </TableRow>
                ) : (
                  audits.map((audit) => (
                    <TableRow key={audit.id} className="standard-table-row group h-[72px]">
                      <TableCell className="standard-table-cell pl-6">
                        <span className="text-[13px] font-normal text-heading block">{audit.templateTitle}</span>

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
