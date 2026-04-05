'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  where,
  writeBatch,
  Timestamp,
  limit
} from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Loader2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FlipHorizontal,
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  questionText: string;
  questionType: 'yes_no' | 'rating';
  severity: 'low' | 'medium' | 'critical';
  requiresPhoto: boolean;
  order: number;
}

interface Response {
  answer: string;
  score: number;
  notes: string;
  photoUrls: string[];
}

export default function AuditExecutionPage() {
  const { auditId } = useParams() as { auditId: string };
  const router = useRouter();

  const [audit, setAudit] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Camera popup state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [capturing, setCapturing] = useState(false);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId, uid: data.uid });
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!session?.uid || !auditId) return;

    async function fetchData() {
      try {
        const auditSnap = await getDoc(doc(db, 'audits', auditId));
        if (!auditSnap.exists()) {
          router.push('/dashboard/auditor');
          return;
        }
        const auditData = auditSnap.data();
        
        // BUG 6: Auditor schedule lock
        const now = new Date();
        const sched = auditData.scheduledDate?.toDate() || new Date(0);
        if (now < sched) {
          alert(`Locked until ${sched.toLocaleDateString()}`);
          router.push('/dashboard/auditor');
          return;
        }

        setAudit({ id: auditSnap.id, ...auditData });

        const qParams = query(
          collection(db, 'auditTemplates', auditData.templateId, 'questions'),
          orderBy('order', 'asc')
        );
        const qSnap = await getDocs(qParams);
        const fetchedQuestions = qSnap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
        setQuestions(fetchedQuestions);

        const rSnap = await getDocs(query(collection(db, 'auditResponses'), where('auditId', '==', auditId)));
        const existingResponses: Record<string, Response> = {};
        rSnap.forEach(d => {
          const data = d.data();
          existingResponses[data.questionId] = {
            answer: data.answer,
            score: data.score,
            notes: data.notes || '',
            photoUrls: data.photoUrls || []
          };
        });
        setResponses(existingResponses);

      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, auditId, router]);

  const currentQuestion = questions[currentIndex];
  const currentResponse = currentQuestion ? (responses[currentQuestion.id] || {
    answer: '',
    score: 0,
    notes: '',
    photoUrls: []
  }) : null;

  const handleAnswer = (answer: string, score: number) => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { answer: '', score: 0, notes: '', photoUrls: [] }),
        answer,
        score
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleNoteChange = (note: string) => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { answer: '', score: 0, notes: '', photoUrls: [] }),
        notes: note
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentQuestion || !session) return;

    setUploading(currentQuestion.id);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      const downloadURL = data.url;

      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...(prev[currentQuestion.id] || { answer: '', score: 0, notes: '', photoUrls: [] }),
          photoUrls: [...(prev[currentQuestion.id]?.photoUrls || []), downloadURL]
        }
      }));
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(null);
    }
  };

  const removePhoto = (urlToRemove: string) => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id]!,
        photoUrls: prev[currentQuestion.id]!.photoUrls.filter(url => url !== urlToRemove)
      }
    }));
    setHasUnsavedChanges(true);
  };

  // --- Camera popup logic ---
  const stopCameraStream = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current = null;
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
  }, []);

  const cameraVideoCallbackRef = useCallback((videoEl: HTMLVideoElement | null) => {
    // Always keep cameraVideoRef in sync — capturePhoto reads from it
    cameraVideoRef.current = videoEl;
    if (!videoEl) return;
    const attach = async () => {
      try {
        if (!cameraStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: cameraFacing }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
          cameraStreamRef.current = stream;
        }
        videoEl.srcObject = cameraStreamRef.current;
        try { await videoEl.play(); } catch (e: any) { if (e.name !== 'AbortError') console.error(e); }
      } catch (err) {
        console.error('Camera error:', err);
        alert('Could not access camera. Please allow camera permissions.');
        setCameraOpen(false);
      }
    };
    attach();
  }, [cameraFacing]);

  const openCamera = () => {
    setCameraFacing('environment');
    setCameraOpen(true);
  };

  const closeCamera = () => {
    stopCameraStream();
    setCameraOpen(false);
  };

  const flipCamera = async () => {
    stopCameraStream();
    setCameraFacing(f => f === 'environment' ? 'user' : 'environment');
    // The cameraVideoCallbackRef will re-fire when the video element remounts due to key change
  };

  const capturePhoto = async () => {
    if (!cameraVideoRef.current || !cameraStreamRef.current || !currentQuestion || !session) return;
    setCapturing(true);
    try {
      const video = cameraVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (cameraFacing === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          const formData = new FormData();
          formData.append('file', blob, `photo_${Date.now()}.jpg`);
          setUploading(currentQuestion.id);
          closeCamera();

          const response = await fetch('/api/upload', { method: 'POST', body: formData });
          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();

          setResponses(prev => ({
            ...prev,
            [currentQuestion.id]: {
              ...(prev[currentQuestion.id] || { answer: '', score: 0, notes: '', photoUrls: [] }),
              photoUrls: [...(prev[currentQuestion.id]?.photoUrls || []), data.url]
            }
          }));
          setHasUnsavedChanges(true);
        } catch (err) {
          console.error('Upload failed', err);
          alert('Photo upload failed. Please try again.');
        } finally {
          setUploading(null);
          setCapturing(false);
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Capture error:', err);
      setCapturing(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => { return () => { stopCameraStream(); }; }, [stopCameraStream]);

  const getLocation = (): Promise<{ latitude: number; longitude: number; locationCaptured: boolean }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0, locationCaptured: false });
        return;
      }
      
      const timeout = setTimeout(() => {
        resolve({ latitude: 0, longitude: 0, locationCaptured: false });
      }, 8000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationCaptured: true
          });
        },
        () => {
          clearTimeout(timeout);
          resolve({ latitude: 0, longitude: 0, locationCaptured: false });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  };

  const saveProgress = async (isFinal = false) => {
    console.log(`[AuditSubmission] Starting saveProgress. isFinal: ${isFinal}`);
    if (!session || !audit) {
      console.warn('[AuditSubmission] Missing session or audit data', { session, audit });
      return;
    }
    setSaving(true);

    try {
      const batch = writeBatch(db);
      console.log('[AuditSubmission] Preparing batch for responses:', Object.keys(responses).length);

      Object.entries(responses).forEach(([qId, r]) => {
        const q = questions.find(question => question.id === qId);
        if (!q) return;

        const responseRef = doc(db, 'auditResponses', `${auditId}_${qId}`);
        batch.set(responseRef, {
          auditId,
          questionId: qId,
          questionText: q.questionText,
          questionType: q.questionType,
          answer: r.answer,
          score: r.score,
          severity: q.severity,
          auditorId: session.uid,
          locationId: audit.locationId,
          photoUrls: r.photoUrls,
          notes: r.notes,
          submittedAt: serverTimestamp()
        });

        // Block 9: Auto-create corrective action for failed critical questions
        if (isFinal) {
          const isFailed = (q.severity === 'critical') && (
            (q.questionType === 'yes_no' && r.answer === 'no') ||
            (q.questionType === 'rating' && r.score <= 3)
          );

          if (isFailed) {
            const caData = {
              auditId,
              questionId: qId,
              questionText: q.questionText,
              locationId: audit.locationId,
              locationName: audit.locationName,
              organizationId: session.orgId,
              assignedManagerId: audit.assignedManagerId,
              description: r.notes || `Failed critical question: ${q.questionText}`,
              severity: q.severity,
              status: 'open',
              reminderSent: false,
              deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
              createdAt: serverTimestamp()
            };
            const caRef = doc(collection(db, 'correctiveActions'));
            batch.set(caRef, caData);
          }
        }
      });

      const auditRef = doc(db, 'audits', auditId);
      const updateData: any = {
        updatedAt: serverTimestamp()
      };

      // Status priority logic:
      // 1. If finishing (isFinal), always mark completed
      // 2. If just saving/leaving, only set to in_progress if it wasn't already completed
      if (isFinal) {
        updateData.status = 'completed';
      } else if (audit.status !== 'completed') {
        updateData.status = 'in_progress';
      }

      if (isFinal) {
        console.log('[AuditSubmission] Calculating final scores');
        let totalScore = 0;
        let maxPossibleScore = 0;
        questions.forEach(q => {
          maxPossibleScore += (q.questionType === 'yes_no' ? 1 : 10);
          totalScore += (responses[q.id]?.score || 0);
        });
        updateData.totalScore = totalScore;
        updateData.maxPossibleScore = maxPossibleScore;
        updateData.scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);
        updateData.completedAt = serverTimestamp();

        // New geolocation logic
        const location = await getLocation();
        
        updateData.latitude = location.latitude;
        updateData.longitude = location.longitude;
        updateData.locationCaptured = location.locationCaptured;

        if (!location.locationCaptured) {
          console.warn('[AuditSubmission] Location not captured, but submitting.');
          alert("Location not captured. Audit will still be submitted without geo-tag.");
        } else {
          console.log('[AuditSubmission] Geolocation captured');
        }
      }

      batch.update(auditRef, updateData);

      // Block 10: Low score and Trend alerts
      if (isFinal && updateData.scorePercentage < 60) {
        console.log('[AuditSubmission] Low score detected, processing alerts');
        // 1. Notify Manager & Admin about low score
        const adminQuery = query(
          collection(db, 'users'),
          where('organizationId', '==', session.orgId),
          where('role', '==', 'ADMIN')
        );
        const adminSnap = await getDocs(adminQuery);
        const recipientIds = [audit.assignedManagerId, ...adminSnap.docs.map(d => d.id)];

        recipientIds.forEach(recipientId => {
          if (!recipientId) return;
          const notifRef = doc(collection(db, 'notifications'));
          batch.set(notifRef, {
            organizationId: session.orgId,
            recipientId,
            recipientRole: recipientId === audit.assignedManagerId ? 'manager' : 'admin',
            type: 'low_score',
            title: `Low Audit Score: ${updateData.scorePercentage}%`,
            message: `Audit for ${audit.locationName} completed with a low score of ${updateData.scorePercentage}%.`,
            relatedId: auditId,
            isRead: false,
            createdAt: serverTimestamp()
          });
        });

        // 2. Check for Trend alert (3 consecutive low scores)
        const recentAuditsQuery = query(
          collection(db, 'audits'),
          where('locationId', '==', audit.locationId),
          where('status', '==', 'completed'),
          orderBy('completedAt', 'desc'),
          limit(3)
        );
        const recentAuditsSnap = await getDocs(recentAuditsQuery);
        const recentAudits = recentAuditsSnap.docs.map(d => d.data());

        const allRecentScores = [updateData.scorePercentage, ...recentAudits.map(a => a.scorePercentage)];

        if (allRecentScores.length >= 3 && allRecentScores.slice(0, 3).every(s => s < 60)) {
          console.log('[AuditSubmission] Trend alert triggered');
          adminSnap.docs.forEach(adminDoc => {
            const trendNotifRef = doc(collection(db, 'notifications'));
            batch.set(trendNotifRef, {
              organizationId: session.orgId,
              recipientId: adminDoc.id,
              recipientRole: 'admin',
              type: 'trend_alert',
              title: `Performance Trend Alert: ${audit.locationName}`,
              message: `${audit.locationName} has scored below 60% on 3 consecutive audits. Priority review required.`,
              relatedId: auditId,
              isRead: false,
              createdAt: serverTimestamp()
            });
          });
        }
      }

      console.log('[AuditSubmission] Committing batch...');
      await batch.commit();
      console.log('[AuditSubmission] Batch committed successfully');
      setHasUnsavedChanges(false);

      if (isFinal) router.push('/dashboard/auditor');
    } catch (err: any) {
      console.error('[AuditSubmission] CRITICAL ERROR during submission:', err);
      alert(`Failed to submit audit: ${err.message || 'Unknown error'}. Please check your connection or console for details.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/20">
        <div className="h-20 bg-background border-b border-border/50 flex items-center px-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 p-6 md:p-20">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressValue = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isQuestionAnswered = !!currentResponse?.answer;
  const isPhotoRequired = currentQuestion?.requiresPhoto;
  const hasPhoto = (currentResponse?.photoUrls || []).length > 0;
  const canProceed = isQuestionAnswered && (!isPhotoRequired || hasPhoto);

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      {/* Header with Progress Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-2xl w-full">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (hasUnsavedChanges) {
                  setShowExitDialog(true);
                } else {
                  router.push('/dashboard/auditor');
                }
              }}
              className="gap-2 font-medium text-muted-text hover:text-destructive hover:bg-destructive/10 text-xs tracking-tight p-0 h-auto"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <div className="text-center">
              <p className="text-sm font-semibold text-heading">
                Question {currentIndex + 1} <span className="text-muted-text/40 font-normal">of {questions.length}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveProgress(false)}
              disabled={saving}
              className="h-8 px-3 gap-2 font-medium text-xs border-primary/20 text-primary hover:bg-primary/5 active:scale-95"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />} Save
            </Button>
          </div>
          <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={currentQuestion.severity === 'critical' ? 'destructive' : 'secondary'}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                  currentQuestion.severity !== 'critical' && "bg-muted text-muted-text"
                )}
              >
                {currentQuestion.severity}
              </Badge>
              {currentQuestion.requiresPhoto && (
                <Badge variant="outline" className="text-[10px] font-bold text-warning border-warning/30 bg-warning/5 tracking-wider px-2 py-0.5">
                  PHOTO REQUIRED
                </Badge>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-heading leading-tight mb-6">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="space-y-10">
            {/* Question Input */}
            <div>
              {currentQuestion.questionType === 'yes_no' ? (
                <div className="flex gap-3 w-full">
                  <Button
                    variant={currentResponse?.answer === 'yes' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-14 text-lg font-semibold rounded-xl border-2 transition-all",
                      currentResponse?.answer === 'yes'
                        ? "bg-success hover:bg-success/90 text-success-foreground border-success shadow-lg active:scale-95"
                        : "hover:bg-success/5 border-border active:scale-95"
                    )}
                    onClick={() => handleAnswer('yes', 1)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={currentResponse?.answer === 'no' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-14 text-lg font-semibold rounded-xl border-2 transition-all",
                      currentResponse?.answer === 'no'
                        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive shadow-lg active:scale-95"
                        : "hover:bg-destructive/5 border-border active:scale-95"
                    )}
                    onClick={() => handleAnswer('no', 0)}
                  >
                    No
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Button
                      key={num}
                      variant={currentResponse?.score === num ? 'default' : 'outline'}
                      className={cn(
                        "w-10 h-10 p-0 font-bold text-sm transition-all rounded-lg active:scale-95",
                        currentResponse?.score === num
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-primary/10 hover:border-primary/30 text-muted-text"
                      )}
                      onClick={() => handleAnswer(num.toString(), num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Photo Attachment Area */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-semibold text-heading flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 opacity-70" /> Photos
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openCamera}
                  disabled={!!uploading}
                  className="h-9 gap-2 font-semibold text-xs border-primary/20 text-primary hover:bg-primary/5 active:scale-95"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Camera className="h-4 w-4 text-primary" />}
                  {uploading ? 'Uploading…' : 'Take Photo'}
                </Button>
              </div>

              {isPhotoRequired && !hasPhoto && (
                <p className="text-xs font-semibold text-destructive mb-4 animate-pulse">
                  * Evidence photo is required for this question.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {currentResponse?.photoUrls.map((url, i) => (
                  <div key={i} className="group relative w-20 h-20 rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                    <Image src={url} alt="Evidence" width={80} height={80} className="h-full w-full object-cover" unoptimized />
                    <button
                      onClick={() => removePhoto(url)}
                      className="absolute right-1 top-1 rounded-full bg-destructive shadow-lg p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Area */}
            <div className="mt-4 space-y-3">
              <Label className="text-sm font-semibold text-heading">Notes</Label>
              <Textarea
                placeholder="Observed discrepancies, context or details..."
                value={currentResponse?.notes || ''}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="min-h-[100px] border-border/50 bg-muted/5 focus:bg-background transition-all rounded-xl text-body text-[14px]"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 z-50 w-full border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 py-4 shadow-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-12 font-bold text-sm rounded-xl active:scale-95"
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              size="lg"
              className="flex-1 h-12 font-bold text-sm rounded-xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-95"
              disabled={!canProceed || saving}
              onClick={() => saveProgress(true)}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} Submit Audit
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex-1 h-12 font-bold text-sm rounded-xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={!canProceed}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </footer>

      {/* Unsaved Changes Guard Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold text-heading">Unsaved Progress</AlertDialogTitle>
            <AlertDialogDescription className="text-body font-normal">
              You have completed {Object.keys(responses).length} questions. Would you like to save your progress before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-medium h-11">Continue Auditing</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowExitDialog(false);
                router.push('/dashboard/auditor');
              }}
              className="bg-muted hover:bg-muted/80 text-muted-foreground h-11 font-medium border-0"
            >
              Exit Without Saving
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => {
                setShowExitDialog(false);
                saveProgress(false).then(() => router.push('/dashboard/auditor'));
              }}
              className="bg-primary hover:bg-primary/90 h-11 font-medium"
            >
              Save and Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── In-App Camera Modal ─────────────────────────────────── */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm">
            <button
              onClick={closeCamera}
              className="h-10 w-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-white/80 text-sm font-semibold tracking-wide">Take Photo</p>
            <button
              onClick={flipCamera}
              className="h-10 w-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FlipHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Viewfinder */}
          <div className="flex-1 relative overflow-hidden bg-black">
            <video
              key={cameraFacing}
              ref={cameraVideoCallbackRef}
              muted
              playsInline
              controls={false}
              className={cn(
                "w-full h-full object-cover",
                cameraFacing === 'user' && "scale-x-[-1]"
              )}
            />
            {/* Corner guides */}
            <div className="absolute inset-8 pointer-events-none">
              <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-white/60 rounded-tl-sm" />
              <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-white/60 rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white/60 rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white/60 rounded-br-sm" />
            </div>
          </div>

          {/* Shutter */}
          <div className="flex items-center justify-center px-4 py-8 bg-black/80 backdrop-blur-sm">
            <button
              onClick={capturePhoto}
              disabled={capturing}
              className="relative h-20 w-20 flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/60" />
              {/* Inner circle */}
              <div className="h-14 w-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                {capturing
                  ? <Loader2 className="h-6 w-6 animate-spin text-black" />
                  : <Camera className="h-6 w-6 text-black" />
                }
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
