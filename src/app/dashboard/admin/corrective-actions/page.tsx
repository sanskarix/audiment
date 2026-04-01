'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  ClipboardList,
  Filter,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';

export default function AdminCorrectiveActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [managers, setManagers] = useState<any[]>([]);
  const [editingCA, setEditingCA] = useState<any>(null);
  const [resolvingCA, setResolvingCA] = useState<any>(null);
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedPhotoUrl, setExpandedPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.organizationId) return;

    // Fetch all open corrective actions for the organization
    const q = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', session.organizationId),
      where('status', 'in', ['open', 'in_progress', 'completed']),
      orderBy('deadline', 'asc')
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // We need manager names if they aren't stored (schema says assignedManagerId is stored)
      // For now we'll just show the ID or fetch names if needed.
      // Better to store managerName in the CA doc during creation for performance.
      // Re-reading DATABASE.md: assignedManagerId is there, but not managerName.
      // I'll fetch manager names for better UX.

      const actionsWithExtras = await Promise.all(fetched.map(async (action: any) => {
        if (!action.assignedManagerId) return action;
        const managerSnap = await getDoc(doc(db, 'users', action.assignedManagerId));
        return {
          ...action,
          managerName: managerSnap.exists() ? managerSnap.data().name : 'Unknown Manager'
        };
      }));

      setActions(actionsWithExtras);
      setLoading(false);
    }, (err) => {
      console.error('Snapshot error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  useEffect(() => {
    if (!session?.organizationId) return;
    const fetchManagers = async () => {
      const q = query(collection(db, 'users'), where('organizationId', '==', session.organizationId), where('role', '==', 'MANAGER'));
      const snap = await getDocs(q);
      setManagers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchManagers();
  }, [session]);

  const handleAssign = async () => {
    if (!editingCA || !selectedManager || !selectedDate) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'correctiveActions', editingCA.id), {
        assignedManagerId: selectedManager,
        deadline: new Date(selectedDate),
      });
      setEditingCA(null);
    } catch (error) {
      console.error("Error updating CA", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolve = async () => {
    if (!resolvingCA) return;
    try {
      await updateDoc(doc(db, 'correctiveActions', resolvingCA.id), {
        status: 'resolved',
        resolvedAt: serverTimestamp()
      });
      setResolvingCA(null);
    } catch (error) {
      console.error("Error resolving CA", error);
    }
  };

  const handleReject = async () => {
    if (!resolvingCA) return;
    try {
      await updateDoc(doc(db, 'correctiveActions', resolvingCA.id), {
        status: 'in_progress'
      });
      setResolvingCA(null);
    } catch (error) {
      console.error("Error rejecting CA", error);
    }
  };

  const filteredActions = actions.filter((action) =>
    action.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.issueDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.managerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="page-heading">Corrective Actions</p>
            <p className="body-text">Unresolved quality failures requiring attention</p>
          </div>
          <Badge variant="secondary" className="h-6 rounded-full bg-destructive/10 text-destructive border-none px-2.5 text-[11px] font-normal">
            {actions.length} open
          </Badge>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search actions by location, issue, or manager..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <Card className="standard-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Overdue Tasks</p>
              <Clock className="h-4 w-4 text-destructive/40" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-destructive tabular-nums leading-tight">
                {actions.filter(a => a.deadline?.toDate() < new Date()).length}
              </div>
              <p className="body-text mt-2">Past deadline</p>
            </div>
          </Card>

          <Card className="standard-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">High Severity</p>
              <AlertCircle className="h-4 w-4 text-warning/40" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-warning tabular-nums leading-tight">
                {actions.filter(a => a.severity === 'critical').length}
              </div>
              <p className="body-text mt-2">Immediate business risk</p>
            </div>
          </Card>

          <Card className="standard-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Target Resolution</p>
              <ClipboardList className="h-4 w-4 text-primary/40" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">48h</div>
              <p className="body-text mt-2">Target resolution window</p>
            </div>
          </Card>
        </div>

        {/* Actions Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Location</TableHead>
                <TableHead className="standard-table-head">Issue</TableHead>
                <TableHead className="standard-table-head">Severity</TableHead>
                <TableHead className="standard-table-head">Deadline</TableHead>
                <TableHead className="standard-table-head text-center">Status</TableHead>
                <TableHead className="standard-table-head text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-[120px]" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="py-4 px-4"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                    <TableCell className="py-4 px-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : actions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="standard-table-cell py-24 text-center text-muted-text bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-success/10 p-4 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-success opacity-40" />
                      </div>
                      <p className="page-heading text-lg opacity-40  tracking-tight font-medium">All systems operational. No open actions.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredActions.map((action) => (
                  <TableRow key={action.id} className="standard-table-row group">
                    <TableCell className="py-4 px-4 text-[14px] font-normal text-heading align-middle">
                      {action.locationName}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[14px] font-normal text-body leading-relaxed align-middle">
                      {action.questionText}
                    </TableCell>
                    <TableCell className="py-4 px-4 align-middle">
                      <Badge className={cn(
                        "h-6 rounded-full border-none px-2.5 text-[11px] font-normal capitalize",
                        action.severity === 'critical' ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                      )}>
                        {action.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 align-middle">
                      <div className={cn(
                        "text-[13px] font-normal tabular-nums",
                        action.deadline?.toDate() < new Date() ? "text-destructive font-medium" : "text-muted-text"
                      )}>
                        {format(action.deadline?.toDate(), 'MMM d, h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center">
                      <Badge variant="secondary" className={cn(
                        "h-6 rounded-full border-none px-2.5 text-[11px] font-normal capitalize",
                        action.status === 'in_progress' ? "bg-primary/10 text-primary" : 
                        action.status === 'completed' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      )}>
                        {action.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-medium tracking-widest" onClick={() => {
                            setEditingCA(action);
                            setSelectedManager(action.assignedManagerId || '');
                            setSelectedDate(action.deadline?.toDate() ? format(action.deadline.toDate(), 'yyyy-MM-dd') : '');
                        }}>Edit</Button>
                        {action.status === 'completed' && (
                          <Button size="sm" className="h-8 text-xs font-medium tracking-widest bg-success text-success-foreground hover:bg-success/90" onClick={() => setResolvingCA(action)}>Review</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!editingCA} onOpenChange={(open) => !open && setEditingCA(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Action</DialogTitle>
            <DialogDescription>Assign this issue to a manager and set a deadline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Assigned Manager</Label>
              <Select value={selectedManager} onValueChange={setSelectedManager}>
                <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                <SelectContent>
                  {managers.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name || m.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCA(null)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={isUpdating || !selectedManager || !selectedDate}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resolvingCA} onOpenChange={(open) => !open && setResolvingCA(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Completion</DialogTitle>
            <DialogDescription>Review the manager's justification and evidence before closing this issue.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-xs text-muted-text bg-muted/10 p-4 rounded-lg flex flex-col gap-2 border border-border/50">
              <span className="font-medium text-heading text-sm">{resolvingCA?.questionText}</span>
              <div className="flex items-center gap-1.5 opacity-80">
                <MapPin className="h-3 w-3" />
                <span>{resolvingCA?.locationName}</span>
              </div>
            </div>
            <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border/50">
              <Label className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">Manager's Note</Label>
              <p className="text-sm text-body italic mt-1">"{resolvingCA?.resolutionNote || 'No note provided.'}"</p>
            </div>
            {resolvingCA?.resolutionPhotoUrls && resolvingCA.resolutionPhotoUrls.length > 0 && (
              <div className="space-y-2 mt-2">
                 <Label className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">Evidence Photos</Label>
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                   {resolvingCA.resolutionPhotoUrls.map((url: string, i: number) => (
                     <div 
                      key={i} 
                      className="h-24 w-24 rounded-lg border border-border/50 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all active:scale-95"
                      onClick={() => setExpandedPhotoUrl(url)}
                     >
                       <img src={url} alt="Proof" className="h-full w-full object-cover" />
                     </div>
                   ))}
                 </div>
                 <p className="text-[10px] text-muted-text/60 italic mt-1">Click to expand evidence</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-row justify-between w-full items-center gap-4 sm:justify-between">
            <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleReject}>Reject</Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setResolvingCA(null)}>Cancel</Button>
              <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={handleResolve}>Approve & Resolve</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!expandedPhotoUrl} onOpenChange={(open) => !open && setExpandedPhotoUrl(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Evidence Photo Viewer</DialogTitle>
          <div className="relative group max-h-[90vh] w-full flex items-center justify-center">
            {expandedPhotoUrl && (
              <img 
                src={expandedPhotoUrl} 
                alt="Expanded Proof" 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl "
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
