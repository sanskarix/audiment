'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, doc, addDoc, getDocs, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, ArrowUp, ArrowDown, Trash2, ArrowLeft, Save, AlertCircle, Camera, FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import { useAuthSync } from '@/components/AuthProvider';
import posthog from 'posthog-js';

type QuestionType = 'yes_no' | 'rating';
type SeverityType = 'low' | 'medium' | 'critical';

interface QuestionDraft {
  id?: string;
  questionText: string;
  questionType: QuestionType;
  severity: SeverityType;
  requiresPhoto: boolean;
  order: number;
}

interface TemplateBuilderProps {
  templateId?: string;
}

export default function TemplateBuilder({ templateId }: TemplateBuilderProps) {
  // orgId and uid come from Firebase ID token claims via AuthProvider —
  // these are always authoritative and do not depend on the session cookie.
  const { isSynced, uid, orgId } = useAuthSync();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!templateId);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hygiene');
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | undefined>();

  useEffect(() => {
    if (!isSynced || !templateId || !orgId) return;

    const loadTemplate = async () => {
      setFetching(true);
      try {
        const tDoc = await getDoc(doc(db, 'auditTemplates', templateId));
        if (tDoc.exists()) {
          const data = tDoc.data();
          setTitle(data.title);
          setCategory(data.category);

          const qsQuery = query(collection(db, `auditTemplates/${templateId}/questions`));
          const snapshot = await getDocs(qsQuery);
          const fetchedQs: QuestionDraft[] = [];
          snapshot.forEach(d => {
            const qData = d.data();
            fetchedQs.push({
              id: d.id,
              questionText: qData.questionText,
              questionType: qData.questionType,
              severity: qData.severity,
              requiresPhoto: qData.requiresPhoto,
              order: qData.order,
            });
          });
          fetchedQs.sort((a, b) => a.order - b.order);
          setQuestions(fetchedQs);
        }
      } catch (e) {
        console.error('Error loading template:', e);
        setError('Failed to load template');
      } finally {
        setFetching(false);
      }
    };

    loadTemplate();
  }, [templateId, orgId, isSynced]);

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newQ = [...questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newQ[index];
    newQ[index] = newQ[targetIdx];
    newQ[targetIdx] = temp;

    const ordered = newQ.map((q, i) => ({ ...q, order: i + 1 }));
    setQuestions(ordered);
    scrollToQuestion(targetIdx + 1);
  };

  const scrollToQuestion = (order: number) => {
    setTimeout(() => {
      const element = document.getElementById(`question-${order}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const addEmptyQuestion = () => {
    const nextOrder = questions.length + 1;
    setQuestions([
      ...questions,
      { questionText: '', questionType: 'yes_no', severity: 'low', requiresPhoto: false, order: nextOrder }
    ]);
    setExpandedQuestion(nextOrder.toString());
    scrollToQuestion(nextOrder);
  };

  const removeQuestion = (index: number) => {
    const newQ = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }));
    setQuestions(newQ);
  };

  const updateQuestion = (index: number, field: keyof QuestionDraft, value: any) => {
    const newQ = [...questions];
    newQ[index] = { ...newQ[index], [field]: value };
    setQuestions(newQ);
  };

  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  useEffect(() => {
    if (title || questions.length > 0) {
      setIsDirty(true);
    }
  }, [title, questions]);

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      router.back();
    }
  };

  const saveTemplate = async () => {
    // ... existing validation
    if (!title.trim() || questions.length === 0 || !orgId) {
      setError('Title and at least 1 question required.');
      return;
    }
    const emptyQ = questions.find(q => !q.questionText.trim());
    if (emptyQ) {
      setError('All questions must have text.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const batch = writeBatch(db);
      let tRef;

      if (templateId) {
        tRef = doc(db, 'auditTemplates', templateId);
        batch.update(tRef, { title, category });

        const qsQuery = query(collection(db, `auditTemplates/${templateId}/questions`));
        const snapshot = await getDocs(qsQuery);
        snapshot.forEach(d => {
          batch.delete(doc(db, `auditTemplates/${templateId}/questions`, d.id));
        });
      } else {
        tRef = doc(collection(db, 'auditTemplates'));
        batch.set(tRef, {
          organizationId: orgId,
          title,
          category,
          isActive: true,
          createdBy: uid,
          createdAt: serverTimestamp(),
        });
      }

      questions.forEach(q => {
        const qRef = doc(collection(db, `auditTemplates/${tRef.id}/questions`));
        batch.set(qRef, {
          questionText: q.questionText,
          questionType: q.questionType,
          maxScore: q.questionType === 'yes_no' ? 1 : 10,
          severity: q.severity,
          requiresPhoto: q.requiresPhoto,
          order: q.order,
        });
      });

      await batch.commit();
      setIsDirty(false); // Clear dirty state after save
      posthog.capture('template_saved', {
        is_new: !templateId,
        template_title: title,
        category,
        question_count: questions.length,
      });
      router.push('/dashboard/admin/templates');
    } catch (e: any) {
      posthog.captureException(e);
      setError(e.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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

  return (
    <div className="flex flex-col gap-6">
      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-50 -mx-4 md:-mx-6 -mt-6 md:-mt-8 px-4 md:px-6 py-3 md:py-4 bg-background/95 backdrop-blur-xl border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="h-9 w-9 flex items-center justify-center rounded-full text-muted-text hover:bg-muted/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-5 w-[1px] bg-border/80 hidden md:block"></div>
          <h1 className="text-lg md:text-xl font-bold text-heading truncate pr-2">
            {templateId ? (title || 'Edit Template') : (title || 'New Template')}
          </h1>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center gap-2">
            {error && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-destructive/5 border border-destructive/20 rounded-md text-destructive text-[11px] font-medium md:animate-in md:slide-in-from-right max-w-[150px] md:max-w-none truncate">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span className="truncate">{error}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-10 px-3 font-semibold text-muted-text hover:text-foreground text-xs md:text-sm"
            >
              Discard
            </Button>
            <Button
              size="sm"
              onClick={saveTemplate}
              disabled={loading}
              className="h-10 px-4 md:px-5 font-bold shadow-lg shadow-primary/20 gap-2 active:scale-95 transition-all text-xs md:text-sm"
            >
              {loading
                ? <div className="h-3 w-3 md:h-4 md:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                : <Save className="h-4 w-4" />
              }
              {loading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile error ── */}
      {error && (
        <div className="md:hidden bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-md text-sm font-normal animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

        {/* ── Left Column: Config ── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="standard-card">
            <div className="p-5 border-b border-border/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h3 className="section-heading">General Settings</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-body font-normal">Template Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Kitchen Hygiene Audit"
                  className="text-body"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-body font-normal">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="text-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hygiene" className="text-body">Hygiene</SelectItem>
                    <SelectItem value="safety" className="text-body">Safety</SelectItem>
                    <SelectItem value="inventory" className="text-body">Inventory</SelectItem>
                    <SelectItem value="custom" className="text-body">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Tips card */}
          <Card className="standard-card">
            <div className="p-5 border-b border-border/50">
              <h3 className="section-heading">Best Practices</h3>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {[
                  'Define critical failure points first.',
                  'Require photo proof for high-risk checks.',
                  'Keep questions short and actionable.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-medium text-sm tabular-nums shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="body-text">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* ── Right Column: Questions ── */}
        <div className="lg:col-span-8 space-y-4 pb-32">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col gap-1">
              <h3 className="section-heading flex items-center gap-2">
                Questions
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[12px] font-normal">
                  {questions.length}
                </Badge>
              </h3>
              <p className="body-text">Add the checks that auditors will complete.</p>
            </div>
            <Button
              size="default"
              onClick={addEmptyQuestion}
              className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {/* Empty state */}
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-border rounded-xl bg-muted/5 text-center">
              <div className="bg-muted/20 p-5 rounded-full mb-5">
                <FileText className="h-8 w-8 opacity-20" />
              </div>
              <p className="section-heading opacity-40 mb-1">No questions yet</p>
              <p className="body-text mb-6">Start adding questions to build your audit template.</p>
              <Button
                variant="outline"
                onClick={addEmptyQuestion}
                className="h-11 px-5 gap-2 border-primary/20 text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4" />
                Add First Question
              </Button>
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-3"
              value={expandedQuestion}
              onValueChange={setExpandedQuestion}
            >
              {questions.map((q, idx) => (
                <AccordionItem
                  id={`question-${q.order}`}
                  value={q.order.toString()}
                  key={q.order}
                  className="standard-card rounded-xl overflow-hidden group border border-border/50 data-[state=open]:border-primary/20"
                >
                  <AccordionTrigger className="hover:no-underline px-5 py-4 data-[state=open]:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4 text-left w-full pr-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-muted/60 font-medium text-sm tabular-nums text-heading border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {q.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="body-text text-[14px] font-normal text-heading block truncate group-hover:text-primary transition-colors">
                          {q.questionText || 'New question...'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {q.requiresPhoto && (
                          <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5 gap-1 text-muted-text">
                            <Camera className="h-3 w-3" />
                            Photo
                          </Badge>
                        )}
                        <Badge
                          className={cn(
                            'text-[11px] font-normal px-2 py-0.5 border',
                            q.severity === 'critical'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : q.severity === 'medium'
                                ? 'bg-warning/10 text-warning border-warning/20'
                                : 'bg-muted/60 text-muted-foreground border-border'
                          )}
                        >
                          {q.severity.charAt(0).toUpperCase() + q.severity.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 py-5 border-t border-border/50 bg-muted/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-12 flex flex-col gap-2">
                        <Label className="text-body font-normal">Question</Label>
                        <Input
                          value={q.questionText}
                          onChange={e => updateQuestion(idx, 'questionText', e.target.value)}
                          placeholder="What needs to be checked?"
                          className="text-body"
                        />
                      </div>
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <Label className="text-body font-normal">Response Type</Label>
                        <Select value={q.questionType} onValueChange={val => updateQuestion(idx, 'questionType', val)}>
                          <SelectTrigger className="text-body">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes_no" className="text-body">Yes / No</SelectItem>
                            <SelectItem value="rating" className="text-body">Rating (1–10)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <Label className="text-body font-normal">Severity</Label>
                        <Select value={q.severity} onValueChange={val => updateQuestion(idx, 'severity', val)}>
                          <SelectTrigger className="text-body">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low" className="text-body">Low</SelectItem>
                            <SelectItem value="medium" className="text-body">Medium</SelectItem>
                            <SelectItem value="critical" className="text-body text-destructive">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-4 flex items-end">
                        <div className="flex items-center justify-between w-full h-11 px-4 rounded-md border border-border bg-background">
                          <Label className="text-body font-normal cursor-pointer" htmlFor={`photo-${idx}`}>Require Photo</Label>
                          <Switch
                            id={`photo-${idx}`}
                            checked={q.requiresPhoto}
                            onCheckedChange={val => updateQuestion(idx, 'requiresPhoto', val)}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-12 pt-3 flex justify-between items-center border-t border-border/50">
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon-sm" disabled={idx === 0} onClick={() => moveQuestion(idx, 'up')} aria-label="Move question up"><ArrowUp className="w-3.5 h-3.5" /></Button>
                          <Button variant="outline" size="icon-sm" disabled={idx === questions.length - 1} onClick={() => moveQuestion(idx, 'down')} aria-label="Move question down"><ArrowDown className="w-3.5 h-3.5" /></Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 gap-1.5 font-medium" onClick={() => removeQuestion(idx)}><Trash2 className="w-3.5 h-3.5" /> Remove</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>

      {/* ── Discard Confirmation Dialog ── */}
      <Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-destructive/10 p-6 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-heading">Discard Changes?</h2>
              <p className="text-sm text-body px-4">You have unsaved changes. Leaving this page will permanently lose your work.</p>
            </div>
          </div>
          <div className="p-4 bg-background flex flex-col gap-2">
            <Button 
               variant="destructive" 
               className="w-full h-11 font-bold rounded-xl shadow-lg shadow-destructive/10" 
               onClick={() => router.back()}
            >
              Discard Changes
            </Button>
            <Button 
               variant="ghost" 
               className="w-full h-11 font-semibold text-muted-text hover:text-foreground" 
               onClick={() => setShowDiscardConfirm(false)}
            >
              Continue Editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
