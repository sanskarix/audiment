'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuthSync } from '@/components/AuthProvider';
import DashboardShell from '@/components/DashboardShell';
import { Button } from '@/components/app-ui/button';
import { Input } from '@/components/app-ui/input';
import { Label } from '@/components/app-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/app-ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/app-ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/app-ui/popover";
import { Calendar } from "@/components/app-ui/calendar";
import { Plus, Search, User, MapPin, Calendar as CalendarIcon, Clock, Trash2, ExternalLink, Play, Send, CheckCircle2, MoreHorizontal, History, ChevronDown, X } from 'lucide-react';
import { format, setHours, setMinutes, lastDayOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/app-ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/app-ui/tabs';
import Link from 'next/link';

export default function AdminFlashmobPage() {
  const { isSynced, orgId, uid } = useAuthSync();
  const [locations, setLocations] = useState<any[]>([]);
  const [auditors, setAuditors] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [publishedRequests, setPublishedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);

  // Form State
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // New Date & Time States
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineHour, setDeadlineHour] = useState('12');
  const [deadlineMinute, setDeadlineMinute] = useState('00');
  const [deadlinePeriod, setDeadlinePeriod] = useState('PM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSynced || !orgId) return;

    const fetchData = async () => {
      try {
        // Fetch core data (locations, users) – these must not fail
        const [locSnap, audSnap, managerSnap] = await Promise.all([
          getDocs(query(collection(db, 'locations'), where('organizationId', '==', orgId), where('isActive', '==', true))),
          getDocs(query(collection(db, 'users'), where('organizationId', '==', orgId), where('role', '==', 'AUDITOR'), where('isActive', '==', true))),
          getDocs(query(collection(db, 'users'), where('organizationId', '==', orgId), where('role', '==', 'MANAGER'), where('isActive', '==', true))),
        ]);
        setLocations(locSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setAuditors(audSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setManagers(managerSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('[flashmob] Failed to load core data:', err);
      }

      try {
        // Fetch completed audit logs – sort client-side to avoid composite index
        const completedSnap = await getDocs(
          query(collection(db, 'flashmobAudits'), where('organizationId', '==', orgId), where('status', '==', 'completed'))
        );
        const completed = completedSnap.docs
          .map(d => ({ id: d.id, ...d.data() } as any))
          .sort((a, b) => (b.submittedAt?.toMillis?.() ?? 0) - (a.submittedAt?.toMillis?.() ?? 0));
        setAudits(completed);
      } catch (err) {
        console.error('[flashmob] Failed to load completed audits:', err);
      }

      try {
        // Fetch active dispatched requests – sort client-side to avoid composite index
        const activeSnap = await getDocs(
          query(collection(db, 'flashmobAuditRequests'), where('organizationId', '==', orgId), where('status', '==', 'published'))
        );
        const active = activeSnap.docs
          .map(d => ({ id: d.id, ...d.data() } as any))
          .sort((a, b) => (b.publishedAt?.toMillis?.() ?? 0) - (a.publishedAt?.toMillis?.() ?? 0));
        setPublishedRequests(active);
      } catch (err) {
        console.error('[flashmob] Failed to load active requests:', err);
      }

      setLoading(false);
    };

    fetchData();
  }, [isSynced, orgId]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuditor || !selectedLocation || !deadlineDate) return;

    setIsSubmitting(true);
    try {
      const auditor = auditors.find(a => a.id === selectedAuditor);
      const location = locations.find(l => l.id === selectedLocation);

      // Construct deadline timestamp
      let hours = parseInt(deadlineHour);
      if (deadlinePeriod === 'PM' && hours !== 12) hours += 12;
      if (deadlinePeriod === 'AM' && hours === 12) hours = 0;

      const deadlineAt = setMinutes(setHours(deadlineDate, hours), parseInt(deadlineMinute));

      const requestData = {
        organizationId: orgId,
        locationId: selectedLocation,
        locationName: location?.name || 'Unknown',
        auditorId: selectedAuditor,
        auditorName: auditor?.name || 'Unknown',
        deadlineAt: deadlineAt,
        status: 'published',
        publishedBy: uid,
        publishedByAdminId: uid,
        publishedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'flashmobAuditRequests'), requestData);

      await addDoc(collection(db, 'notifications'), {
        organizationId: orgId,
        recipientId: selectedAuditor,
        recipientRole: 'auditor',
        type: 'surprise_audit',
        title: 'Flashmob Verification Required',
        message: `You have an immediate flashmob verification request for ${location?.name || 'a location'}.`,
        relatedId: docRef.id,
        isRead: false,
        createdAt: serverTimestamp()
      });

      setPublishedRequests([{ id: docRef.id, ...requestData, publishedAt: new Date() }, ...publishedRequests]);
      setIsDialogOpen(false);
      const auditorName = auditor?.name || 'Auditor';
      setSuccessMessage(`Flashmob dispatched to ${auditorName} successfully.`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Reset form
      setSelectedAuditor('');
      setSelectedLocation('');
      setDeadlineDate(undefined);
      setDeadlineHour('12');
      setDeadlineMinute('00');
      setDeadlinePeriod('PM');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAudit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    try {
      await deleteDoc(doc(db, 'flashmobAudits', id));
      setAudits(audits.filter(a => a.id !== id));
    } catch (err) { console.error(err); }
  };

  const filteredAudits = audits.filter(a =>
    a.locationName?.toLowerCase().includes(search.toLowerCase()) ||
    a.auditorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">

        {/* Header Section */}
        <div className="page-header-section mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="page-heading">Flashmob Verification</h1>
            <p className="body-text text-muted-text">Monitor real-time video evidence and location check-ins.</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedAuditor('');
              setSelectedLocation('');
              setDeadlineDate(undefined);
              setDeadlineHour('12');
              setDeadlineMinute('00');
              setDeadlinePeriod('PM');
            }
          }}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all">
                <Plus className="h-4 w-4" /> Publish Flashmob
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px] gap-0 p-0 overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-border/40">
                <DialogTitle className="text-[18px] font-semibold text-heading leading-tight tracking-tight">Publish Flashmob</DialogTitle>
                <DialogDescription className="text-[13px] text-muted-text mt-1">
                  Dispatch an instant verification request to an auditor.
                </DialogDescription>
              </div>

              {/* Body */}
              <form onSubmit={handlePublish}>
                <div className="px-6 py-5 space-y-4">

                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label className="text-body font-normal">Site location</Label>
                    <Select value={selectedLocation} onValueChange={(val) => {
                      setSelectedLocation(val);
                      setSelectedAuditor('');
                    }} required>
                      <SelectTrigger className="h-10 border-border/50 bg-muted/30 text-body text-[13px] rounded-lg focus:ring-primary/20">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50">
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id} className="text-body text-[13px]">{location.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Auditor */}
                  <div className="space-y-1.5">
                    <Label className="text-body font-normal">Auditor</Label>
                    {(() => {
                      const loc = selectedLocation ? locations.find(l => l.id === selectedLocation) : null;
                      const assignedIds: string[] = loc
                        ? (loc.assignedManagerIds || (loc.assignedManagerId ? [loc.assignedManagerId] : []))
                        : [];
                      const locationAuditors = assignedIds.length > 0
                        ? auditors.filter(a => assignedIds.includes(a.managerId))
                        : auditors;
                      const selectedAuditorData = selectedAuditor ? auditors.find(a => a.id === selectedAuditor) : null;
                      const selectedLacksAccess = selectedAuditorData && !selectedAuditorData.isFlashmobEnabled;

                      return (
                        <>
                          <Select
                            value={selectedAuditor}
                            onValueChange={setSelectedAuditor}
                            required
                            disabled={!selectedLocation}
                          >
                            <SelectTrigger className={cn(
                              "h-10 border-border/50 bg-muted/30 text-body text-[13px] rounded-lg focus:ring-primary/20",
                              !selectedLocation && "opacity-50 cursor-not-allowed"
                            )}>
                              <SelectValue placeholder={selectedLocation ? "Select an auditor" : "Select a location first"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                              {locationAuditors.length === 0 && (
                                <div className="px-3 py-4 text-[12px] text-muted-text text-center">No auditors assigned to this location.</div>
                              )}
                              {locationAuditors.map((auditor) => (
                                <SelectItem key={auditor.id} value={auditor.id} className="text-body text-[13px]">
                                  <span className={!auditor.isFlashmobEnabled ? 'text-muted-text' : ''}>
                                    {auditor.name}{!auditor.isFlashmobEnabled ? ' (No flashmob access)' : ''}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedLacksAccess && (
                            <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
                              <span className="text-destructive mt-0.5 shrink-0">⚠️</span>
                              <p className="text-[11px] text-destructive leading-relaxed">
                                <strong>{selectedAuditorData.name}</strong> does not have flashmob access and cannot receive dispatches.{' '}
                                <Link
                                  href="/dashboard/admin/users"
                                  className="underline underline-offset-2 font-semibold hover:opacity-70 transition-opacity"
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Enable it in Users →
                                </Link>
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/40 pt-1" />

                  {/* Deadline */}
                  <div className="space-y-1.5">
                    <Label className="text-body font-normal">Deadline</Label>
                    <div className="flex items-center gap-2">
                      {/* Date picker */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 h-10 justify-start text-left font-normal border-border/50 bg-muted/30 text-[13px] rounded-lg focus:ring-primary/20",
                              !deadlineDate ? "text-muted-text/60" : "text-body"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-40 shrink-0" />
                            {deadlineDate ? format(deadlineDate, "MMM d, yyyy") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl border-border/50 shadow-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={deadlineDate}
                            onSelect={setDeadlineDate}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Time selects – compact */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Select value={deadlineHour} onValueChange={setDeadlineHour}>
                          <SelectTrigger className="h-10 w-[52px] border-border/50 bg-muted/30 px-1.5 text-[13px] text-body rounded-lg focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="min-w-[64px] rounded-xl border-border/50">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                              <SelectItem key={h} value={h.toString()} className="text-body text-[13px]">{String(h).padStart(2, '0')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-text/40 font-bold text-[14px] select-none">:</span>
                        <Select value={deadlineMinute} onValueChange={setDeadlineMinute}>
                          <SelectTrigger className="h-10 w-[52px] border-border/50 bg-muted/30 px-1.5 text-[13px] text-body rounded-lg focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="min-w-[64px] rounded-xl border-border/50">
                            {['00', '15', '30', '45'].map((m) => (
                              <SelectItem key={m} value={m} className="text-body text-[13px]">{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={deadlinePeriod} onValueChange={setDeadlinePeriod}>
                          <SelectTrigger className="h-10 w-[52px] border-border/50 bg-muted/30 px-1.5 text-[11px] font-semibold uppercase tracking-wider text-body rounded-lg focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="min-w-[60px] rounded-xl border-border/50">
                            <SelectItem value="AM" className="text-body text-[13px]">AM</SelectItem>
                            <SelectItem value="PM" className="text-body text-[13px]">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-border/50 text-[13px] font-medium text-muted-text hover:text-heading rounded-lg"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10 bg-primary hover:bg-primary/90 text-[13px] text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all font-semibold rounded-lg gap-2"
                    disabled={isSubmitting || !deadlineDate || !selectedAuditor || !selectedLocation || !auditors.find(a => a.id === selectedAuditor)?.isFlashmobEnabled}
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? 'Publishing…' : 'Dispatch'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Success banner */}
        {successMessage && (
          <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl text-[13px] font-medium animate-in fade-in slide-in-from-top-1 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Filters and Tabs */}
        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-muted/40 border border-border/40 p-1">
                <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 body-text">
                  Completed Logs
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 body-text">
                  Pending Tasks
                </TabsTrigger>
              </TabsList>

              <div className="search-wrapper w-full sm:w-72">
                <Search className="search-icon" />
                <Input
                  placeholder="Filter by location or auditor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <TabsContent value="all" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 rounded-xl bg-muted/20 animate-pulse border border-border/40" />
                  ))}
                </div>
              ) : filteredAudits.length === 0 ? (
                <div className="empty-state">
                  <History className="empty-state-icon" />
                  <h3 className="empty-state-title">No audit logs found</h3>
                  <p className="empty-state-body">Once auditors submit their verifications, they'll appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-aud-md">
                  {filteredAudits.map((audit) => (
                    <AuditCard key={audit.id} audit={audit} onDelete={() => handleDeleteAudit(audit.id)} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-aud-md">
                {publishedRequests.map((req) => (
                  <PendingRequestCard key={req.id} request={req} />
                ))}
                {publishedRequests.length === 0 && (
                  <div className="col-span-full empty-state">
                    <History className="empty-state-icon" />
                    <p className="empty-state-body">No pending assignments at the moment.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}

function AuditCard({ audit, onDelete }: { audit: any; onDelete: () => void }) {
  const date = audit.submittedAt?.toDate ? audit.submittedAt.toDate() : new Date();

  return (
    <div className="standard-card group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <video
          src={audit.videoUrl}
          className="w-full h-full object-cover"
          onMouseOver={e => e.currentTarget.play()}
          onMouseOut={e => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
          muted
          loop
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex items-center gap-2 text-white">
            <Play className="h-4 w-4 fill-white" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Preview Feed</span>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/40 backdrop-blur-md border-white/20 text-white text-[10px] uppercase tracking-widest font-bold py-1">
            {format(date, 'HH:mm')}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="min-w-0">
            <h3 className="section-heading truncate mb-1">{audit.locationName || 'Unspecified Site'}</h3>
            <div className="flex items-center gap-1.5 text-muted-text">
              <User className="h-3.5 w-3.5" />
              <span className="body-text truncate">{audit.auditorName}</span>
            </div>
          </div>
          <Link href={`/dashboard/admin/flashmob/${audit.id}`}>
            <Button variant="outline" size="icon" className="h-9 w-9 border-border/50 hover:bg-primary/5 hover:text-primary transition-colors">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-text/50" />
            <span className="muted-label">{format(date, 'MMM d, yyyy')}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-text/40 hover:text-destructive transition-colors"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PendingRequestCard({ request }: { request: any }) {
  const publishedAt = request.publishedAt?.toDate ? request.publishedAt.toDate() : new Date();
  const deadlineAt = request.deadlineAt?.toDate ? request.deadlineAt.toDate() : new Date();
  const isOverdue = new Date() > deadlineAt;

  return (
    <div className="standard-card border-dashed p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className={cn(
          "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
          isOverdue ? "bg-destructive/5 text-destructive border-destructive/20" : "bg-primary/5 text-primary border-primary/20"
        )}>
          {isOverdue ? 'Overdue' : 'Dispatched'}
        </Badge>
        <span className="muted-label text-[11px]">{format(publishedAt, 'MMM d')}</span>
      </div>

      <h3 className="section-heading mb-1">{request.locationName}</h3>
      <p className="body-text text-muted-text mb-4">Target: {request.auditorName}</p>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/40">
        <Clock className={cn("h-4 w-4", isOverdue ? "text-destructive" : "text-muted-text")} />
        <div className="min-w-0">
          <p className="text-[10px] text-muted-text font-medium uppercase tracking-tight">Deadline</p>
          <p className={cn("body-text font-semibold truncate", isOverdue && "text-destructive")}>
            {format(deadlineAt, 'MMM d, h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
}
