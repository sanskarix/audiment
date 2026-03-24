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
import { Plus, ArrowUp, ArrowDown, Trash2, ArrowLeft, Save, Loader2 } from 'lucide-react';
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
        <p className="text-muted-foreground animate-pulse">Loading template builder...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{templateId ? 'Edit' : 'Create'} Template</h1>
            <p className="text-muted-foreground text-xs">Design the blueprint for your organization's audits.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-destructive font-medium mr-2">{error}</span>
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={saveTemplate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              General Info
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Template Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekly Kitchen Check" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hygiene">Hygiene</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-muted/30 p-6 space-y-3">
            <h4 className="text-sm font-medium">Builder Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
              <li>Use <strong>Critical</strong> severity for questions that must be failed-proof.</li>
              <li>Enable <strong>Require Photo</strong> for visual evidence collection.</li>
              <li>Reorder questions for a logical flow during the audit walk-through.</li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 pb-20">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Questions <Badge variant="secondary" className="ml-1">{questions.length}</Badge>
            </h3>
            <Button size="sm" onClick={addEmptyQuestion} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/20 text-muted-foreground">
                  <Plus className="h-10 w-10 mb-4 opacity-20" />
                  <p>No questions yet. Start building your template.</p>
                  <Button variant="ghost" size="sm" onClick={addEmptyQuestion} className="mt-4">Add your first question</Button>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full" defaultValue={questions.map(q => q.order.toString())}>
                  {questions.map((q, idx) => (
                    <AccordionItem id={`question-${q.order}`} value={q.order.toString()} key={q.order} className="border rounded-xl bg-card mb-4 overflow-hidden shadow-sm transition-all hover:shadow-md">
                      <AccordionTrigger className="hover:no-underline px-4 py-4 data-[state=open]:bg-muted/30">
                        <div className="flex items-center space-x-3 text-left w-full pr-4">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0 shrink-0 bg-background font-bold">{q.order}</Badge>
                          <span className="font-medium flex-1 truncate">{q.questionText || 'New Question...'}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {q.requiresPhoto && <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-700 border-sky-200">Photo</Badge>}
                            <Badge variant={q.severity === 'critical' ? 'destructive' : q.severity === 'medium' ? 'secondary' : 'outline'} className="text-[10px] uppercase tracking-wider">
                              {q.severity}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 border-t bg-muted/5">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          <div className="md:col-span-12 space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold">Question Text</Label>
                            <Input value={q.questionText} onChange={e => updateQuestion(idx, 'questionText', e.target.value)} placeholder="Ask something clearly..." className="text-base" />
                          </div>
                          
                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold">Type</Label>
                            <Select value={q.questionType} onValueChange={val => updateQuestion(idx, 'questionType', val)}>
                              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes_no">Yes / No</SelectItem>
                                <SelectItem value="rating">Rating (1-10)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold">Severity</Label>
                            <Select value={q.severity} onValueChange={val => updateQuestion(idx, 'severity', val)}>
                              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-4 space-y-2 flex flex-col justify-end">
                            <div className="flex items-center justify-between p-2 rounded-md border bg-background px-3 h-10">
                              <Label className="text-xs uppercase text-muted-foreground font-bold cursor-pointer" htmlFor={`photo-${idx}`}>Require Photo</Label>
                              <Switch id={`photo-${idx}`} checked={q.requiresPhoto} onCheckedChange={val => updateQuestion(idx, 'requiresPhoto', val)} />
                            </div>
                          </div>

                          <div className="md:col-span-12 pt-4 flex justify-between items-center border-t mt-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" disabled={idx === 0} onClick={() => moveQuestion(idx, 'up')} className="rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="icon" disabled={idx === questions.length - 1} onClick={() => moveQuestion(idx, 'down')} className="rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                                <ArrowDown className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeQuestion(idx)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Remove Question
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
