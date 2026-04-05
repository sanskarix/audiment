'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Calendar,
  X,
  Camera,
  MessageSquare,
  AlertCircle,
  TrendingDown,
  Wrench,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CorrectiveAction {
  id: string;
  auditId: string;
  locationId: string;
  locationName: string;
  questionText: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'completed' | 'resolved';
  deadline: any;
  createdAt: any;
  completedAt?: any;
  resolvedAt?: any;
  resolutionNote?: string;
  resolutionPhotoUrls?: string[];
}

export default function ManagerCorrectiveActionsPage() {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Resolution state
  const [selectedCA, setSelectedCA] = useState<CorrectiveAction | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionPhotos, setResolutionPhotos] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.uid || !session?.organizationId) return;

    const q = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', session.organizationId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedActions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CorrectiveAction[];
      
      // Filter for specific manager's locations if needed, 
      // but usually the query covers it. Let's filter client-side 
      // to ensure strictly assigned manager actions if that's the logic 
      // (Wait, the query was filtering by assignedManagerId in previous version)
      // Actually, if we want ALL actions for the org that this manager leads?
      // BUG 3 says "assigned to this manager".
      
      const managerActions = fetchedActions.filter(ca => (ca as any).assignedManagerId === session.uid);
      setActions(managerActions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching corrective actions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const handleComplete = async () => {
    if (!selectedCA || !resolutionNote) return;
    setIsResolving(true);
    try {
      const caRef = doc(db, 'correctiveActions', selectedCA.id);
      await updateDoc(caRef, {
        status: 'completed',
        resolutionNote,
        resolutionPhotoUrls: resolutionPhotos,
        completedAt: serverTimestamp()
      });
      setSelectedCA(null);
      setResolutionNote('');
      setResolutionPhotos([]);
    } catch (error) {
      console.error('Error completing CA:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleMarkOngoing = async (caId: string) => {
    try {
      await updateDoc(doc(db, 'correctiveActions', caId), {
        status: 'in_progress'
      });
    } catch (error) {
      console.error('Error marking as ongoing:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResolutionPhotos(prev => [...prev, data.url]);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge className="bg-destructive/10 text-destructive border-none px-2.5 py-0.5 rounded-full text-[10px] font-semibold">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500/10 text-amber-600 border-none px-2.5 py-0.5 rounded-full text-[10px] font-semibold">Medium</Badge>;
      default: return <Badge className="bg-primary/10 text-primary border-none px-2.5 py-0.5 rounded-full text-[10px] font-semibold">Low</Badge>;
    }
  };

  const activeActions = actions
    .filter(ca => ca.status === 'open' || ca.status === 'in_progress')
    .sort((a, b) => {
      const timeA = a.deadline?.toDate ? a.deadline.toDate().getTime() : 0;
      const timeB = b.deadline?.toDate ? b.deadline.toDate().getTime() : 0;
      return timeA - timeB;
    });
  const historyActions = actions
    .filter(ca => ca.status === 'completed' || ca.status === 'resolved')
    .sort((a, b) => {
      const timeA = a.completedAt?.toDate ? a.completedAt.toDate().getTime() : (a.resolvedAt?.toDate ? a.resolvedAt.toDate().getTime() : 0);
      const timeB = b.completedAt?.toDate ? b.completedAt.toDate().getTime() : (b.resolvedAt?.toDate ? b.resolvedAt.toDate().getTime() : 0);
      return timeB - timeA;
    });

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Corrective actions</h1>
            <p className="body-text">Track and resolve compliance issues across your assigned locations.</p>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-muted/30 border border-border/40 p-1 rounded-lg h-10 w-fit">
            <TabsTrigger value="active" className="px-5 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-heading data-[state=active]:shadow-sm">
              Active ({activeActions.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="px-5 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-heading data-[state=active]:shadow-sm">
              History ({historyActions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="focus-visible:outline-none">
            <div className="flex flex-col gap-4 max-w-5xl">
              {activeActions.length === 0 ? (
                <div className="py-24 border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-muted-text bg-muted/5 rounded-2xl">
                  <div className="bg-success/5 p-4 rounded-full mb-4">
                    <CheckCircle2 className="h-10 w-10 text-success opacity-40" />
                  </div>
                  <p className="font-semibold text-heading">No pending actions</p>
                  <p className="body-text text-sm mt-1 text-center">All your locations are currently following compliance standards.</p>
                </div>
              ) : (
                activeActions.map((ca) => {
                  const now = new Date();
                  const deadline = ca.deadline?.toDate();
                  const isOverdue = deadline && deadline < now;
                  
                  return (
                    <Card key={ca.id} className="p-0 border border-border/50 overflow-hidden hover:border-primary/30 shadow-sm hover:shadow-md transition-all group bg-background">
                      <div className="flex flex-col md:flex-row md:items-stretch">
                        <div className="flex-1 p-5 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getSeverityBadge(ca.severity)}
                                {ca.status === 'in_progress' ? (
                                  <Badge className="bg-amber-500/10 text-amber-600 border-none px-2 py-0.5 rounded-full text-[10px] font-semibold">In progress</Badge>
                                ) : (
                                  <Badge className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border-none", isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted/30 text-muted-text")}>
                                    {isOverdue ? 'Overdue' : 'Open'}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-heading leading-tight group-hover:text-primary transition-colors">
                                {ca.questionText}
                              </h3>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-b border-border/20 pb-4">
                            <div className="flex items-center gap-2 text-sm text-body">
                              <MapPin className="h-4 w-4 text-primary/40 shrink-0" />
                              <span>{ca.locationName}</span>
                            </div>
                            <div className={cn("flex items-center gap-2 text-sm font-medium", isOverdue ? "text-destructive" : "text-body")}>
                              <Clock className="h-4 w-4 opacity-40 shrink-0" />
                              <span>Due {deadline ? format(deadline, 'MMM d, yyyy') : 'No deadline'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-text ml-auto md:ml-0">
                               <Calendar className="h-4 w-4 opacity-30 shrink-0" />
                               <span>Raised {ca.createdAt ? format(ca.createdAt.toDate(), 'MMM d') : 'N/A'}</span>
                            </div>
                          </div>
                          
                          {ca.description && (
                            <div className="bg-muted/5 rounded-lg p-3 border border-border/20">
                              <p className="text-[13px] text-muted-text leading-relaxed italic">"{ca.description}"</p>
                            </div>
                          )}
                        </div>

                        <div className="md:w-64 bg-muted/5 md:border-l border-t md:border-t-0 border-border/50 flex flex-col items-center justify-center p-5 gap-3">
                          <Button
                            className="w-full h-11 shadow-lg shadow-primary/20 font-semibold text-sm active:scale-95 transition-all"
                            onClick={() => setSelectedCA(ca)}
                          >
                            Resolve issue
                          </Button>
                          {ca.status === 'open' && (
                            <Button
                              variant="outline"
                              className="w-full h-11 border-border/50 text-muted-text hover:text-primary hover:bg-primary/5 text-[12px] font-medium"
                              onClick={() => handleMarkOngoing(ca.id)}
                            >
                              Mark ongoing
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="focus-visible:outline-none">
             <div className="flex flex-col gap-4 max-w-5xl">
              {historyActions.length === 0 ? (
                <div className="py-24 border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-muted-text bg-muted/5 rounded-2xl">
                  <p className="font-semibold text-heading opacity-40">No history found</p>
                </div>
              ) : (
                historyActions.map((ca) => (
                  <Card key={ca.id} className="p-0 border border-border/50 overflow-hidden hover:border-success/20 shadow-sm transition-all bg-background group">
                     <div className="flex flex-col md:flex-row md:items-stretch">
                        <div className="flex-1 p-5 space-y-4">
                           <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-success/10 text-success border-none px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                       {ca.status === 'resolved' ? 'Resolved' : 'Completed'}
                                    </Badge>
                                    <span className="text-[10px] text-muted-text/40 tabular-nums">ID: {ca.id.slice(0, 8)}</span>
                                 </div>
                                 <h3 className="text-lg font-semibold text-heading leading-tight group-hover:text-success transition-colors">
                                    {ca.questionText}
                                 </h3>
                              </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-b border-border/20 pb-4">
                              <div className="flex items-center gap-2 text-sm text-body">
                                 <MapPin className="h-4 w-4 text-primary/40 shrink-0" />
                                 <span>{ca.locationName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-text">
                                 <CheckCircle2 className="h-4 w-4 text-success/40 shrink-0" />
                                 <span>Closed {ca.completedAt ? format(ca.completedAt.toDate(), 'MMM d, yyyy') : (ca.resolvedAt ? format(ca.resolvedAt.toDate(), 'MMM d, yyyy') : 'N/A')}</span>
                              </div>
                           </div>

                           <div className="bg-muted/5 rounded-lg p-4 border border-border/20 space-y-2">
                              <p className="text-[10px] font-bold text-muted-text/50 uppercase tracking-tight">Resolution note</p>
                              <p className="text-sm text-body italic leading-relaxed">"{ca.resolutionNote || 'No notes provided.'}"</p>
                           </div>
                        </div>

                        {ca.resolutionPhotoUrls && ca.resolutionPhotoUrls.length > 0 && (
                          <div className="md:w-64 bg-muted/5 md:border-l border-t md:border-t-0 border-border/50 p-5 flex flex-col justify-center gap-2">
                            <p className="text-[10px] font-bold text-muted-text/50 uppercase tracking-tight mb-1 text-center md:text-left">Proof of resolution</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                               {ca.resolutionPhotoUrls.map((url, i) => (
                                 <div key={i} className="h-16 w-16 md:h-12 md:w-12 rounded-lg border border-border shadow-sm overflow-hidden bg-muted group rotate-0 hover:scale-105 transition-transform relative">
                                   <Image src={url} alt="Proof" width={64} height={64} className="h-full w-full object-cover" />
                                 </div>
                               ))}
                            </div>
                          </div>
                        )}
                     </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelectedCA(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="font-semibold text-heading text-xl">Resolve issue</DialogTitle>
            <DialogDescription className="text-muted-text text-sm">
              Provide evidence and steps taken to remediate this non-compliance.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-0 space-y-6">
            <div className="space-y-3">
              <Label className="text-[13px] font-semibold text-heading">Resolution note</Label>
              <Textarea
                placeholder="Describe how the issue was fixed..."
                className="min-h-[120px] bg-muted/5 border-border/50 resize-none focus:ring-primary/20 text-body"
                value={resolutionNote}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResolutionNote(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-semibold text-heading">Upload proof</Label>
                <span className="text-[10px] text-muted-text/50">{resolutionPhotos.length} photos</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {resolutionPhotos.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg border border-border overflow-hidden bg-muted group">
                    <Image src={url} alt="Proof" width={100} height={100} className="h-full w-full object-cover" />
                    <button 
                      onClick={() => setResolutionPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 h-5 w-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(resolutionPhotos.length < 4) && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-1.5 hover:bg-muted/10 hover:border-primary/30 transition-all text-muted-text/40 hover:text-primary"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>
                        <Camera className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Add photo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 bg-muted/5 border-t border-border/50 gap-3">
            <Button variant="outline" onClick={() => setSelectedCA(null)} className="font-medium">Cancel</Button>
            <Button
              className="font-semibold shadow-lg shadow-primary/20 px-6 active:scale-95 transition-all"
              onClick={handleComplete}
              disabled={isResolving || !resolutionNote}
            >
              {isResolving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
