'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { db, auth } from '@/lib/firebase';
import { getIdToken } from 'firebase/auth';
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
} from '@/components/app-ui/card';
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
import { Badge } from '@/components/app-ui/badge';
import { Button } from '@/components/app-ui/button';
import { format, startOfMonth } from 'date-fns';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/app-ui/dialog';
import { Textarea } from '@/components/app-ui/textarea';
import { Input } from '@/components/app-ui/input';
import { Label } from "@/components/app-ui/label";
import { Skeleton } from "@/components/app-ui/skeleton";
import { ScrollArea } from "@/components/app-ui/scroll-area";
import { useRef } from 'react';
import { useAuthSync } from '@/components/AuthProvider';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const { isSynced, uid, orgId } = useAuthSync();
  const [managerExtraStats, setManagerExtraStats] = useState<{ unassigned: any[], nearDeadlines: any[] }>({ unassigned: [], nearDeadlines: [] });
  const [isMounted, setIsMounted] = useState(false);

  // Tab states for dashboard simplification
  const [activeActivityTab, setActiveActivityTab] = useState<'audits' | 'notifications'>('audits');
  const [activeTasksTab, setActiveTasksTab] = useState<'unassigned' | 'deadlines'>('unassigned');


  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Resolution state
  const [selectedCA, setSelectedCA] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionPhotos, setResolutionPhotos] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSynced) return;
    if (!uid || !orgId) {
      setLoading(false);
      return;
    }

    async function fetchManagerData() {
      try {
        console.log('[ManagerDashboard] Fetching data for UID:', uid);
        
        const monthStart = startOfMonth(new Date());
        const now = new Date();

        // 1. Robust Location Detection
        let managedLocationIds: string[] = [];
        const userLocSnap = await getDoc(doc(db, 'users', uid!));
        const userData = userLocSnap.data();
        if (userData?.assignedLocationIds || userData?.assignedLocations) {
          managedLocationIds = userData?.assignedLocationIds || userData?.assignedLocations || [];
        }
        
        if (managedLocationIds.length === 0) {
          const locsByArrayQuery = query(
            collection(db, 'locations'),
            where('organizationId', '==', orgId!),
            where('assignedManagerIds', 'array-contains', uid!)
          );
          const locsBySingleQuery = query(
            collection(db, 'locations'),
            where('organizationId', '==', orgId!),
            where('assignedManagerId', '==', uid!)
          );
          
          const [snapArray, snapSingle] = await Promise.all([
            getDocs(locsByArrayQuery),
            getDocs(locsBySingleQuery)
          ]);
          
          const foundIds = new Set<string>();
          snapArray.docs.forEach(d => foundIds.add(d.id));
          snapSingle.docs.forEach(d => foundIds.add(d.id));
          managedLocationIds = Array.from(foundIds);
        }

        if (managedLocationIds.length === 0) {
          console.log('Manager Dashboard - No managed locations found');
        }

        // 2. Fetch Audits across all managed locations
        let allAudits: any[] = [];
        if (managedLocationIds.length > 0) {
          const auditsByLoc = query(
            collection(db, 'audits'),
            where('organizationId', '==', orgId!),
            where('locationId', 'in', managedLocationIds.slice(0, 30))
          );
          const auditsSnap = await getDocs(auditsByLoc);
          allAudits = auditsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        }

        // 3. Fetch Auditors
        const auditorsQuery = query(
          collection(db, 'users'),
          where('organizationId', '==', orgId!),
          where('managerId', '==', uid!),
          where('role', '==', 'AUDITOR')
        );
        const auditorsSnap = await getDocs(auditorsQuery);
        const auditors = auditorsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        // 4. Update Stats helper
        const toDate = (val: any): Date => {
          if (!val) return new Date(0);
          if (typeof val.toDate === 'function') return val.toDate();
          return new Date(val);
        };

        const pendingAudits = allAudits.filter(a => ['published', 'assigned', 'in_progress'].includes(a.status));
        const completedThisMonth = allAudits.filter(a => 
          a.status === 'completed' && 
          toDate(a.completedAt) >= monthStart
        );

        // Sorting: Closest future audits first
        const sortedAudits = [...allAudits].sort((a, b) => {
          const dateA = toDate(a.scheduledDate);
          const dateB = toDate(b.scheduledDate);
          
          const isFutureA = dateA >= now;
          const isFutureB = dateB >= now;

          if (isFutureA && !isFutureB) return -1;
          if (!isFutureA && isFutureB) return 1;
          
          if (isFutureA && isFutureB) return dateA.getTime() - dateB.getTime();
          return dateB.getTime() - dateA.getTime();
        });

        // 5. Fetch Corrective Actions for managed locations
        if (managedLocationIds.length > 0) {
          const caQuery = query(
            collection(db, 'correctiveActions'),
            where('organizationId', '==', orgId!),
            where('locationId', 'in', managedLocationIds.slice(0, 30))
          );
          const caSnap = await getDocs(caQuery);
          const fetchedCAs = caSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
          
          fetchedCAs.sort((a, b) => {
            const deadA = toDate(a.deadline).getTime();
            const deadB = toDate(b.deadline).getTime();
            if (deadA !== deadB) return deadA - deadB;
            const prioMap: any = { critical: 0, medium: 1, low: 2 };
            const prioA = prioMap[a.severity] ?? 99;
            const prioB = prioMap[b.severity] ?? 99;
            return (prioA - prioB);
          });

          setCorrectiveActions(fetchedCAs);
        }

        setManagerExtraStats({
          unassigned: allAudits.filter(a => a.status === 'published' && !a.assignedAuditorId).slice(0, 5),
          nearDeadlines: pendingAudits.sort((a, b) => toDate(a.deadline).getTime() - toDate(b.deadline).getTime()).slice(0, 5)
        });

        setStats({
          assignedLocations: managedLocationIds.length,
          activeAuditors: auditors.length,
          recentAuditScores: allAudits
            .filter(a => a.status === 'completed')
            .sort((a, b) => toDate(b.completedAt).getTime() - toDate(a.completedAt).getTime())
            .slice(0, 10)
            .map(a => ({
              date: format(toDate(a.completedAt), 'MM/dd'),
              score: a.finalScore ?? a.scorePercentage ?? 0
            }))
            .reverse(),
          auditorActivity: auditors.map(aud => {
            const personalAudits = allAudits.filter(a => a.assignedAuditorId === aud.uid);
            return {
              id: aud.id,
              name: aud.name,
              completed: personalAudits.filter(a => a.status === 'completed').length,
              pending: personalAudits.filter(a => ['assigned', 'in_progress'].includes(a.status)).length
            };
          }),
          recentAudits: sortedAudits.slice(0, 5),
          totalPending: pendingAudits.length,
          completedThisMonth: completedThisMonth.length
        } as any);

      } catch (error: any) {
        console.error('Error fetching manager data:', error);
        setErrorMsg(error.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchManagerData();

    if (!uid || !orgId) return;

    // Fetch corrective actions (real-time)
    const caQuery = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', orgId),
      where('assignedManagerId', '==', uid),
      where('status', 'in', ['open', 'in_progress']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeCA = onSnapshot(caQuery, (snap) => {
      setCorrectiveActions(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err: any) => {
      if (err.name === 'AbortError') return;
      console.error('[ManagerDashboard] CA snapshot error:', err);
    });

    // Fetch recent notifications (real-time)
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err: any) => {
      if (err.name === 'AbortError') return;
      console.error('[ManagerDashboard] Notifications snapshot error:', err);
    });

    return () => {
      unsubscribeCA();
      unsubscribeNotifications();
    };
  }, [uid, orgId, isSynced]);

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
      
      let authHeaders: any = {};
      if (auth.currentUser) {
        const idToken = await getIdToken(auth.currentUser);
        authHeaders['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData,
        headers: authHeaders
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResolutionPhotos(prev => [...prev, data.url]);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="manager">
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
    <DashboardShell role="manager">
      <div className="dashboard-page-container">
        {errorMsg && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6">
            <h3 className="font-bold">Error loading dashboard</h3>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="page-heading">Overview</h1>
            <p className="body-text text-muted-text">Manage quality and compliance across your branches.</p>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="standard-card p-6 bg-card">
            <p className="text-[11px] font-medium text-muted-text/50 uppercase tracking-[0.07em]">Locations</p>
            <div className="text-[36px] font-bold text-heading tabular-nums leading-none mt-3" style={{ letterSpacing: '-0.02em' }}>
              {stats?.assignedLocations}
            </div>
            <p className="text-[11.5px] text-muted-text/70 mt-2.5">Managed branches</p>
          </Card>

          <Card className="standard-card p-6 bg-card">
            <p className="text-[11px] font-medium text-muted-text/50 uppercase tracking-[0.07em]">Pending Audits</p>
            <div className="text-[36px] font-bold text-heading tabular-nums leading-none mt-3" style={{ letterSpacing: '-0.02em' }}>
              {(stats as any)?.totalPending || 0}
            </div>
            <p className="text-[11.5px] text-muted-text/70 mt-2.5">Require attention</p>
          </Card>

          <Card className="standard-card p-6 bg-card">
            <p className="text-[11px] font-medium text-muted-text/50 uppercase tracking-[0.07em]">Completed</p>
            <div className="text-[36px] font-bold text-success tabular-nums leading-none mt-3" style={{ letterSpacing: '-0.02em' }}>
              {(stats as any)?.completedThisMonth || 0}
            </div>
            <p className="text-[11.5px] text-muted-text/70 mt-2.5">Completed this month</p>
          </Card>

          <Card className="standard-card p-6 bg-card">
            <p className="text-[11px] font-medium text-muted-text/50 uppercase tracking-[0.07em]">Auditors</p>
            <div className="text-[36px] font-bold text-heading tabular-nums leading-none mt-3" style={{ letterSpacing: '-0.02em' }}>
              {stats?.activeAuditors}
            </div>
            <p className="text-[11.5px] text-muted-text/70 mt-2.5">Active team members</p>
          </Card>
        </div>

        {/* Corrective Actions Section */}
        <div className="standard-card bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-0.5">
              <h3 className="text-[14px] font-semibold text-heading">Corrective Actions</h3>
              <p className="text-[11px] text-muted-text/60">Issues requiring immediate attention</p>
            </div>
            <Link href="/dashboard/manager/corrective-actions" className="text-[11.5px] font-medium text-primary hover:opacity-80 transition-opacity">
              View all
            </Link>
          </div>

          {correctiveActions.length === 0 ? (
            <div className="text-center py-10 text-muted-text/40">
              <p className="text-xs font-medium">No pending corrective actions.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {[...correctiveActions]
                .sort((a, b) => {
                  const toDate = (val: any) => val?.toDate ? val.toDate().getTime() : new Date(val).getTime();
                  return toDate(a.deadline) - toDate(b.deadline);
                })
                .map(action => (
                  <button
                    key={action.id}
                    onClick={() => setSelectedCA(action)}
                    className="flex-shrink-0 w-72 p-4 rounded-xl border border-border/40 bg-muted/5 hover:border-border/80 transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.05em]",
                          action.severity === 'high' ? "text-destructive" :
                            action.severity === 'medium' ? "text-amber-500" :
                            "text-primary"
                        )}>
                          {action.severity} severity
                        </span>
                        {action.status === 'in_progress' && (
                          <span className="text-[10px] text-muted-text/50 font-medium">In Progress</span>
                        )}
                      </div>

                      <p className="text-[13.5px] font-normal text-heading leading-snug line-clamp-2 min-h-[40px]">
                        {action.questionText}
                      </p>

                      <div className="space-y-1.5 pt-1 text-[11px] text-muted-text/60">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 opacity-60" />
                          <span className="truncate">{action.locationName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-destructive font-medium">
                          <Clock className="h-3 w-3 opacity-80" />
                          <span>Due {format(action.deadline.toDate ? action.deadline.toDate() : new Date(action.deadline), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Split Grid: Left Side (Trends & Logs) vs Right Side (Operations & Workload) */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          
          {/* Left Column: Chart & Activity logs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Performance Trend */}
            <Card className="standard-card p-6 bg-card">
              <div className="mb-6">
                <h3 className="text-[14px] font-semibold text-heading">Performance Trend</h3>
                <p className="text-[11px] text-muted-text/60 mt-0.5">Average compliance score across recent audits</p>
              </div>
              <div className="h-[280px] w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.recentAuditScores} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} strokeOpacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--muted-text)" 
                        fontSize={10} 
                        axisLine={false} 
                        tickLine={false} 
                        fontWeight={500} 
                        tick={{ dy: 10 }}
                      />
                      <YAxis 
                        stroke="var(--muted-text)" 
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
                          border: '1px solid var(--border)', 
                          backgroundColor: 'var(--background)', 
                          color: 'var(--heading)', 
                          fontSize: '11px',
                          fontWeight: '600',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                          padding: '10px'
                        }}
                        cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--primary)' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="h-full w-full rounded-xl" />
                )}
              </div>
            </Card>

            {/* Activity tab panel: Recent Audits & Notifications combined */}
            <Card className="standard-card p-6 bg-card flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-semibold text-heading">Activity Log</h3>
                  <p className="text-[11px] text-muted-text/60">Live updates and audit history</p>
                </div>
                {/* Segment controller */}
                <div className="bg-muted/30 p-0.5 rounded-lg flex gap-1 border border-border/20">
                  <button
                    onClick={() => setActiveActivityTab('audits')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                      activeActivityTab === 'audits' 
                        ? "bg-background text-heading shadow-sm" 
                        : "text-muted-text/75 hover:text-heading"
                    )}
                  >
                    Audits
                  </button>
                  <button
                    onClick={() => setActiveActivityTab('notifications')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                      activeActivityTab === 'notifications' 
                        ? "bg-background text-heading shadow-sm" 
                        : "text-muted-text/75 hover:text-heading"
                    )}
                  >
                    Alerts
                  </button>
                </div>
              </div>

              {activeActivityTab === 'audits' ? (
                <div className="divide-y divide-border/25">
                  {stats?.recentAudits.map((audit, i) => (
                    <div key={i} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="min-w-0 pr-4 space-y-1">
                        <p className="text-[13px] font-normal text-heading leading-tight truncate">{audit.templateTitle}</p>
                        <div className="text-[11px] text-muted-text/50 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 opacity-60" /> {audit.locationName} 
                          <span>•</span> 
                          <Clock className="h-3 w-3 opacity-60" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMM d') : 'Scheduled'}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {audit.status === 'completed' ? (
                          <span className={cn(
                            "text-[13.5px] font-semibold tabular-nums",
                            audit.scorePercentage >= 90 ? "text-success" : audit.scorePercentage >= 70 ? "text-primary" : "text-destructive"
                          )}>
                            {audit.scorePercentage}%
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-muted-text/40">
                            {audit.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/25 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-12 text-center text-xs text-muted-text/40">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                            <p className="text-[13px] font-medium text-heading leading-tight">{n.title}</p>
                          </div>
                          <span className="text-[10px] text-muted-text/40 tabular-nums">
                            {n.createdAt ? format(n.createdAt.toDate(), 'MMM d, h:mm a') : 'Now'}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-muted-text/70 leading-relaxed pr-6">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

          </div>

          {/* Right Column: Workload & Combined Tasks */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Auditor Workload */}
            <Card className="standard-card p-6 bg-card flex flex-col">
              <div className="mb-5">
                <h3 className="text-[14px] font-semibold text-heading">Auditor Workload</h3>
                <p className="text-[11px] text-muted-text/60 mt-0.5">Current audit assignment distribution</p>
              </div>
              <div className="divide-y divide-border/25 flex-1 flex flex-col justify-start">
                {stats?.auditorActivity.map((aud, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <Link href={`/dashboard/manager/auditors/${aud.id}`} className="text-[13px] font-medium text-heading hover:text-primary transition-colors">
                        {aud.name}
                      </Link>
                      <div className="flex items-center gap-3 text-[11px] text-muted-text/50">
                        <span className="text-success font-medium">{aud.completed} completed</span>
                        <span>•</span>
                        <span>{aud.pending} in progress</span>
                      </div>
                    </div>
                    {aud.pending === 0 ? (
                      <span className="text-[10px] font-medium text-success uppercase tracking-[0.05em]">Idle</span>
                    ) : (
                      <span className="text-[10px] font-medium text-primary uppercase tracking-[0.05em]">{aud.pending} Active</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Audit Tasks Panel: Unassigned & Deadlines combined */}
            <Card className="standard-card p-6 bg-card">
              <div className="flex items-center justify-between mb-5">
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-semibold text-heading">Operations</h3>
                  <p className="text-[11px] text-muted-text/60">Manage dispatches and deadlines</p>
                </div>
                {/* Segment controller */}
                <div className="bg-muted/30 p-0.5 rounded-lg flex gap-1 border border-border/20">
                  <button
                    onClick={() => setActiveTasksTab('unassigned')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                      activeTasksTab === 'unassigned' 
                        ? "bg-background text-heading shadow-sm" 
                        : "text-muted-text/75 hover:text-heading"
                    )}
                  >
                    Unassigned ({managerExtraStats.unassigned.length})
                  </button>
                  <button
                    onClick={() => setActiveTasksTab('deadlines')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                      activeTasksTab === 'deadlines' 
                        ? "bg-background text-heading shadow-sm" 
                        : "text-muted-text/75 hover:text-heading"
                    )}
                  >
                    Deadlines
                  </button>
                </div>
              </div>

              {activeTasksTab === 'unassigned' ? (
                <div className="divide-y divide-border/25">
                  {managerExtraStats.unassigned.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-text/40">No unassigned audits.</p>
                  ) : (
                    managerExtraStats.unassigned.map((audit) => (
                      <div key={audit.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-1 min-w-0 pr-4">
                          <p className="text-[13px] font-normal text-heading truncate">{audit.templateTitle}</p>
                          <p className="text-[11px] text-muted-text/50 flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 opacity-60" /> {audit.locationName}
                          </p>
                        </div>
                        <Link href="/dashboard/manager/audits">
                          <Button size="sm" variant="outline" className="h-7 px-3 text-[11px] font-medium border-border/50 text-muted-text hover:text-heading hover:border-border transition-colors">
                            Assign
                          </Button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border/25">
                  {managerExtraStats.nearDeadlines.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-text/40">No upcoming deadlines.</p>
                  ) : (
                    managerExtraStats.nearDeadlines.map((audit) => (
                      <div key={audit.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-1 min-w-0 pr-4">
                          <p className="text-[13px] font-normal text-heading truncate">{audit.templateTitle}</p>
                          <p className="text-[11px] text-muted-text/50 flex items-center gap-1.5">
                            <Clock className="h-3 w-3 opacity-60" /> {audit.deadline ? format(audit.deadline.toDate(), 'MMM d, yyyy') : '–'}
                          </p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-medium uppercase tracking-[0.05em]",
                          audit.status === 'in_progress' ? "text-primary" : "text-muted-text/50"
                        )}>
                          {audit.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

          </div>

        </div>

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
              <Label htmlFor="note" className="text-xs font-medium text-muted-text tracking-tight">Note</Label>
              <Textarea
                id="note"
                placeholder="Explain how the issue was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[120px] text-sm bg-background border-border/50 focus-visible:ring-primary/20 text-body resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-text tracking-tight">Photo evidence (optional)</Label>
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
                      <Image src={url} alt="Evidence" width={64} height={64} className="h-full w-full object-cover" />
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
    </DashboardShell>
  );
}
