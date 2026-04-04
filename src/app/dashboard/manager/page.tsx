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
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp
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
  Loader2,
  AlertTriangle,
  Camera,
  MessageSquare,
  CheckCircle,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from 'react';

interface ManagerStats {
  assignedLocations: number;
  activeAuditors: number;
  recentAuditScores: { date: string; score: number }[];
  auditorActivity: { id: string; name: string; completed: number; pending: number }[];
  recentAudits: any[];
}

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [correctiveActions, setCorrectiveActions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [managerExtraStats, setManagerExtraStats] = useState<{ unassigned: any[], nearDeadlines: any[] }>({ unassigned: [], nearDeadlines: [] });

  // Resolution state
  const [selectedCA, setSelectedCA] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionPhotos, setResolutionPhotos] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;

    async function fetchManagerData() {
      try {
        console.log('Manager Dashboard - Session:', session);
        console.log('Manager Dashboard - UID:', session.uid);
        console.log('Manager Dashboard - OrganizationId:', session.organizationId);

        // Robust Fetch for Location IDs
        let locationIds: string[] = [];
        
        // Strategy 1: Check User Document (Multi-Manager Update)
        const userRef = doc(db, 'users', session.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        
        if (userData?.assignedLocationIds || userData?.assignedLocations) {
          locationIds = userData?.assignedLocationIds || userData?.assignedLocations || [];
          console.log('Manager Dashboard - Found locations in user doc:', locationIds);
        }
        
        // Strategy 2: Fallback to Locations Collection Query (Legacy or Alternate Store)
        if (locationIds.length === 0) {
          console.log('Manager Dashboard - No locations in user doc, querying locations collection...');
          const locsByArrayQuery = query(
            collection(db, 'locations'),
            where('organizationId', '==', session.organizationId),
            where('assignedManagerIds', 'array-contains', session.uid)
          );
          const locsBySingleQuery = query(
            collection(db, 'locations'),
            where('organizationId', '==', session.organizationId),
            where('assignedManagerId', '==', session.uid)
          );
          
          const [snapArray, snapSingle] = await Promise.all([
            getDocs(locsByArrayQuery),
            getDocs(locsBySingleQuery)
          ]);
          
          const foundIds = new Set<string>();
          snapArray.docs.forEach(d => foundIds.add(d.id));
          snapSingle.docs.forEach(d => foundIds.add(d.id));
          locationIds = Array.from(foundIds);
          console.log('Manager Dashboard - Found locations via collection query:', locationIds);
        }

        const assignedLocationsCount = locationIds.length;
        
        // Fetch unassigned audits and audits near deadlines
        let unassignedAudits: any[] = [];
        let upcomingAudits: any[] = [];
        
        if (locationIds.length > 0) {
          const unassignedQuery = query(
            collection(db, 'audits'),
            where('organizationId', '==', session.organizationId),
            where('locationId', 'in', locationIds.slice(0, 30)),
            where('status', 'in', ['published', 'assigned']),
            limit(5)
          );
          const unassignedSnap = await getDocs(unassignedQuery);
          unassignedAudits = unassignedSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          const deadlineQuery = query(
            collection(db, 'audits'),
            where('organizationId', '==', session.organizationId),
            where('locationId', 'in', locationIds.slice(0, 30)),
            where('status', 'in', ['published', 'assigned', 'in_progress']),
            orderBy('deadline', 'asc'),
            limit(5)
          );
          const deadlineSnap = await getDocs(deadlineQuery);
          upcomingAudits = deadlineSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          // Original Queries from ManagerDashboardPage
          // 4. Fetch corrective actions for manager's locations
          const caQuery = query(
            collection(db, 'corrective_actions'),
            where('organizationId', '==', session.organizationId),
            where('locationId', 'in', locationIds.slice(0, 10)),
            orderBy('deadline', 'asc'),
            limit(20)
          );
          const caSnap = await getDocs(caQuery);
          setCorrectiveActions(caSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          
          // 5. Fetch completed audits for report summary
          const auditsSummaryQuery = query(
            collection(db, 'audits'),
            where('organizationId', '==', session.organizationId),
            where('locationId', 'in', locationIds.slice(0, 10)),
            where('status', '==', 'completed'),
            limit(20)
          );
          const auditsSummarySnap = await getDocs(auditsSummaryQuery);
          // Note: Assuming setRecentAudits is defined or handled via stats
        }

        setManagerExtraStats({
          unassigned: unassignedAudits,
          nearDeadlines: upcomingAudits
        });

        // 2. Fetch auditors reporting to this manager
        const auditorsSnap = await getDocs(query(
          collection(db, 'users'),
          where('organizationId', '==', session.organizationId),
          where('managerId', '==', session.uid),
          where('role', '==', 'AUDITOR')
        ));
        console.log('Manager Dashboard - Auditors found:', auditorsSnap.size);
        const auditors = auditorsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 3. Fetch recent audits for these locations
        if (locationIds.length === 0) {
          console.warn('Manager Dashboard - No locations assigned to check for audits');
          
          const idleActivity = auditors.map((aud: any) => ({
            id: aud.id,
            name: aud.name,
            completed: 0,
            pending: 0
          }));

          setStats({
            assignedLocations: 0,
            activeAuditors: auditors.length,
            recentAuditScores: [],
            auditorActivity: idleActivity,
            recentAudits: []
          });
          setLoading(false);
          return;
        }

        const auditsQuery = query(
          collection(db, 'audits'),
          where('organizationId', '==', session.organizationId),
          where('locationId', 'in', locationIds),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        console.log('Manager Dashboard - Fetching audits for locations:', locationIds);
        const auditsSnap = await getDocs(auditsQuery);
        console.log('Manager Dashboard - Audits found:', auditsSnap.size);
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
            id: aud.id,
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

    // Fetch corrective actions (real-time)
    const caQuery = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', session.organizationId),
      where('assignedManagerId', '==', session.uid),
      where('status', 'in', ['open', 'in_progress']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeCA = onSnapshot(caQuery, (snap) => {
      setCorrectiveActions(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });

    // Fetch recent notifications (real-time)
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', session.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });

    return () => {
      unsubscribeCA();
      unsubscribeNotifications();
    };
  }, [session]);

  const handleResolve = async () => {
    if (!selectedCA || !resolutionNote) return;
    setIsResolving(true);
    try {
      const caRef = doc(db, 'correctiveActions', selectedCA.id);
      await updateDoc(caRef, {
        status: 'resolved',
        resolutionNote,
        resolutionPhotoUrls: resolutionPhotos,
        resolvedAt: serverTimestamp()
      });
      setSelectedCA(null);
      setResolutionNote('');
      setResolutionPhotos([]);
    } catch (error) {
      console.error('Error resolving CA:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResolutionPhotos(prev => [...prev, data.url]);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="dashboard-page-container">
          <div className="page-header-section mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
          </div>
          <div className="grid gap-6 md:grid-cols-7">
            <Skeleton className="md:col-span-4 h-[400px] rounded-xl" />
            <Skeleton className="md:col-span-3 h-[400px] rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container px-6 md:px-10">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Overview</h1>
            <p className="body-text">Manage quality and compliance across your branches.</p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Locations</p>
              <MapPin className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{stats?.assignedLocations}</div>
              <p className="body-text mt-2">Managed locations</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Auditors</p>
              <Users className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{stats?.activeAuditors}</div>
              <p className="body-text mt-2">Active auditors</p>
            </div>
          </Card>
        </div>

        {/* Priority Resolution Section */}
        {correctiveActions.length > 0 && (
          <Card className="standard-card bg-muted/5 border-primary/10 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="section-heading">Corrective Actions</h3>
                  <p className="text-[12px] text-muted-text">Issues requiring immediate attention</p>
                </div>
                <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-3 text-[11px] font-semibold tabular-nums lowercase">
                  {correctiveActions.length} pending
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {correctiveActions.map((ca) => (
                  <Card key={ca.id} className="standard-card bg-background border-border/40 hover:border-primary/20 transition-all duration-200">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className={cn(
                          "h-5 rounded-full border-none px-2 text-[10px] font-medium lowercase tracking-tight",
                          ca.severity === 'critical' ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                        )}>
                          {ca.severity}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-text/60">
                          <Clock className="h-3 w-3" />
                          {format(ca.deadline.toDate(), 'MMM d')}
                        </div>
                      </div>
                      
                      <h4 className="text-[14px] font-medium text-heading leading-tight line-clamp-3 mb-6">
                        {ca.questionText}
                      </h4>

                      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-text/50">
                          <MapPin className="h-3.5 w-3.5" />
                          {ca.locationName}
                        </div>
                        <Button
                          size="sm"
                          variant="link"
                          className="h-6 p-0 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors"
                          onClick={() => setSelectedCA(ca)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Trend Chart */}
          <Card className="lg:col-span-4 standard-card p-6">
            <div className="mb-6">
              <h3 className="section-heading">Performance Trend</h3>
              <p className="body-text mt-1">Score trends from recent audits</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.recentAuditScores}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.06} />
                  <XAxis 
                    dataKey="date" 
                    stroke="oklch(var(--muted-text))" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    fontWeight={500} 
                    tick={{ dy: 10 }}
                    tickFormatter={(val) => val.toLowerCase()}
                  />
                  <YAxis 
                    stroke="oklch(var(--muted-text))" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 100]} 
                    fontWeight={500}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid oklch(var(--border) / 0.5)', 
                      backgroundColor: 'oklch(var(--background))', 
                      color: 'oklch(var(--heading))', 
                      fontSize: '11px',
                      fontWeight: '600',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                      padding: '12px'
                    }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="lg:col-span-3 standard-card p-6">
            <div className="mb-6">
              <h3 className="section-heading">Auditor Activity</h3>
              <p className="body-text mt-1">Current workload of your team</p>
            </div>
            <div className="space-y-4">
              {stats?.auditorActivity.map((aud, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/5">
                  <div className="space-y-1">
                    <Link href={`/dashboard/manager/auditors/${aud.id}`} className="block">
                      <p className="font-semibold text-[13px] text-heading hover:text-primary transition-colors cursor-pointer">{aud.name}</p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-medium text-success border-success/30 bg-success/5 px-2 py-0.5 lowercase">
                        {aud.completed} completed
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-medium text-muted-text border-border px-2 py-0.5 lowercase">
                        {aud.pending} in progress
                      </Badge>
                    </div>
                  </div>
                  <CheckCircle2 className={aud.pending === 0 ? "text-success h-5 w-5 opacity-80" : "text-muted-text/30 h-5 w-5"} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Manager Tasks: Unassigned Auddits & Near Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Unassigned Audits */}
          <Card className="standard-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-heading">Unassigned Audits</h3>
                <p className="body-text mt-1">Audits waiting for an auditor</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary lowercase px-3">{managerExtraStats.unassigned.length} pending</Badge>
            </div>
            <div className="space-y-3">
              {managerExtraStats.unassigned.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-border/40 rounded-xl">
                  <p className="text-sm text-body">No unassigned audits.</p>
                </div>
              ) : (
                managerExtraStats.unassigned.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-all">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-heading">{audit.templateTitle}</p>
                      <p className="text-[11px] text-muted-text flex items-center gap-1.5 lowercase">
                        <MapPin className="h-3 w-3" /> {audit.locationName}
                      </p>
                    </div>
                    <Link href="/dashboard/manager/audits">
                      <Button size="sm" variant="outline" className="h-8 text-xs lowercase">Assign</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Near Deadlines */}
          <Card className="standard-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="section-heading">Near Deadlines</h3>
                <p className="body-text mt-1">Upcoming audit deadlines</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-warning opacity-50" />
            </div>
            <div className="space-y-3">
              {managerExtraStats.nearDeadlines.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-border/40 rounded-xl">
                  <p className="text-sm text-body">No upcoming deadlines.</p>
                </div>
              ) : (
                managerExtraStats.nearDeadlines.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-all">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-heading">{audit.templateTitle}</p>
                      <p className="text-[11px] text-muted-text flex items-center gap-1.5 lowercase">
                        <Clock className="h-3 w-3" /> {audit.deadline ? format(audit.deadline.toDate(), 'MMM d, yyyy') : 'No date'}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px] lowercase",
                      audit.status === 'in_progress' ? "text-primary border-primary/20" : "text-muted-text border-border"
                    )}>
                      {audit.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Recent Notifications & Recent Audits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="standard-card p-6">
            <div className="mb-6">
              <h3 className="section-heading">Recent Notifications</h3>
              <p className="body-text mt-1">Latest updates and alerts</p>
            </div>
            <ScrollArea className="h-[350px] pr-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <p className="text-sm">No notifications yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn("p-4 rounded-xl border border-border/40 transition-all", !n.isRead && "bg-primary/5 border-primary/20")}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[13px] font-semibold text-heading">{n.title}</p>
                        <span className="text-[10px] text-muted-text/50">
                          {n.createdAt ? format(n.createdAt.toDate(), 'MMM d, h:mm a') : 'Now'}
                        </span>
                      </div>
                      <p className="text-[12px] text-body line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

        {/* Recent Audits Section */}
        <Card className="standard-card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-heading">Recent Audits</h3>
                <p className="body-text mt-1">Latest audits from your team</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-text/50" />
            </div>
          </div>
          <div className="space-y-3">
            {stats?.recentAudits.map((audit, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-muted/30 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-heading leading-tight">{audit.templateTitle}</p>
                    <div className="text-[12px] font-normal text-muted-text flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {audit.locationName} 
                      <span className="opacity-30 mx-0.5">•</span> 
                      <Clock className="h-3 w-3" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMM d, h:mm a') : 'Scheduled'}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {audit.status === 'completed' ? (
                    <Badge className={cn(
                      "text-[10px] font-semibold px-2.5 py-1 lowercase",
                      audit.scorePercentage >= 90 ? "bg-success text-success-foreground" : audit.scorePercentage >= 70 ? "bg-primary text-primary-foreground" : "bg-warning text-warning-foreground"
                    )}>
                      {audit.scorePercentage}%
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-semibold text-muted-text bg-muted/20 lowercase px-2.5 py-1">
                      {audit.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Resolution Dialog */}
      <Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelectedCA(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-heading flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" /> Resolve Issue
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-text mt-1 leading-normal">
              {selectedCA?.questionText} at <span className="font-medium text-heading">{selectedCA?.locationName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="note" className="text-xs font-medium text-muted-text tracking-tight uppercase">Note</Label>
              <Textarea
                id="note"
                placeholder="Explain how the issue was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[120px] text-sm bg-background border-border/50 focus-visible:ring-primary/20 text-body resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-text uppercase tracking-tight">Photo Evidence (Optional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 w-full border-dashed border-border/60 flex flex-col gap-2 hover:bg-muted/10 hover:border-primary/30 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Camera className="h-5 w-5 text-muted-text/60 group-hover:text-primary/60 transition-colors" />
                  )}
                  <span className="text-[11px] font-medium text-muted-text group-hover:text-primary transition-colors tracking-tight">
                    {isUploading ? 'Uploading...' : 'Click to upload photo'}
                  </span>
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>

              {resolutionPhotos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                  {resolutionPhotos.map((url, i) => (
                    <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-border/40 shrink-0 shadow-sm group">
                      <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                      <button
                        className="absolute top-1 right-1 bg-destructive text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/80"
                        onClick={() => setResolutionPhotos(prev => prev.filter(p => p !== url))}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-border/40 bg-muted/5 gap-2">
            <Button variant="outline" onClick={() => setSelectedCA(null)} className="h-9 px-4 font-medium text-xs text-muted-text">Cancel</Button>
            <Button
              onClick={handleResolve}
              disabled={isResolving || !resolutionNote}
              className="h-9 px-4 font-medium text-xs bg-success hover:bg-success/90 text-white shadow-lg shadow-success/10 transition-all active:scale-95"
            >
              {isResolving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <CheckCircle2 className="h-3 w-3 mr-2" />}
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardShell>
  );
}
