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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredActions = actions.filter((ca) =>
    ca.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ca.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ca.questionText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openActions = filteredActions.filter(ca => ca.status === 'open' || ca.status === 'in_progress');
  const completedActions = filteredActions.filter(ca => ca.status === 'completed' || ca.status === 'resolved');

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
        <div className="page-header-section flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Corrective Actions</h1>
            <p className="body-text">Monitor and resolve issues identified during audits.</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Card className="px-4 py-2 flex items-center gap-3 border-destructive/30 bg-destructive/10 shadow-sm rounded-lg flex-shrink-0">
              <span className="text-[10px] font-medium text-destructive  tracking-widest leading-none mt-0.5">Attention Required</span>
              <span className="text-xl font-medium text-destructive leading-none">{openActions.length}</span>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search actions by location or description..."
              className="pl-9 h-11 bg-background text-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="open" className="space-y-6">
          <TabsList className="bg-muted/20 p-1 border border-border/50 rounded-lg inline-flex h-12">
            <TabsTrigger value="open" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 font-medium text-xs  tracking-widest h-full transition-all rounded-md">
              Open Issues ({openActions.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 font-medium text-xs  tracking-widest h-full transition-all rounded-md">
              Completed ({completedActions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full">
              {openActions.length === 0 ? (
                <div className="col-span-full py-32 border-dashed border-2 border-border/50 flex flex-col items-center justify-center text-muted-text bg-muted/10 rounded-2xl">
                  <div className="bg-success/10 p-4 rounded-full mb-4">
                    <CheckCircle2 className="h-10 w-10 text-success opacity-80" />
                  </div>
                  <p className="section-heading text-lg">No Open Corrective Actions</p>
                  <p className="body-text pt-2 max-w-[320px] text-center">Excellent! Everything is compliant across your managed locations.</p>
                </div>
              ) : (
                openActions.map((ca) => (
                  <Card key={ca.id} className="standard-card flex flex-col h-full group hover:border-primary/20 transition-colors">
                    <CardHeader className="p-xl bg-muted/10 border-b border-border/50">
                      <div className="flex justify-between items-start mb-md">
                        {getSeverityBadge(ca.severity)}
                        <Badge variant="outline" className="text-[10px] font-medium text-destructive bg-destructive/10 border-destructive/30  tracking-widest px-2 py-0.5">
                          Due {ca.deadline ? format(ca.deadline.toDate(), 'MMM d, yyyy') : 'No Date'}
                        </Badge>
                      </div>
                      <CardTitle className="section-heading text-lg leading-snug group-hover:text-primary transition-colors">
                        {ca.questionText}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-xl space-y-md flex-grow">
                      <div className="relative pl-md border-l-2 border-primary/30">
                        <p className="body-text text-body/80 leading-relaxed italic">
                          "{ca.description}"
                        </p>
                      </div>
                      <div className="flex flex-col gap-xs pt-xs">
                        <div className="flex items-center gap-2 text-[10px] font-normal text-muted-text  tracking-widest">
                          <MapPin className="h-3.5 w-3.5 text-primary opacity-60" />
                          <span>{ca.locationName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-normal text-muted-text/60  tracking-widest">
                          <Calendar className="h-3.5 w-3.5 opacity-60" />
                          Identified {ca.createdAt ? format(ca.createdAt.toDate(), 'MMM d, h:mm a') : 'N/A'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-xl pt-0 mt-auto flex gap-2">
                       {ca.status === 'open' && (
                        <Button
                          variant="outline"
                          className="flex-1 font-medium tracking-widest text-xs h-10 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => handleMarkOngoing(ca.id)}
                        >
                          Mark Ongoing
                        </Button>
                      )}
                      <Button
                        className="flex-1 font-medium tracking-widest text-xs h-10 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setSelectedCA(ca)}
                      >
                        {ca.status === 'open' ? 'Complete Issue' : 'Complete Issue'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-0">
            <div className="space-y-6">
              {completedActions.length === 0 ? (
                <Card className="py-20 border-dashed border-2 flex flex-col items-center justify-center text-muted-text bg-muted/5 rounded-2xl">
                  <p className="page-heading text-lg opacity-40  tracking-[0.2em] font-normal">No Completed Issues Found</p>
                </Card>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {completedActions.map((ca) => (
                    <Card key={ca.id} className="standard-card flex flex-col overflow-hidden hover:border-success/30 transition-colors group">
                      <div className="p-xl border-b border-border/50 bg-background flex-1">
                        <div className="flex items-center justify-between gap-2 mb-md">
                          <div className="flex items-center gap-2">
                            <div className="bg-success/20 p-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3 text-success" />
                            </div>
                            <span className="text-[10px] font-medium text-success  tracking-widest">
                              {ca.status === 'resolved' ? 'Resolved by Admin' : 'Completed'}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-text font-normal  tracking-widest opacity-60">
                            ID: {ca.id.substring(0, 8)}
                          </span>
                        </div>
                        <h4 className="section-heading text-lg mb-2 group-hover:text-success transition-colors leading-snug">{ca.questionText}</h4>
                        <p className="text-[10px] font-normal text-muted-text  tracking-widest mb-lg">{ca.locationName}</p>

                        <div className="bg-muted/10 p-md rounded-lg border border-border/50 relative">
                          <p className="text-[10px] font-normal  text-muted-text mb-sm tracking-widest opacity-80">Resolution Note</p>
                          <p className="body-text italic text-body/80 leading-relaxed">"{ca.resolutionNote || 'No notes provided.'}"</p>
                        </div>
                      </div>
                      <div className="p-xl bg-muted/5 flex flex-col gap-md">
                        <div className="flex flex-col gap-xs">
                          <p className="text-[10px] font-normal  text-muted-text tracking-widest opacity-80">Completed On</p>
                          <p className="text-sm font-normal text-body">{ca.completedAt ? format(ca.completedAt.toDate(), 'MMM d, yyyy') : (ca.resolvedAt ? format(ca.resolvedAt.toDate(), 'MMM d, yyyy') : 'N/A')}</p>
                        </div>
                        {ca.resolutionPhotoUrls && ca.resolutionPhotoUrls.length > 0 && (
                          <div className="flex gap-sm overflow-x-auto pb-2">
                            {ca.resolutionPhotoUrls.map((url, i) => (
                              <div key={i} className="h-14 w-14 rounded-md border border-border/50 overflow-hidden bg-muted/20 flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
                                <img src={url} alt="Proof" className="h-full w-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelectedCA(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50">
          <DialogHeader className="p-xl border-b border-border/50 bg-muted/10">
            <DialogTitle className="flex items-center gap-3 text-success font-semibold text-xl">
              <CheckCircle2 className="h-5 w-5" /> COMPLETE ISSUE
            </DialogTitle>
            <DialogDescription className="font-normal text-body bg-background p-md rounded-lg border border-border/50 mt-md flex flex-col gap-sm">
              <span className="text-[10px] font-normal text-muted-text  tracking-widest">Identified Issue</span>
              <span className="text-sm italic leading-snug">"{selectedCA?.questionText}"</span>
              <span className="text-[10px] font-normal text-primary  tracking-widest mt-1">{selectedCA?.locationName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="p-xl space-y-md">
            <div className="space-y-sm">
              <Label htmlFor="note" className="text-xs font-normal  text-muted-text tracking-widest">Resolution Note</Label>
              <Textarea
                id="note"
                placeholder="Describe how the issue was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[120px] text-sm bg-background border-input text-body"
              />
            </div>

            <div className="space-y-sm">
              <Label className="text-xs font-normal  text-muted-text tracking-widest">Evidence Photo (Optional)</Label>
              <div className="flex flex-col gap-md">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 w-full border-dashed flex-col gap-sm border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-muted-text" /> : <Camera className="h-5 w-5 text-muted-text" />}
                  <span className="text-[10px] font-normal text-muted-text  tracking-widest flex items-center gap-1.5"><span className="text-primary font-medium">Upload</span> or drag and drop</span>
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>

              {resolutionPhotos.length > 0 && (
                <div className="flex gap-md overflow-x-auto py-2 mt-2">
                  {resolutionPhotos.map((url, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-md overflow-hidden border border-border/50 shadow-sm flex-shrink-0">
                      <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                      <button
                        className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded hover:bg-destructive transition-colors"
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

          <DialogFooter className="bg-muted/10 p-xl border-t border-border/50 gap-sm">
            <Button variant="outline" onClick={() => setSelectedCA(null)} className="font-medium text-xs  tracking-widest text-body">Discard</Button>
            <Button
              onClick={handleComplete}
              disabled={isResolving || !resolutionNote}
              className="font-medium text-xs  tracking-widest shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isResolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Submit Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
