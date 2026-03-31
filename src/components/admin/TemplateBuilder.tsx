'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, doc, updateDoc, addDoc, getDocs, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, ArrowUp, ArrowDown, Trash2, ArrowLeft, Save, Loader2, AlertCircle, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!templateId);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hygiene');
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId, uid: data.uid });
      } catch (e) {
        console.error('Failed to parse session cookie', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!templateId || !session?.orgId) return;

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
  }, [templateId, session]);

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

  const saveTemplate = async () => {
    if (!title.trim() || questions.length === 0 || !session?.orgId) {
      setError('Title and at least 1 question required.');
      return;
    }
    const emptyQ = questions.find(q => !q.questionText.trim());
    if (emptyQ) {
      setError('All questions must have text.');
      return;
    }

    setLoading(true);
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
          organizationId: session.orgId,
          title,
          category,
          isActive: true,
          createdBy: session.uid,
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
      router.push('/dashboard/admin/templates');
    } catch (e: any) {
      setError(e.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-text animate-pulse font-normal  tracking-widest text-[10px]">Synchronizing Architectural Data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 -mx-6 -mt-6 px-6 py-4 bg-background/95 backdrop-blur-xl border-b border-border/50 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full hover:bg-muted transition-all active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-xs">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h1 className="text-xl font-semibold tracking-tight text-heading">
                {templateId ? 'Edit Blueprint' : 'New Blueprint'}
              </h1>
            </div>
            <p className="text-[10px] font-normal text-muted-text  tracking-widest opacity-60">Design the structural intelligence for operations</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-destructive/5 border border-destructive/20 rounded-lg text-destructive text-[10px] font-normal  tracking-widest animate-in slide-in-from-right">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <Button variant="ghost" onClick={() => router.back()} className="h-10 px-4 font-medium  tracking-widest text-[10px] opacity-40 hover:opacity-100 italic transition-all text-muted-text">Discard</Button>
          <Button
            onClick={saveTemplate}
            disabled={loading}
            className="h-10 px-6 font-medium  tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Commit Blueprint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="standard-card">
            <div className="p-6 border-b border-border/50">
              <h3 className="section-heading flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Save className="h-4 w-4 text-primary" />
                </div>
                General Config
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-[10px] font-normal  text-muted-text tracking-widest pl-1">Blueprint Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Kitchen Hygiene v1.2"
                  className="h-10 text-sm font-normal tracking-tight text-body"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[10px] font-normal  text-muted-text tracking-widest pl-1">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="h-10 text-xs font-medium  tracking-widest text-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hygiene" className="font-normal  tracking-widest text-[10px] text-body">Hygiene</SelectItem>
                    <SelectItem value="safety" className="font-normal  tracking-widest text-[10px] text-body">Safety</SelectItem>
                    <SelectItem value="inventory" className="font-normal  tracking-widest text-[10px] text-body">Inventory</SelectItem>
                    <SelectItem value="custom" className="font-normal  tracking-widest text-[10px] text-body">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4 shadow-sm">
            <h4 className="text-[10px] font-medium  tracking-widest text-primary/60">CONSTRUCTION RULES</h4>
            <ul className="text-xs font-normal space-y-3 leading-relaxed text-muted-text">
              <li className="flex gap-2">
                <span className="text-primary font-medium">01</span>
                Define critical failure points.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-medium">02</span>
                Mandate proof for high-risk areas.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-medium">03</span>
                Optimise flow for floor movement.
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6 pb-32">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="section-heading flex items-center gap-3">
                Question Modules <Badge variant="secondary" className="rounded-full px-2">{questions.length}</Badge>
              </h3>
              <p className="body-text mt-1">Construct specific analytical data points</p>
            </div>
            <Button size="default" onClick={addEmptyQuestion} className="shadow-lg shadow-primary/10 active:scale-95 transition-all">
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>

          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-32 border-2 border-dashed border-muted-text/20 rounded-[2.5rem] bg-muted/5 text-muted-text transition-all hover:bg-muted/10">
                <Plus className="h-16 w-16 mb-8 opacity-10" />
                <p className="text-2xl font-normal text-heading/40">Zero Intelligence Defined</p>
                <p className="text-sm font-normal opacity-60 mt-2 max-w-[320px] text-center">Your blueprint requires analytical modules to be operational.</p>
                <Button variant="outline" size="lg" onClick={addEmptyQuestion} className="mt-8 h-14 px-10 rounded-2xl font-medium  tracking-widest text-[10px] border-primary/20 text-primary hover:bg-primary/5 transition-all">Start Engineering</Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full" defaultValue={questions.map(q => q.order.toString())}>
                {questions.map((q, idx) => (
                  <AccordionItem id={`question-${q.order}`} value={q.order.toString()} key={q.order} className="border border-border/50 rounded-xl bg-card mb-4 overflow-hidden shadow-sm transition-all hover:border-primary/30 group">
                    <AccordionTrigger className="hover:no-underline px-6 py-5 data-[state=open]:bg-muted/30">
                      <div className="flex items-center space-x-4 text-left w-full pr-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-muted/50 font-medium text-base tabular-nums group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-border/50 text-heading">{q.order}</div>
                        <div className="flex-1 overflow-hidden">
                          <span className="font-medium text-base text-heading block truncate group-hover:text-primary transition-colors">{q.questionText || 'New Question...'}</span>
                          <span className="text-[9px] font-normal  tracking-widest text-muted-text block mt-0.5 opacity-50">UNIT_{q.order.toString().padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {q.requiresPhoto && (
                            <Badge variant="outline" className="text-[9px] font-medium bg-muted/30  tracking-widest px-2 py-0.5 text-muted-text">
                              <Camera className="h-3 w-3 mr-1" /> Photo Ref
                            </Badge>
                          )}
                          <Badge
                            variant={q.severity === 'critical' ? 'destructive' : q.severity === 'medium' ? 'secondary' : 'outline'}
                            className="text-[9px] font-medium  tracking-widest px-2 py-0.5"
                          >
                            {q.severity}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-6 border-t border-border/50 bg-muted/10">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-12 flex flex-col gap-2">
                          <Label className="text-[10px] font-normal  text-muted-text tracking-widest pl-1">Inquiry Definition</Label>
                          <Input
                            value={q.questionText}
                            onChange={e => updateQuestion(idx, 'questionText', e.target.value)}
                            placeholder="What needs to be checked?"
                            className="h-10 text-sm font-normal text-body"
                          />
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-2">
                          <Label className="text-[10px] font-normal  text-muted-text tracking-widest pl-1">Data Model</Label>
                          <Select value={q.questionType} onValueChange={val => updateQuestion(idx, 'questionType', val)}>
                            <SelectTrigger className="h-10 text-[10px] font-medium  tracking-widest text-body">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes_no" className="font-normal  tracking-widest text-[10px] text-body">Yes / No</SelectItem>
                              <SelectItem value="rating" className="font-normal  tracking-widest text-[10px] text-body">Rating (1-10)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-2">
                          <Label className="text-[10px] font-normal  text-muted-text tracking-widest pl-1">Severity</Label>
                          <Select value={q.severity} onValueChange={val => updateQuestion(idx, 'severity', val)}>
                            <SelectTrigger className="h-10 text-[10px] font-medium  tracking-widest text-body">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low" className="font-normal  tracking-widest text-[10px] text-body">Low</SelectItem>
                              <SelectItem value="medium" className="font-normal  tracking-widest text-[10px] text-body">Medium</SelectItem>
                              <SelectItem value="critical" className="font-normal  tracking-widest text-[10px] text-destructive">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 flex items-end">
                          <div className="flex items-center justify-between w-full h-10 px-4 rounded-lg border border-border bg-background">
                            <Label className="text-[10px] font-normal  text-muted-text tracking-widest cursor-pointer" htmlFor={`photo-${idx}`}>Mandatory Photo</Label>
                            <Switch id={`photo-${idx}`} checked={q.requiresPhoto} onCheckedChange={val => updateQuestion(idx, 'requiresPhoto', val)} />
                          </div>
                        </div>

                        <div className="md:col-span-12 pt-4 flex justify-between items-center border-t border-border/50 mt-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              disabled={idx === 0}
                              onClick={() => moveQuestion(idx, 'up')}
                              className="rounded-md"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              disabled={idx === questions.length - 1}
                              onClick={() => moveQuestion(idx, 'down')}
                              className="rounded-md"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 rounded-md font-medium text-[10px]  tracking-widest" onClick={() => removeQuestion(idx)}>
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
