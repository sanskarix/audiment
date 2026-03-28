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
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Header with Progress Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => saveProgress(false).then(() => router.push('/dashboard/auditor'))} 
              className="h-10 gap-2 px-5 font-black text-muted-foreground hover:text-destructive hover:bg-destructive/10 uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-90"
            >
              <X className="h-4 w-4" /> Abort Mission
            </Button>
            <div className="text-center group cursor-default">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 leading-none mb-1.5 group-hover:opacity-100 transition-opacity">
                Operational Status
              </p>
              <div className="flex items-center gap-3 justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                <p className="text-xs font-black text-foreground tracking-widest italic">
                  MODULE {currentIndex + 1} <span className="text-muted-foreground/30 font-medium not-italic">/</span> {questions.length}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => saveProgress(false)} 
              disabled={saving} 
              className="h-10 gap-2 px-5 font-black uppercase tracking-[0.2em] text-[10px] border-primary/20 text-primary hover:bg-primary/5 shadow-xl shadow-primary/5 rounded-xl transition-all active:scale-90"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Sync Progress
            </Button>
          </div>
          <div className="relative h-2 w-full bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Card className="standard-card overflow-hidden shadow-2xl border-primary/5">
            <div className="h-2 w-full bg-primary/10">
              <div 
                className={cn(
                  "h-full transition-all duration-300",
                  currentQuestion.severity === 'critical' ? "bg-destructive" : currentQuestion.severity === 'medium' ? "bg-warning" : "bg-success"
                )}
                style={{ width: '100%' }}
              />
            </div>
            <CardHeader className="space-y-8 p-10 pb-6">
              <div className="flex items-center gap-4">
                <Badge 
                  variant={currentQuestion.severity === 'critical' ? 'destructive' : 'outline'} 
                  className={cn(
                    "uppercase text-[10px] font-black tracking-[0.2em] px-4 py-1.5 shadow-lg",
                    currentQuestion.severity === 'critical' ? "shadow-destructive/20" : "border-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {currentQuestion.severity} Severity Index
                </Badge>
                {currentQuestion.requiresPhoto && (
                  <Badge variant="outline" className="uppercase text-[10px] font-black text-warning border-warning/30 bg-warning/10 tracking-[0.2em] px-4 py-1.5 shadow-lg shadow-warning/5">
                    Visual Evidence Required
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl md:text-5xl font-black italic tracking-tighter leading-[1] text-foreground uppercase">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 p-8 pt-6">
              {/* Question Input */}
              <div className="py-2">
                {currentQuestion.questionType === 'yes_no' ? (
                  <div className="grid grid-cols-2 gap-8">
                    <Button
                      variant={currentResponse?.answer === 'yes' ? 'default' : 'outline'}
                      className={cn(
                        "h-32 text-3xl font-black italic tracking-tighter transition-all duration-500 border-2 rounded-3xl",
                        currentResponse?.answer === 'yes' 
                          ? "bg-success hover:bg-success text-success-foreground border-success shadow-2xl shadow-success/40 scale-[1.05]" 
                          : "hover:bg-success/5 hover:border-success/30 text-muted-foreground border-muted opacity-40 hover:opacity-100"
                      )}
                      onClick={() => handleAnswer('yes', 1)}
                    >
                      {currentResponse?.answer === 'yes' && <CheckCircle2 className="mr-4 h-10 w-10 animate-in zoom-in duration-300" />}
                      YES / PASS
                    </Button>
                    <Button
                      variant={currentResponse?.answer === 'no' ? 'default' : 'outline'}
                      className={cn(
                        "h-32 text-3xl font-black italic tracking-tighter transition-all duration-500 border-2 rounded-3xl",
                        currentResponse?.answer === 'no' 
                          ? "bg-destructive hover:bg-destructive text-destructive-foreground border-destructive shadow-2xl shadow-destructive/40 scale-[1.05]" 
                          : "hover:bg-destructive/5 hover:border-destructive/30 text-muted-foreground border-muted opacity-40 hover:opacity-100"
                      )}
                      onClick={() => handleAnswer('no', 0)}
                    >
                      {currentResponse?.answer === 'no' && <X className="mr-4 h-10 w-10 animate-in zoom-in duration-300" />}
                      NO / FAIL
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 justify-between bg-muted/10 p-6 rounded-3xl border border-muted/20">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <Button
                        key={num}
                        variant={currentResponse?.score === num ? 'default' : 'outline'}
                        className={cn(
                          "h-14 w-14 sm:h-16 sm:w-16 p-0 font-black text-xl transition-all rounded-2xl border-2",
                          currentResponse?.score === num 
                            ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-125 z-10" 
                            : "hover:bg-primary/10 hover:border-primary/30 text-muted-foreground opacity-50 hover:opacity-100"
                        )}
                        onClick={() => handleAnswer(num.toString(), num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-6 pt-8 border-t border-muted/20">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em] flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 opacity-50" /> Visual Evidence
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!!uploading}
                    className="h-10 gap-2 px-5 font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary/5 transition-all active:scale-95"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Camera className="h-4 w-4 text-primary" />}
                    Capture Evidence
                  </Button>
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                </div>

                {isPhotoRequired && !hasPhoto && (
                  <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-left duration-500">
                    <AlertCircle className="h-6 w-6 text-destructive animate-pulse" />
                    <p className="text-[11px] text-destructive font-black uppercase tracking-[0.2em]">
                      Analytical non-compliance: Visual evidence is strictly mandated for this module.
                    </p>
                  </div>
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
              <div className="space-y-4 pt-8 border-t border-muted/20">
                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.2em]">
                  Audit Log / Remarks
                </Label>
                <Textarea
                  placeholder="Provide precise details for your observations..."
                  value={currentResponse?.notes || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="min-h-[140px] resize-none bg-muted/10 border-muted/20 focus:border-primary/40 focus:ring-primary/10 rounded-xl text-sm italic"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur-md p-8 shadow-[0_-15px_40px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-8">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 font-black uppercase tracking-[0.2em] text-[10px] h-16 border-muted-foreground/10 hover:bg-muted/10 transition-all text-muted-foreground rounded-2xl active:scale-95"
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-3 h-6 w-6" /> Previous Module
          </Button>
 
          {currentIndex === questions.length - 1 ? (
            <Button
              size="lg"
              className="flex-1 font-black uppercase tracking-[0.2em] text-[10px] h-16 shadow-2xl shadow-success/30 hover:scale-[1.05] transition-all bg-success hover:bg-success text-success-foreground rounded-2xl active:scale-95 border-none"
              disabled={!canProceed || saving}
              onClick={() => saveProgress(true)}
            >
              {saving ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <CheckCircle2 className="mr-3 h-6 w-6" />} Finalize Deployment
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex-1 font-black uppercase tracking-[0.2em] text-[10px] h-16 shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all bg-primary hover:bg-primary rounded-2xl active:scale-95 border-none"
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={!canProceed}
            >
              Next Strategy <ChevronRight className="ml-3 h-6 w-6" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
