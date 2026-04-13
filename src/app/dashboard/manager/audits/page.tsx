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
  orderBy,
  getDoc,
  Timestamp,
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
import { 
  CheckSquare, 
  UserPlus, 
  MapPin, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Search, 
  Filter, 
  X, 
  Plus, 
  CalendarIcon 
} from 'lucide-react';
import { useAuthSync } from '@/components/AuthProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

export default function ManagerAuditsPage() {
  const { isSynced, uid, orgId } = useAuthSync();
  const [audits, setAudits] = useState<any[]>([]);
  const [auditors, setAuditors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [selectedAuditIds, setSelectedAuditIds] = useState<string[]>([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkAuditor, setBulkAuditor] = useState('');
  
  // New Audit Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    templateId: '',
    locationId: '',
    scheduledDate: undefined as Date | undefined,
    deadline: undefined as Date | undefined,
    isSurprise: false,
    recurring: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    recurringDay: 1,
    repeatUntil: undefined as Date | undefined,
  });

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  useEffect(() => {
    if (!isSynced) return;
    if (!uid || !orgId) {
      setLoading(false);
      return;
    }
    async function subscribeToData() {
      setLoading(true);
      // 1. Fetch locations I manage
      const qLoc = query(
        collection(db, 'locations'),
        where('organizationId', '==', orgId),
        where('assignedManagerIds', 'array-contains', uid)
      );
      const locSnap = await getDocs(qLoc);
      const managedLocationIds = locSnap.docs.map(d => d.id);
      setLocations(locSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // 2. Subscribe to Audits
      let qAudits;
      if (managedLocationIds.length > 0) {
        qAudits = query(
          collection(db, 'audits'),
          where('organizationId', '==', orgId),
          where('locationId', 'in', managedLocationIds.slice(0, 30))
        );
      } else {
        qAudits = query(
          collection(db, 'audits'),
          where('organizationId', '==', orgId),
          where('assignedManagerId', '==', uid)
        );
      }

      const unsubscribeAudits = onSnapshot(qAudits, (snap) => {
        const toDate = (val: any): Date => {
          if (!val) return new Date(0);
          if (typeof val.toDate === 'function') return val.toDate();
          return new Date(val);
        };

        const fetchedAudits = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        fetchedAudits.sort((a, b: any) => {
          const deadA = toDate(a.deadline).getTime();
          const deadB = toDate(b.deadline).getTime();
          if (deadA !== deadB) return deadA - deadB;
          const statusMap: any = { missed: 0, published: 1, assigned: 1, in_progress: 2, completed: 3 };
          return (statusMap[a.status] ?? 99) - (statusMap[b.status] ?? 99);
        });
        setAudits(fetchedAudits);
        setLoading(false);
      });

      // 3. Subscribe to Auditors
      const qAuditors = query(
        collection(db, 'users'),
        where('organizationId', '==', orgId),
        where('role', '==', 'AUDITOR'),
        where('managerId', '==', uid),
        where('isActive', '==', true)
      );
      const unsubscribeAuditors = onSnapshot(qAuditors, (snap) => {
        setAuditors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      // 4. Fetch Templates
      const qTemplates = query(
        collection(db, 'auditTemplates'), 
        where('organizationId', '==', orgId), 
        where('isActive', '==', true)
      );
      getDocs(qTemplates).then(snap => {
        setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      return () => {
        unsubscribeAudits();
        unsubscribeAuditors();
      };
    }

    const unsubPromise = subscribeToData();
    return () => {
      unsubPromise.then(unsub => unsub?.());
    };
  }, [uid, orgId, isSynced]);

  const handlePublish = async () => {
    const template = templates.find(t => t.id === formData.templateId);
    const location = locations.find(l => l.id === formData.locationId);
    
    if (!template || !location || !formData.scheduledDate || !formData.deadline || !orgId || !uid) return;

    setLoading(true);
    try {
      const auditData: any = {
        organizationId: orgId,
        templateId: formData.templateId,
        templateTitle: template.title,
        locationId: formData.locationId,
        locationName: location.name,
        assignedManagerId: uid,
        isSurprise: formData.isSurprise,
        recurring: formData.recurring,
        recurringDay: formData.recurring !== 'none' ? formData.recurringDay : null,
        scheduledDate: Timestamp.fromDate(formData.scheduledDate),
        deadline: Timestamp.fromDate(formData.deadline),
        status: 'published'
      };

      let occurrences = 1;
      if (formData.recurring !== 'none' && formData.scheduledDate && formData.repeatUntil) {
        const diffTime = Math.abs(formData.repeatUntil.getTime() - formData.scheduledDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (formData.recurring === 'daily') occurrences = diffDays + 1;
        else if (formData.recurring === 'weekly') occurrences = Math.floor(diffDays / 7) + 1;
        else if (formData.recurring === 'monthly') occurrences = Math.floor(diffDays / 30) + 1;
        
        occurrences = Math.min(occurrences, 30);
      }

      let currentDate = new Date(formData.scheduledDate);
      let currentDeadline = new Date(formData.deadline);
      const durationMs = currentDeadline.getTime() - currentDate.getTime();

      for (let i = 0; i < occurrences; i++) {
        const instanceData = { ...auditData };
        instanceData.scheduledDate = Timestamp.fromDate(new Date(currentDate));
        instanceData.deadline = Timestamp.fromDate(new Date(currentDate.getTime() + durationMs));

        await addDoc(collection(db, 'audits'), instanceData);

        if (formData.recurring === 'daily') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (formData.recurring === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (formData.recurring === 'monthly') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      setIsDialogOpen(false);
      setFormData({
        templateId: '',
        locationId: '',
        scheduledDate: undefined,
        deadline: undefined,
        isSurprise: false,
        recurring: 'none',
        recurringDay: 1,
        repeatUntil: undefined,
      });
      // Trigger a refresh (simplified)
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Failed to save audit');
    } finally {
      setLoading(false);
    }
  };

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
    if (!selectedAudit || !selectedAuditor || !orgId) return;
    setLoading(true);
    try {
      const auditor = auditors.find(a => a.id === selectedAuditor);
      if (!auditor) throw new Error('Auditor not found');

      const auditRef = doc(db, 'audits', selectedAudit.id);
      await updateDoc(auditRef, {
        assignedAuditorId: selectedAuditor,
        status: 'assigned'
      });

      await addDoc(collection(db, 'notifications'), {
        organizationId: orgId,
        recipientId: selectedAuditor,
        recipientRole: 'auditor',
        type: selectedAudit.isSurprise ? 'surprise_audit' : 'audit_assigned',
        title: `New Audit Assigned: ${selectedAudit.templateTitle}`,
        message: `You have been assigned a new audit at ${selectedAudit.locationName}.`,
        relatedId: selectedAudit.id,
        isRead: false,
        createdAt: serverTimestamp()
      });

      setAudits(prev => prev.map(a => a.id === selectedAudit.id ? { ...a, assignedAuditorId: selectedAuditor, status: 'assigned' } : a));
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

  const handleBulkAssign = async () => {
    if (!bulkAuditor || selectedAuditIds.length === 0 || !orgId) return;
    setLoading(true);
    try {
      const auditor = auditors.find(a => a.id === bulkAuditor);
      if (!auditor) throw new Error('Auditor not found');

      const batch = [];
      for (const auditId of selectedAuditIds) {
        const audit = audits.find(a => a.id === auditId);
        if (!audit || (audit.status !== 'published' && audit.status !== 'assigned')) continue;

        const auditRef = doc(db, 'audits', auditId);
        batch.push(updateDoc(auditRef, {
          assignedAuditorId: bulkAuditor,
          status: 'assigned'
        }));

        batch.push(addDoc(collection(db, 'notifications'), {
          organizationId: orgId,
          recipientId: bulkAuditor,
          recipientRole: 'auditor',
          type: audit.isSurprise ? 'surprise_audit' : 'audit_assigned',
          title: `New Audit Assigned: ${audit.templateTitle}`,
          message: `You have been assigned a new audit at ${audit.locationName}.`,
          relatedId: auditId,
          isRead: false,
          createdAt: serverTimestamp()
        }));
      }

      await Promise.all(batch);
      setAudits(prev => prev.map(a => selectedAuditIds.includes(a.id) ? { ...a, assignedAuditorId: bulkAuditor, status: 'assigned' } : a));
      setBulkDialogOpen(false);
      setSelectedAuditIds([]);
      setBulkAuditor('');
    } catch (e) {
      console.error(e);
      alert('Failed to batch assign');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'published':
        return <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">Published</Badge>;
      case 'assigned':
        return <Badge variant="secondary" className="h-6 rounded-full bg-warning/10 text-warning border-none px-2.5 text-[12px] font-normal">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">In progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="h-6 rounded-full bg-success/10 text-success border-none px-2.5 text-[12px] font-normal">Completed</Badge>;
      case 'missed':
        return <Badge variant="secondary" className="h-6 rounded-full bg-destructive/10 text-destructive border-none px-2.5 text-[12px] font-normal">Missed</Badge>;
      default:
        return <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">Pending</Badge>;
    }
  };

  return (
    <DashboardShell role="manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audits</h1>
            <p className="body-text">Manage ongoing and upcoming audits for your locations.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 h-11 px-5 text-[14px] font-medium gap-2 active:scale-95 transition-all">
                <Plus className="mr-2 h-4 w-4" /> New audit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-heading">New audit</DialogTitle>
                <DialogDescription className="text-sm text-muted-text">Schedule a new audit for your branches.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="template" className="text-xs text-muted-foreground">Template</Label>
                    <Select value={formData.templateId} onValueChange={(val) => updateFormField('templateId', val)}>
                      <SelectTrigger id="template" className="h-10 text-body bg-muted/5 border-border/50">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id} className="text-body">{t.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location" className="text-xs text-muted-foreground">Location</Label>
                    <Select value={formData.locationId} onValueChange={(val) => updateFormField('locationId', val)}>
                      <SelectTrigger id="location" className="h-10 text-body bg-muted/5 border-border/50">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(l => (
                          <SelectItem key={l.id} value={l.id} className="text-body">{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">Scheduled date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("h-10 w-full justify-start text-left font-normal text-body border-border/50 bg-muted/5", !formData.scheduledDate && "text-muted-text")}>
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-40" />
                          {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="start">
                        <Calendar mode="single" selected={formData.scheduledDate} onSelect={(date: any) => {
                          updateFormField('scheduledDate', date);
                          if (date && (!formData.deadline || date > formData.deadline)) {
                            const newDeadline = new Date(date);
                            newDeadline.setHours(23, 59, 59);
                            updateFormField('deadline', newDeadline);
                          }
                        }} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("h-10 w-full justify-start text-left font-normal text-body border-border/50 bg-muted/5", !formData.deadline && "text-muted-text")}>
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-40" />
                          {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="end">
                        <Calendar mode="single" selected={formData.deadline} onSelect={(date) => updateFormField('deadline', date)} disabled={(date: any) => formData.scheduledDate ? date < formData.scheduledDate : false} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="recurring" className="text-xs text-muted-foreground">Frequency</Label>
                  <Select value={formData.recurring} onValueChange={(val: any) => updateFormField('recurring', val)}>
                    <SelectTrigger id="recurring" className="h-10 text-body bg-muted/5 border-border/50">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">One-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.recurring !== 'none' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs text-muted-foreground">Repeat until</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("h-10 w-full justify-start text-left font-normal text-body border-border/50 bg-background", !formData.repeatUntil && "text-muted-text")}>
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-40" />
                            {formData.repeatUntil ? format(formData.repeatUntil, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="start">
                          <Calendar mode="single" selected={formData.repeatUntil} onSelect={(date) => updateFormField('repeatUntil', date)} disabled={(date: any) => formData.scheduledDate ? date < formData.scheduledDate : false} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-t border-border/50">
                  <Label htmlFor="isSurprise" className="text-sm font-medium">Surprise audit</Label>
                  <Switch id="isSurprise" checked={formData.isSurprise} onCheckedChange={(val) => updateFormField('isSurprise', val)} />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handlePublish}
                  disabled={loading || !formData.templateId || !formData.locationId || !formData.scheduledDate || !formData.deadline}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Publish audit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            {selectedAuditIds.length > 0 && (
              <Button 
                variant="default" 
                size="sm"
                className="h-11 px-4 gap-2 font-medium text-xs bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                onClick={() => setBulkDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4" /> Bulk assign ({selectedAuditIds.length})
              </Button>
            )}
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
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">By status</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="published" className="text-body cursor-pointer">Published</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="assigned" className="text-body cursor-pointer">Assigned</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in_progress" className="text-body cursor-pointer">In progress</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed" className="text-body cursor-pointer">Completed</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">By assignee</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All</DropdownMenuRadioItem>
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
                  <TableHead className="w-[50px] pl-6">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-border"
                      checked={selectedAuditIds.length === filteredAudits.filter(a => !a.status || a.status === 'published' || a.status === 'assigned').length && filteredAudits.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAuditIds(filteredAudits.filter(a => !a.status || a.status === 'published' || a.status === 'assigned').map(a => a.id));
                        } else {
                          setSelectedAuditIds([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="standard-table-head">Template</TableHead>
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
                    <TableRow key={a.id} className={cn("standard-table-row group", selectedAuditIds.includes(a.id) && "bg-primary/5")}>
                      <TableCell className="pl-6">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-border"
                          checked={selectedAuditIds.includes(a.id)}
                          disabled={a.status && a.status !== 'published' && a.status !== 'assigned'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAuditIds(prev => [...prev, a.id]);
                            } else {
                              setSelectedAuditIds(prev => prev.filter(id => id !== a.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-normal text-body">{a.templateTitle}</span>
                          {a.recurring && a.recurring !== 'none' && (
                            <div className="h-5 rounded-full bg-primary/10 text-primary px-2 flex items-center gap-1 w-fit text-[11px] font-normal capitalize shrink-0">
                              <span>{a.recurring}</span>
                            </div>
                          )}
                        </div>
                        {a.isSurprise && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-warning font-medium">
                            <span>Surprise</span>
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
                        {(!a.status || a.status.toLowerCase() !== 'completed') && (
                          <Dialog open={open && selectedAudit?.id === a.id} onOpenChange={(val) => {
                            if (!val) {
                              setOpen(false);
                              setSelectedAudit(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="default" size="sm" className={cn(
                                "h-8 text-xs font-medium shadow-sm transition-all",
                                a.assignedAuditorId ? "bg-muted hover:bg-muted/80 text-muted-foreground shadow-none" : ""
                              )} onClick={() => {
                                setSelectedAudit(a);
                                setOpen(true);
                              }}>
                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                {a.assignedAuditorId ? 'Reassign' : 'Assign auditor'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                              <DialogHeader>
                                <DialogTitle className="font-semibold text-heading">
                                  {a.assignedAuditorId ? 'Reassign auditor' : 'Assign auditor'}
                                </DialogTitle>
                                <DialogDescription className="text-muted-text text-sm">
                                  Assigning <strong className="text-heading font-medium">{a.templateTitle}</strong> to {a.locationName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label className="text-body font-normal">Select auditor</Label>
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
                                  Assign
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {a.status === 'completed' && (
                          <Button size="sm" variant="ghost" className="h-8 text-[11px] font-normal text-muted-text hover:text-primary">
                            Review report
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
        {/* Bulk Assign Dialog */}
        <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="font-semibold text-heading">Bulk assign audits</DialogTitle>
              <DialogDescription className="text-muted-text text-sm">
                Assign <strong className="text-heading font-medium">{selectedAuditIds.length}</strong> audits to a single auditor.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-body font-normal">Select auditor</Label>
                <Select value={bulkAuditor} onValueChange={setBulkAuditor}>
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
              <Button variant="outline" onClick={() => setBulkDialogOpen(false)} className="font-normal text-sm">Cancel</Button>
              <Button onClick={handleBulkAssign} disabled={loading || !bulkAuditor} className="font-normal text-sm">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Bulk assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
