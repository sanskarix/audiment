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
  getDoc
} from 'firebase/firestore';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
  Play,
  Check,
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Step = 'location' | 'video' | 'review' | 'selfie' | 'submitting' | 'success';

const STEPS: { id: Step; label: string; description: string }[] = [
  { id: 'location', label: 'Location', description: 'Select branch' },
  { id: 'video', label: 'Video', description: 'Record video' },
  { id: 'review', label: 'Review', description: 'Check footage' },
  { id: 'selfie', label: 'Selfie', description: 'Take selfie' },
  { id: 'submitting', label: 'Submit', description: 'Finalize' },
  { id: 'success', label: 'Done', description: 'Success' },
];

const StepBreadcrumb = ({ current }: { current: Step }) => {
  const currentIndex = STEPS.findIndex(s => s.id === current);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-border/40 z-0" />
        <div
          className="absolute top-5 left-0 h-px bg-primary z-0 transition-all duration-700"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10 bg-background px-1">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-semibold text-sm",
                isDone ? "bg-primary border-primary text-white" :
                  isActive ? "bg-background border-primary text-primary shadow-md shadow-primary/20" :
                    "bg-background border-border/40 text-muted-text/40"
              )}>
                {isDone ? <Check className="h-5 w-5" /> : <span>{i + 1}</span>}
              </div>
              <div className="text-center hidden sm:block">
                <p className={cn(
                  "text-[11px] font-semibold leading-tight",
                  isActive ? "text-primary" : isDone ? "text-heading" : "text-muted-text/40"
                )}>{step.label}</p>
                <p className={cn(
                  "text-[10px] leading-tight mt-0.5",
                  isActive || isDone ? "text-muted-text" : "text-muted-text/30"
                )}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function FlashmobAuditPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [session, setSession] = useState<{ orgId: string, uid: string, name: string } | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  const [step, setStep] = useState<Step>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const recordingStreamRef = useRef<MediaStream | null>(null);
  const selfieStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(20);

  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId, uid: data.uid, name: data.name });
      } catch (e) { setLoading(false); }
    } else { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;
    const fetchUserData = async () => {
      try {
        const d = await getDoc(doc(db, 'users', session.uid));
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
  }, [session]);

  useEffect(() => {
    if (!session?.orgId) return;
    async function fetchLocations() {
      try {
        const q = query(collection(db, 'locations'), where('organizationId', '==', session?.orgId));
        const snap = await getDocs(q);
        setLocations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchLocations();
  }, [session]);

  // Cleanup all streams on unmount
  useEffect(() => {
    return () => {
      recordingStreamRef.current?.getTracks().forEach(t => t.stop());
      selfieStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Callback ref: fires the instant the recording video element mounts into the DOM
  const recordingVideoCallbackRef = useCallback((videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    // Get stream (or acquire it first)
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
        // Catch and handle the potential AbortError if the play request is interrupted
        try {
          await videoEl.play();
        } catch (playErr: any) {
          if (playErr.name !== 'AbortError') {
            console.error('Video play error:', playErr);
          }
        }
      } catch (err) {
        console.error('Recording camera error:', err);
        alert('Could not access camera. Please allow camera permissions and try again.');
      }
    };
    attachStream();
  }, []);

  // Callback ref: fires the instant the selfie video element mounts into the DOM
  const selfieVideoCallbackRef = useCallback((videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    const attachStream = async () => {
      try {
        // Stop recording stream first
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
        // Catch and handle the potential AbortError if the play request is interrupted
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
    if (!recordingStreamRef.current) {
      alert('Camera is not ready yet. Please wait a moment and try again.');
      return;
    }

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
    setCountdown(20);

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
    if (!videoBlob || !selfieBlob || !session || !selectedLocation) return;
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
      const vData = await vRes.json();
      if (!vRes.ok) throw new Error(vData.error || 'Video upload failed');

      const selfieFormData = new FormData();
      selfieFormData.append('file', selfieBlob, 'selfie.jpg');
      const sRes = await fetch('/api/upload', { method: 'POST', body: selfieFormData });
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData.error || 'Selfie upload failed');

      const location = locations.find(l => l.id === selectedLocation);
      await addDoc(collection(db, 'flashmobAudits'), {
        organizationId: session.orgId,
        locationId: selectedLocation,
        locationName: location?.name || 'Unknown',
        auditorId: session.uid,
        auditorName: session.name || 'Anonymous',
        videoUrl: vData.url,
        selfieUrl: sData.url,
        latitude, longitude,
        submittedAt: serverTimestamp(),
        visibleTo: [session.uid]
      });
      setStep('success');
    } catch (err) {
      console.error('Flashmob submission failed:', err);
      alert('Submission failed. Check your connection.');
    } finally { setSaving(false); }
  };

  const selectedLocationName = locations.find(l => l.id === selectedLocation)?.name;

  if (loading) {
    return (
      <DashboardShell role="Auditor">
        <div className="dashboard-page-container max-w-2xl mx-auto px-6 md:px-10 pb-32">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-10" />
          <Skeleton className="h-14 w-full rounded-xl mb-6" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </DashboardShell>
    );
  }

  if (userData && !userData.hasFlashmobAccess) {
    return (
      <DashboardShell role="Auditor">
        <div className="max-w-md mx-auto mt-20 px-6">
          <Card className="standard-card">
            <CardHeader className="text-center pb-4 pt-8">
              <div className="mx-auto bg-destructive/10 h-12 w-12 rounded-full flex items-center justify-center mb-4 border border-destructive/20">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-heading font-semibold">Access Restricted</CardTitle>
              <CardDescription className="body-text font-normal mt-1">
                You don't have permission to conduct flashmob audits. Contact your administrator.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <Button className="w-full" onClick={() => router.push('/dashboard/auditor')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Auditor">
      <div className="dashboard-page-container max-w-2xl mx-auto px-6 md:px-10 pb-20">

        {/* Header */}
        <div className="page-header-section mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="page-heading">Flash Audit</h1>
            <p className="body-text">Record video and photo proof for location verification.</p>
          </div>
        </div>

        {/* Step breadcrumb */}
        <StepBreadcrumb current={step} />

        {/* ── Step 1: Location ─────────────────────────────── */}
        {step === 'location' && (
          <Card className="standard-card border-border/40">
            <div className="p-6 border-b border-border/40 bg-muted/5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="section-heading">Location</h3>
                <p className="body-text text-[12px]">Select the branch for this audit.</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl text-[14px]">
                  <SelectValue placeholder="Choose a location…" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {locations.length === 0 ? (
                    <SelectItem value="none" disabled>No locations configured</SelectItem>
                  ) : (
                    locations.map(l => (
                      <SelectItem key={l.id} value={l.id} className="text-[14px]">
                        {l.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {selectedLocation && selectedLocation !== 'none' && (
                <div className="flex items-center gap-2 text-[12px] text-success font-medium p-3 bg-success/5 border border-success/20 rounded-xl">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span><strong>{selectedLocationName}</strong> selected</span>
                </div>
              )}

              <Button
                className="w-full h-12 font-semibold rounded-xl"
                disabled={!selectedLocation || selectedLocation === 'none'}
                onClick={() => { 
                  setStep('video'); 
                }}
              >
                Continue to Recording <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: Video ─────────────────────────────────── */}
        {step === 'video' && (
          <Card className="standard-card border-border/40">
            <div className="p-6 border-b border-border/40 bg-muted/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="section-heading">Video Recording</h3>
                  <p className="body-text text-[12px]">Record a 20-second video of the surroundings.</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Viewfinder — callback ref attaches stream the moment this element mounts */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-border/50 ring-1 ring-border/20 shadow-2xl">
                <video
                  ref={recordingVideoCallbackRef}
                  muted
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Overlays */}
                <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Live Feed</span>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-bold tabular-nums transition-all duration-300",
                    recording
                      ? "bg-destructive text-white border-destructive shadow-lg shadow-destructive/20 scale-110"
                      : "bg-black/40 border-white/10 text-white/80"
                  )}>
                    <Clock className={cn("h-3.5 w-3.5", recording && "animate-pulse")} />
                    0:{countdown.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
                  <div className="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
                  <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
                  <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
                </div>
              </div>

              {/* Record / Stop button */}
              <div className="flex flex-col items-center gap-4 py-2">
                {!recording ? (
                  <button
                    className="group relative h-20 w-20 flex items-center justify-center transition-all active:scale-95"
                    onClick={startRecording}
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-muted/20 scale-100 group-hover:scale-110 transition-transform" />
                    <div className="h-16 w-16 rounded-full bg-destructive flex items-center justify-center shadow-xl shadow-destructive/20 ring-4 ring-background">
                       <div className="h-6 w-6 rounded-full bg-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>
                  </button>
                ) : (
                  <button
                    className="group relative h-20 w-20 flex items-center justify-center transition-all active:scale-95"
                    onClick={stopRecording}
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-destructive/20 animate-ping opacity-25" />
                    <div className="h-16 w-16 rounded-full bg-background border-2 border-destructive flex items-center justify-center shadow-xl shadow-destructive/10 ring-4 ring-background">
                       <StopCircle className="h-8 w-8 text-destructive fill-destructive" />
                    </div>
                  </button>
                )}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[12px] font-semibold text-heading uppercase tracking-widest">
                    {recording ? 'Stop Recording' : 'Start Recording'}
                  </p>
                  <p className="text-[10px] text-muted-text/60">
                    {recording ? `Autosaves in ${countdown}s` : 'Max duration: 20 seconds'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 3: Review ────────────────────────────────── */}
        {step === 'review' && videoUrl && (
          <Card className="standard-card border-border/40">
            <div className="p-6 border-b border-border/40 bg-muted/5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="section-heading">Review Video</h3>
                <p className="body-text text-[12px]">Check the video quality before proceeding.</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-border/40">
                <video src={videoUrl} className="h-full w-full object-cover" controls autoPlay loop />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 font-semibold rounded-xl border-border/50 text-muted-text hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all"
                  onClick={() => { 
                    setVideoUrl(null); 
                    setVideoBlob(null); 
                    setStep('video'); 
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake
                </Button>
                <Button
                  className="h-12 font-semibold rounded-xl"
                  onClick={() => { 
                    setStep('selfie'); 
                  }}
                >
                  Looks Good <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 4: Selfie ────────────────────────────────── */}
        {step === 'selfie' && (
          <Card className="standard-card border-border/40">
            <div className="p-6 border-b border-border/40 bg-muted/5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Camera className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="section-heading">Identity Verification</h3>
                <p className="body-text text-[12px]">Take a selfie to confirm your presence.</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Circular viewfinder — callback ref attaches stream the moment this element mounts */}
              <div className="flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="h-56 w-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl bg-black">
                    <video
                      id="selfie-video-el"
                      ref={selfieVideoCallbackRef}
                      muted
                      playsInline
                      controls={false}
                      className="h-full w-full object-cover scale-x-[-1]"
                    />
                  </div>
                  {/* Face guide ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 pointer-events-none" />
                </div>
                <p className="text-[12px] text-muted-text text-center">Centre your face in the circle, then tap the button.</p>
              </div>

              <Button
                size="lg"
                className="w-full h-13 font-semibold rounded-xl shadow-lg shadow-primary/10"
                onClick={takeSelfie}
              >
                <Camera className="mr-2 h-5 w-5" /> Capture Photo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Step 5: Submit ────────────────────────────────── */}
        {step === 'submitting' && (
          <Card className="standard-card border-border/40">
            <div className="p-6 border-b border-border/40 bg-muted/5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <UploadCloud className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="section-heading">Final Submission</h3>
                <p className="body-text text-[12px]">Review your details and submit the audit.</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">

              {/* Summary card */}
              <div className="rounded-xl bg-muted/5 border border-border/40 divide-y divide-border/40">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12px] text-muted-text font-medium flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 opacity-50" /> Location
                  </span>
                  <span className="text-[13px] font-semibold text-heading">
                    {locations.find(l => l.id === selectedLocation)?.name || '–'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12px] text-muted-text font-medium flex items-center gap-2">
                    <Video className="h-3.5 w-3.5 opacity-50" /> Video
                  </span>
                  <Badge variant="secondary" className="bg-success/10 text-success border-none text-[11px] font-semibold">
                    <CheckCircle2 className="mr-1.5 h-3 w-3" /> Captured
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12px] text-muted-text font-medium flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5 opacity-50" /> Selfie
                  </span>
                  {selfieUrl ? (
                    <div className="flex items-center gap-2">
                      <Image src={selfieUrl} alt="Selfie" width={32} height={32} className="h-8 w-8 rounded-full object-cover border border-border/40" />
                      <Badge variant="secondary" className="bg-success/10 text-success border-none text-[11px] font-semibold">
                        <CheckCircle2 className="mr-1.5 h-3 w-3" /> Taken
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="bg-warning/10 text-warning border-none text-[11px]">Missing</Badge>
                  )}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-13 font-semibold shadow-lg shadow-primary/10 rounded-xl"
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-5 w-5" /> Submit Verification
                  </>
                )}
              </Button>

              <p className="text-[11px] text-muted-text text-center">
                Your video and selfie will be uploaded securely and shared with admins.
              </p>
            </CardContent>
          </Card>
        )}
        {step === 'success' && (
          <Card className="standard-card border-border/40 overflow-hidden">
            <div className="p-12 text-center bg-success/5 border-b border-border/40">
              <div className="mx-auto bg-success/10 h-20 w-20 rounded-full flex items-center justify-center mb-6 border border-success/20">
                <Check className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-heading mb-2">Audit Submitted</h3>
              <p className="body-text">Your flash audit has been successfully logged.</p>
            </div>
            <CardContent className="p-10 space-y-4">
              <Button
                size="lg"
                className="w-full h-13 font-semibold rounded-xl"
                onClick={() => router.push('/dashboard/auditor/history')}
              >
                Go to History
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-13 font-semibold rounded-xl"
                onClick={() => {
                  setSelectedLocation('');
                  setVideoBlob(null);
                  setVideoUrl(null);
                  setSelfieBlob(null);
                  setSelfieUrl(null);
                  setStep('location');
                }}
              >
                Start Another Audit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
