'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
  MapPin,
  Plus,
  FileText
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import { useAuthSync } from '@/components/AuthProvider';
import posthog from 'posthog-js';
import { calculateAuditScore, ScoreInputQuestion, QuestionType, Severity } from '@/lib/scoring';

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
  const { isSynced, orgId, uid } = useAuthSync();
  const { auditId } = useParams() as { auditId: string };
  const router = useRouter();

  const [audit, setAudit] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Geolocation popup state
  const [showLocationErrorDialog, setShowLocationErrorDialog] = useState(false);
  const [showInitialLocationPrompt, setShowInitialLocationPrompt] = useState(false);
  const [showPermissionErrorDialog, setShowPermissionErrorDialog] = useState(false);

  // State and refs already defined above
 
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
    if (!isSynced || !uid || !auditId) return;

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

        const rSnap = await getDocs(query(
          collection(db, 'auditResponses'), 
          where('auditId', '==', auditId),
          where('auditorId', '==', uid)
        ));
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

        if (auditData.status !== 'completed') {
          setShowInitialLocationPrompt(true);
        }

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [uid, auditId, router, isSynced]);

  const currentQuestion = questions[currentIndex];
  const currentResponse = currentQuestion ? (responses[currentQuestion.id] || {
    answer: '',
    score: 0,
    notes: '',
    photoUrls: []
  }) : null;

  const getLocation = useCallback(async (): Promise<{ locationCaptured: boolean; latitude: number | null; longitude: number | null }> => {
    if (typeof window === 'undefined') {
      return { locationCaptured: false, latitude: null, longitude: null };
    }
    if (!('geolocation' in navigator)) {
      return { locationCaptured: false, latitude: null, longitude: null };
    }

    return await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            locationCaptured: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({ locationCaptured: false, latitude: null, longitude: null });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

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
    if (!file || !currentQuestion || !uid) return;

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
    } catch (err: any) {
      if (err.name === 'AbortError') return;
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

  const openCamera = async () => {
    try {
      setCapturing(true); // Loading state while requesting
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      cameraStreamRef.current = stream;
      setCameraFacing('environment');
      setCameraOpen(true);
    } catch (err) {
      console.error('Camera error:', err);
      setShowPermissionErrorDialog(true);
    } finally {
      setCapturing(false);
    }
  };

  const closeCamera = () => {
    stopCameraStream();
    setCameraOpen(false);
  };

  const flipCamera = async () => {
    try {
      stopCameraStream();
      const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: newFacing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      cameraStreamRef.current = stream;
      setCameraFacing(newFacing);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Flip camera error:', err);
    }
  };

  const cameraVideoCallbackRef = useCallback((videoEl: HTMLVideoElement | null) => {
    cameraVideoRef.current = videoEl;
    if (videoEl && cameraStreamRef.current) {
      videoEl.srcObject = cameraStreamRef.current;
      videoEl.play().catch(e => {
        if (e.name !== 'AbortError') console.error('Video play error:', e);
      });
    }
  }, []);

  const capturePhoto = async () => {
    if (!cameraVideoRef.current || !cameraStreamRef.current || !currentQuestion || !uid) return;
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
          posthog.capture('audit_photo_captured', {
            audit_id: auditId,
            question_id: currentQuestion.id,
            question_severity: currentQuestion.severity,
          });
          setHasUnsavedChanges(true);
        } catch (err: any) {
          if (err.name === 'AbortError') return;
          console.error('Upload failed', err);
          posthog.captureException(err);
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

  const saveProgress = async (isFinal = false) => {
    console.log(`[AuditSubmission] Starting saveProgress. isFinal: ${isFinal}`);
    if (!uid || !audit) {
      console.warn('[AuditSubmission] Missing uid or audit data', { uid, audit });
      return;
    }
    setSaving(true);

    try {
      const batch = writeBatch(db);
      
      // Calculate final scores first for consistency
      const scoringInput: ScoreInputQuestion[] = questions.map(q => ({
        questionId: q.id,
        questionText: q.questionText,
        questionType: q.questionType as QuestionType,
        severity: (q.severity || 'medium') as Severity,
        answer: q.questionType === 'yes_no'
          ? (responses[q.id]?.answer === 'yes' ? 'Yes' : responses[q.id]?.answer === 'no' ? 'No' : null)
          : (responses[q.id]?.score ?? null)
      }));

      const scoreResult = calculateAuditScore(scoringInput);

      if (isFinal) {
        console.log('AUDIT SCORING TRACE:', JSON.stringify({
          auditId,
          locationName: audit.locationName,
          ...scoreResult
        }, null, 2));
      }

      Object.entries(responses).forEach(([qId, r]) => {
        const q = questions.find(question => question.id === qId);
        if (!q) return;

        const traceItem = scoreResult.trace.find(t => t.questionId === qId);

        const responseRef = doc(db, 'auditResponses', `${auditId}_${qId}`);
        batch.set(responseRef, {
          auditId,
          questionId: qId,
          questionText: q.questionText,
          questionType: q.questionType,
          answer: r.answer,
          score: r.score,
          severity: q.severity,
          auditorId: uid,
          locationId: audit.locationId,
          photoUrls: r.photoUrls,
          notes: r.notes,
          submittedAt: serverTimestamp(),
          isCriticalFailure: traceItem?.isCriticalFailure ?? false
        });

        // Auto-create corrective action for failed critical questions
        if (isFinal && traceItem?.isCriticalFailure) {
          const caData = {
            auditId,
            questionId: qId,
            questionText: q.questionText,
            locationId: audit.locationId,
            locationName: audit.locationName,
            organizationId: orgId,
            assignedManagerId: audit.assignedManagerId,
            description: r.notes || `Critical Failure detected: ${q.questionText}`,
            severity: q.severity,
            status: 'open',
            reminderSent: false,
            deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
            createdAt: serverTimestamp()
          };
          const caRef = doc(collection(db, 'correctiveActions'));
          batch.set(caRef, caData);
        }
      });

      const auditRef = doc(db, 'audits', auditId);
      const updateData: any = {
        updatedAt: serverTimestamp()
      };

      if (isFinal) {
        updateData.status = 'completed';
        updateData.finalScore = scoreResult.finalScore;
        updateData.scorePercentage = scoreResult.finalScore; // backward compatibility
        updateData.grade = scoreResult.grade;
        updateData.hasCriticalFailure = scoreResult.hasCriticalFailure;
        updateData.criticalFailureCount = scoreResult.criticalFailureCount;
        updateData.scoringVersion = scoreResult.scoringVersion;
        updateData.scoringTrace = scoreResult.trace;
        updateData.weightedEarned = scoreResult.weightedEarned;
        updateData.weightedMax = scoreResult.weightedMax;
        updateData.completedAt = serverTimestamp();

        // Geolocation
        const location = await getLocation();
        if (!location.locationCaptured) {
          console.warn('[AuditSubmission] Location not captured, aborting final submission.');
          setSaving(false);
          setShowLocationErrorDialog(true);
          return;
        }

        updateData.latitude = location.latitude;
        updateData.longitude = location.longitude;
        updateData.locationCaptured = location.locationCaptured;
      } else if (audit.status !== 'completed') {
        updateData.status = 'in_progress';
      }

      batch.update(auditRef, updateData);

      console.log('[AuditSubmission] Committing batch...');
      await batch.commit();
      console.log('[AuditSubmission] Batch committed successfully');

      // ── Post-commit: fire-and-forget low-score & trend alert notifications ──
      // This runs AFTER the main batch succeeds so it can never block submission.
      // Notifications are generated server-side (Admin SDK) to avoid Firestore
      // security-rule denials — auditors cannot query other auditors' completed
      // audit docs from the client, which caused "Missing or insufficient permissions".
      if (isFinal && updateData.scorePercentage < 60) {
        console.log('[AuditSubmission] Low score detected, dispatching server notification job...');
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const idToken = await getIdToken(currentUser);
            fetch('/api/audit/submit-notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                auditId,
                scorePercentage: updateData.scorePercentage,
                locationId: audit.locationId,
                locationName: audit.locationName,
                assignedManagerId: audit.assignedManagerId,
                organizationId: orgId,
              }),
            }).then(res => {
              if (!res.ok) console.warn('[AuditSubmission] Notification job responded with non-OK status:', res.status);
              else console.log('[AuditSubmission] Notification job dispatched successfully.');
            }).catch(err => console.warn('[AuditSubmission] Notification job failed (non-blocking):', err));
          }
        } catch (notifErr) {
          // Non-blocking: log but do not rethrow — the audit itself already succeeded.
          console.warn('[AuditSubmission] Could not dispatch notification job:', notifErr);
        }
      }
      setHasUnsavedChanges(false);

      if (isFinal) {
        posthog.capture('audit_submitted', {
          audit_id: auditId,
          location_name: audit.locationName,
          score_percentage: updateData.scorePercentage,
          total_questions: questions.length,
          answered_questions: Object.keys(responses).length,
        });
        router.push('/dashboard/auditor');
      } else {
        posthog.capture('audit_progress_saved', {
          audit_id: auditId,
          location_name: audit.locationName,
          answered_questions: Object.keys(responses).length,
          total_questions: questions.length,
        });
      }
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

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="font-semibold text-heading text-lg">No questions found</p>
          <p className="text-muted-text text-sm pb-4">This audit template doesn't contain any questions.</p>
          <Button variant="outline" onClick={() => router.push('/dashboard/auditor')}>
            Return to Dashboard
          </Button>
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
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-6 py-3 md:py-4 shadow-sm">
        <div className="mx-auto max-w-2xl w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <p className="text-[10px] md:text-[11px] font-bold text-muted-text/60 uppercase tracking-widest truncate max-w-[150px] md:max-w-none">
                {audit?.templateTitle} • {audit?.locationName}
              </p>
              <h1 className="text-sm md:text-base font-bold text-heading">
                Step {currentIndex + 1} <span className="text-muted-text/40 font-normal">of {questions.length}</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveProgress(false)}
                disabled={saving}
                className="h-8 px-2 md:px-3 text-primary hover:bg-primary/5 font-semibold text-xs transition-all"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5 mr-1" />}
                <span className="hidden md:inline">Save progress</span>
                <span className="md:hidden">Save</span>
              </Button>
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
                className="h-8 w-8 md:w-auto md:px-3 p-0 text-muted-text hover:text-destructive hover:bg-destructive/5"
              >
                <X className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Exit</span>
              </Button>
            </div>
          </div>
          <div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 md:px-6 py-6 md:py-12 max-w-2xl mx-auto w-full">
        <div className="flex-1 flex flex-col justify-center space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-2">
              <Badge
                variant={currentQuestion.severity === 'critical' ? 'destructive' : 'secondary'}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                  currentQuestion.severity !== 'critical' && "bg-muted text-muted-text"
                )}
              >
                {currentQuestion.severity}
              </Badge>
              {currentQuestion.requiresPhoto && (
                <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-200 bg-amber-50 tracking-wider px-2 py-0.5 rounded-md">
                  PHOTO REQUIRED
                </Badge>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-heading leading-tight">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="space-y-8 md:space-y-12">
            {/* Question Input */}
            <div className="w-full">
              {currentQuestion.questionType === 'yes_no' ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    variant={currentResponse?.answer === 'yes' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-16 md:h-20 text-xl font-bold rounded-2xl border-2 transition-all active:scale-[0.97]",
                      currentResponse?.answer === 'yes'
                        ? "bg-success hover:bg-success/90 text-success-foreground border-success shadow-lg shadow-success/20"
                        : "hover:bg-success/5 border-border text-muted-text"
                    )}
                    onClick={() => handleAnswer('yes', 1)}
                   >
                    <CheckCircle2 className={cn("mr-2 h-6 w-6", currentResponse?.answer === 'yes' ? "opacity-100" : "opacity-20")} />
                    Yes
                  </Button>
                  <Button
                    variant={currentResponse?.answer === 'no' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-16 md:h-20 text-xl font-bold rounded-2xl border-2 transition-all active:scale-[0.97]",
                      currentResponse?.answer === 'no'
                        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive shadow-lg shadow-destructive/20"
                        : "hover:bg-destructive/5 border-border text-muted-text"
                    )}
                    onClick={() => handleAnswer('no', 0)}
                  >
                    <X className={cn("mr-2 h-6 w-6", currentResponse?.answer === 'no' ? "opacity-100" : "opacity-20")} />
                    No
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Button
                      key={num}
                      variant={currentResponse?.score === num ? 'default' : 'outline'}
                      className={cn(
                        "h-12 md:h-14 p-0 font-bold text-lg transition-all rounded-xl active:scale-95",
                        currentResponse?.score === num
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
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

            {/* Photo & Notes Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-border/50">
              {/* Photo Attachment Area */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-muted-text uppercase tracking-widest flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5" /> Evidence photos
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openCamera}
                    disabled={!!uploading}
                    className="h-8 md:h-9 px-3 gap-2 font-bold text-xs text-primary hover:bg-primary/5 rounded-full"
                  >
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Add photo
                  </Button>
                </div>

                {isPhotoRequired && !hasPhoto && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-destructive animate-pulse">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Photo evidence required</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {currentResponse?.photoUrls.map((url, i) => (
                    <div key={i} className="group relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-border/50 shadow-sm">
                      <Image src={url} alt="Evidence" width={80} height={80} className="h-full w-full object-cover" unoptimized />
                      <button
                        onClick={() => removePhoto(url)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={openCamera}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-dashed border-muted flex items-center justify-center text-muted-text/40 hover:text-primary/40 hover:border-primary/20 transition-all"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Notes Area */}
              <div className="space-y-4">
                <Label className="text-xs font-bold text-muted-text uppercase tracking-widest flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" /> Additional notes
                </Label>
                <Textarea
                  placeholder="Describe what you see..."
                  value={currentResponse?.notes || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="min-h-[100px] md:min-h-[120px] border-border/50 bg-muted/5 focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all rounded-xl text-body text-[14px] resize-none"
                />
              </div>
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

      {/* Initial Location Prompt Dialog */}
      <AlertDialog open={showInitialLocationPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Location Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              To begin and verify this audit accurately, you must allow location access. Your location is captured strictly to verify you are on-site during the audit process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => {
              setShowInitialLocationPrompt(false);
              getLocation(); // Trigger browser permission prompt natively
            }}>
              Enable Location
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submission Location Error Dialog */}
      <AlertDialog open={showLocationErrorDialog} onOpenChange={setShowLocationErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Location Verification Failed
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please explicitly enable location services and check your browser permissions to proceed. We could not safely verify your location, so the audit cannot be finalized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button onClick={async () => {
              setShowLocationErrorDialog(false);
              await getLocation(); // Fire the prompt before they try to submit again
            }}>
              Try Again
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Camera Permission Error Dialog */}
      <AlertDialog open={showPermissionErrorDialog} onOpenChange={setShowPermissionErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Camera className="h-5 w-5" /> Camera Access Denied
            </AlertDialogTitle>
            <AlertDialogDescription>
              Audiment needs camera access to capture evidence photos. Please enable camera permissions in your browser or device settings and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowPermissionErrorDialog(false)}>
              Got it
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
