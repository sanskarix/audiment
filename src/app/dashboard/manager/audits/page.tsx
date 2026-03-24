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
import { CheckSquare, UserPlus, MapPin, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
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
      } catch (e) {}
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
      case 'published': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none">Awaiting Assignment</Badge>;
      case 'assigned': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none">Assigned</Badge>;
      case 'in_progress': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-none">In Progress</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="border-none">Missed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="Manager">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Operations</h1>
          <p className="text-muted-foreground text-sm">Assign auditors to blueprints and monitor their execution.</p>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Audit</TableHead>
                <TableHead className="font-semibold">Branch</TableHead>
                <TableHead className="font-semibold">Deadline</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Clock className="h-8 w-8 opacity-20" />
                      <p>No audits published for your locations yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                audits.map((a) => (
                  <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{a.templateTitle}</span>
                        {a.isSurprise && (
                          <Badge variant="secondary" className="w-fit text-[10px] bg-amber-50 text-amber-700 border-none py-0 px-1 mt-0.5">
                            Surprise Audit
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{a.locationName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {a.deadline?.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(a.status)}</TableCell>
                    <TableCell>
                      {a.assignedAuditorId ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span className="text-xs font-medium">
                            {auditors.find(aud => aud.id === a.assignedAuditorId)?.name || 'Auditor Assigned'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Not Assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === 'published' && (
                        <Dialog open={open && selectedAudit?.id === a.id} onOpenChange={(val) => {
                          if (!val) setOpen(false);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="shadow-sm" onClick={() => {
                              setSelectedAudit(a);
                              setOpen(true);
                            }}>
                              <UserPlus className="mr-2 h-4 w-4" /> Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Auditor</DialogTitle>
                              <DialogDescription>
                                Assign an auditor to perform <strong>{a.templateTitle}</strong> at <strong>{a.locationName}</strong>.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <div className="space-y-2">
                                <Label>Select Auditor</Label>
                                <Select value={selectedAuditor} onValueChange={setSelectedAuditor}>
                                  <SelectTrigger>
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
                              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                              <Button onClick={handleAssign} disabled={loading || !selectedAuditor}>
                                {loading && <Clock className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Assignment
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {a.status !== 'published' && a.status !== 'completed' && a.status !== 'missed' && (
                        <Button size="sm" variant="ghost" disabled>Monitoring...</Button>
                      )}
                      {a.status === 'completed' && (
                        <Button size="sm" variant="ghost" className="text-emerald-600">View Report</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  );
}
