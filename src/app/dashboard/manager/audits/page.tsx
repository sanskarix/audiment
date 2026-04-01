'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckSquare, UserPlus, MapPin, AlertCircle, Clock, CheckCircle2, Loader2, Search, Filter, X } from 'lucide-react';

export default function ManagerAuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [auditors, setAuditors] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId, uid: data.uid });
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.orgId || !session?.uid) return;

    // Fetch Audits assigned to this manager's locations
    const qAudits = query(
      collection(db, 'audits'),
      where('organizationId', '==', session.orgId),
      where('assignedManagerId', '==', session.uid)
    );

    const unsubAudits = onSnapshot(qAudits, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      fetched.sort((a, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setAudits(fetched);
    });

    // Fetch Auditors reporting to this manager
    const qAuditors = query(
      collection(db, 'users'),
      where('organizationId', '==', session.orgId),
      where('role', '==', 'AUDITOR'),
      where('managerId', '==', session.uid),
      where('isActive', '==', true)
    );

    getDocs(qAuditors).then(snap => {
      setAuditors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubAudits();
  }, [session]);

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch = 
      audit.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.status?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || 
      (assigneeFilter === 'unassigned' ? !audit.assignedAuditorId : audit.assignedAuditorId === assigneeFilter);

    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleAssign = async () => {
    if (!selectedAudit || !selectedAuditor || !session) return;

    setLoading(true);
    try {
      const auditor = auditors.find(a => a.id === selectedAuditor);
      if (!auditor) throw new Error('Auditor not found');

      const auditRef = doc(db, 'audits', selectedAudit.id);
      await updateDoc(auditRef, {
        assignedAuditorId: selectedAuditor,
        status: 'assigned'
      });

      // Create notification for Auditor
      await addDoc(collection(db, 'notifications'), {
        organizationId: session.orgId,
        recipientId: selectedAuditor,
        recipientRole: 'auditor',
        type: selectedAudit.isSurprise ? 'surprise_audit' : 'audit_assigned',
        title: `New Audit Assigned: ${selectedAudit.templateTitle}`,
        message: `You have been assigned a new audit at ${selectedAudit.locationName}. Deadline: ${selectedAudit.deadline?.toDate().toLocaleDateString()}.`,
        relatedId: selectedAudit.id,
        isRead: false,
        createdAt: serverTimestamp()
      });

      setOpen(false);
      setSelectedAudit(null);
      setSelectedAuditor('');
    } catch (e) {
      console.error(e);
      alert('Failed to assign auditor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">Published</Badge>;
      case 'assigned':
        return <Badge variant="secondary" className="h-6 rounded-full bg-warning/10 text-warning border-none px-2.5 text-[12px] font-normal">Personnel Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">In Execution</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="h-6 rounded-full bg-success/10 text-success border-none px-2.5 text-[12px] font-normal">Completed</Badge>;
      case 'missed':
        return <Badge variant="secondary" className="h-6 rounded-full bg-destructive/10 text-destructive border-none px-2.5 text-[12px] font-normal">SLA Breached</Badge>;
      default:
        return <Badge variant="secondary" className="h-6 rounded-full bg-muted/20 text-muted-text border-none px-2.5 text-[12px] font-normal">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Active Audits</h1>
            <p className="body-text">Monitor ongoing and upcoming audits across your assigned locations.</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search audits by template, location, manager or status..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/50 placeholder:text-muted-text/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {(statusFilter !== 'all' || assigneeFilter !== 'all') && (
              <Button 
                variant="ghost" 
                onClick={() => { setStatusFilter('all'); setAssigneeFilter('all'); }}
                className="h-11 px-3 text-[11px] font-medium text-muted-text hover:text-destructive transition-colors group"
              >
                <X className="h-3 w-3 mr-1.5 opacity-40 group-hover:opacity-100" />
                Clear
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn(
                  "h-11 px-4 gap-2 font-medium text-xs border-border/50",
                  (statusFilter !== 'all' || assigneeFilter !== 'all') ? "text-primary border-primary/20 bg-primary/5" : "text-muted-text"
                )}>
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">By Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All Statuses</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="published" className="text-body cursor-pointer">Published</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="assigned" className="text-body cursor-pointer">Assigned</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in_progress" className="text-body cursor-pointer">In Progress</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed" className="text-body cursor-pointer">Completed</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">By Assignee</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All Team</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="unassigned" className="text-body cursor-pointer italic text-muted-text/60">Unassigned</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  {auditors.map(aud => (
                    <DropdownMenuRadioItem key={aud.id} value={aud.id} className="text-body cursor-pointer">{aud.name}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="standard-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="standard-table-head pl-6">Blueprint</TableHead>
                  <TableHead className="standard-table-head">Location</TableHead>
                  <TableHead className="standard-table-head">Deadline</TableHead>
                  <TableHead className="standard-table-head">Status</TableHead>
                  <TableHead className="standard-table-head">Assignee</TableHead>
                  <TableHead className="standard-table-head text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="standard-table-cell h-32 text-center text-muted-text">
                      No audits found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAudits.map((a) => (
                    <TableRow key={a.id} className="standard-table-row group">
                      <TableCell className="standard-table-cell pl-6">
                        <span className="text-[14px] font-normal text-body">{a.templateTitle}</span>
                        {a.isSurprise && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-warning font-medium">
                            <span>Surprise Audit</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <span className="text-[14px] font-normal text-body">{a.locationName}</span>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <span className="text-[13px] font-normal text-muted-text">
                          {a.deadline?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </TableCell>
                      <TableCell className="standard-table-cell">{getStatusBadge(a.status)}</TableCell>
                      <TableCell className="standard-table-cell">
                        {a.assignedAuditorId ? (
                          <span className="text-[14px] font-normal text-body">
                            {auditors.find(aud => aud.id === a.assignedAuditorId)?.name || 'Assigned'}
                          </span>
                        ) : (
                          <span className="text-[13px] font-normal text-muted-text/60 italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="standard-table-cell text-right pr-6">
                        {a.status === 'published' && (
                          <Dialog open={open && selectedAudit?.id === a.id} onOpenChange={(val) => {
                            if (!val) {
                              setOpen(false);
                              setSelectedAudit(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 text-xs font-normal border-border/50 text-muted-text hover:text-primary transition-all" onClick={() => {
                                setSelectedAudit(a);
                                setOpen(true);
                              }}>
                                <UserPlus className="h-3.5 w-3.5 mr-1" /> Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                              <DialogHeader>
                                <DialogTitle className="font-semibold text-heading">Assign Auditor</DialogTitle>
                                <DialogDescription className="text-muted-text text-sm">
                                  Assigning <strong className="text-heading font-medium">{a.templateTitle}</strong> to {a.locationName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label className="text-body font-normal">Select Auditor</Label>
                                  <Select value={selectedAuditor} onValueChange={setSelectedAuditor}>
                                    <SelectTrigger className="h-10 text-body bg-background border-border/50">
                                      <SelectValue placeholder="Choose an auditor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {auditors.map(aud => (
                                        <SelectItem key={aud.id} value={aud.id}>{aud.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)} className="font-normal text-sm">Cancel</Button>
                                <Button onClick={handleAssign} disabled={loading || !selectedAuditor} className="font-normal text-sm">
                                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Confirm Assignment
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {a.status === 'completed' && (
                          <Button size="sm" variant="ghost" className="h-8 text-[11px] font-normal text-muted-text hover:text-primary">
                            Review Report
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
