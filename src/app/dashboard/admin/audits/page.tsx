'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  getDocs,
  serverTimestamp,
  getDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, CheckSquare, Clock, AlertCircle, Search, MoreHorizontal, Pencil, Loader2, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AdminAuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [deadline, setDeadline] = useState<Date>();
  const [isSurprise, setIsSurprise] = useState(false);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [recurringDay, setRecurringDay] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [editingAuditId, setEditingAuditId] = useState<string | null>(null);

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
    if (!session?.orgId) return;

    // Fetch Audits
    const qAudits = query(collection(db, 'audits'), where('organizationId', '==', session.orgId));
    const unsubAudits = onSnapshot(qAudits, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      fetched.sort((a, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setAudits(fetched);
    });

    // Fetch Templates
    const qTemplates = query(collection(db, 'auditTemplates'), where('organizationId', '==', session.orgId), where('isActive', '==', true));
    getDocs(qTemplates).then(snap => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Locations
    const qLocations = query(collection(db, 'locations'), where('organizationId', '==', session.orgId), where('isActive', '==', true));
    getDocs(qLocations).then(snap => {
      setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Managers
    const qManagers = query(collection(db, 'users'), where('organizationId', '==', session.orgId), where('role', '==', 'MANAGER'), where('isActive', '==', true));
    getDocs(qManagers).then(snap => {
      setManagers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubAudits();
  }, [session]);

  const handlePublish = async () => {
    if (!selectedTemplate || !selectedLocation || !selectedManager || !scheduledDate || !deadline || !session) return;

    setLoading(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      const location = locations.find(l => l.id === selectedLocation);

      if (!template || !location) throw new Error('Invalid template or location');

      const auditData: any = {
        organizationId: session.orgId,
        templateId: selectedTemplate,
        templateTitle: template.title,
        locationId: selectedLocation,
        locationName: location.name,
        assignedManagerId: selectedManager,
        isSurprise,
        recurring,
        recurringDay: recurring !== 'none' ? recurringDay : null,
        scheduledDate: Timestamp.fromDate(scheduledDate),
        deadline: Timestamp.fromDate(deadline),
      };

      if (editingAuditId) {
        await updateDoc(doc(db, 'audits', editingAuditId), auditData);
      } else {
        auditData.publishedBy = session.uid;
        auditData.assignedAuditorId = '';
        auditData.status = 'published';
        auditData.createdAt = serverTimestamp();
        auditData.totalScore = 0;
        auditData.maxPossibleScore = 0;
        auditData.scorePercentage = 0;

        const occurrences = recurring === 'none' ? 1 : 5;
        let currentDate = new Date(scheduledDate);
        let currentDeadline = new Date(deadline);
        const durationMs = currentDeadline.getTime() - currentDate.getTime();

        for (let i = 0; i < occurrences; i++) {
          const instanceData = { ...auditData };
          instanceData.scheduledDate = Timestamp.fromDate(new Date(currentDate));
          instanceData.deadline = Timestamp.fromDate(new Date(currentDate.getTime() + durationMs));

          const docRef = await addDoc(collection(db, 'audits'), instanceData);

          if (i === 0) {
            // Create notification for Manager only for the first occurrence
            await addDoc(collection(db, 'notifications'), {
              organizationId: session.orgId,
              recipientId: selectedManager,
              recipientRole: 'manager',
              type: isSurprise ? 'surprise_audit' : 'audit_assigned',
              title: `New Audit Published: ${template.title}`,
              message: `A new audit has been published for ${location.name}. Please assign an auditor.`,
              relatedId: docRef.id,
              isRead: false,
              createdAt: serverTimestamp()
            });
          }

          // Advance date for next iteration
          if (recurring === 'daily') {
            currentDate.setDate(currentDate.getDate() + 1);
          } else if (recurring === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (recurring === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
        }
      }

      setOpen(false);
      // Reset form
      setEditingAuditId(null);
      setSelectedTemplate('');
      setSelectedLocation('');
      setSelectedManager('');
      setScheduledDate(undefined);
      setDeadline(undefined);
      setIsSurprise(false);
      setRecurring('none');
      setRecurringDay(1);
    } catch (e) {
      console.error(e);
      alert('Failed to save audit');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">
            Published
          </Badge>
        );
      case 'assigned':
        return (
          <Badge variant="secondary" className="h-6 rounded-full bg-warning/10 text-warning border-none px-2.5 text-[12px] font-normal">
            Assigned
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="h-6 rounded-full bg-success/10 text-success border-none px-2.5 text-[12px] font-normal">
            Completed
          </Badge>
        );
      case 'missed':
        return (
          <Badge variant="secondary" className="h-6 rounded-full bg-destructive/10 text-destructive border-none px-2.5 text-[12px] font-normal">
            Missed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="h-6 rounded-full bg-muted/20 text-muted-text border-none px-2.5 text-[12px] font-normal">
            {status}
          </Badge>
        );
    }
  };

  const filteredAudits = audits.filter((audit) =>
    audit.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.assignedManagerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audits</h1>
          </div>
          <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setEditingAuditId(null);
              setSelectedTemplate('');
              setSelectedLocation('');
              setSelectedManager('');
              setScheduledDate(undefined);
              setDeadline(undefined);
              setIsSurprise(false);
              setRecurring('none');
              setRecurringDay(1);
            }
          }}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 h-11 px-5 text-[14px] font-medium gap-2 active:scale-95 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Publish Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="font-semibold text-heading">
                  {editingAuditId ? 'Edit Audit Instance' : 'Publish New Audit'}
                </DialogTitle>
                <DialogDescription className="text-muted-text">
                  {editingAuditId ? 'Update parameters for this existing audit instance.' : 'Assign a template to a location and set the schedule.'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-8 p-8">
                {/* Primary Selectors - Stacked for clarity */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="template" className="text-body font-normal">Audit Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template" className="h-11 text-body border-border/50">
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
                    <Label htmlFor="location" className="text-body font-normal">Target Location</Label>
                    <Select value={selectedLocation} onValueChange={(val) => {
                      setSelectedLocation(val);
                      setSelectedManager('');
                    }}>
                      <SelectTrigger id="location" className="h-11 text-body border-border/50">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(l => (
                          <SelectItem key={l.id} value={l.id} className="text-body">{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="manager" className="text-body font-normal">Assigned Manager</Label>
                    <Select value={selectedManager} onValueChange={setSelectedManager} disabled={!selectedLocation}>
                      <SelectTrigger id="manager" className="h-11 text-body border-border/50">
                        <SelectValue placeholder={selectedLocation ? "Select manager for this audit" : "Select location first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedLocation && managers
                          .filter(m => {
                            const loc = locations.find(l => l.id === selectedLocation);
                            const assignedIds = loc?.assignedManagerIds || (loc?.assignedManagerId ? [loc.assignedManagerId] : []);
                            return assignedIds.includes(m.id);
                          })
                          .map(m => (
                            <SelectItem key={m.id} value={m.id} className="text-body">{m.name}</SelectItem>
                          ))
                        }
                        {selectedLocation && managers.filter(m => {
                          const loc = locations.find(l => l.id === selectedLocation);
                          const assignedIds = loc?.assignedManagerIds || (loc?.assignedManagerId ? [loc.assignedManagerId] : []);
                          return assignedIds.includes(m.id);
                        }).length === 0 && (
                            <SelectItem value="none" disabled className="text-muted-text">No managers assigned to this location</SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                    <p className="text-[12px] text-muted-text/40 font-normal mt-1 leading-relaxed">The branch manager will be responsible for assigning the final auditor.</p>
                  </div>
                </div>

                {/* Date Selection - 2 Columns */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-body font-normal">Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("h-11 w-full justify-start text-left font-normal text-body border-border/50", !scheduledDate && "text-muted-text")}>
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-40" />
                          {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl">
                        <Calendar mode="single" selected={scheduledDate} onSelect={(date: any) => {
                          setScheduledDate(date);
                          if (date && (!deadline || date > deadline)) {
                            const newDeadline = new Date(date);
                            newDeadline.setHours(23, 59, 59);
                            setDeadline(newDeadline);
                          }
                        }} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-body font-normal">Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("h-11 w-full justify-start text-left font-normal text-body border-border/50", !deadline && "text-muted-text")}>
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-40" />
                          {deadline ? format(deadline, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl">
                        <Calendar mode="single" selected={deadline} onSelect={setDeadline} disabled={(date: any) => scheduledDate ? date < scheduledDate : false} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Configuration Options */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-5 rounded-xl bg-muted/20 border border-border/40">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-body font-medium">Surprise Audit</Label>
                      <p className="text-[12px] text-muted-text/60 font-normal leading-normal">Location won't be notified until the date.</p>
                    </div>
                    <Switch checked={isSurprise} onCheckedChange={setIsSurprise} />
                  </div>

                  <div className="space-y-5 p-5 rounded-xl bg-muted/20 border border-border/40">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-body font-medium">Recurring Schedule</Label>
                      <p className="text-[12px] text-muted-text/60 font-normal leading-normal">Automatically generate the next instance.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pt-1">
                      <Select value={recurring} onValueChange={(val: any) => setRecurring(val)}>
                        <SelectTrigger className="h-11 text-body border-border/50 bg-background">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-body">Does not repeat</SelectItem>
                          <SelectItem value="daily" className="text-body">Daily</SelectItem>
                          <SelectItem value="weekly" className="text-body">Weekly</SelectItem>
                          <SelectItem value="monthly" className="text-body">Monthly</SelectItem>
                        </SelectContent>
                      </Select>

                      {recurring === 'weekly' && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-[12px] font-medium text-muted-text">Repeat on</Label>
                          <Select value={recurringDay.toString()} onValueChange={(val) => setRecurringDay(parseInt(val))}>
                            <SelectTrigger className="h-11 text-body border-border/50 bg-background">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0" className="text-body">Sunday</SelectItem>
                              <SelectItem value="1" className="text-body">Monday</SelectItem>
                              <SelectItem value="2" className="text-body">Tuesday</SelectItem>
                              <SelectItem value="3" className="text-body">Wednesday</SelectItem>
                              <SelectItem value="4" className="text-body">Thursday</SelectItem>
                              <SelectItem value="5" className="text-body">Friday</SelectItem>
                              <SelectItem value="6" className="text-body">Saturday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {recurring === 'monthly' && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-[12px] font-medium text-muted-text">Repeat on</Label>
                          <Select value={recurringDay.toString()} onValueChange={(val) => setRecurringDay(parseInt(val))}>
                            <SelectTrigger className="h-11 text-body border-border/50 bg-background">
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <SelectItem key={day} value={day.toString()} className="text-body">Day {day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)} className="font-medium h-11 px-4">Cancel</Button>
                <Button
                  onClick={handlePublish}
                  disabled={loading || !selectedTemplate || !selectedLocation || !selectedManager || !scheduledDate || !deadline}
                  className="font-medium h-11 px-5 gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingAuditId ? 'Save Changes' : 'Publish Audit'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search audits by template, location, manager or status..."
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

        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Audit Instance</TableHead>
                <TableHead className="standard-table-head">Location</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head">Schedule</TableHead>
                <TableHead className="standard-table-head">Surprise</TableHead>
                <TableHead className="standard-table-head text-right">Score</TableHead>
                <TableHead className="standard-table-head w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="standard-table-cell text-center py-24">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="bg-muted/10 p-4 rounded-full">
                        <CheckSquare className="h-8 w-8 opacity-20" />
                      </div>
                      <p className="page-heading opacity-40">No audits published yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAudits.map((a) => (
                  <TableRow key={a.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-normal text-body">{a.templateTitle}</span>
                        {a.recurring && a.recurring !== 'none' && (
                          <div className="h-5 rounded-full bg-primary/10 text-primary px-2 flex items-center gap-1.5 w-fit text-[11px] font-normal">
                            <Clock className="w-2.5 h-2.5" />
                            <span className="capitalize">{a.recurring}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell text-[14px] font-normal text-body">
                      {a.locationName}
                    </TableCell>
                    <TableCell className="standard-table-cell">{getStatusBadge(a.status)}</TableCell>
                    <TableCell className="standard-table-cell">
                      <div className="flex flex-col gap-1.5 font-normal">
                        <span className="text-[14px] font-normal text-body">{a.deadline?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      {a.isSurprise ? (
                        <Badge variant="secondary" className="h-6 rounded-full bg-warning/10 text-warning border-none px-2.5 text-[12px] font-normal">
                          Surprise
                        </Badge>
                      ) : (
                        <span className="text-[14px] font-normal text-muted-text">Routine</span>
                      )}
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
                      {a.status === 'completed' ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={cn("text-[14px] font-medium tabular-nums", a.scorePercentage < 70 ? "text-destructive" : "text-success")}>
                            {a.scorePercentage}%
                          </span>
                          <span className="text-[11px] font-normal text-muted-text/50 tabular-nums">{a.totalScore} / {a.maxPossibleScore}</span>
                        </div>
                      ) : (
                        <span className="text-[14px] font-normal text-muted-text">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {(a.status === 'published' || a.status === 'assigned') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4 opacity-50" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-muted/20 shadow-xl">
                            <DropdownMenuItem
                              className="rounded-lg h-10 font-medium cursor-pointer focus:bg-primary/5 focus:text-primary transition-all text-body"
                              onClick={() => {
                                setEditingAuditId(a.id);
                                setSelectedTemplate(a.templateId);
                                setSelectedLocation(a.locationId);
                                setSelectedManager(a.assignedManagerId || '');
                                setScheduledDate(a.scheduledDate?.toDate());
                                setDeadline(a.deadline?.toDate());
                                setIsSurprise(a.isSurprise || false);
                                setRecurring(a.recurring || 'none');
                                setRecurringDay(a.recurringDay || 1);
                                setOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit Audit Instance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
