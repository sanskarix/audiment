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
import { CheckSquare, UserPlus, MapPin, AlertCircle, Clock, CheckCircle2, Loader2, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ManagerAuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [auditors, setAuditors] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredAudits = audits.filter((audit) => 
    audit.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    audit.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case 'published': return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs font-medium uppercase tracking-tight">Awaiting Assignment</Badge>;
      case 'assigned': return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 px-2 py-0.5 text-xs font-medium uppercase tracking-tight">Assigned</Badge>;
      case 'in_progress': return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs font-medium uppercase tracking-tight">In Progress</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-2 py-0.5 text-xs font-medium uppercase tracking-tight">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="px-2 py-0.5 text-xs font-medium uppercase tracking-tight">Missed</Badge>;
      default: return <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium uppercase tracking-tight">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audit Operations</h1>
            <p className="body-text">Assign auditors to blueprints and monitor their execution.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search audits by template, location, or status..." 
              className="pl-9 h-11 bg-background text-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs uppercase tracking-widest border-border/40 text-muted-text">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Audit Blueprint</TableHead>
                <TableHead className="standard-table-head">Branch Location</TableHead>
                <TableHead className="standard-table-head">Deadline</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head">Assigned Personnel</TableHead>
                <TableHead className="standard-table-head text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="standard-table-cell h-32 text-center text-muted-text">
                    No audits found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAudits.map((a) => (
                  <TableRow key={a.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="font-normal text-sm text-heading">{a.templateTitle}</span>
                        {a.isSurprise && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                            <span className="text-[10px] font-normal text-warning uppercase tracking-widest">Surprise Audit</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <div className="flex items-center gap-2 font-normal text-body">
                        <MapPin className="h-4 w-4 text-primary opacity-60" />
                        <span className="text-sm">{a.locationName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <span className="text-sm font-normal text-destructive">
                        {a.deadline?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </TableCell>
                    <TableCell className="standard-table-cell">{getStatusBadge(a.status)}</TableCell>
                    <TableCell className="standard-table-cell">
                      {a.assignedAuditorId ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-sm font-normal text-success">
                            {auditors.find(aud => aud.id === a.assignedAuditorId)?.name || 'Auditor Assigned'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-text/60 italic font-normal">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Awaiting Assignment</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
                      {a.status === 'published' && (
                        <Dialog open={open && selectedAudit?.id === a.id} onOpenChange={(val) => {
                          if (!val) {
                            setOpen(false);
                            setSelectedAudit(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 gap-2 text-xs font-medium uppercase tracking-widest text-primary hover:bg-primary/5 transition-all active:scale-95" onClick={() => {
                              setSelectedAudit(a);
                              setOpen(true);
                            }}>
                              <UserPlus className="h-4 w-4" /> Assign Personnel
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[450px]">
                            <DialogHeader className="p-xl border-b border-border/50">
                              <DialogTitle className="text-lg font-semibold flex items-center gap-3 text-heading">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                  <UserPlus className="h-5 w-5 text-primary" />
                                </div>
                                AUDITOR ASSIGNMENT
                              </DialogTitle>
                              <DialogDescription className="body-text text-xs mt-2">
                                Assigning blueprint <strong className="text-heading">{a.templateTitle}</strong> to {a.locationName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-lg p-xl">
                              <div className="space-y-xs">
                                <Label className="text-xs font-normal uppercase tracking-widest text-muted-text">Select Qualified Auditor</Label>
                                <Select value={selectedAuditor} onValueChange={setSelectedAuditor}>
                                  <SelectTrigger className="h-10 bg-background border-input text-body">
                                    <SelectValue placeholder="Choose an auditor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {auditors.map(aud => (
                                      <SelectItem key={aud.id} value={aud.id} className="font-normal text-sm cursor-pointer">{aud.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter className="p-xl border-t border-border/50 bg-muted/10 gap-sm">
                              <Button variant="outline" onClick={() => setOpen(false)} className="font-medium text-xs uppercase tracking-widest shadow-sm text-body">Cancel</Button>
                              <Button
                                onClick={handleAssign}
                                disabled={loading || !selectedAuditor}
                                className="font-medium text-xs uppercase tracking-widest shadow-md"
                              >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                Confirm Assignment
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {a.status !== 'published' && a.status !== 'completed' && a.status !== 'missed' && (
                        <div className="flex items-center gap-2 justify-end text-muted-text/60">
                          <div className="h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
                          <span className="text-xs font-normal uppercase tracking-widest">Ongoing</span>
                        </div>
                      )}
                      {a.status === 'completed' && (
                        <Button size="sm" variant="ghost" className="h-8 gap-2 text-xs font-medium uppercase tracking-widest text-success hover:bg-success/5 border border-success/10 transition-all">
                          View Report
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardShell>
  );
}
