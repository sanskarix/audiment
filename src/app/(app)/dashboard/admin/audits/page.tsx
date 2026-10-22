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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/app-ui/table';
import { Button } from '@/components/app-ui/button';
import { useAuthSync } from '@/components/AuthProvider';
import { Badge } from '@/components/app-ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/app-ui/dialog';
import { Input } from '@/components/app-ui/input';
import { Label } from '@/components/app-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/app-ui/select';
import { Switch } from '@/components/app-ui/switch';
import { Calendar } from '@/components/app-ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/app-ui/popover';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/app-ui/dropdown-menu';
import { Card } from '@/components/app-ui/card';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, CheckSquare, Clock, AlertCircle, Search, MoreHorizontal, Pencil, Loader2, Filter, X } from 'lucide-react';

export default function AdminAuditsPage() {
  const { isSynced, uid, orgId } = useAuthSync();
  const [audits, setAudits] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');
  const [orgSettings, setOrgSettings] = useState({ defaultStartTime: '10:00', defaultEndTime: '22:00' });

  // Form state
  const [formData, setFormData] = useState({
    templateId: '',
    locationId: '',
    managerId: '',
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

  const getDefaultTimes = (locId?: string) => {
    let st = orgSettings.defaultStartTime || '10:00';
    let et = orgSettings.defaultEndTime || '22:00';
    if (locId) {
      const loc = locations.find(l => l.id === locId);
      if (loc) {
        if (loc.defaultStartTime) st = loc.defaultStartTime;
        if (loc.defaultEndTime) et = loc.defaultEndTime;
      }
    }
    return { start: st, end: et };
  };

  const [open, setOpen] = useState(false);
  const [editingAuditId, setEditingAuditId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isSynced || !orgId) return;
    
    try {
      // Fetch Org Settings
      const orgRef = doc(db, 'organizations', orgId);
      const orgSnap = await getDoc(orgRef);
      if (orgSnap.exists()) {
        const orgData = orgSnap.data();
        setOrgSettings({
          defaultStartTime: orgData.defaultStartTime || '10:00',
          defaultEndTime: orgData.defaultEndTime || '22:00'
        });
      }

      // Fetch Audits
      const qAudits = query(collection(db, 'audits'), where('organizationId', '==', orgId));
      const auditSnap = await getDocs(qAudits);
      const fetched = auditSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      
      const toDate = (val: any): Date => {
        if (!val) return new Date(0);
        if (typeof val.toDate === 'function') return val.toDate();
        return new Date(val);
      };

      const incomplete = fetched.filter(a => a.status !== 'completed');
      const complete = fetched.filter(a => a.status === 'completed');

      incomplete.sort((a, b) => {
        const dateA = toDate(a.scheduledDate).getTime();
        const dateB = toDate(b.scheduledDate).getTime();
        return dateA - dateB;
      });

      complete.sort((a, b) => {
        const dateA = toDate(a.completedAt).getTime();
        const dateB = toDate(b.completedAt).getTime();
        return dateB - dateA;
      });

      setAudits([...incomplete, ...complete]);

      // Fetch Templates
      const qTemplates = query(collection(db, 'auditTemplates'), where('organizationId', '==', orgId), where('isActive', '==', true));
      const templateSnap = await getDocs(qTemplates);
      setTemplates(templateSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => (a.title || '').localeCompare(b.title || '')));

      // Fetch Locations
      const qLocations = query(collection(db, 'locations'), where('organizationId', '==', orgId), where('isActive', '==', true));
      const locationSnap = await getDocs(qLocations);
      setLocations(locationSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => (a.name || '').localeCompare(b.name || '')));

      // Fetch Managers
      const qManagers = query(collection(db, 'users'), where('organizationId', '==', orgId), where('role', '==', 'MANAGER'), where('isActive', '==', true));
      const managerSnap = await getDocs(qManagers);
      setManagers(managerSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => (a.name || '').localeCompare(b.name || '')));

    } catch (err) {
      console.error('[AdminAudits] Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId, isSynced]);

  const handlePublish = async () => {
    const template = templates.find(t => t.id === formData.templateId);
    const location = locations.find(l => l.id === formData.locationId);
    
    if (!template || !location || !formData.scheduledDate || !formData.deadline) return;

    setLoading(true);
    try {
      const auditData: any = {
        organizationId: orgId,
        templateId: formData.templateId,
        templateTitle: template.title,
        locationId: formData.locationId,
        locationName: location.name,
        assignedManagerId: formData.managerId,
        isSurprise: formData.isSurprise,
        recurring: formData.recurring,
        recurringDay: formData.recurring !== 'none' ? formData.recurringDay : null,
        scheduledDate: Timestamp.fromDate(formData.scheduledDate),
        deadline: Timestamp.fromDate(formData.deadline),
        status: 'published',
        createdAt: serverTimestamp(),
      };

      if (editingAuditId) {
        // When editing, we remove the status field so we don't accidentally reset an 'assigned' or 'in_progress' audit.
        const { status, ...updateData } = auditData;
        await updateDoc(doc(db, 'audits', editingAuditId), updateData);
      } else {
        let occurrences = 1;
        if (formData.recurring !== 'none' && formData.scheduledDate && formData.repeatUntil) {
          const diffTime = Math.abs(formData.repeatUntil.getTime() - formData.scheduledDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (formData.recurring === 'daily') occurrences = diffDays + 1;
          else if (formData.recurring === 'weekly') occurrences = Math.floor(diffDays / 7) + 1;
          else if (formData.recurring === 'monthly') occurrences = Math.floor(diffDays / 30) + 1;
          
          // Safety cap
          occurrences = Math.min(occurrences, 30);
        }

        let currentDate = new Date(formData.scheduledDate);
        let currentDeadline = new Date(formData.deadline);
        const durationMs = currentDeadline.getTime() - currentDate.getTime();

        for (let i = 0; i < occurrences; i++) {
          const instanceData = { ...auditData };
          instanceData.scheduledDate = Timestamp.fromDate(new Date(currentDate));
          instanceData.deadline = Timestamp.fromDate(new Date(currentDate.getTime() + durationMs));

          const docRef = await addDoc(collection(db, 'audits'), instanceData);

          if (i === 0) {
            // Create notification for Manager only for the first occurrence
            await addDoc(collection(db, 'notifications'), {
              organizationId: orgId,
              recipientId: formData.managerId,
              recipientRole: 'manager',
              type: formData.isSurprise ? 'surprise_audit' : 'audit_assigned',
              title: `New audit published: ${template.title}`,
              message: `A new audit has been published for ${location.name}. Please assign an auditor.`,
              relatedId: docRef.id,
              isRead: false,
              createdAt: serverTimestamp()
            });
          }

          // Advance date for next iteration
          if (formData.recurring === 'daily') {
            currentDate.setDate(currentDate.getDate() + 1);
          } else if (formData.recurring === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
          } else if (formData.recurring === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
        }
      }

      await fetchData();
      setOpen(false);
      // Reset form
      setEditingAuditId(null);
      setFormData({
        templateId: '',
        locationId: '',
        managerId: '',
        scheduledDate: undefined,
        deadline: undefined,
        isSurprise: false,
        recurring: 'none',
        recurringDay: 1,
        repeatUntil: undefined,
      });
    } catch (e) {
      console.error(e);
      alert('Failed to save audit');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (audit: any) => {
    const now = new Date();
    const scheduledDate = audit.scheduledDate?.toDate();
    const deadline = audit.deadline?.toDate();
    const isDeadlineHit = audit.status === 'missed' || (audit.status !== 'completed' && deadline && deadline < now);

    if (audit.status === 'completed') {
      return <Badge variant="secondary" className="badge-completed">Completed</Badge>;
    }

    if (isDeadlineHit) {
      return <Badge variant="secondary" className="badge-danger">Deadline hit</Badge>;
    }

    if (audit.status === 'in_progress') {
      return <Badge variant="secondary" className="badge-in-progress">In progress</Badge>;
    }

    if ((audit.status === 'published' || audit.status === 'assigned')) {
      if (scheduledDate && scheduledDate > now) {
        return <Badge variant="secondary" className="status-badge badge-muted">Scheduled</Badge>;
      }
      return <Badge variant="secondary" className="badge-assigned">Pending</Badge>;
    }

    return <Badge variant="secondary" className="status-badge badge-muted">{audit.status}</Badge>;
  };

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.assignedManagerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || audit.locationId === locationFilter;
    const matchesManager = managerFilter === 'all' || audit.assignedManagerId === managerFilter;

    return matchesSearch && matchesStatus && matchesLocation && matchesManager;
  });

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="page-heading">Audits</h1>
              <p className="body-text text-muted-text">Manage audits and schedules.</p>
            </div>
            <Dialog open={open} onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                setEditingAuditId(null);
                setFormData({
                  templateId: '',
                  locationId: '',
                  managerId: '',
                  scheduledDate: undefined,
                  deadline: undefined,
                  isSurprise: false,
                  recurring: 'none',
                  recurringDay: 1,
                  repeatUntil: undefined,
                });
              } else if (!editingAuditId) {
                const today = new Date();
                
                const { start: st, end: et } = getDefaultTimes();
                const [startH, startM] = st.split(':').map(Number);
                const [endH, endM] = et.split(':').map(Number);
                
                const start = new Date(today);
                start.setHours(startH, startM, 0, 0);

                const end = new Date(today);
                end.setHours(endH, endM, 0, 0);

                setFormData(prev => ({
                  ...prev,
                  scheduledDate: start,
                  deadline: end
                }));
              }
            }}>
              <DialogTrigger asChild>
                <Button size="default" className="shadow-lg shadow-primary/20 h-11 px-5 text-[14px] font-medium gap-2 active:scale-95 transition-all">
                  <Plus className="mr-2 h-4 w-4" /> New audit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg p-6">
                <DialogHeader>
                  <DialogTitle className="font-semibold text-heading">
                    {editingAuditId ? 'Edit audit' : 'New audit'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="template" className="text-body font-normal">Template</Label>
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
                      <Label htmlFor="location" className="text-body font-normal">Location</Label>
                      <Select value={formData.locationId} onValueChange={(val) => {
                        updateFormField('locationId', val);
                        updateFormField('managerId', '');
                        
                        const { start: st, end: et } = getDefaultTimes(val);
                        setFormData(prev => {
                          const updates = { ...prev };
                          if (prev.scheduledDate) {
                            const newStart = new Date(prev.scheduledDate);
                            const [sh, sm] = st.split(':').map(Number);
                            newStart.setHours(sh, sm, 0, 0);
                            updates.scheduledDate = newStart;
                          }
                          if (prev.deadline) {
                            const newEnd = new Date(prev.deadline);
                            const [eh, em] = et.split(':').map(Number);
                            newEnd.setHours(eh, em, 0, 0);
                            updates.deadline = newEnd;
                          }
                          return updates;
                        });
                      }}>
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

                  {formData.locationId && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="manager" className="text-body font-normal">Manager</Label>
                      <Select value={formData.managerId} onValueChange={(val) => updateFormField('managerId', val)}>
                        <SelectTrigger id="manager" className="h-10 text-body bg-muted/5 border-border/50">
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {managers
                            .filter(m => {
                              const loc = locations.find(l => l.id === formData.locationId);
                              if (!loc) return false;
                              const assignedIds = loc.assignedManagerIds || (loc.assignedManagerId ? [loc.assignedManagerId] : []);
                              return assignedIds.includes(m.id);
                            })
                            .map(m => (
                              <SelectItem key={m.id} value={m.id} className="text-body">{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-body font-normal">Scheduled date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-10 text-[13px] w-full justify-start text-left font-normal border-border/50 bg-muted/5 text-body",
                              !formData.scheduledDate && "text-muted-text"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="start">
                          <Calendar mode="single" selected={formData.scheduledDate} onSelect={(date: any) => {
                            if (!date) {
                              updateFormField('scheduledDate', undefined);
                              return;
                            }
                            const { start: st, end: et } = getDefaultTimes(formData.locationId);
                            const [startH, startM] = st.split(':').map(Number);
                            date.setHours(startH, startM, 0, 0);
                            updateFormField('scheduledDate', date);
                            if (!formData.deadline || date >= formData.deadline) {
                              const newDeadline = new Date(date);
                              newDeadline.setDate(newDeadline.getDate() + 1);
                              const [endH, endM] = et.split(':').map(Number);
                              newDeadline.setHours(endH, endM, 0, 0);
                              updateFormField('deadline', newDeadline);
                            }
                          }} disabled={(date: Date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-body font-normal">Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-10 text-[13px] w-full justify-start text-left font-normal border-border/50 bg-muted/5 text-body",
                              !formData.deadline && "text-muted-text"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {formData.deadline ? format(formData.deadline, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="end">
                          <Calendar mode="single" selected={formData.deadline} onSelect={(date: any) => {
                            if (!date) {
                              updateFormField('deadline', undefined);
                              return;
                            }
                            const { end: et } = getDefaultTimes(formData.locationId);
                            const [endH, endM] = et.split(':').map(Number);
                            date.setHours(endH, endM, 0, 0);
                            updateFormField('deadline', date);
                          }} disabled={(date: Date) => {
                            let minDate = new Date();
                            minDate.setHours(0, 0, 0, 0);
                            if (formData.scheduledDate) {
                              const sched = new Date(formData.scheduledDate);
                              sched.setHours(0, 0, 0, 0);
                              if (sched > minDate) minDate = sched;
                            }
                            return date < minDate;
                          }} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="recurring" className="text-body font-normal">Frequency</Label>
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
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                      {formData.recurring === 'weekly' && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-body font-normal">Repeat on day</Label>
                          <Select value={formData.recurringDay.toString()} onValueChange={(val) => updateFormField('recurringDay', parseInt(val))}>
                            <SelectTrigger className="h-10 text-body bg-background border-border/50">
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

                      {formData.recurring === 'monthly' && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-body font-normal">Repeat on date</Label>
                          <Select value={formData.recurringDay.toString()} onValueChange={(val) => updateFormField('recurringDay', parseInt(val))}>
                            <SelectTrigger className="h-10 text-body bg-background border-border/50">
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

                      <div className="flex flex-col gap-2">
                        <Label className="text-body font-normal">Repeat until</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-10 text-[13px] w-full justify-start text-left font-normal border-border/50 bg-background text-body",
                                !formData.repeatUntil && "text-muted-text"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {formData.repeatUntil ? format(formData.repeatUntil, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="start">
                            <Calendar mode="single" selected={formData.repeatUntil} onSelect={(date: any) => {
                              if (date) {
                                const { end: et } = getDefaultTimes(formData.locationId);
                                const [endH, endM] = et.split(':').map(Number);
                                date.setHours(endH, endM, 0, 0);
                              }
                              updateFormField('repeatUntil', date);
                            }} disabled={(date: Date) => {
                              let minDate = new Date();
                              minDate.setHours(0, 0, 0, 0);
                              if (formData.scheduledDate) {
                                const sched = new Date(formData.scheduledDate);
                                sched.setHours(0, 0, 0, 0);
                                if (sched > minDate) minDate = sched;
                              }
                              return date < minDate;
                            }} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-t border-border/50">
                    <Label htmlFor="isSurprise" className="text-body font-normal">Surprise audit</Label>
                    <Switch id="isSurprise" checked={formData.isSurprise} onCheckedChange={(val) => updateFormField('isSurprise', val)} />
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" className="h-10 px-5 text-[13px] font-medium" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    className="h-10 px-5 text-[13px] font-medium shadow-lg shadow-primary/20"
                    onClick={handlePublish}
                    disabled={loading || !formData.templateId || !formData.locationId || !formData.managerId || !formData.scheduledDate || !formData.deadline}
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editingAuditId ? 'Save changes' : 'Publish audit'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="search-wrapper max-w-md">
            <Search className="search-icon" />
            <Input
              placeholder="Search audits..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {(statusFilter !== 'all' || locationFilter !== 'all' || managerFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => { setStatusFilter('all'); setLocationFilter('all'); setManagerFilter('all'); }}
                className="h-11 px-3 text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors group"
              >
                <X className="h-3 w-3 mr-1.5 opacity-40 group-hover:opacity-100" />
                Clear
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn(
                  "filter-btn",
                  (statusFilter !== 'all' || locationFilter !== 'all' || managerFilter !== 'all') && "text-primary border-primary/20 bg-primary/5"
                )}>
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 overflow-y-auto max-h-[400px]">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground/50 px-2 py-1.5">By Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All Statuses</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="published" className="text-body cursor-pointer">Published</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="assigned" className="text-body cursor-pointer">Assigned</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in_progress" className="text-body cursor-pointer">In Progress</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed" className="text-body cursor-pointer">Completed</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground/50 px-2 py-1.5">By Location</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={locationFilter} onValueChange={setLocationFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All Locations</DropdownMenuRadioItem>
                  {locations.map(loc => (
                    <DropdownMenuRadioItem key={loc.id} value={loc.id} className="text-body cursor-pointer">{loc.name}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground/50 px-2 py-1.5">By Manager</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={managerFilter} onValueChange={setManagerFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All Managers</DropdownMenuRadioItem>
                  {managers.map(m => (
                    <DropdownMenuRadioItem key={m.id} value={m.id} className="text-body cursor-pointer">{m.name}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Template</TableHead>
                <TableHead className="standard-table-head">Location</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head">Deadline</TableHead>
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
                      <p className="font-semibold text-heading opacity-40">No audits published yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAudits.map((a) => {
                  const now = new Date();
                  const deadline = a.deadline?.toDate();
                  const isDeadlineHit = a.status === 'missed' || (a.status !== 'completed' && deadline && deadline < now);
                  
                  return (
                    <TableRow key={a.id} className={cn(
                      "standard-table-row group",
                      isDeadlineHit && "bg-destructive/5 hover:bg-destructive/10"
                    )}>
                      <TableCell className="standard-table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-normal text-body">{a.templateTitle}</span>
                          {a.recurring && a.recurring !== 'none' && (
                            <div className="h-5 rounded-full bg-primary/10 text-primary px-2 flex items-center gap-1.5 w-fit text-[11px] font-normal">
                              <Clock className="w-2.5 h-2.5" />
                              <span className="capitalize">{a.recurring}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell text-[13px] font-normal text-body">
                        {a.locationName}
                      </TableCell>
                      <TableCell className="standard-table-cell">{getStatusBadge(a)}</TableCell>
                    <TableCell className="standard-table-cell">
                      <div className="flex flex-col gap-1.5 font-normal">
                        <span className="text-[13px] font-normal text-body">{a.deadline?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      {a.isSurprise ? (
                        <Badge variant="secondary" className="status-badge badge-warning">
                          Surprise
                        </Badge>
                      ) : (
                        <span className="text-[13px] font-normal text-muted-foreground">Routine</span>
                      )}
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
                      {a.status === 'completed' ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={cn("text-[13px] font-medium tabular-nums", a.scorePercentage < 70 ? "text-destructive" : "text-success")}>
                            {a.scorePercentage}%
                          </span>
                          <span className="text-[11px] font-normal text-muted-foreground/50 tabular-nums">{a.totalScore} / {a.maxPossibleScore}</span>
                        </div>
                      ) : (
                        <span className="text-[13px] font-normal text-muted-foreground">Pending</span>
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
                                setFormData({
                                  templateId: a.templateId,
                                  locationId: a.locationId,
                                  managerId: a.assignedManagerId || '',
                                  scheduledDate: a.scheduledDate?.toDate(),
                                  deadline: a.deadline?.toDate(),
                                  isSurprise: a.isSurprise || false,
                                  recurring: a.recurring || 'none',
                                  recurringDay: a.recurringDay || 1,
                                  repeatUntil: a.repeatUntil?.toDate() || undefined,
                                });
                                setOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardShell>
  );
}
