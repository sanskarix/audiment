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
} from '@/components/ui/card';
import { 
  MapPin, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ManagerStats {
  assignedLocations: number;
  activeAuditors: number;
  recentAuditScores: { date: string; score: number }[];
  auditorActivity: { name: string; completed: number; pending: number }[];
  recentAudits: any[];
}

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;

    async function fetchManagerData() {
      try {
        // 1. Fetch assigned locations
        const locationsSnap = await getDocs(query(
          collection(db, 'locations'), 
          where('assignedManagerId', '==', session.uid)
        ));
        const locationIds = locationsSnap.docs.map(d => d.id);
        const assignedLocationsCount = locationsSnap.size;

        // 2. Fetch auditors reporting to this manager
        const auditorsSnap = await getDocs(query(
          collection(db, 'users'), 
          where('managerId', '==', session.uid),
          where('role', '==', 'auditor')
        ));
        const auditors = auditorsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 3. Fetch recent audits for these locations
        if (locationIds.length === 0) {
            setStats({
                assignedLocations: 0,
                activeAuditors: auditors.length,
                recentAuditScores: [],
                auditorActivity: [],
                recentAudits: []
            });
            return;
        }

        const auditsSnap = await getDocs(query(
          collection(db, 'audits'),
          where('locationId', 'in', locationIds),
          orderBy('createdAt', 'desc'),
          limit(20)
        ));
        const audits = auditsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        // Process recent scores for chart
        const recentScores = audits
          .filter(a => a.status === 'completed')
          .slice(0, 10)
          .map(a => ({
            date: a.completedAt ? format(a.completedAt.toDate(), 'MM/dd') : format(a.createdAt.toDate(), 'MM/dd'),
            score: a.scorePercentage || 0
          }))
          .reverse();

        // Process auditor activity
        const activity = auditors.map((aud: any) => {
          const personalAudits = audits.filter(a => a.assignedAuditorId === aud.uid);
          return {
            name: aud.name,
            completed: personalAudits.filter(a => a.status === 'completed').length,
            pending: personalAudits.filter(a => a.status === 'assigned' || a.status === 'in_progress').length
          };
        });

        setStats({
          assignedLocations: assignedLocationsCount,
          activeAuditors: auditors.length,
          recentAuditScores: recentScores,
          auditorActivity: activity,
          recentAudits: audits.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching manager data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchManagerData();
  }, [session]);

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Branch Performance</h2>
          <p className="text-muted-foreground">Monitoring quality and compliance across your assigned locations</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Managed Branches</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900">{stats?.assignedLocations}</div>
              <p className="text-xs text-muted-foreground pt-1">Total active locations under your oversight</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Reporting Auditors</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900">{stats?.activeAuditors}</div>
              <p className="text-xs text-muted-foreground pt-1">Auditors currently reporting to you</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
          {/* Trend Chart */}
          <Card className="md:col-span-4 shadow-sm border-muted">
            <CardHeader>
              <CardTitle>Score History</CardTitle>
              <CardDescription>Average performance trend over recent audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.recentAuditScores}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#2563eb', strokeWidth: 2 }} 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="md:col-span-3 shadow-sm border-muted">
            <CardHeader>
              <CardTitle>Auditor Activity</CardTitle>
              <CardDescription>Current workload distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats?.auditorActivity.map((aud, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-zinc-900">{aud.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 h-5 px-1.5 font-bold border-emerald-100">
                          {aud.completed} Done
                        </Badge>
                        <Badge variant="outline" className="text-[10px] text-zinc-500 h-5 px-1.5 font-bold">
                          {aud.pending} In Progress
                        </Badge>
                      </div>
                    </div>
                    <CheckCircle2 className={aud.pending === 0 ? "text-emerald-500 h-4 w-4" : "text-zinc-200 h-4 w-4"} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Audits Table */}
        <Card className="shadow-sm border-muted">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A live look at submissions across your branches</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-zinc-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentAudits.map((audit, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{audit.templateTitle}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {audit.locationName} &bull; <Clock className="h-3 w-3" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMM d, h:mm a') : 'Scheduled'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {audit.status === 'completed' ? (
                      <div className={cn(
                        "text-sm font-black text-white px-3 py-1 rounded-full px-2 py-0.5 text-[12px]",
                        audit.scorePercentage >= 90 ? "bg-emerald-500" : audit.scorePercentage >= 70 ? "bg-indigo-500" : "bg-rose-500"
                      )}>
                        {audit.scorePercentage}%
                      </div>
                    ) : (
                      <Badge variant="outline" className="uppercase text-[10px] font-bold text-zinc-400">
                        {audit.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
