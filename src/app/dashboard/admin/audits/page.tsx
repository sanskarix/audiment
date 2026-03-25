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
import { CalendarIcon, Plus, CheckSquare, Clock, MapPin, AlertCircle, Search, MoreHorizontal, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
      } catch (e) {}
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
      case 'published': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Published</Badge>;
      case 'assigned': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Assigned</Badge>;
      case 'in_progress': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">In Progress</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Completed</Badge>;
      case 'missed': return <Badge variant="destructive" className="border-none">Missed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAudits = audits.filter(a => 
    a.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
            <p className="text-muted-foreground text-sm">Monitor and publish audit instances for your locations.</p>
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
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Publish Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingAuditId ? 'Edit Published Audit' : 'Publish New Audit'}</DialogTitle>
                <DialogDescription>
                  {editingAuditId ? 'Update parameters for this audit instance.' : 'Assign a template to a location and set the schedule.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={selectedLocation} onValueChange={(val) => {
                      setSelectedLocation(val);
                      setSelectedManager(''); // Reset manager when location changes
                    }}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Assigned Manager</Label>
                  <Select value={selectedManager} onValueChange={setSelectedManager} disabled={!selectedLocation}>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder={selectedLocation ? "Select manager for this audit" : "Select location first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedLocation && managers
                        .filter(m => {
                          const loc = locations.find(l => l.id === selectedLocation);
                          // Support both array and legacy string
                          const assignedIds = loc?.assignedManagerIds || (loc?.assignedManagerId ? [loc.assignedManagerId] : []);
                          return assignedIds.includes(m.id);
                        })
                        .map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))
                      }
                      {selectedLocation && managers.filter(m => {
                        const loc = locations.find(l => l.id === selectedLocation);
                        const assignedIds = loc?.assignedManagerIds || (loc?.assignedManagerId ? [loc.assignedManagerId] : []);
                        return assignedIds.includes(m.id);
                      }).length === 0 && (
                        <SelectItem value="none" disabled>No managers assigned to this location</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">Select which branch manager will assign an auditor for this task.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deadline ? format(deadline, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={deadline} onSelect={setDeadline} disabled={(date: any) => scheduledDate ? date < scheduledDate : false} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Surprise Audit</Label>
                    <p className="text-[11px] text-muted-foreground">Location won't be notified until the scheduled date.</p>
                  </div>
                  <Switch checked={isSurprise} onCheckedChange={setIsSurprise} />
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-muted/40 border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Recurring Schedule</Label>
                    <p className="text-[11px] text-muted-foreground">Automatically generate the next audit instance.</p>
                  </div>
                  <Select value={recurring} onValueChange={(val: any) => setRecurring(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Does not repeat</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>

                  {recurring === 'weekly' && (
                    <div className="space-y-2">
                      <Label className="text-xs">Repeat on Day of Week</Label>
                      <Select value={recurringDay.toString()} onValueChange={(val) => setRecurringDay(parseInt(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sunday</SelectItem>
                          <SelectItem value="1">Monday</SelectItem>
                          <SelectItem value="2">Tuesday</SelectItem>
                          <SelectItem value="3">Wednesday</SelectItem>
                          <SelectItem value="4">Thursday</SelectItem>
                          <SelectItem value="5">Friday</SelectItem>
                          <SelectItem value="6">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {recurring === 'monthly' && (
                    <div className="space-y-2">
                      <Label className="text-xs">Repeat on Date of Month</Label>
                      <Select value={recurringDay.toString()} onValueChange={(val) => setRecurringDay(parseInt(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <SelectItem key={day} value={day.toString()}>Day {day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handlePublish} disabled={loading || !selectedTemplate || !selectedLocation || !selectedManager || !scheduledDate || !deadline}>
                  {loading && <Clock className="mr-2 h-4 w-4 animate-spin" />}
                  {editingAuditId ? 'Save Changes' : 'Publish Instance'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by template or location..." 
            className="pl-10 max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Audit Instance</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Schedule</TableHead>
                <TableHead className="font-semibold">Surprise</TableHead>
                <TableHead className="font-semibold text-right">Score</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <CheckSquare className="h-8 w-8 opacity-20" />
                      <p>No audits published yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAudits.map((a) => (
                  <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{a.templateTitle}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tabular-nums">{a.id.slice(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{a.locationName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(a.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-muted-foreground">Due: {a.deadline?.toDate().toLocaleDateString()}</span>
                        <span className="font-medium">Scheduled: {a.scheduledDate?.toDate().toLocaleDateString()}</span>
                        {a.recurring && a.recurring !== 'none' && (
                          <span className="text-blue-600 font-semibold mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {a.recurring.charAt(0).toUpperCase() + a.recurring.slice(1)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {a.isSurprise ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">YES</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === 'completed' ? (
                        <div className="flex flex-col items-end">
                          <span className={cn("font-bold text-lg", a.scorePercentage < 70 ? "text-destructive" : "text-emerald-600")}>
                            {a.scorePercentage}%
                          </span>
                          <span className="text-[10px] text-muted-foreground">{a.totalScore}/{a.maxPossibleScore}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(a.status === 'published' || a.status === 'assigned') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
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
                            }}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit Audit
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
        </div>
      </div>
    </DashboardShell>
  );
}
