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
            <h3 className="text-lg font-medium">Loading Flashmob Tool</h3>
            <p className="text-muted-foreground text-sm">Please wait while we set things up...</p>
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
              <div className="mx-auto bg-red-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
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
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">New Flashmob Audit</h1>
        </div>

        {step === 'location' && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Select the location you are currently auditing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location..." />
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
                className="w-full"
                disabled={!selectedLocation || selectedLocation === 'none'}
                onClick={() => {
                  setStep('video');
                  startCamera('environment');
                }}
              >
                Continue to Video <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'video' && (
          <Card>
            <CardHeader>
              <CardTitle>Record Activity</CardTitle>
              <CardDescription>Capture 20 seconds of the location activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video bg-zinc-100 rounded-lg overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                {recording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" /> Recording
                  </div>
                )}
                
                <div className="absolute top-4 right-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                  <Clock className="h-4 w-4" /> 00:{countdown.toString().padStart(2, '0')}
                </div>
              </div>
              
              <div className="flex justify-center">
                {!recording ? (
                  <Button size="lg" className="w-full sm:w-auto" onClick={startRecording}>
                    <Video className="h-4 w-4 mr-2" /> Start Recording
                  </Button>
                ) : (
                  <Button size="lg" variant="destructive" className="w-full sm:w-auto" onClick={stopRecording}>
                    <StopCircle className="h-4 w-4 mr-2" /> Stop Recording
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'review' && videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Review Video</CardTitle>
              <CardDescription>Check the recorded video before continuing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video bg-zinc-100 rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  className="h-full w-full object-cover"
                  controls
                  autoPlay
                  loop
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setVideoUrl(null);
                    setVideoBlob(null);
                    setStep('video');
                    startCamera('environment');
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake Video
                </Button>
                <Button
                  onClick={() => {
                    setStep('selfie');
                    startCamera('user');
                  }}
                >
                  Continue to Selfie <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'selfie' && (
          <Card>
             <CardHeader>
              <CardTitle>Take Selfie</CardTitle>
              <CardDescription>Capture a clear photo of yourself at the location.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video bg-zinc-100 rounded-lg overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" className="w-full sm:w-auto" onClick={takeSelfie}>
                  <Camera className="h-4 w-4 mr-2" /> Take Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'submitting' && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Submit Audit</CardTitle>
              <CardDescription>You are about to submit the flashmob audit.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 pb-6">
              {selfieUrl && (
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted">
                   <img src={selfieUrl} alt="Selfie preview" className="h-full w-full object-cover" />
                </div>
              )}
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[200px]"
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" /> Submit Report
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
