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
import { useRef } from 'react';

interface ManagerStats {
  assignedLocations: number;
  activeAuditors: number;
  recentAuditScores: { date: string; score: number }[];
  auditorActivity: { name: string; completed: number; pending: number }[];
  recentAudits: any[];
}

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [correctiveActions, setCorrectiveActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

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

        // 1. Fetch assigned locations
        const locationsQuery = query(
          collection(db, 'locations'),
          where('organizationId', '==', session.organizationId),
          where('assignedManagerId', '==', session.uid)
        );
        const locationsSnap = await getDocs(locationsQuery);
        console.log('Manager Dashboard - Locations found:', locationsSnap.size);
        const locationIds = locationsSnap.docs.map(d => d.id);
        const assignedLocationsCount = locationsSnap.size;

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
          setStats({
            assignedLocations: 0,
            activeAuditors: auditors.length,
            recentAuditScores: [],
            auditorActivity: [],
            recentAudits: []
          });
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

    return () => unsubscribeCA();
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
        <div className="page-header-section">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Overview</h1>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Managed Branches</p>
              <MapPin className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{stats?.assignedLocations}</div>
              <p className="body-text mt-2">Locations you manage</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Reporting Auditors</p>
              <Users className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">{stats?.activeAuditors}</div>
              <p className="body-text mt-2">Auditors on your team</p>
            </div>
          </Card>
        </div>

        {/* Priority Resolution Section */}
        {correctiveActions.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="section-heading">Priority Resolution</h3>
              <Badge variant="secondary" className="h-6 rounded-full bg-muted/20 text-muted-text border-none px-3 text-[11px] font-medium capitalize">
                {correctiveActions.length} Pending Actions
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {correctiveActions.map((ca) => (
                <Card key={ca.id} className="standard-card relative overflow-hidden group hover:translate-y-[-2px] transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest text-muted-text/60 uppercase">{ca.severity} Severity</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-muted/20 text-[11px] font-medium text-muted-text">
                        <Clock className="h-3 w-3 opacity-50" />
                        {format(ca.deadline.toDate(), 'MMM d')}
                      </div>
                    </div>
                    
                    <h4 className="text-[15px] font-semibold text-heading leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">{ca.questionText}</h4>
                    <p className="text-[12px] text-muted-text leading-relaxed line-clamp-2 mb-6">{ca.description || 'No additional details provided for this action.'}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-text/50">
                        <MapPin className="h-3 w-3" /> {ca.locationName}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-0 text-[12px] font-semibold text-primary hover:bg-transparent hover:text-primary/70 gap-2 overflow-hidden group/btn"
                        onClick={() => setSelectedCA(ca)}
                      >
                        Resolve Issue
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Trend Chart */}
          <Card className="lg:col-span-4 standard-card p-6">
            <div className="mb-6">
              <h3 className="section-heading">Score History</h3>
              <p className="body-text mt-1">Average score across recent audits</p>
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
                    tickFormatter={(val) => val.toUpperCase()}
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
              <h3 className="section-heading">Personnel Focus</h3>
              <p className="body-text mt-1">Current team workload and activity</p>
            </div>
            <div className="space-y-4">
              {stats?.auditorActivity.map((aud, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-[13px] text-heading">{aud.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-medium tracking-widest text-success border-success/30 bg-success/5 px-2 py-0.5">
                        {aud.completed} Completed
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-medium tracking-widest text-muted-text border-border px-2 py-0.5">
                        {aud.pending} In Progress
                      </Badge>
                    </div>
                  </div>
                  <CheckCircle2 className={aud.pending === 0 ? "text-success h-5 w-5 opacity-80" : "text-muted-text/30 h-5 w-5"} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Audits Table Section */}
        <Card className="standard-card p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-heading">Operation Stream</h3>
                <p className="body-text mt-1">Recent audits submitted by your team</p>
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
                    <div className="text-[11px] font-medium text-muted-text flex items-center gap-1.5 uppercase tracking-wider">
                      <MapPin className="h-3 w-3" /> {audit.locationName} 
                      <span className="opacity-30 mx-1">•</span> 
                      <Clock className="h-3 w-3" /> {audit.completedAt ? format(audit.completedAt.toDate(), 'MMM d, h:mm a') : 'Scheduled'}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {audit.status === 'completed' ? (
                    <Badge className={cn(
                      "text-[10px] font-semibold tracking-widest px-2.5 py-1 uppercase",
                      audit.scorePercentage >= 90 ? "bg-success text-success-foreground" : audit.scorePercentage >= 70 ? "bg-primary text-primary-foreground" : "bg-warning text-warning-foreground"
                    )}>
                      {audit.scorePercentage}%
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-semibold tracking-widest text-muted-text bg-muted/20 uppercase px-2.5 py-1">
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
          <DialogHeader className="p-xl border-b border-border/50">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-heading">
              <CheckCircle className="h-5 w-5 text-success" /> Resolve Issue
            </DialogTitle>
            <DialogDescription className="body-text text-xs mt-2">
              {selectedCA?.questionText} at {selectedCA?.locationName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-lg p-xl">
            <div className="space-y-xs">
              <Label htmlFor="note" className="text-xs font-normal  tracking-widest text-muted-text">Resolution Note</Label>
              <Textarea
                id="note"
                placeholder="Describe how the issue was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[120px] text-sm bg-background border-input focus:ring-primary/20 text-body"
              />
            </div>

            <div className="space-y-xs">
              <Label className="text-xs font-normal  tracking-widest text-muted-text">Evidence Photo (Optional)</Label>
              <div className="flex items-center gap-md">
                <Button
                  type="button"
                  variant="outline"
                  className="h-20 w-full border-dashed flex-col gap-2 hover:bg-muted/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Camera className="h-5 w-5 text-muted-text" />}
                  <span className="text-[10px] font-medium tracking-widest  text-muted-text">CLICK TO UPLOAD</span>
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>

              {resolutionPhotos.length > 0 && (
                <div className="flex gap-sm overflow-x-auto py-2 mt-2">
                  {resolutionPhotos.map((url, i) => (
                    <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden border border-border/50 shrink-0">
                      <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                      <button
                        className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-1 hover:bg-destructive active:scale-95 transition-all"
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

          <DialogFooter className="p-xl border-t border-border/50 bg-muted/10 gap-sm">
            <Button variant="outline" onClick={() => setSelectedCA(null)} className="font-medium text-xs  tracking-widest shadow-sm text-muted-text">Cancel</Button>
            <Button
              onClick={handleResolve}
              disabled={isResolving || !resolutionNote}
              className="font-medium text-xs  tracking-widest shadow-lg shadow-success/20 bg-success hover:bg-success/90 text-success-foreground"
            >
              {isResolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
