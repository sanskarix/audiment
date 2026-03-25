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

      // 3. Upload Selfie
      const selfieFormData = new FormData();
      selfieFormData.append('file', selfieBlob, 'selfie.jpg');
      const sRes = await fetch('/api/upload', { method: 'POST', body: selfieFormData });
      const sData = await sRes.json();

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
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tighter">Preparing Mission</h3>
            <p className="text-muted-foreground text-sm">Synchronizing location data and verifying permissions...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (userData && !userData.hasFlashmobAccess) {
    return (
      <DashboardShell role="Auditor">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-none shadow-2xl bg-zinc-950 text-white overflow-hidden">
            <CardHeader className="pb-4 pt-8 text-center">
              <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter uppercase">Access Denied</CardTitle>
              <CardDescription className="text-zinc-500">
                You do not have the required clearance for covert flashmob audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <Button className="w-full h-12 bg-white text-black font-black hover:bg-zinc-200" variant="outline" onClick={() => router.push('/dashboard/auditor')}>
                RETURN TO BASE
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Auditor">
      <div className="max-w-xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Flashmob Sequence</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn("h-1 w-6 rounded-full transition-colors",
                  (i === 1 && step === 'location') || (i === 2 && step === 'video') || (i === 3 && step === 'review') || (i === 4 && step === 'selfie') ? "bg-amber-500" : "bg-zinc-200"
                )} />
              ))}
            </div>
          </div>
          <div className="w-12"></div>
        </div>

        {step === 'location' && (
          <Card className="border-none shadow-2xl">
            <CardHeader className="text-center pb-8 pt-10">
              <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-zinc-600" />
              </div>
              <CardTitle className="text-2xl font-black text-zinc-900 tracking-tighter">SELECT TARGET BRANCH</CardTitle>
              <CardDescription>Confirm the location you are currently auditing covertly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500">Target Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 text-lg font-medium border-zinc-200">
                    <SelectValue placeholder="Identify location..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.length === 0 ? (
                      <SelectItem value="none" disabled>No locations found</SelectItem>
                    ) : (
                      locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full h-14 text-md font-black bg-zinc-900 hover:bg-black text-white"
                disabled={!selectedLocation || selectedLocation === 'none'}
                onClick={() => {
                  setStep('video');
                  startCamera('environment');
                }}
              >
                INITIATE SCAN <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'video' && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900">
              <video
                ref={videoRef}
                className="h-full w-full object-cover grayscale brightness-125 contrast-125"
                autoPlay
                muted
                playsInline
              />

              <div className="absolute inset-0 pointer-events-none border-[20px] border-black/10 flex items-center justify-center">
                <div className="h-full w-full border border-white/20 rounded-xl" />
              </div>

              {recording && (
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-black animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-white" /> RECORDING
                </div>
              )}

              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-black mono flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> 00:{countdown.toString().padStart(2, '0')}
              </div>

              <div className="absolute bottom-10 inset-x-0 flex items-center justify-center px-6">
                {!recording ? (
                  <Button
                    size="lg"
                    className="h-20 w-20 rounded-full bg-white border-8 border-zinc-900 shadow-xl group hover:scale-110 transition-transform p-0"
                    onClick={startRecording}
                  >
                    <div className="h-8 w-8 rounded-full bg-red-600 group-hover:scale-90 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="h-20 w-20 rounded-full bg-white border-8 border-zinc-900 shadow-xl group hover:scale-110 transition-transform p-0"
                    onClick={stopRecording}
                  >
                    <StopCircle className="h-10 w-10 text-black" fill="currentColor" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Capture 20 seconds of the location activity
            </p>
          </div>
        )}

        {step === 'review' && videoUrl && (
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl">
              <video
                src={videoUrl}
                className="h-full w-full object-cover"
                controls
                autoPlay
                loop
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 font-black border-zinc-200"
                onClick={() => {
                  setVideoUrl(null);
                  setVideoBlob(null);
                  setStep('video');
                  startCamera('environment');
                }}
              >
                <RefreshCw className="mr-2 h-5 w-5" /> RE-SCAN
              </Button>
              <Button
                className="h-14 font-black bg-zinc-900 hover:bg-black text-white"
                onClick={() => {
                  setStep('selfie');
                  startCamera('user');
                }}
              >
                CONTINUE <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 'selfie' && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-full" />
              </div>
              <div className="absolute bottom-10 inset-x-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="h-20 w-20 rounded-full bg-white border-8 border-zinc-900 shadow-xl group"
                  onClick={takeSelfie}
                >
                  <Camera className="h-8 w-8 text-black" />
                </Button>
              </div>
            </div>
            <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Capture a clear selfie at the location
            </p>
          </div>
        )}

        {step === 'submitting' && (
          <Card className="border-none shadow-2xl bg-zinc-900 text-white py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-8">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                <UploadCloud className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-8 w-8 text-amber-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Transmitting Data</h3>
                <p className="text-zinc-500 text-sm">Uploading encrypted video and selfie to headquarters...</p>
              </div>
              <Button
                className="w-full max-w-xs h-14 bg-amber-500 hover:bg-amber-600 text-black font-black"
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> UPLOADING...
                  </>
                ) : 'CONFIRM UPLOAD'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
