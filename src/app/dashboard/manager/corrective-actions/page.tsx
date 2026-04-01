'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  X,
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

interface CorrectiveAction {
  id: string;
  organizationId: string;
  assignedManagerId: string;
  status: 'open' | 'in_progress' | 'completed' | 'resolved';
  severity: 'high' | 'medium' | 'low';
  questionText: string;
  description: string;
  locationName: string;
  locationId: string;
  deadline: any;
  createdAt: any;
  completedAt?: any;
  resolvedAt?: any;
  resolutionNote?: string;
  resolutionPhotoUrls?: string[];
}

export default function CorrectiveActionsPage() {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Resolution Dialog State
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

    // Real-time listener for corrective actions assigned to this manager
    const q = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', session.organizationId),
      where('assignedManagerId', '==', session.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedActions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CorrectiveAction[];
      setActions(fetchedActions);
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
      case 'high': return <Badge variant="destructive" className=" text-[10px] font-medium">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="bg-warning/10 text-warning border-none  text-[10px] font-medium">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="bg-primary/10 text-primary border-none  text-[10px] font-medium">Low</Badge>;
      default: return null;
    }
  };

  const openActions = actions.filter(ca => ca.status === 'open' || ca.status === 'in_progress');
  const completedActions = actions.filter(ca => ca.status === 'completed' || ca.status === 'resolved');

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
            <h1 className="page-heading">Priority Resolution</h1>
            <p className="body-text">Address and resolve identified compliance issues across your branch.</p>
          </div>
        </div>



        <Tabs defaultValue="open" className="space-y-6">
          <div className="flex justify-start">
            <TabsList className="h-10 items-center justify-center rounded-lg bg-muted/30 p-1 text-muted-text border border-border/50">
              <TabsTrigger 
                value="open" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-heading data-[state=active]:shadow-sm"
              >
                Active ({openActions.length})
              </TabsTrigger>
              <TabsTrigger 
                value="resolved" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-heading data-[state=active]:shadow-sm"
              >
                History ({completedActions.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="open" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {openActions.length === 0 ? (
                <div className="col-span-full py-24 border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-muted-text bg-muted/5 rounded-2xl">
                  <div className="bg-success/5 p-4 rounded-full mb-4">
                    <CheckCircle2 className="h-10 w-10 text-success opacity-40" />
                  </div>
                  <p className="font-semibold text-heading">No Pending Issues</p>
                  <p className="body-text text-sm mt-1">All your locations are compliant.</p>
                </div>
              ) : (
                openActions.map((ca) => (
                  <Card key={ca.id} className="standard-card flex flex-col h-full group hover:border-primary/20 transition-all duration-200">
                    <div className="p-6 bg-muted/5 border-b border-border/40">
                      <div className="flex justify-between items-center mb-4">
                        {ca.severity === 'high' ? (
                          <Badge variant="secondary" className="h-6 rounded-full bg-destructive/10 text-destructive border-none px-2.5 text-[12px] font-normal">High Severity</Badge>
                        ) : ca.severity === 'medium' ? (
                          <Badge variant="secondary" className="h-6 rounded-full bg-warning/10 text-warning border-none px-2.5 text-[12px] font-normal">Medium Severity</Badge>
                        ) : (
                          <Badge variant="secondary" className="h-6 rounded-full bg-primary/10 text-primary border-none px-2.5 text-[12px] font-normal">Low Severity</Badge>
                        )}
                        <Badge variant="outline" className="text-[11px] font-medium text-destructive border-destructive/20 bg-destructive/5 px-2 py-0.5 rounded-md">
                          Due {ca.deadline ? format(ca.deadline.toDate(), 'MMM d') : 'No Date'}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-heading leading-snug group-hover:text-primary transition-colors">
                        {ca.questionText}
                      </h4>
                    </div>
                    <CardContent className="p-6 space-y-4 flex-grow">
                      <div className="relative pl-4 border-l-2 border-primary/20">
                        <p className="body-text text-sm italic line-clamp-3">
                          "{ca.description}"
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center gap-2 text-[12px] text-body">
                          <span>{ca.locationName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-text">
                          <Clock className="h-3.5 w-3.5 opacity-40" />
                          <span>Identified {ca.createdAt ? format(ca.createdAt.toDate(), 'MMM d, h:mm a') : 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 mt-auto flex gap-3">
                       {ca.status === 'open' && (
                        <Button
                          variant="outline"
                          className="flex-1 font-medium text-xs h-10 border-border/50 text-muted-text hover:text-primary transition-all"
                          onClick={() => handleMarkOngoing(ca.id)}
                        >
                          Mark Ongoing
                        </Button>
                      )}
                      <Button
                        className="flex-1 font-medium text-xs h-10 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        onClick={() => setSelectedCA(ca)}
                      >
                        Resolve Issue
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-6 lg:grid-cols-2">
              {completedActions.length === 0 ? (
                <div className="col-span-full py-24 border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-muted-text bg-muted/5 rounded-2xl">
                  <p className="font-semibold text-heading opacity-40">History Empty</p>
                </div>
              ) : (
                completedActions.map((ca) => (
                  <Card key={ca.id} className="standard-card flex flex-col overflow-hidden hover:border-success/30 transition-all duration-200 group">
                    <div className="p-6 border-b border-border/40 bg-background flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="h-6 rounded-full bg-success/10 text-success border-none px-2.5 text-[12px] font-normal">
                          {ca.status === 'resolved' ? 'Resolved by Admin' : 'Completed'}
                        </Badge>
                        <span className="text-[11px] text-muted-text opacity-40 tabular-nums">
                          ID: {ca.id.substring(0, 8)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-heading leading-snug group-hover:text-success transition-colors">{ca.questionText}</h4>
                      <p className="text-[11px] font-medium text-muted-text uppercase tracking-wider mt-2">{ca.locationName}</p>

                      <div className="bg-muted/5 p-4 rounded-xl border border-border/40 mt-4 relative">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-text/60 mb-2">Resolution Statement</p>
                        <p className="body-text text-sm italic">"{ca.resolutionNote || 'No notes provided.'}"</p>
                      </div>
                    </div>
                    <div className="p-6 bg-muted/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">Closed On</p>
                          <p className="text-xs font-normal text-body">{ca.completedAt ? format(ca.completedAt.toDate(), 'MMM d, yyyy') : (ca.resolvedAt ? format(ca.resolvedAt.toDate(), 'MMM d, yyyy') : 'N/A')}</p>
                        </div>
                        {ca.resolutionPhotoUrls && ca.resolutionPhotoUrls.length > 0 && (
                          <div className="flex -space-x-2">
                             {ca.resolutionPhotoUrls.map((url, i) => (
                               <div key={i} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer">
                                 <img src={url} alt="Proof" className="h-full w-full object-cover" />
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelectedCA(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-heading">Resolve Issue</DialogTitle>
            <DialogDescription className="text-muted-text text-sm">
              Provide evidence and steps taken to remediate this non-compliance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">Issue Context</p>
              <p className="text-sm font-medium text-heading italic leading-snug">"{selectedCA?.questionText}"</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-body font-normal">Resolution Note</Label>
              <Textarea
                id="note"
                placeholder="Detail the corrective actions taken..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[120px] text-body resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-body font-normal">Visual Evidence (Optional)</Label>
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4 w-fit border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-text flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  <span className="text-[12px] font-medium">Attach Proof</span>
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>

              {resolutionPhotos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {resolutionPhotos.map((url, i) => (
                    <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-border/40 shadow-sm flex-shrink-0 group">
                      <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                      <button
                        className="absolute top-1 right-1 bg-destructive/90 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setResolutionPhotos(prev => prev.filter(p => p !== url))}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCA(null)} className="h-9 px-4 font-normal text-xs">Cancel</Button>
            <Button
              onClick={handleComplete}
              disabled={isResolving || !resolutionNote}
              className="h-9 px-4 font-medium text-xs shadow-lg shadow-primary/10 transition-all"
            >
              {isResolving && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
              Complete Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
