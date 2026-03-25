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
  Plus
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
import { Label } from '@/components/ui/label';
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
      } catch (e) {}
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

        {/* Corrective Actions Section */}
        {correctiveActions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Open Corrective Actions ({correctiveActions.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-left">
              {correctiveActions.map((ca) => (
                <Card key={ca.id} className="border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="destructive" className="text-[10px] font-bold uppercase">
                        {ca.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-bold text-rose-700 bg-rose-50 border-rose-100 italic">
                        Due {format(ca.deadline.toDate(), 'MMM d')}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold pt-2">{ca.questionText}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{ca.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3 w-3" /> {ca.locationName}
                    </div>
                  </CardContent>
                  <CardContent className="pt-0 flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 h-8 text-[11px] font-bold"
                      onClick={() => setSelectedCA(ca)}
                    >
                       Mark as Resolved
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                        "text-[10px] font-black text-white px-2 py-1 rounded-full",
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

      {/* Resolution Dialog */}
      <Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelectedCA(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <CheckCircle className="h-5 w-5" /> Resolve Issue
            </DialogTitle>
            <DialogDescription>
              {selectedCA?.questionText} at {selectedCA?.locationName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note" className="text-xs font-bold uppercase text-muted-foreground">Resolution Note</Label>
              <Textarea 
                id="note"
                placeholder="Describe how the issue was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[100px] text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Evidence Photo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-20 w-full border-dashed flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Camera className="h-5 w-5 text-muted-foreground" />}
                  <span className="text-[10px] font-bold">CLICK TO UPLOAD</span>
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>
              
              <div className="flex gap-2 overflow-x-auto py-2">
                {resolutionPhotos.map((url, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden border">
                    <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                    <button 
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-1"
                      onClick={() => setResolutionPhotos(prev => prev.filter(p => p !== url))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedCA(null)} className="font-bold text-xs uppercase h-9">Cancel</Button>
            <Button 
              onClick={handleResolve} 
              disabled={isResolving || !resolutionNote}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-wider h-9 px-6"
            >
              {isResolving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <CheckCircle className="h-4 w-4 mr-2" />}
              Complete Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
