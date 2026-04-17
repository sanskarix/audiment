'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { useAuthSync } from '@/components/AuthProvider';
import posthog from 'posthog-js';
import { MobileCard, MobileCardHeader, MobileCardTitle, MobileCardDescription, MobileCardContent, MobileCardFooter } from '@/components/mobile/MobileCard';

export default function AdminCorrectiveActionsPage() {
  const { isSynced, orgId } = useAuthSync();
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [managers, setManagers] = useState<any[]>([]);
  const [editingCA, setEditingCA] = useState<any>(null);
  const [resolvingCA, setResolvingCA] = useState<any>(null);
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedPhotoUrl, setExpandedPhotoUrl] = useState<string | null>(null);


  const fetchActions = async () => {
    if (!isSynced || !orgId) return;
    
    try {
      // Fetch all open corrective actions for the organization
      const q = query(
        collection(db, 'correctiveActions'),
        where('organizationId', '==', orgId),
        where('status', 'in', ['open', 'in_progress', 'completed']),
        orderBy('deadline', 'asc')
      );

      const snap = await getDocs(q);
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const toDate = (val: any): Date => {
        if (!val) return new Date(0);
        if (typeof val.toDate === 'function') return val.toDate();
        return new Date(val);
      };

      const actionsWithExtras = await Promise.all(fetched.map(async (action: any) => {
        if (!action.assignedManagerId) return action;
        const managerSnap = await getDoc(doc(db, 'users', action.assignedManagerId));
        return {
          ...action,
          managerName: managerSnap.exists() ? managerSnap.data().name : 'Unknown Manager'
        };
      }));

      actionsWithExtras.sort((a, b) => {
        // 1. Deadline (closest first)
        const deadA = toDate(a.deadline).getTime();
        const deadB = toDate(b.deadline).getTime();
        if (deadA !== deadB) return deadA - deadB;

        // 2. Priority (Critical first)
        const prioMap: any = { critical: 0, medium: 1, low: 2 };
        const prioA = prioMap[a.severity] ?? 99;
        const prioB = prioMap[b.severity] ?? 99;
        if (prioA !== prioB) return prioA - prioB;

        // 3. Status (Open first)
        const statusMap: any = { open: 0, in_progress: 1, completed: 2, resolved: 3 };
        const statusA = statusMap[a.status] ?? 99;
        const statusB = statusMap[b.status] ?? 99;
        return statusA - statusB;
      });

      setActions(actionsWithExtras);
      setLoading(false);
    } catch (err) {
      console.error('[AdminCorrectiveActions] Fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [orgId, isSynced]);

  useEffect(() => {
    if (!isSynced || !orgId) return;
    const fetchManagers = async () => {
      const q = query(collection(db, 'users'), where('organizationId', '==', orgId), where('role', '==', 'MANAGER'));
      const snap = await getDocs(q);
      setManagers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchManagers();
  }, [orgId, isSynced]);

  const handleAssign = async () => {
    if (!editingCA || !selectedManager || !selectedDate) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'correctiveActions', editingCA.id), {
        assignedManagerId: selectedManager,
        deadline: new Date(selectedDate),
      });
      posthog.capture('corrective_action_assigned', {
        corrective_action_id: editingCA.id,
        location_name: editingCA.locationName,
        severity: editingCA.severity,
        deadline: selectedDate,
      });
      await fetchActions();
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
      posthog.capture('corrective_action_resolved', {
        corrective_action_id: resolvingCA.id,
        location_name: resolvingCA.locationName,
        severity: resolvingCA.severity,
      });
      await fetchActions();
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
      posthog.capture('corrective_action_rejected', {
        corrective_action_id: resolvingCA.id,
        location_name: resolvingCA.locationName,
        severity: resolvingCA.severity,
      });
      await fetchActions();
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
      <DashboardShell role="admin">
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
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="page-heading">Actions</h1>
              <p className="body-text text-muted-text hidden md:block">Track and resolve issues across your organization.</p>
            </div>
            <Badge variant="secondary" className="h-7 rounded-full bg-destructive/10 text-destructive border-none px-3 text-[10px] font-bold animate-pulse">
              {actions.length} PENDING
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="standard-card p-4 md:p-6 overflow-hidden relative border-l-4 border-l-destructive">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className="section-heading text-xs uppercase tracking-widest opacity-60">Overdue</p>
              <Clock className="h-4 w-4 text-destructive/40" />
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl md:text-[32px] font-bold tracking-tight text-destructive tabular-nums leading-none">
                {actions.filter(a => a.deadline?.toDate() < new Date()).length}
              </div>
              <p className="text-[10px] font-medium text-muted-text/50 pb-0.5">NON-COMPLIANT</p>
            </div>
          </Card>

          <Card className="standard-card p-4 md:p-6 overflow-hidden relative border-l-4 border-l-warning">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className="section-heading text-xs uppercase tracking-widest opacity-60">Critical</p>
              <AlertCircle className="h-4 w-4 text-warning/40" />
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl md:text-[32px] font-bold tracking-tight text-warning tabular-nums leading-none">
                {actions.filter(a => a.severity === 'critical').length}
              </div>
              <p className="text-[10px] font-medium text-muted-text/50 pb-0.5">FIX REQUIRED</p>
            </div>
          </Card>

          <Card className="standard-card p-4 md:p-6 overflow-hidden relative border-l-4 border-l-primary/40">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className="section-heading text-xs uppercase tracking-widest opacity-60">Upcoming</p>
              <ClipboardList className="h-4 w-4 text-primary/40" />
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl md:text-[32px] font-bold tracking-tight text-heading tabular-nums leading-none">48h</div>
              <p className="text-[10px] font-medium text-muted-text/50 pb-0.5">NEXT BATCH</p>
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search actions..."
              className="pl-9 h-10 md:h-11 text-xs md:text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70 focus:border-primary/50 transition-all rounded-xl md:rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10 md:h-11 w-10 md:w-auto md:px-4 flex items-center justify-center gap-2 font-medium text-xs border-border/50 text-[#6b7280] rounded-xl md:rounded-lg">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">Filters</span>
          </Button>
        </div>

        <div className="hidden md:block">
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
                ) : filteredActions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="standard-table-cell py-24 text-center text-muted-text bg-muted/5">
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-success/10 p-4 rounded-full">
                          <CheckCircle2 className="h-8 w-8 text-success opacity-40" />
                        </div>
                        <p className="page-heading text-lg opacity-40 tracking-tight font-medium">All systems operational. No open actions.</p>
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

        {/* Mobile Card View */}
        <div className="grid md:hidden grid-cols-1 gap-3">
          {filteredActions.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-muted-text bg-muted/5 rounded-2xl border border-dashed">
              <CheckCircle2 className="h-8 w-8 text-success opacity-20 mb-2" />
              <p className="text-sm font-medium">All systems operational</p>
            </div>
          ) : (
            filteredActions.map((action) => (
              <MobileCard key={action.id} className="border-l-4 border-l-primary/40">
                <MobileCardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <MobileCardTitle>{action.locationName}</MobileCardTitle>
                      <MobileCardDescription className="line-clamp-2 mt-1 italic">
                        "{action.questionText}"
                      </MobileCardDescription>
                    </div>
                    <Badge className={cn(
                      "h-5 rounded-full border-none px-2 text-[10px] uppercase font-bold",
                      action.severity === 'critical' ? "bg-destructive text-white" : "bg-warning text-warning-foreground"
                    )}>
                      {action.severity}
                    </Badge>
                  </div>
                </MobileCardHeader>
                <MobileCardContent>
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-text uppercase font-semibold">Deadline</span>
                      <span className={cn(
                        "font-bold tabular-nums",
                        action.deadline?.toDate() < new Date() ? "text-destructive" : "text-heading"
                      )}>
                        {format(action.deadline?.toDate(), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-text uppercase font-semibold">Status</span>
                      <Badge variant="secondary" className="h-5 rounded-full px-2 text-[9px] font-bold">
                        {action.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </MobileCardContent>
                <MobileCardFooter>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-4" onClick={() => {
                    setEditingCA(action);
                    setSelectedManager(action.assignedManagerId || '');
                    setSelectedDate(action.deadline?.toDate() ? format(action.deadline.toDate(), 'yyyy-MM-dd') : '');
                  }}>Manage</Button>
                  {action.status === 'completed' && (
                    <Button size="sm" className="h-8 text-[10px] font-bold px-4 bg-success" onClick={() => setResolvingCA(action)}>Resolve</Button>
                  )}
                </MobileCardFooter>
              </MobileCard>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!editingCA} onOpenChange={(open) => !open && setEditingCA(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign</DialogTitle>
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
            <DialogTitle>Review</DialogTitle>
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
              <Label className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">Note</Label>
              <p className="text-sm text-body italic mt-1">"{resolvingCA?.resolutionNote || 'No note provided.'}"</p>
            </div>
            {resolvingCA?.resolutionPhotoUrls && resolvingCA.resolutionPhotoUrls.length > 0 && (
              <div className="space-y-2 mt-2">
                <Label className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">Photos</Label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {resolvingCA.resolutionPhotoUrls.map((url: string, i: number) => (
                    <div
                      key={i}
                      className="h-24 w-24 rounded-lg border border-border/50 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all active:scale-95"
                      onClick={() => setExpandedPhotoUrl(url)}
                    >
                      <Image src={url} alt="Proof" width={96} height={96} className="h-full w-full object-cover" />
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
              <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={handleResolve}>Resolve</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!expandedPhotoUrl} onOpenChange={(open) => !open && setExpandedPhotoUrl(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Evidence Photo Viewer</DialogTitle>
          <div className="relative group max-h-[90vh] w-full flex items-center justify-center">
            {expandedPhotoUrl && (
              <Image
                src={expandedPhotoUrl}
                alt="Expanded Proof"
                width={800}
                height={600}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl "
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
