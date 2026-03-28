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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50" />
            </Card>
          ))}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Executive Overview</h1>
            <p className="body-text">Organization-wide performance and compliance metrics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid card-gap md:grid-cols-2 lg:grid-cols-3">
          <Card className="standard-card border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Audits</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalAuditsThisMonth}</div>
              <p className="muted-label pt-1 text-muted-foreground/60">Total audits published this month</p>
            </CardContent>
          </Card>

          <Card className="standard-card border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats?.completionRate}%</div>
              <p className="muted-label pt-1 text-muted-foreground/60">Percentage of audits completed</p>
              <Progress value={stats?.completionRate} className="mt-3 h-1 bg-success/10" />
            </CardContent>
          </Card>

          <Link href="/dashboard/admin/corrective-actions" className="block">
            <Card className="standard-card border-l-4 border-l-destructive h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Open Corrective Actions</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{stats?.openCorrectiveActions}</div>
                <p className="muted-label pt-1 text-destructive uppercase font-bold tracking-widest">Immediate Attention Required</p>
                <div className="mt-4 flex items-center text-[10px] font-bold text-destructive uppercase tracking-wider">
                  View Queue <TrendingUp className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-12">
            <CardHeader>
              <CardTitle>Cross-Branch Performance</CardTitle>
              <CardDescription>Average audit scores across all active locations</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.locationScores}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.05)'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {stats?.locationScores.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.score >= 90 ? '#10b981' : entry.score >= 70 ? '#6366f1' : '#f43f5e'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
