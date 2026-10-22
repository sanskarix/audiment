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
} from '@/components/app-ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/app-ui/dialog";
import { Label } from "@/components/app-ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/app-ui/table';
import { Input } from '@/components/app-ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/app-ui/card';
import { Badge } from '@/components/app-ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/app-ui/popover";
import { Calendar } from "@/components/app-ui/calendar";
import {
  Calendar as CalendarIcon,
  AlertCircle,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  ClipboardList,
  Filter,
  ArrowUpRight,
  Search,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/app-ui/skeleton";
import { Button } from '@/components/app-ui/button';
import { useAuthSync } from '@/components/AuthProvider';

export default function AdminCorrectiveActionsPage() {
  const { isSynced, orgId } = useAuthSync();
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [managers, setManagers] = useState<any[]>([]);
  const [editingCA, setEditingCA] = useState<any>(null);
  const [resolvingCA, setResolvingCA] = useState<any>(null);
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedPhotoUrl, setExpandedPhotoUrl] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');


  const fetchActions = async () => {
    if (!isSynced || !orgId) return;
    
    try {
      // Fetch all open corrective actions for the organization
      let queryConstraints: any[] = [
        where('organizationId', '==', orgId)
      ];

      if (statusFilter !== 'all') {
        queryConstraints.push(where('status', '==', statusFilter));
      }

      const q = query(
        collection(db, 'correctiveActions'),
        ...queryConstraints,
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
  }, [orgId, isSynced, statusFilter]);

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
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Actions</h1>
            <p className="body-text text-muted-text">Track and resolve issues.</p>
          </div>
          <Badge variant="secondary" className="h-7 rounded-full bg-destructive/10 text-destructive border-none px-4 text-[12px] font-medium animate-pulse">
            {actions.length} PENDING
          </Badge>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <Card className="standard-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Overdue</p>
              <Clock className="h-4 w-4 text-destructive/40" />
            </div>
            <div>
              <div className="stat-number text-destructive">
                {actions.filter(a => a.deadline?.toDate ? a.deadline.toDate() < new Date() : new Date(a.deadline) < new Date()).length}
              </div>
              <p className="stat-sub">Overdue</p>
            </div>
          </Card>

          <Card className="standard-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Critical</p>
              <AlertCircle className="h-4 w-4 text-warning/40" />
            </div>
            <div>
              <div className="stat-number text-warning">
                {actions.filter(a => a.severity === 'critical').length}
              </div>
              <p className="stat-sub">Critical</p>
            </div>
          </Card>

          <Card className="standard-card p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <p className="stat-label">Upcoming</p>
              <ClipboardList className="h-4 w-4 text-primary/40" />
            </div>
            <div>
              <div className="stat-number text-heading">48h</div>
              <p className="stat-sub">Upcoming window</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="search-wrapper max-w-md">
            <Search className="search-icon" />
            <Input
              placeholder="Search corrective actions..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-11 bg-background text-body border-border/50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableCell colSpan={6} className="standard-table-cell py-24 text-center text-muted-foreground bg-muted/5 font-normal">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-success/10 p-4 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-success opacity-40" />
                      </div>
                      <p className="font-semibold text-heading text-base opacity-60">All systems operational. No open actions.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredActions.map((action) => {
                  const deadlineDate = action.deadline?.toDate ? action.deadline.toDate() : new Date(action.deadline);
                  return (
                    <TableRow key={action.id} className="standard-table-row group">
                      <TableCell className="py-4 px-4 text-[13px] font-normal text-heading align-middle">
                        {action.locationName}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-[13px] font-normal text-body leading-relaxed align-middle">
                        {action.questionText}
                      </TableCell>
                      <TableCell className="py-4 px-4 align-middle">
                        <Badge className={cn(
                          "status-badge-xs capitalize",
                          action.severity === 'critical' ? "badge-danger" : "badge-warning"
                        )}>
                          {action.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4 align-middle">
                        <div className={cn(
                          "text-[13px] font-normal tabular-nums",
                          deadlineDate < new Date() ? "text-destructive font-medium" : "text-muted-foreground"
                        )}>
                          {format(deadlineDate, 'MMM d, h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center text-[11px]">
                        <Badge variant="secondary" className={cn(
                          "status-badge-sm capitalize",
                          action.status === 'in_progress' ? "badge-primary" :
                            action.status === 'completed' || action.status === 'resolved' ? "badge-success" : "badge-warning"
                        )}>
                          {action.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-7 px-3 text-[11px] font-medium border-border/50 text-muted-foreground" onClick={() => {
                            setEditingCA(action);
                            setSelectedManager(action.assignedManagerId || '');
                            setSelectedDate(action.deadline?.toDate ? action.deadline.toDate() : (action.deadline ? new Date(action.deadline) : undefined));
                          }}>Edit</Button>
                          {action.status === 'completed' && (
                            <Button size="sm" className="h-7 px-3 text-[11px] font-medium bg-success/10 text-success hover:bg-success/20 border-none" onClick={() => setResolvingCA(action)}>Review</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!editingCA} onOpenChange={(open) => !open && setEditingCA(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-heading">Update Assignment</DialogTitle>
            <DialogDescription className="body-text text-muted-text">Assign a manager and set a new resolution deadline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-body font-normal">Assigned Manager</Label>
              <Select value={selectedManager} onValueChange={setSelectedManager}>
                <SelectTrigger className="h-10 border-border/50 bg-background text-body">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-body">{m.name || m.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-body font-normal">Resolution Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 text-[13px] w-full justify-start text-left font-normal border-border/50 bg-background text-body",
                      !selectedDate && "text-muted-text"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" className="h-10 px-5 border-border/50 text-[13px] text-body active:scale-95 transition-all" onClick={() => setEditingCA(null)}>Cancel</Button>
            <Button className="h-10 px-6 bg-primary shadow-lg shadow-primary/20 text-[13px] font-medium active:scale-95 transition-all" onClick={handleAssign} disabled={isUpdating || !selectedManager || !selectedDate}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resolvingCA} onOpenChange={(open) => !open && setResolvingCA(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-heading">Verification Review</DialogTitle>
            <DialogDescription className="body-text text-muted-text">Review the resolution proof submitted by the manager.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-xs text-muted-text bg-muted/10 p-4 rounded-lg flex flex-col gap-2 border border-border/50">
              <span className="font-medium text-heading text-[13px]">{resolvingCA?.questionText}</span>
              <div className="flex items-center gap-1.5 opacity-80">
                <MapPin className="h-3 w-3" />
                <span className="text-[11px]">{resolvingCA?.locationName}</span>
              </div>
            </div>
            <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border/50">
              <Label className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">Manager Note</Label>
              <p className="text-[13px] text-body italic mt-1 leading-relaxed">"{resolvingCA?.resolutionNote || 'No note provided.'}"</p>
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
                      <Image src={url} alt="Proof" width={96} height={96} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-text/60 italic mt-1">Click to expand verification proof</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-row justify-between w-full items-center gap-4 sm:justify-between pt-4 border-t border-border/40">
            <Button variant="outline" size="sm" className="h-9 px-4 border-destructive/30 text-destructive hover:bg-destructive/10 text-[13px] font-medium active:scale-95 transition-all" onClick={handleReject}>Reject Proof</Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 px-4 border-border/50 text-[13px] font-medium active:scale-95 transition-all" onClick={() => setResolvingCA(null)}>Cancel</Button>
              <Button size="sm" className="h-9 px-4 bg-success text-success-foreground hover:bg-success/90 text-[13px] font-medium shadow-lg shadow-success/20 active:scale-95 transition-all" onClick={handleResolve}>Resolve Task</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!expandedPhotoUrl} onOpenChange={(open) => !open && setExpandedPhotoUrl(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Evidence Photo Viewer</DialogTitle>
          <DialogDescription className="sr-only">Detailed view of the uploaded evidence photo.</DialogDescription>
          <div className="relative group max-h-[90vh] w-full flex items-center justify-center">
            {expandedPhotoUrl && (
              <Image
                src={expandedPhotoUrl}
                alt="Expanded Proof"
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
