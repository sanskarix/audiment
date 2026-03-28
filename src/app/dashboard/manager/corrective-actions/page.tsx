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
  status: 'open' | 'in_progress' | 'resolved';
  severity: 'high' | 'medium' | 'low';
  questionText: string;
  description: string;
  locationName: string;
  locationId: string;
  deadline: any;
  createdAt: any;
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
      } catch (e) {}
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

  const handleResolve = async () => {
    if (!selectedCA || !resolutionNote) return;
    setIsResolving(true);
    try {
      const caRef = doc(db, 'correctiveActions', selectedCA.id);
      await updateDoc(caRef, {
        status: 'resolved',
        resolutionNote,
        resolutionPhotoUrls: resolutionPhotos,
        resolvedAt: serverTimestamp()
      });
      setSelectedCA(null);
      setResolutionNote('');
      setResolutionPhotos([]);
    } catch (error) {
      console.error('Error resolving CA:', error);
    } finally {
      setIsResolving(false);
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
      case 'high': return <Badge variant="destructive" className="uppercase text-[10px] font-bold">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none uppercase text-[10px] font-bold">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none uppercase text-[10px] font-bold">Low</Badge>;
      default: return null;
    }
  };

  const filteredActions = actions.filter(ca => 
    ca.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ca.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openActions = filteredActions.filter(ca => ca.status === 'open' || ca.status === 'in_progress');
  const resolvedActions = filteredActions.filter(ca => ca.status === 'resolved');

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
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Corrective Actions</h1>
            <p className="body-text">Monitor and resolve issues identified during audits.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by question or location..."
              className="pl-8 bg-muted/20 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <Card className="px-5 py-2.5 flex items-center gap-3 border-destructive/20 bg-destructive/5 shadow-none rounded-xl">
               <span className="text-[11px] font-black text-destructive uppercase tracking-widest">Attention Required:</span>
               <span className="text-xl font-black text-destructive leading-none">{actions.filter(a => a.status !== 'resolved').length}</span>
             </Card>
          </div>
        </div>

        <Tabs defaultValue="open" className="section-gap">
          <TabsList className="bg-muted/30 p-1.5 border min-h-[48px] rounded-xl">
            <TabsTrigger value="open" className="data-[state=active]:bg-background data-[state=active]:shadow-md px-10 font-black text-[10px] uppercase tracking-widest h-full transition-all">
              Open Issues ({openActions.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-background data-[state=active]:shadow-md px-10 font-black text-[10px] uppercase tracking-widest h-full transition-all">
              Resolved ({resolvedActions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {openActions.length === 0 ? (
                <Card className="col-span-full py-20 border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 rounded-2xl">
                  <div className="bg-success/10 p-5 rounded-full mb-6">
                    <CheckCircle2 className="h-12 w-12 text-success opacity-40" />
                  </div>
                  <p className="page-heading text-lg">No Open Corrective Actions</p>
                  <p className="muted-label pt-1 max-w-[280px]">Excellent! Everything is compliant across your managed locations.</p>
                </Card>
              ) : (
                openActions.map((ca) => (
                  <Card key={ca.id} className="standard-card flex flex-col h-full group">
                    <CardHeader className="pb-4 px-6 pt-6 bg-muted/5 border-b border-muted/20">
                      <div className="flex justify-between items-center mb-3">
                        {getSeverityBadge(ca.severity)}
                        <Badge variant="outline" className="text-[9px] font-black text-destructive bg-destructive/5 border-destructive/10 uppercase tracking-widest px-2.5 py-1">
                          Due {ca.deadline ? format(ca.deadline.toDate(), 'MMM d, yyyy') : 'No Date'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {ca.questionText}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 px-6 space-y-5 flex-grow">
                      <div className="relative pl-5">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                        <p className="body-text italic leading-relaxed text-foreground/80">
                          "{ca.description}"
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 pt-2">
                        <div className="flex items-center gap-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <MapPin className="h-4 w-4 text-primary" /> 
                          <span>{ca.locationName}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                          <Calendar className="h-4 w-4 opacity-40" /> 
                          Identified {ca.createdAt ? format(ca.createdAt.toDate(), 'MMM d, h:mm a') : 'N/A'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-6 px-6 mt-auto">
                      <Button 
                        className="w-full font-black uppercase tracking-widest text-[11px] h-11 shadow-black/10 group-hover:shadow-primary/20 transition-all"
                        onClick={() => setSelectedCA(ca)}
                      >
                         Add Resolution Notes
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-0">
             <div className="section-gap">
                {resolvedActions.length === 0 ? (
                  <Card className="py-20 border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 rounded-2xl">
                    <p className="page-heading text-lg opacity-40 uppercase tracking-[0.2em]">No Resolved Issues Found</p>
                  </Card>
                ) : (
                  <div className="grid gap-5">
                   {resolvedActions.map((ca) => (
                    <Card key={ca.id} className="standard-card flex flex-col md:flex-row overflow-hidden hover:border-success/30 transition-all group">
                      <div className="p-6 md:w-3/4 border-b md:border-b-0 md:border-r border-muted/20">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-success p-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[10px] font-black text-success uppercase tracking-widest">Resolved</span>
                          <span className="text-[10px] text-muted-foreground font-mono ml-auto opacity-30">
                            ID: {ca.id.substring(0, 8)}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-success transition-colors">{ca.questionText}</h4>
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 italic">{ca.locationName}</p>
                        
                        <div className="bg-muted/10 p-5 rounded-xl border border-muted/10 relative">
                          <p className="text-[9px] font-black uppercase text-muted-foreground/40 mb-2 tracking-[0.2em]">Resolution Note</p>
                          <p className="body-text italic text-foreground/70 leading-relaxed">"{ca.resolutionNote || 'No notes provided.'}"</p>
                        </div>
                      </div>
                      <div className="p-6 md:w-1/4 bg-muted/5 flex flex-col justify-center gap-5">
                         <div className="text-center">
                            <p className="text-[9px] font-black uppercase text-muted-foreground/40 mb-1 tracking-widest">Resolved On</p>
                            <p className="text-sm font-black text-foreground">{ca.resolvedAt ? format(ca.resolvedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</p>
                         </div>
                         {ca.resolutionPhotoUrls && ca.resolutionPhotoUrls.length > 0 && (
                           <div className="flex justify-center gap-2 flex-wrap">
                             {ca.resolutionPhotoUrls.map((url, i) => (
                               <div key={i} className="h-12 w-12 rounded-lg border border-muted/30 overflow-hidden bg-white shadow-sm ring-2 ring-white hover:scale-110 transition-transform">
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

      {/* Resolution Dialog */}
      <Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelectedCA(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-6 border-b border-muted/20">
            <DialogTitle className="flex items-center gap-3 text-success text-2xl font-black italic tracking-tighter">
              <CheckCircle2 className="h-6 w-6" /> RESOLVE ISSUE
            </DialogTitle>
            <DialogDescription className="font-bold text-foreground bg-muted/5 p-4 rounded-xl border border-muted/10 mt-4">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1">Identified Issue</span>
              <span className="text-base italic leading-tight">"{selectedCA?.questionText}"</span>
              <span className="block text-[10px] font-black text-primary pt-2 uppercase tracking-widest">{selectedCA?.locationName}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note" className="text-xs font-bold uppercase text-muted-foreground">Resolution Note</Label>
              <Textarea 
                id="note"
                placeholder="Describe how the issue was fixed..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[100px] text-sm focus:ring-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Evidence Photo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-20 w-full border-dashed flex-col gap-2 border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Camera className="h-5 w-5 text-zinc-400" />}
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Click to upload proof</span>
                </Button>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
              </div>
              
              <div className="flex gap-2 overflow-x-auto py-2">
                {resolutionPhotos.map((url, i) => (
                  <div key={i} className="relative h-20 w-20 rounded-md overflow-hidden border shadow-sm flex-shrink-0">
                    <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                    <button 
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 hover:bg-red-600 transition-colors"
                      onClick={() => setResolutionPhotos(prev => prev.filter(p => p !== url))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-muted/5 p-6 border-t border-muted/20">
            <Button variant="ghost" onClick={() => setSelectedCA(null)} className="font-black text-[11px] uppercase tracking-widest h-11 px-6">Discard</Button>
            <Button 
              onClick={handleResolve} 
              disabled={isResolving || !resolutionNote}
              className="font-black text-[11px] uppercase tracking-widest h-11 px-10 shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isResolving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Complete Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
