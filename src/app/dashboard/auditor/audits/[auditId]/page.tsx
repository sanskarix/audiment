'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  AlertCircle
} from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!session?.uid || !auditId) return;

    async function fetchData() {
      try {
        const auditSnap = await getDoc(doc(db, 'audits', auditId));
        if (!auditSnap.exists()) {
          router.push('/dashboard/auditor');
          return;
        }
        const auditData = auditSnap.data();
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
            console.log(`[AuditSubmission] Creating corrective action for question: ${qId}`);
            const caRef = doc(collection(db, 'correctiveActions'));
            batch.set(caRef, {
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
              deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
              createdAt: serverTimestamp()
            });
          }
        }
      });

      const auditRef = doc(db, 'audits', auditId);
      const updateData: any = {
        status: isFinal ? 'completed' : 'in_progress',
        updatedAt: serverTimestamp()
      };

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

        // 4. Check if geo-location request is hanging with timeout fallback
        if (navigator.geolocation) {
          console.log('[AuditSubmission] Requesting geolocation...');
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              // Reduced timeout to 5s for better UX, fallback to 0,0
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                enableHighAccuracy: false // Faster response
              });
            });
            updateData.latitude = pos.coords.latitude;
            updateData.longitude = pos.coords.longitude;
            console.log('[AuditSubmission] Geolocation captured');
          } catch (e) {
            console.warn('[AuditSubmission] Geo location failed or timed out, using fallback (0,0)', e);
            updateData.latitude = 0;
            updateData.longitude = 0;
          }
        } else {
          updateData.latitude = 0;
          updateData.longitude = 0;
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

      if (isFinal) router.push('/dashboard/auditor');
    } catch (err: any) {
      console.error('[AuditSubmission] CRITICAL ERROR during submission:', err);
      alert(`Failed to submit audit: ${err.message || 'Unknown error'}. Please check your connection or console for details.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-muted/30"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const progressValue = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isQuestionAnswered = !!currentResponse?.answer;
  const isPhotoRequired = currentQuestion?.requiresPhoto;
  const hasPhoto = (currentResponse?.photoUrls || []).length > 0;
  const canProceed = isQuestionAnswered && (!isPhotoRequired || hasPhoto);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with Progress Bar */}
      <header className="sticky top-0 z-10 w-full border-b bg-background px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => saveProgress(false).then(() => router.push('/dashboard/auditor'))} className="h-8 gap-1 px-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => saveProgress(false)} disabled={saving} className="h-8 gap-1 px-2">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Save
            </Button>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-sm border-muted">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={currentQuestion.severity === 'critical' ? 'destructive' : 'outline'} className="uppercase text-[10px] font-bold">
                  {currentQuestion.severity} Severity
                </Badge>
                {currentQuestion.requiresPhoto && (
                  <Badge variant="secondary" className="uppercase text-[10px] font-bold">
                    Photo Required
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl md:text-2xl font-semibold leading-snug">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Question Input */}
              <div>
                {currentQuestion.questionType === 'yes_no' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={currentResponse?.answer === 'yes' ? 'default' : 'outline'}
                      size="lg"
                      className={cn(
                        "h-20 text-lg font-semibold",
                        currentResponse?.answer === 'yes' && "bg-emerald-600 hover:bg-emerald-700 hover:text-white"
                      )}
                      onClick={() => handleAnswer('yes', 1)}
                    >
                      {currentResponse?.answer === 'yes' && <CheckCircle2 className="mr-2 h-5 w-5" />}
                      YES
                    </Button>
                    <Button
                      variant={currentResponse?.answer === 'no' ? 'default' : 'outline'}
                      size="lg"
                      className={cn(
                        "h-20 text-lg font-semibold",
                        currentResponse?.answer === 'no' && "bg-destructive hover:bg-destructive"
                      )}
                      onClick={() => handleAnswer('no', 0)}
                    >
                      {currentResponse?.answer === 'no' && <X className="mr-2 h-5 w-5" />}
                      NO
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <Button
                        key={num}
                        variant={currentResponse?.score === num ? 'default' : 'outline'}
                        className="h-10 w-10 sm:h-12 sm:w-12 p-0 font-bold"
                        onClick={() => handleAnswer(num.toString(), num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Visual Evidence
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!!uploading}
                    className="h-8 gap-1 text-xs"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    Upload Photo
                  </Button>
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                </div>

                {isPhotoRequired && !hasPhoto && (
                  <p className="text-[10px] text-destructive font-bold uppercase animate-pulse">
                    Evidence is mandatory for this question
                  </p>
                )}

                <div className="grid grid-cols-4 gap-2">
                  {currentResponse?.photoUrls.map((url, i) => (
                    <div key={i} className="group relative aspect-square rounded-md overflow-hidden border">
                      <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removePhoto(url)}
                        className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Area */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs font-bold uppercase text-muted-foreground">
                  Notes / Observations
                </Label>
                <Textarea
                  placeholder="Describe your findings here..."
                  value={currentResponse?.notes || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 z-10 w-full border-t bg-background p-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 font-semibold"
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              size="lg"
              className="flex-1 font-semibold"
              disabled={!canProceed || saving}
              onClick={() => saveProgress(true)}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finish & Submit'}
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex-1 font-semibold"
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={!canProceed}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
