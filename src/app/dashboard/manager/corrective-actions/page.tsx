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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Corrective Actions</h2>
          <p className="text-muted-foreground">Monitor and resolve issues identified during audits.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by question or location..."
              className="pl-8 bg-zinc-50 border-zinc-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <Card className="px-3 py-1.5 flex items-center gap-2 border-muted shadow-none">
               <span className="text-xs font-bold text-rose-600 uppercase">Attention Required:</span>
               <span className="text-sm font-black">{actions.filter(a => a.status !== 'resolved').length}</span>
             </Card>
          </div>
        </div>

        <Tabs defaultValue="open" className="space-y-6">
          <TabsList className="bg-zinc-100/50 p-1 border">
            <TabsTrigger value="open" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 font-bold text-xs uppercase tracking-wider">
              Open Issues ({openActions.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 font-bold text-xs uppercase tracking-wider">
              Resolved ({resolvedActions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {openActions.length === 0 ? (
                <Card className="col-span-full py-12 border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground bg-zinc-50/50">
                  <CheckCircle2 className="h-10 w-10 mb-4 text-emerald-500 opacity-20" />
                  <p className="font-bold uppercase text-xs tracking-widest">No Open Corrective Actions</p>
                  <p className="text-xs pt-1">Everything is compliant across your locations.</p>
                </Card>
              ) : (
                openActions.map((ca) => (
                  <Card key={ca.id} className="shadow-sm border-zinc-200 hover:border-zinc-300 transition-all group overflow-hidden">
                    <CardHeader className="pb-3 bg-zinc-50/50 border-b">
                      <div className="flex justify-between items-start mb-2">
                        {getSeverityBadge(ca.severity)}
                        <Badge variant="outline" className="text-[10px] font-bold text-rose-700 bg-rose-50 border-rose-100 italic">
                          Due {ca.deadline ? format(ca.deadline.toDate(), 'MMM d, yyyy') : 'No Date'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold text-zinc-900 group-hover:text-blue-700 transition-colors">
                        {ca.questionText}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 space-y-3">
                      <p className="text-sm text-zinc-600 leading-relaxed italic border-l-2 border-zinc-200 pl-3">
                        "{ca.description}"
                      </p>
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                          <MapPin className="h-3.5 w-3.5" /> 
                          <span className="uppercase tracking-tight">{ca.locationName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Calendar className="h-3.5 w-3.5" /> 
                          Identified {ca.createdAt ? format(ca.createdAt.toDate(), 'MMM d, h:mm a') : 'N/A'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 flex gap-2">
                      <Button 
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-xs font-black uppercase tracking-widest h-10"
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
             <div className="space-y-4">
               {resolvedActions.length === 0 ? (
                 <Card className="py-12 border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground bg-zinc-50/50">
                    <p className="font-bold uppercase text-xs tracking-widest">No Resolved Issues Found</p>
                 </Card>
               ) : (
                 <div className="grid gap-4">
                  {resolvedActions.map((ca) => (
                    <Card key={ca.id} className="shadow-sm border-emerald-100 flex flex-col md:flex-row overflow-hidden bg-emerald-50/10">
                      <div className="p-4 md:w-3/4 border-b md:border-b-0 md:border-r border-zinc-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved</span>
                          <span className="text-[10px] text-zinc-400 font-mono ml-auto">
                            ID: {ca.id.substring(0, 8)}
                          </span>
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-1">{ca.questionText}</h4>
                        <p className="text-xs text-zinc-500 mb-3">{ca.locationName}</p>
                        
                        <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100">
                          <p className="text-xs font-bold uppercase text-zinc-400 mb-1">Resolution Note</p>
                          <p className="text-sm text-zinc-700 italic">"{ca.resolutionNote || 'No notes provided.'}"</p>
                        </div>
                      </div>
                      <div className="p-4 md:w-1/4 bg-zinc-50/30 flex flex-col justify-center gap-3">
                         <div className="text-center">
                            <p className="text-[10px] font-bold uppercase text-zinc-400">Resolved On</p>
                            <p className="text-xs font-black text-zinc-900">{ca.resolvedAt ? format(ca.resolvedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</p>
                         </div>
                         {ca.resolutionPhotoUrls && ca.resolutionPhotoUrls.length > 0 && (
                           <div className="flex justify-center gap-1">
                             {ca.resolutionPhotoUrls.map((url, i) => (
                               <div key={i} className="h-10 w-10 rounded border overflow-hidden bg-white">
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
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <CheckCircle className="h-5 w-5" /> Resolve Issue
            </DialogTitle>
            <DialogDescription className="font-medium text-zinc-900">
              {selectedCA?.questionText} 
              <span className="block text-xs font-normal text-muted-foreground pt-1">at {selectedCA?.locationName}</span>
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

          <DialogFooter className="bg-zinc-50/50 p-4 -m-6 mt-4">
            <Button variant="ghost" onClick={() => setSelectedCA(null)} className="font-bold text-xs uppercase h-10">Discard</Button>
            <Button 
              onClick={handleResolve} 
              disabled={isResolving || !resolutionNote}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-widest h-10 px-8 shadow-md"
            >
              {isResolving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <CheckCircle className="h-4 w-4 mr-2" />}
              Complete Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
