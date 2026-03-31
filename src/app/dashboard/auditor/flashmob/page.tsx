'use client';

import { useState, useEffect, useRef } from 'react';
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
  onSnapshot
} from 'firebase/firestore';
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
  Loader2,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex gap-1.5 mb-10">
    {Array.from({ length: total }).map((_, i) => (
      <div 
        key={i} 
        className={cn(
          "h-1 rounded-full transition-all duration-500",
          i < current ? "w-8 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "w-2 bg-muted-foreground/20"
        )} 
      />
    ))}
  </div>
);

export default function FlashmobAuditPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [session, setSession] = useState<{ orgId: string, uid: string, name: string } | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  const [step, setStep] = useState<'location' | 'video' | 'review' | 'selfie' | 'submitting'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Video Recording
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(20);
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Selfie
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
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', session.uid), (d) => {
      const data = d.data();
      setUserData(data);
      if (d.exists() && data?.hasFlashmobAccess === false) {
        setLoading(false);
      }
    }, (err) => {
      console.error('User profile subscription error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, [session]);

  useEffect(() => {
    if (!session?.orgId) return;

    async function fetchLocations() {
      try {
        const q = query(collection(db, 'locations'), where('organizationId', '==', session?.orgId));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLocations(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, [session]);

  // Handle Video Stream
  const startCamera = async (facingMode: 'environment' | 'user' = 'environment') => {
    try {
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: facingMode === 'environment'
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Ensure camera releases on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  // Recording Logic
  const startRecording = () => {
    if (!stream) return;

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
      setStep('review');
    };

    recorder.start(100); // collect data every 100ms for reliable chunks
    setRecording(true);
    setCountdown(20);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use recorderRef directly to avoid stale closure on `recording` state
          if (recorderRef.current && recorderRef.current.state === 'recording') {
            recorderRef.current.stop();
            setRecording(false);
            // Stop camera tracks
            recorderRef.current.stream?.getTracks().forEach(t => t.stop());
            setStream(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
      setRecording(false);
      stopCamera();
    }
  };

  const takeSelfie = () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setSelfieBlob(blob);
          setSelfieUrl(URL.createObjectURL(blob));
          stopCamera();
          setStep('submitting');
        }
      }, 'image/jpeg');
    }
  };

  const handleSubmit = async () => {
    if (!videoBlob || !selfieBlob || !session || !selectedLocation) return;
    setSaving(true);

    try {
      // 1. Get Location
      let latitude = 0, longitude = 0;
      try {
        const pos: any = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } catch (e) { console.warn('Geo failed'); }

      // 2. Upload Video
      const videoFormData = new FormData();
      videoFormData.append('file', videoBlob, 'flashmob_video.webm');
      const vRes = await fetch('/api/upload', { method: 'POST', body: videoFormData });
      const vData = await vRes.json();
      if (!vRes.ok) throw new Error(vData.error || 'Video upload failed');

      // 3. Upload Selfie
      const selfieFormData = new FormData();
      selfieFormData.append('file', selfieBlob, 'selfie.jpg');
      const sRes = await fetch('/api/upload', { method: 'POST', body: selfieFormData });
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData.error || 'Selfie upload failed');

      const location = locations.find(l => l.id === selectedLocation);

      // 4. Save to Firestore
      await addDoc(collection(db, 'flashmobAudits'), {
        organizationId: session.orgId,
        locationId: selectedLocation,
        locationName: location?.name || 'Unknown',
        auditorId: session.uid,
        auditorName: session.name || 'Anonymous',
        videoUrl: vData.url,
        selfieUrl: sData.url,
        latitude,
        longitude,
        submittedAt: serverTimestamp(),
        visibleTo: [session.uid]
      });

      router.push('/dashboard/auditor?flashmob=success');
    } catch (err) {
      console.error('Flashmob submission failed:', err);
      alert('Submission failed. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Auditor">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-heading">Loading Flashmob Tool</h3>
            <p className="text-muted-text text-sm">Please wait while we set things up...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (userData && !userData.hasFlashmobAccess) {
    return (
      <DashboardShell role="Auditor">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader className="text-center pb-4 pt-8">
              <div className="mx-auto bg-destructive/10 h-12 w-12 rounded-full flex items-center justify-center mb-4 border border-destructive/20 shadow-inner">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-heading font-medium">Access Denied</CardTitle>
              <CardDescription className="text-body font-normal">
                You do not have the required permissions for flashmob audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/auditor')}>
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
      <div className="dashboard-page-container max-w-2xl mx-auto pb-32">
        <div className="page-header-section mb-xl flex flex-col md:flex-row md:items-center gap-xl">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-10 w-10 shrink-0 md:-ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h1 className="page-heading">Field Target Intel</h1>
            </div>
            <p className="body-text">High-speed verification protocol.</p>
          </div>
        </div>

        <StepIndicator current={['location', 'video', 'review', 'selfie', 'submitting'].indexOf(step) + 1} total={5} />

        {step === 'location' && (
          <Card className="standard-card overflow-hidden">
            <div className="bg-muted/30 p-xl border-b border-border/50">
               <h3 className="section-heading flex items-center gap-2">
                 <MapPin className="h-4 w-4 text-primary" />
                 Target Identification
               </h3>
               <p className="body-text text-xs mt-1">Operational Environment</p>
            </div>
            <CardContent className="p-xl space-y-xl bg-card">
              <div className="space-y-sm">
                <Label className="text-xs font-normal uppercase tracking-widest text-muted-text">Deployment Zone</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 bg-background font-medium tracking-widest text-xs px-4 border-input focus:ring-primary/20 text-body">
                    <SelectValue placeholder="Identify your location..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.length === 0 ? (
                      <SelectItem value="none" disabled className="font-normal text-xs tracking-widest text-body">No Zones Configured</SelectItem>
                    ) : (
                      locations.map(l => <SelectItem key={l.id} value={l.id} className="font-normal text-xs tracking-widest text-body">{l.name}</SelectItem>)
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="lg"
                className="w-full text-xs font-medium uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                disabled={!selectedLocation || selectedLocation === 'none'}
                onClick={() => {
                  setStep('video');
                  startCamera('environment');
                }}
              >
                Establish Visual Link <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'video' && (
          <Card className="standard-card overflow-hidden">
            <div className="bg-muted/30 p-xl border-b border-border/50 flex items-center justify-between">
               <div>
                  <h3 className="section-heading flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    Live Transmission
                  </h3>
                  <p className="body-text text-xs mt-1">Stream verification in progress</p>
               </div>
               {recording && (
                 <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-widest animate-pulse border border-destructive/20">
                    <div className="h-2 w-2 rounded-full bg-destructive" /> RECORDING
                 </div>
               )}
            </div>
            <CardContent className="p-xl space-y-xl bg-card">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover grayscale md:grayscale-0 contrast-125"
                  autoPlay
                  muted
                  playsInline
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 border-t-2 border-l-2 border-primary/50" />
                    <div className="w-8 h-8 border-t-2 border-r-2 border-primary/50" />
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-background/80 backdrop-blur-md px-6 py-2 rounded-xl border border-white/10 flex items-center gap-3 shadow-xl">
                       <Clock className="h-4 w-4 text-primary animate-pulse" />
                       <span className="text-xl font-medium italic text-heading tabular-nums tracking-tighter">00:{countdown.toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="w-8 h-8 border-b-2 border-l-2 border-primary/50" />
                    <div className="w-8 h-8 border-b-2 border-r-2 border-primary/50" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                {!recording ? (
                  <Button 
                    size="lg" 
                    className="h-20 w-20 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center p-0 hover:scale-105 active:scale-95 transition-all" 
                    onClick={startRecording}
                  >
                    <Video className="h-8 w-8 text-primary-foreground" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    className="h-20 w-20 rounded-full shadow-lg shadow-destructive/30 flex items-center justify-center p-0 animate-pulse hover:scale-105 active:scale-95 transition-all" 
                    onClick={stopRecording}
                  >
                    <StopCircle className="h-8 w-8 text-white" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'review' && videoUrl && (
          <Card className="standard-card overflow-hidden">
            <div className="bg-muted/30 p-xl border-b border-border/50">
               <h3 className="section-heading flex items-center gap-2">
                 <RefreshCw className="h-4 w-4 text-primary" />
                 Transmission Review
               </h3>
               <p className="body-text text-xs mt-1">Validate capture quality before uplink</p>
            </div>
            <CardContent className="p-xl space-y-xl bg-card">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <video
                  src={videoUrl}
                  className="h-full w-full object-cover"
                  controls
                  autoPlay
                  loop
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <Button
                  variant="outline"
                  className="h-14 font-medium uppercase tracking-widest text-[10px] text-muted-text transition-all hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 active:scale-95"
                  onClick={() => {
                    setVideoUrl(null);
                    setVideoBlob(null);
                    setStep('video');
                    startCamera('environment');
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Discard
                </Button>
                <Button
                  className="h-14 font-medium uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setStep('selfie');
                    startCamera('user');
                  }}
                >
                  Confirm <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'selfie' && (
          <Card className="standard-card overflow-hidden">
            <div className="bg-muted/30 p-xl border-b border-border/50 text-center flex flex-col items-center">
               <h3 className="section-heading flex items-center justify-center gap-2">
                 <Camera className="h-4 w-4 text-primary" />
                 Identification Hash
               </h3>
               <p className="body-text text-xs mt-1">Capture biometric proof of presence</p>
            </div>
            <CardContent className="p-xl space-y-xl bg-card">
              <div className="relative aspect-square max-w-[400px] mx-auto bg-black rounded-full overflow-hidden border-8 border-muted/30 shadow-xl">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover grayscale"
                  autoPlay
                  muted
                  playsInline
                />
                {/* Selfie Grid Ring */}
                <div className="absolute inset-0 border-[16px] border-primary/5 rounded-full pointer-events-none" />
                <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 flex items-center justify-center p-0 transition-all hover:scale-105 active:scale-95 group" 
                  onClick={takeSelfie}
                >
                  <Camera className="h-8 w-8 text-primary-foreground group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'submitting' && (
          <Card className="standard-card overflow-hidden">
            <div className="bg-muted/30 p-12 text-center flex flex-col items-center">
               <div className="mx-auto bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mb-6 rotate-12">
                 <UploadCloud className="h-8 w-8 text-primary" />
               </div>
               <h3 className="section-heading mb-1 text-2xl">Initialize Uplink</h3>
               <p className="body-text text-xs">Transmitting field intelligence to central command</p>
            </div>
            <CardContent className="p-xl flex flex-col items-center justify-center space-y-xl bg-card">
              {selfieUrl && (
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted shadow-lg relative group">
                   <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <CheckCircle2 className="text-white h-8 w-8" />
                   </div>
                   <img src={selfieUrl} alt="Selfie preview" className="h-full w-full object-cover grayscale" />
                </div>
              )}
              <Button
                size="lg"
                className="w-full h-16 font-medium uppercase tracking-widest text-xs shadow-lg shadow-primary/30 transition-all active:scale-95"
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" /> ESTABLISHING LINK...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-3 h-5 w-5" /> COMMENCE UPLINK
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
