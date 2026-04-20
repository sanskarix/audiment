'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { useAuthSync } from '@/components/AuthProvider';
import DashboardShell from '@/components/DashboardShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Search, User, MapPin, Calendar as CalendarIcon, Clock, Trash2, ExternalLink, Play, Send, CheckCircle2, MoreHorizontal, History, ChevronDown, X } from 'lucide-react';
import { format, setHours, setMinutes, lastDayOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

  // Form State
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // New Date & Time States
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineHour, setDeadlineHour] = useState('12');
  const [deadlineMinute, setDeadlineMinute] = useState('00');
  const [deadlinePeriod, setDeadlinePeriod] = useState('PM');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSynced || !orgId) return;

    const fetchData = async () => {
      try {
        const [locSnap, audSnap, auditSnap, reqSnap] = await Promise.all([
          getDocs(query(collection(db, 'locations'), where('organizationId', '==', orgId), where('isActive', '==', true))),
          getDocs(query(collection(db, 'users'), where('organizationId', '==', orgId), where('role', '==', 'auditor'), where('isFlashmobEnabled', '==', true))),
          getDocs(query(collection(db, 'flashmobAudits'), where('organizationId', '==', orgId), orderBy('submittedAt', 'desc'))),
          getDocs(query(collection(db, 'flashmobAudits'), where('organizationId', '==', orgId), where('status', '==', 'active')))
        ]);

        setLocations(locSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setAuditors(audSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setAudits(auditSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const reqDocs = reqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        reqDocs.sort((a: any, b: any) => {
          const tA = a.publishedAt?.toMillis?.() || 0;
          const tB = b.publishedAt?.toMillis?.() || 0;
          return tB - tA;
        });
        setPublishedRequests(reqDocs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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
        status: 'active',
        publishedBy: uid,
        publishedAt: serverTimestamp(),
        isVisibleToManager: false,
      };

      const docRef = await addDoc(collection(db, 'flashmobAudits'), requestData);
      
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
      alert('Flashmob request published successfully.');
      
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all">
                <Plus className="h-4 w-4" /> Publish Flashmob
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl border-none shadow-2xl">
              <div className="bg-card p-6 sm:p-8 space-y-6">
                <DialogHeader className="space-y-1.5 text-left">
                  <DialogTitle className="page-heading text-[22px] leading-tight flex items-center justify-between w-full">
                    Publish Flashmob
                  </DialogTitle>
                  <DialogDescription className="body-text text-[14px] text-muted-text/80">
                    Send an instant verification request to an auditor.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handlePublish} className="space-y-6">
                  <div className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <Label className="section-heading text-[13px] font-medium text-heading">Assign Auditor</Label>
                      <Select value={selectedAuditor} onValueChange={setSelectedAuditor} required>
                        <SelectTrigger className="h-11 border-border/50 bg-background text-body text-[14px] focus:ring-primary/20 rounded-md">
                          <SelectValue placeholder="Select an auditor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-border/50">
                          {auditors.map((auditor) => (
                            <SelectItem key={auditor.id} value={auditor.id} className="text-body cursor-pointer">{auditor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="section-heading text-[13px] font-medium text-heading">Site Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                        <SelectTrigger className="h-11 border-border/50 bg-background text-body text-[14px] focus:ring-primary/20 rounded-md">
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-border/50">
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id} className="text-body cursor-pointer">{location.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-5 sm:grid sm:grid-cols-5 sm:items-end">
                      {/* Date Selector */}
                      <div className="flex flex-col gap-2 sm:col-span-3">
                        <Label className="section-heading text-[13px] font-medium text-heading">Deadline Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-11 w-full justify-start text-left font-normal border-border/50 bg-background text-body text-[14px] focus:ring-primary/20 rounded-md",
                                  !deadlineDate && "text-muted-text/60"
                                )}
                              >
                                <CalendarIcon className="mr-3 h-4 w-4 opacity-40" />
                                {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-xl border-border/50 shadow-xl" align="start">
                            <Calendar
                              mode="single"
                              selected={deadlineDate}
                              onSelect={setDeadlineDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Time Selector */}
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <Label className="section-heading text-[13px] font-medium text-heading">Deadline Time</Label>
                        <div className="flex items-center gap-1.5">
                          <Select value={deadlineHour} onValueChange={setDeadlineHour}>
                            <SelectTrigger className="h-11 border-border/50 focus:ring-primary/20 bg-background flex-1 px-2.5 text-body text-[14px] rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="min-w-[70px] rounded-lg border-border/50">
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                <SelectItem key={h} value={h.toString()} className="text-body">{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span className="text-muted-text/30 font-medium">:</span>

                          <Select value={deadlineMinute} onValueChange={setDeadlineMinute}>
                            <SelectTrigger className="h-11 border-border/50 focus:ring-primary/20 bg-background flex-1 px-2.5 text-body text-[14px] rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="min-w-[70px] rounded-lg border-border/50">
                              {['00', '15', '30', '45'].map((m) => (
                                <SelectItem key={m} value={m} className="text-body">{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select value={deadlinePeriod} onValueChange={setDeadlinePeriod}>
                            <SelectTrigger className="h-11 border-border/50 focus:ring-primary/20 bg-background w-[68px] px-2 font-semibold text-[11px] text-body uppercase tracking-wider rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="min-w-[68px] rounded-lg border-border/50">
                              <SelectItem value="AM" className="text-body">AM</SelectItem>
                              <SelectItem value="PM" className="text-body">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-[15px] text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all font-semibold rounded-md uppercase tracking-wide"
                      disabled={isSubmitting || !deadlineDate}
                    >
                      {isSubmitting ? 'Publishing...' : 'Dispatch Flashmob'}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
                <Input
                  placeholder="Filter by location or auditor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-border/50 bg-background/50 focus-visible:ring-primary/20 shadow-sm"
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
                <div className="standard-card flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                    <History className="h-8 w-8 text-muted-text/30" />
                  </div>
                  <h3 className="section-heading text-heading/70">No audit logs found</h3>
                  <p className="body-text text-muted-text/60 mt-1">Once auditors submit their verifications, they'll appear here.</p>
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
                {publishedRequests.filter(r => r.status === 'active').map((req) => (
                  <PendingRequestCard key={req.id} request={req} />
                ))}
                {publishedRequests.filter(r => r.status === 'active').length === 0 && (
                  <div className="col-span-full standard-card flex flex-col items-center justify-center py-20 text-center border-dashed">
                    <History className="h-10 w-10 text-muted-text/20 mb-3" />
                    <p className="body-text text-muted-text">No pending assignments at the moment.</p>
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
