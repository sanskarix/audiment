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
  limit,
  Timestamp,
  onSnapshot
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
  Clock
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
import { format, subMonths, startOfToday, startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalAuditsThisMonth: number;
  completionRate: number;
  openCorrectiveActions: number;
  locationScores: { name: string; score: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const match = document.cookie.match(/audiment_session=([^;]+)/);
        const session = match ? JSON.parse(decodeURIComponent(match[1])) : null;
        console.log('Admin Dashboard - Session:', session);

        if (!session?.organizationId) {
          console.warn('Admin Dashboard - No organizationId in session');
          setLoading(false);
          return;
        }

        const now = new Date();
        const monthStart = startOfMonth(now);

        // 1. Fetch Audits for this month
        const auditsRef = collection(db, 'audits');
        const auditsQuery = query(
          auditsRef,
          where('organizationId', '==', session.organizationId),
          where('createdAt', '>=', Timestamp.fromDate(monthStart))
        );
        console.log('Admin Dashboard - Fetching audits for org:', session.organizationId);

        const auditsSnap = await getDocs(auditsQuery);
        console.log('Admin Dashboard - Audits count:', auditsSnap.size);

        const audits = auditsSnap.docs.map(d => d.data() as any);
        const total = audits.length;
        const completed = audits.filter(a => a.status === 'completed').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // 2. Fetch Open Corrective Actions
        const caRef = collection(db, 'correctiveActions');
        const caSnap = await getDocs(query(
          caRef,
          where('organizationId', '==', session.organizationId),
          where('status', '==', 'open')
        ));
        console.log('Admin Dashboard - Open corrective actions:', caSnap.size);
        const openCA = caSnap.size;

        // 3. Fetch Location Scores
        const completedAuditsQuery = query(
          auditsRef,
          where('organizationId', '==', session.organizationId),
          where('status', '==', 'completed'),
          orderBy('completedAt', 'desc'),
          limit(100)
        );

        console.log('Admin Dashboard - Fetching completed audits for scores');
        const completedAuditsSnap = await getDocs(completedAuditsQuery);
        console.log('Admin Dashboard - Completed audits for scores:', completedAuditsSnap.size);

        const locationData: Record<string, { total: number; count: number }> = {};
        completedAuditsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (!locationData[data.locationName]) {
            locationData[data.locationName] = { total: 0, count: 0 };
          }
          locationData[data.locationName].total += data.scorePercentage || 0;
          locationData[data.locationName].count += 1;
        });

        const scores = Object.entries(locationData).map(([name, data]) => ({
          name,
          score: Math.round(data.total / data.count)
        })).sort((a, b) => b.score - a.score);

        setStats({
          totalAuditsThisMonth: total,
          completionRate: rate,
          openCorrectiveActions: openCA,
          locationScores: scores
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Block 9: Real-time corrective context
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    const session = match ? JSON.parse(decodeURIComponent(match[1])) : null;
    if (session?.organizationId) {
      const q = query(
        collection(db, 'correctiveActions'),
        where('organizationId', '==', session.organizationId),
        where('status', 'in', ['open', 'in_progress'])
      );
      const unsubscribe = onSnapshot(q, (snap) => {
        setStats(prev => prev ? { ...prev, openCorrectiveActions: snap.size } : prev);
      });
      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return (
      <DashboardShell role="Admin">
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
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Organization Vitals</h1>
            <p className="body-text text-muted-text">Monitor compliance health and operational performance across all regions.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Monthly Audits</p>
              <ClipboardList className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{stats?.totalAuditsThisMonth}</div>
              <p className="body-text mt-2">Audits published this month</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Completion Rate</p>
              <CheckCircle2 className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{stats?.completionRate}%</div>
              <p className="body-text mt-2">Audits completed</p>
              <Progress value={stats?.completionRate} className="mt-4 h-1.5 bg-success/10" />
            </div>
          </Card>

          <Link href="/dashboard/admin/corrective-actions" className="block group">
            <Card className="standard-card p-6 h-full group-hover:bg-destructive/5 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <p className="section-heading">Open Actions</p>
                <AlertCircle className="h-4 w-4 text-destructive/40 transition-colors" />
              </div>
              <div>
                <div className="text-[32px] font-semibold tracking-tight text-destructive tabular-nums leading-tight">{stats?.openCorrectiveActions}</div>
                <p className="body-text mt-2 text-destructive/60 font-medium">Attention required</p>
                <div className="mt-5 flex items-center gap-1.5 text-[11px] font-medium text-destructive bg-destructive/10 w-fit px-3 py-1.5 rounded-full">
                  View Queue <TrendingUp className="h-3 w-3" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="standard-card p-6">
            <div className="mb-6">
              <h3 className="section-heading">Location Performance</h3>
              <p className="body-text mt-1">Average score across all locations</p>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.locationScores} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis
                    dataKey="name"
                    stroke="oklch(var(--muted-text))"
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    tick={{ dy: 10 }}
                  />
                  <YAxis
                    stroke="oklch(var(--muted-text))"
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: 'oklch(var(--muted))', opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: 'oklch(var(--background))',
                      borderRadius: '12px',
                      border: '1px solid oklch(var(--border))',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'oklch(var(--heading))'
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
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}