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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, UserPlus, MapPin, AlertCircle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
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
      case 'published': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-tight">Awaiting Assignment</Badge>;
      case 'assigned': return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 px-2 py-0.5 text-xs font-bold uppercase tracking-tight">Assigned</Badge>;
      case 'in_progress': return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-tight">In Progress</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-2 py-0.5 text-xs font-bold uppercase tracking-tight">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="px-2 py-0.5 text-xs font-bold uppercase tracking-tight">Missed</Badge>;
      default: return <Badge variant="outline" className="px-2 py-0.5 text-xs font-bold uppercase tracking-tight">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Audit Operations</h1>
            <p className="body-text">Assign auditors to blueprints and monitor their execution.</p>
          </div>
        </div>

        <Card className="standard-card">
          <Table>
            <TableHeader >
              <TableRow >
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Audit Blueprint</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Branch Location</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Deadline</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Assigned Personnel</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-muted/10 p-4 rounded-full">
                        <Clock className="h-8 w-8 opacity-20" />
                      </div>
                      <p className="page-heading text-lg opacity-40 uppercase tracking-tight">No audits published for your locations yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                audits.map((a) => (
                  <TableRow key={a.id} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-foreground text-sm leading-none group-hover:text-primary transition-colors">{a.templateTitle}</span>
                        {a.isSurprise && (
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                            <span className="text-[9px] font-bold text-warning uppercase tracking-tight">Surprise Audit</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-3.5 w-3.5 text-primary opacity-50" />
                        <span className="text-[11px] font-bold uppercase tracking-tight text-foreground/80">{a.locationName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-[11px] font-bold text-destructive">
                      {a.deadline?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="px-4 py-3">{getStatusBadge(a.status)}</TableCell>
                    <TableCell className="px-4 py-3">
                      {a.assignedAuditorId ? (
                        <div className="flex items-center gap-2.5 bg-success/5 border border-success/10 px-3 py-1.5 rounded-lg w-fit">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          <span className="text-xs font-bold uppercase tracking-tight text-success/80">
                            {auditors.find(aud => aud.id === a.assignedAuditorId)?.name || 'Auditor Assigned'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground/30 italic">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs font-bold uppercase tracking-tight">Awaiting Assignment</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      {a.status === 'published' && (
                        <Dialog open={open && selectedAudit?.id === a.id} onOpenChange={(val) => {
                          if (!val) {
                            setOpen(false);
                            setSelectedAudit(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-9 px-4 font-bold uppercase tracking-tight text-[10px] border-primary/20 text-primary hover:bg-primary/5 shadow-sm transition-all hover:scale-105 active:scale-95" onClick={() => {
                              setSelectedAudit(a);
                              setOpen(true);
                            }}>
                              <UserPlus className="mr-2 h-4 w-4" /> Assign Personnel
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="px-6 pb-4">
                              <DialogTitle className="text-2xl font-sans flex items-center gap-3">
                                <div className="bg-primary p-2 rounded-lg">
                                  <UserPlus className="h-5 w-5 text-white" />
                                </div>
                                AUDITOR ASSIGNMENT
                              </DialogTitle>
                              <DialogDescription className="text-xs font-bold uppercase text-muted-foreground tracking-tight mt-2">
                                Assigning blueprint <strong>{a.templateTitle}</strong> to {a.locationName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-8 space-y-6">
                              <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tight">Select Qualified Auditor</Label>
                                <Select value={selectedAuditor} onValueChange={setSelectedAuditor}>
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Choose an auditor" />
                                  </SelectTrigger>
                                  <SelectContent className="">
                                    {auditors.map(aud => (
                                      <SelectItem key={aud.id} value={aud.id} className="rounded-lg h-10 font-bold text-xs cursor-pointer">{aud.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter className="px-6 py-4 border-t">
                              <Button variant="ghost" onClick={() => setOpen(false)} className="h-9 px-4 text-sm">Cancel</Button>
                              <Button
                                onClick={handleAssign}
                                disabled={loading || !selectedAuditor}
                                className="h-9 px-4 text-sm"
                              >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Assignment
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {a.status !== 'published' && a.status !== 'completed' && a.status !== 'missed' && (
                        <div className="flex items-center gap-2 justify-end text-muted-foreground/40">
                          <div className="h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-tight">Mission Ongoing...</span>
                        </div>
                      )}
                      {a.status === 'completed' && (
                        <Button size="sm" variant="ghost" className="h-9 px-4 font-bold uppercase tracking-tight text-[10px] text-success hover:bg-success/5 border border-success/10 shadow-sm transition-all hover:scale-105">View Full Report</Button>
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
