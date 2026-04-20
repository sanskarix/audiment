'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Camera,
  Video,
  StopCircle,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  ChevronRight,
  Clock,
  MapPin,
  AlertCircle,
  Check,
  ArrowLeft,
  Zap,
  History,
  Play,
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuthSync } from '@/components/AuthProvider';
import { format } from 'date-fns';

type Step = 'location' | 'video' | 'review' | 'selfie' | 'submitting' | 'success';

const STEPS: { id: Step; label: string; description: string }[] = [
  { id: 'location', label: 'Site', description: 'Select branch' },
  { id: 'video', label: 'Capture', description: 'Record video' },
  { id: 'review', label: 'Review', description: 'Check footage' },
  { id: 'selfie', label: 'ID Proof', description: 'Take selfie' },
  { id: 'submitting', label: 'Verify', description: 'Finalize' },
  { id: 'success', label: 'Done', description: 'Success' },
];

const StepBreadcrumb = ({ current }: { current: Step }) => {
  const currentIndex = STEPS.findIndex(s => s.id === current);
  return (
    <div className="mb-10 px-2">
      <div className="flex items-center justify-between relative">
        {/* Track background */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/40 z-0" />
        {/* Track fill */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary z-0 transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(var(--primary),0.5)]"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2.5 z-10 bg-background px-2">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center border-2 transition-all duration-300 text-[13px] font-bold shadow-sm",
                isDone
                  ? "bg-primary border-primary text-white"
                  : isActive
                    ? "bg-background border-primary text-primary ring-4 ring-primary/10"
                    : "bg-background border-border/60 text-muted-text/30"
              )}>
                {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              <div className="text-center hidden sm:block">
                <p className={cn(
                  "muted-label !text-[10px] uppercase tracking-widest leading-none",
                  isActive ? "text-primary font-bold" : isDone ? "text-heading/60" : "text-muted-text/30"
                )}>{step.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function FlashmobAuditPage() {
  const { isSynced, orgId, uid } = useAuthSync();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [publishedRequests, setPublishedRequests] = useState<any[]>([]);
  const [historyAudits, setHistoryAudits] = useState<any[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('self');
  const [viewTab, setViewTab] = useState<'assigned' | 'history'>('assigned');
  const [showWizard, setShowWizard] = useState(false);

  const [step, setStep] = useState<Step>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const recordingStreamRef = useRef<MediaStream | null>(null);
  const selfieStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSynced || !uid) return;
    const fetchUserData = async () => {
      try {
        const d = await getDoc(doc(db, 'users', uid));
        if (d.exists()) {
          const data = d.data();
          setUserData(data);
          if (data?.hasFlashmobAccess === false) setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [uid, isSynced]);

  useEffect(() => {
    if (!isSynced || !orgId) return;
    async function fetchLocations() {
      try {
        const q = query(collection(db, 'locations'), where('organizationId', '==', orgId));
        const snap = await getDocs(q);
        setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchLocations();
  }, [orgId, isSynced]);

  useEffect(() => {
    if (!isSynced || !orgId || !uid) return;
    async function fetchPublishedRequests() {
      try {
        const qReq = query(
          collection(db, 'flashmobAuditRequests'),
          where('organizationId', '==', orgId),
          where('auditorId', '==', uid),
          where('status', '==', 'published')
        );
        const snap = await getDocs(qReq);
        const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        reqs.sort((a: any, b: any) => {
          const da = a?.deadlineAt?.toDate ? a.deadlineAt.toDate().getTime() : Number.MAX_SAFE_INTEGER;
          const db = b?.deadlineAt?.toDate ? b.deadlineAt.toDate().getTime() : Number.MAX_SAFE_INTEGER;
          if (da !== db) return da - db;
          const pa = a?.publishedAt?.toDate ? a.publishedAt.toDate().getTime() : 0;
          const pb = b?.publishedAt?.toDate ? b.publishedAt.toDate().getTime() : 0;
          return pb - pa;
        });
        setPublishedRequests(reqs);
      } catch (err) {
        console.error('Failed to fetch published flashmob requests:', err);
      }
    }
    fetchPublishedRequests();
  }, [isSynced, orgId, uid]);

  useEffect(() => {
    if (!isSynced || !orgId || !uid) return;
    async function fetchHistoryAudits() {
      try {
        const qAud = query(
          collection(db, 'flashmobAudits'),
          where('organizationId', '==', orgId),
          where('auditorId', '==', uid)
        );
        const snap = await getDocs(qAud);
        const audits = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        audits.sort((a: any, b: any) => {
          const ta = a?.submittedAt?.toDate ? a.submittedAt.toDate().getTime() : 0;
          const tb = b?.submittedAt?.toDate ? b.submittedAt.toDate().getTime() : 0;
          return tb - ta;
        });
        setHistoryAudits(audits);
      } catch (err) {
        console.error('Failed to fetch flashmob history:', err);
      }
    }
    fetchHistoryAudits();
  }, [isSynced, orgId, uid]);

  useEffect(() => {
    return () => {
      recordingStreamRef.current?.getTracks().forEach(t => t.stop());
      selfieStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const recordingVideoCallbackRef = useCallback((videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    const attachStream = async () => {
      try {
        if (!recordingStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
          recordingStreamRef.current = stream;
        }
        videoEl.srcObject = recordingStreamRef.current;
        try {
          await videoEl.play();
        } catch (playErr: any) {
          if (playErr.name !== 'AbortError') {
            console.error('Video play error:', playErr);
          }
        }
      } catch (err) {
        console.error('Recording camera error:', err);
      }
    };
    attachStream();
  }, []);

  const selfieVideoCallbackRef = useCallback((videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    const attachStream = async () => {
      try {
        recordingStreamRef.current?.getTracks().forEach(t => t.stop());
        recordingStreamRef.current = null;

        if (!selfieStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'user' } },
            audio: false
          });
          selfieStreamRef.current = stream;
        }
        videoEl.srcObject = selfieStreamRef.current;
        try {
          await videoEl.play();
        } catch (playErr: any) {
          if (playErr.name !== 'AbortError') {
            console.error('Selfie play error:', playErr);
          }
        }
      } catch (err) {
        console.error('Selfie camera error:', err);
      }
    };
    attachStream();
  }, []);

  const stopRecordingCamera = () => {
    recordingStreamRef.current?.getTracks().forEach(track => track.stop());
    recordingStreamRef.current = null;
  };

  const startRecording = () => {
    if (!recordingStreamRef.current) return;

    const pickMime = () => {
      if (typeof MediaRecorder === 'undefined') return undefined;
      const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
      return candidates.find(t => MediaRecorder.isTypeSupported(t));
    };

    chunksRef.current = [];
    const mimeType = pickMime();
    const recorder = mimeType
      ? new MediaRecorder(recordingStreamRef.current, { mimeType })
      : new MediaRecorder(recordingStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, mimeType ? { type: mimeType } : undefined);
      setVideoBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
      setStep('review');
    };

    recorder.start(100);
    setRecording(true);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false);
            stopRecordingCamera();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      stopRecordingCamera();
    }
  };

  const takeSelfie = () => {
    const videoEl = document.querySelector<HTMLVideoElement>('#selfie-video-el');
    if (!videoEl || !selfieStreamRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoEl, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setSelfieBlob(blob);
          setSelfieUrl(URL.createObjectURL(blob));
          selfieStreamRef.current?.getTracks().forEach(track => track.stop());
          selfieStreamRef.current = null;
          setStep('submitting');
        }
      }, 'image/jpeg');
    }
  };

  const handleSubmit = async () => {
    if (!videoBlob || !selfieBlob || !orgId || !uid || !selectedLocation) return;
    setSaving(true);
    try {
      let latitude = 0, longitude = 0;
      try {
        const pos: any = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } catch (e) { console.warn('Geo failed'); }

      const videoFormData = new FormData();
      videoFormData.append('file', videoBlob, 'flashmob_video.webm');
      const vRes = await fetch('/api/upload', { method: 'POST', body: videoFormData });
      if (vRes.status === 0) return;
      const vData = await vRes.json();
      if (!vRes.ok) throw new Error(vData.error || 'Video upload failed');

      const selfieFormData = new FormData();
      selfieFormData.append('file', selfieBlob, 'selfie.jpg');
      const sRes = await fetch('/api/upload', { method: 'POST', body: selfieFormData });
      if (sRes.status === 0) return;
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData.error || 'Selfie upload failed');

      const location = locations.find(l => l.id === selectedLocation);
      const sourceRequest = selectedRequestId !== 'self'
        ? publishedRequests.find(r => r.id === selectedRequestId)
        : null;

      const auditRef = await addDoc(collection(db, 'flashmobAudits'), {
        organizationId: orgId,
        locationId: selectedLocation,
        locationName: location?.name || 'Unknown',
        auditorId: uid,
        auditorName: userData?.name || 'Anonymous',
        videoUrl: vData.url,
        selfieUrl: sData.url,
        latitude, longitude,
        isVisibleToManager: false,
        submittedAt: serverTimestamp(),
        visibleTo: [uid],
        publishedRequestId: sourceRequest?.id || null,
        publishedByAdminId: sourceRequest?.publishedByAdminId || null,
        publicationType: sourceRequest ? 'published' : 'self'
      });

      if (sourceRequest?.id) {
        await updateDoc(doc(db, 'flashmobAuditRequests', sourceRequest.id), {
          status: 'completed',
          completedAt: serverTimestamp(),
          completedAuditId: auditRef.id
        });
      }
      setStep('success');
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Flashmob submission failed:', err);
    } finally { setSaving(false); }
  };

  const enterWizard = (requestId: string, locationId?: string, startStep: Step = 'location') => {
    setSelectedRequestId(requestId);
    if (locationId) setSelectedLocation(locationId);
    else setSelectedLocation('');
    setStep(startStep);
    setVideoBlob(null);
    setVideoUrl(null);
    setSelfieBlob(null);
    setSelfieUrl(null);
    setShowWizard(true);
  };

  if (loading) {
    return (
      <DashboardShell role="auditor">
        <div className="dashboard-page-container max-w-2xl mx-auto">
          <div className="flex flex-col gap-4 mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (userData && !userData.hasFlashmobAccess) {
    return (
      <DashboardShell role="auditor">
        <div className="dashboard-page-container max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="section-heading mb-2">Verification Restricted</h2>
          <p className="body-text text-muted-text/60 max-w-xs mb-8">
            Your account does not have permission to perform flashmob audits. Please contact support.
          </p>
          <Button variant="outline" className="h-11 px-6 border-border/50" onClick={() => router.push('/dashboard/auditor')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardShell>
    );
  }

  // ── Landing view ──────────────────────────────────────────────────────────
  if (!showWizard) {
    return (
      <DashboardShell role="auditor">
        <div className="dashboard-page-container max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="page-header-section mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="page-heading">Verification Tasks</h1>
              <p className="body-text text-muted-text">Complete assigned site check-ins and review history.</p>
            </div>
            <Button
              className="h-11 px-6 gap-2 bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              onClick={() => enterWizard('self')}
            >
              <Zap className="h-4 w-4" />
              Self Audit
            </Button>
          </div>

          <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as any)}>
            <TabsList className="bg-muted/40 border border-border/40 p-1 mb-6">
              <TabsTrigger value="assigned" className="px-6 body-text rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Active Assignments
                {publishedRequests.length > 0 && (
                  <Badge className="ml-2 bg-primary text-white border-none py-0 px-1.5 h-4 min-w-[16px] flex items-center justify-center text-[9px] font-bold">
                    {publishedRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="px-6 body-text rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {publishedRequests.length === 0 ? (
                <div className="standard-card flex flex-col items-center justify-center py-20 text-center border-dashed">
                  <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                    <Video className="h-7 w-7 text-muted-text/20" />
                  </div>
                  <h3 className="section-heading text-heading/70">No pending assignments</h3>
                  <p className="body-text text-muted-text/60 mt-1 mb-6">You're all caught up! You can still start a self-check-in below.</p>
                  <Button variant="outline" className="h-11 px-6 border-border/50" onClick={() => enterWizard('self')}>
                    Start Self Audit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedRequests.map((r) => {
                    const deadline = r?.deadlineAt?.toDate ? r.deadlineAt.toDate() : null;
                    const isUrgent = deadline && deadline.getTime() - Date.now() < 12 * 3600 * 1000;
                    return (
                      <div key={r.id} className="standard-card p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors",
                            isUrgent ? "bg-destructive/5 border-destructive/20 text-destructive" : "bg-primary/5 border-primary/20 text-primary"
                          )}>
                            <Zap className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="section-heading truncate mb-0.5">{r.locationName}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-muted-text">
                              <span className="body-text flex items-center gap-1.5 opacity-70">
                                <Clock className="h-3.5 w-3.5" />
                                {deadline ? `Due ${format(deadline, 'h:mm a, MMM d')}` : 'No deadline'}
                              </span>
                              {isUrgent && (
                                <Badge className="bg-destructive/10 text-destructive border-none text-[10px] uppercase tracking-tighter font-bold py-0 h-4">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="h-11 px-6 gap-2 bg-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all active:scale-95"
                          onClick={() => enterWizard(r.id, r.locationId, 'video')}
                        >
                          Start <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {historyAudits.length === 0 ? (
                <div className="standard-card flex flex-col items-center justify-center py-20 text-center border-dashed">
                  <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                    <History className="h-7 w-7 text-muted-text/20" />
                  </div>
                  <h3 className="section-heading text-heading/70">No verification history</h3>
                  <p className="body-text text-muted-text/60 mt-1">Check-ins you complete will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyAudits.map((a) => {
                    const submitted = a?.submittedAt?.toDate ? a.submittedAt.toDate() : null;
                    const isSelf = !a?.publishedRequestId;
                    return (
                      <div key={a.id} className="standard-card p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-12 w-12 rounded-2xl bg-success/5 border border-success/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-6 w-6 text-success" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="section-heading truncate mb-0.5">{a.locationName}</h3>
                            <div className="flex items-center gap-3 text-muted-text">
                              <span className="body-text opacity-70">{submitted ? format(submitted, 'PPP p') : 'Unknown time'}</span>
                              <Badge variant="outline" className={cn(
                                "text-[10px] py-0 h-4 px-2 tracking-widest uppercase font-bold",
                                isSelf ? "bg-muted/40 text-muted-text/60 border-border/40" : "bg-primary/5 text-primary border-primary/20"
                              )}>
                                {isSelf ? 'Self' : 'Assigned'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    );
  }

  // ── Wizard view ───────────────────────────────────────────────────────────
  const selectedLocationName = locations.find(l => l.id === selectedLocation)?.name;

  return (
    <DashboardShell role="auditor">
      <div className="dashboard-page-container max-w-2xl mx-auto animate-in fade-in duration-700">

        {/* Wizard Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowWizard(false)}
              className="h-10 w-10 rounded-xl border border-border/50 flex items-center justify-center text-muted-text hover:text-heading hover:bg-muted/40 transition-all shrink-0 active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="page-heading truncate">Site Verification</h1>
              <p className="body-text text-muted-text italic">
                {selectedLocationName ? `Arrived at ${selectedLocationName}` : 'Preparing audit evidence...'}
              </p>
            </div>
          </div>
        </div>

        {/* Step Breadcrumb */}
        <StepBreadcrumb current={step} />

        {/* Step Content */}
        <div className="mt-4">
          {/* STEP 1: SITE SELECTION */}
          {step === 'location' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="standard-card p-6 divide-y divide-border/40">
                <div className="pb-6">
                  <h3 className="section-heading mb-4">Location & Source</h3>
                  <div className="space-y-4">
                    {publishedRequests.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-body font-normal">Active Assignment</Label>
                        <Select
                          value={selectedRequestId}
                          onValueChange={(val) => {
                            setSelectedRequestId(val);
                            if (val === 'self') setSelectedLocation('');
                            else {
                              const r = publishedRequests.find(req => req.id === val);
                              if (r) setSelectedLocation(r.locationId);
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 border-border/50 focus:ring-primary/20 shadow-sm">
                            <SelectValue placeholder="Request context" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self">No specific assignment (Self Audit)</SelectItem>
                            {publishedRequests.map(r => (
                              <SelectItem key={r.id} value={r.id}>{r.locationName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-body font-normal">Select Site</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="h-11 border-border/50 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Where are you right now?" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(l => (
                            <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    className="w-full h-11 px-8 bg-primary shadow-lg shadow-primary/20 rounded-md active:scale-95 transition-all text-[15px] font-semibold gap-2"
                    disabled={!selectedLocation}
                    onClick={() => setStep('video')}
                  >
                    Confirm Arrived <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VIDEO RECORDING */}
          {step === 'video' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="standard-card p-0 overflow-hidden ring-1 ring-border/40 shadow-2xl">
                <div className="p-5 border-b border-border/40 flex justify-between items-center bg-muted/5">
                  <h3 className="section-heading">Arrived: {selectedLocationName}</h3>
                  <Badge className="bg-destructive text-white border-none py-1 h-5 animate-pulse text-[10px] font-bold tracking-widest uppercase">
                    REC: {countdown}s
                  </Badge>
                </div>
                
                <div className="relative aspect-video bg-black">
                  <video
                    ref={recordingVideoCallbackRef}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none" />
                </div>

                <div className="p-8 flex flex-col items-center gap-6 bg-background">
                  <div className="text-center space-y-1">
                    <p className="section-heading">Arrived Feed</p>
                    <p className="body-text text-muted-text">Record a 360° pan of the site entrance.</p>
                  </div>

                  {!recording ? (
                    <button
                      className="h-20 w-20 rounded-full border-[6px] border-muted/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
                      onClick={startRecording}
                    >
                      <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center shadow-lg shadow-destructive/20 group-hover:scale-90 transition-transform">
                        <Play className="h-5 w-5 fill-white text-white translate-x-0.5" />
                      </div>
                    </button>
                  ) : (
                    <button
                      className="h-20 w-20 rounded-full border-[6px] border-destructive/20 flex items-center justify-center transition-all active:scale-95 group"
                      onClick={stopRecording}
                    >
                      <div className="h-10 w-10 rounded-sm bg-destructive flex items-center justify-center shadow-lg shadow-destructive/10 animate-pulse" />
                    </button>
                  )}

                  <p className="muted-label tracking-widest text-[10px] uppercase font-bold">
                    {recording ? 'Recording in progress...' : 'Tap for start pan'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 'review' && videoUrl && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="standard-card p-0 overflow-hidden ring-1 ring-border/40 shadow-2xl">
                <div className="p-5 border-b border-border/40 flex justify-between items-center bg-muted/5">
                  <h3 className="section-heading">Verify Footage</h3>
                  <Badge className="bg-success text-white border-none py-1 h-5 text-[10px] font-bold tracking-widest uppercase">
                    Captured
                  </Badge>
                </div>
                <div className="aspect-video bg-black">
                  <video src={videoUrl} controls autoPlay loop className="h-full w-full" />
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-11 px-6 border-border/50 text-muted-text active:scale-95 transition-transform gap-2"
                    onClick={() => setStep('video')}
                  >
                    <RefreshCw className="h-4 w-4" /> Retake Pan
                  </Button>
                  <Button
                    className="h-11 px-6 bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-transform gap-2"
                    onClick={() => setStep('selfie')}
                  >
                    Looks Good <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SELFIE */}
          {step === 'selfie' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="standard-card p-8 flex flex-col items-center">
                <h3 className="section-heading mb-2">Auditor ID Proof</h3>
                <p className="body-text text-muted-text mb-10 max-w-[280px]">Take a clear selfie on-site to verify your identity.</p>

                <div className="relative mb-10 group">
                  <div className="h-64 w-64 rounded-[40px] overflow-hidden border-4 border-primary/20 ring-8 ring-primary/5 shadow-2xl bg-black">
                    <video
                      id="selfie-video-el"
                      ref={selfieVideoCallbackRef}
                      muted
                      playsInline
                      className="h-full w-full object-cover scale-x-[-1]"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-[40px] border-2 border-dashed border-white/10 pointer-events-none" />
                </div>

                <Button
                  className="h-12 w-12 rounded-full bg-primary shadow-xl shadow-primary/30 p-0 active:scale-90 transition-transform mb-4"
                  onClick={takeSelfie}
                >
                  <Camera className="h-6 w-6" />
                </Button>
                <p className="muted-label uppercase tracking-widest text-[10px] font-bold">Tap to capture</p>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL SUBMIT */}
          {step === 'submitting' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="standard-card p-0 overflow-hidden shadow-2xl">
                  <div className="p-6 text-center border-b border-border/40">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                      <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="section-heading">Final Verification</h3>
                    <p className="body-text text-muted-text">Encryption in progress. Review and upload.</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary opacity-60" />
                        <span className="body-text font-bold text-heading truncate max-w-[180px]">{selectedLocationName}</span>
                      </div>
                      <Badge className="bg-success text-white border-none py-0.5 h-4 text-[9px] font-bold uppercase tracking-widest">Verified</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 h-32">
                      <div className="standard-card p-0 relative overflow-hidden bg-black rounded-xl">
                        {videoUrl && <video src={videoUrl} className="h-full w-full object-cover opacity-60" muted loop autoPlay />}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-[9px] font-bold uppercase tracking-wider text-center">Video Proof</p>
                        </div>
                      </div>
                      <div className="standard-card p-0 relative overflow-hidden bg-muted rounded-xl">
                        {selfieUrl && <Image src={selfieUrl} alt="Selfie" fill className="object-cover opacity-80" />}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-[9px] font-bold uppercase tracking-wider text-center">ID Proof</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full h-11 px-8 bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-all text-[15px] font-bold gap-2"
                      disabled={saving}
                      onClick={handleSubmit}
                    >
                      {saving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Publishing Log...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Finalize & Submit
                        </>
                      )}
                    </Button>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === 'success' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500 text-center">
              <div className="standard-card p-12 flex flex-col items-center">
                <div className="h-20 w-20 rounded-3xl bg-success/10 border border-success/20 flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-success" strokeWidth={3} />
                </div>
                <h1 className="page-heading mb-2">Audit Published</h1>
                <p className="body-text text-muted-text mb-10 max-w-xs">Site verification successfully logged and shared with your administrator.</p>
                
                <div className="w-full space-y-3">
                  <Button
                    className="w-full h-11 bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-all font-bold"
                    onClick={() => {
                      setShowWizard(false);
                      setViewTab('history');
                    }}
                  >
                    View History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-border/50 text-muted-text active:scale-95 transition-all"
                    onClick={() => setShowWizard(false)}
                  >
                    Back to Assignments
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
