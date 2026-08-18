'use client';

import { useEffect, useState, useMemo } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  BarChart as BarChartIcon,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  TrendingUp,
  MapPin,
  Clock,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Progress } from "@/components/ui/progress";
import { startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSync } from '@/components/AuthProvider';

interface DashboardStats {
  totalAuditsThisMonth: number;
  completionRate: number;
  openCorrectiveActions: number;
  locationScores: { name: string; score: number }[];
}

export default function AdminDashboardPage() {
  const { isSynced, orgId } = useAuthSync();
  const [audits, setAudits] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendAlerts, setTrendAlerts] = useState<any[]>([]);
  const [openCA, setOpenCA] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isSynced || !orgId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // 1. Subscribe to Locations
    const qLoc = query(collection(db, 'locations'), where('organizationId', '==', orgId));
    const unsubscribeLocations = onSnapshot(qLoc, (snap) => {
      setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('[AdminDashboard] Locations error:', err);
    });

    // 2. Subscribe to Audits
    const qAudits = query(collection(db, 'audits'), where('organizationId', '==', orgId));
    const unsubscribeAudits = onSnapshot(qAudits, (snap) => {
      setAudits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('[AdminDashboard] Audits error:', err);
      setError('Failed to sync audit data.');
      setLoading(false);
    });

    // 3. Corrective Actions count
    const qCA = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', orgId),
      where('status', 'in', ['open', 'in_progress'])
    );
    const unsubscribeCA = onSnapshot(qCA, (snap) => {
      setOpenCA(snap.size);
    });

    // 4. Trend Alerts
    const qTrend = query(
      collection(db, 'notifications'),
      where('organizationId', '==', orgId),
      where('type', '==', 'trend_alert'),
      where('isRead', '==', false)
    );
    const unsubscribeTrend = onSnapshot(qTrend, (snap) => {
      setTrendAlerts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeLocations();
      unsubscribeAudits();
      unsubscribeCA();
      unsubscribeTrend();
    };
  }, [isSynced, orgId]);

  // Compute stats whenever audits or locations change
  const stats: DashboardStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    
    const thisMonthAudits = audits.filter(a => {
      const auditDate = a.scheduledDate || a.createdAt || a.completedAt;
      if (!auditDate) return false;
      try {
        const date = auditDate.toDate ? auditDate.toDate() : new Date(auditDate);
        return date >= monthStart;
      } catch (e) {
        return false;
      }
    });

    const total = thisMonthAudits.length;
    const completed = thisMonthAudits.filter(a => a.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const locMap: Record<string, string> = {};
    locations.forEach(l => { locMap[l.id] = l.name; });

    const locationStats: Record<string, { total: number; count: number }> = {};
    
    audits.filter(a => a.status === 'completed').forEach(audit => {
      const currentName = locMap[audit.locationId] || audit.locationName;
      if (!currentName) return;

      if (!locationStats[currentName]) {
        locationStats[currentName] = { total: 0, count: 0 };
      }
      locationStats[currentName].total += audit.finalScore ?? audit.scorePercentage ?? 0;
      locationStats[currentName].count += 1;
    });

    const scores = Object.entries(locationStats).map(([name, data]) => ({
      name,
      score: Math.round(data.total / data.count)
    })).sort((a, b) => b.score - a.score);

    return {
      totalAuditsThisMonth: total,
      completionRate: rate,
      openCorrectiveActions: openCA,
      locationScores: scores
    };
  }, [audits, locations, openCA]);

  const handleDismissAlert = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (error) {
      console.error('Error dismissing trend alert:', error);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="admin">
        <div className="dashboard-page-container">
          <div className="page-header-section mb-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-[32px] w-[250px]" />
              <Skeleton className="h-[18px] w-[350px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[148px] rounded-xl" />
            <Skeleton className="h-[148px] rounded-xl" />
            <Skeleton className="h-[148px] rounded-xl" />
          </div>
          <Skeleton className="h-[460px] w-full rounded-xl mt-6" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Overview</h1>
            <p className="body-text text-muted-text">View key metrics and statistics across your branches.</p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-sm">Action Required</h3>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Trend Alert Banners */}
        {trendAlerts.length > 0 && (
          <div className="flex flex-col gap-3 mb-6">
            {trendAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-warning/5 border-warning/20 text-warning transition-all"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[13px] font-medium">
                    Performance Alert – {alert.locationName || 'Location'} has scored below threshold on 3 consecutive audits.
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/admin/reports"
                    className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
                  >
                    View reports
                  </Link>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1 hover:bg-warning/10 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Audits</p>
              <ClipboardList className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{stats?.totalAuditsThisMonth}</div>
              <p className="body-text mt-2">This month</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Completion rate</p>
              <CheckCircle2 className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{stats?.completionRate}%</div>
              <p className="body-text mt-2">Completed</p>
              <Progress value={stats?.completionRate} className="mt-4 h-1.5 bg-success/10" />
            </div>
          </Card>

          <Link href="/dashboard/admin/corrective-actions" className="block group">
            <Card className="standard-card p-6 h-full group-hover:bg-destructive/5 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <p className="section-heading">Actions</p>
                <AlertCircle className="h-4 w-4 text-destructive/40 transition-colors" />
              </div>
              <div>
                <div className="text-[32px] font-semibold tracking-tight text-destructive tabular-nums leading-tight">{stats?.openCorrectiveActions}</div>
                <p className="body-text mt-2 text-destructive/60 font-medium">Open issues</p>
                <div className="mt-5 flex items-center gap-1.5 text-[11px] font-medium text-destructive bg-destructive/10 w-fit px-3 py-1.5 rounded-full">
                  View <TrendingUp className="h-3 w-3" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="standard-card p-6">
            <div className="mb-6">
              <h3 className="section-heading">Performance</h3>
              <p className="body-text mt-1">Average score</p>
            </div>
            <div className="h-[400px] w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                  <BarChart data={stats?.locationScores} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis
                      dataKey="name"
                      stroke="var(--muted-text)"
                      fontSize={11}
                      fontWeight={500}
                      tickLine={false}
                      axisLine={false}
                      tick={{ dy: 10 }}
                    />
                    <YAxis
                      stroke="var(--muted-text)"
                      fontSize={11}
                      fontWeight={500}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--heading)'
                      }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                      {stats?.locationScores.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.score >= 90 ? 'oklch(0.6 0.18 150)' : entry.score >= 70 ? 'oklch(0.5 0.134 242.7)' : 'oklch(0.577 0.245 27.3)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full rounded-xl" />
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}