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
        <p className="text-muted-foreground animate-pulse font-black uppercase tracking-widest text-[10px]">Synchronizing Architectural Data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 -mx-6 -mt-6 px-6 py-5 bg-background/80 backdrop-blur-xl border-b border-muted-foreground/10 shadow-2xl shadow-black/5 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-2xl font-Inter leading-none">
                {templateId ? 'Modify Blueprint' : 'Engineer Blueprint'}
              </h1>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-60">Design the structural intelligence for field operations</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-right duration-300">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <Button variant="ghost" onClick={() => router.back()} className="h-12 px-6 font-black uppercase tracking-widest text-[10px] rounded-2xl opacity-40 hover:opacity-100 transition-all">Discard</Button>
          <Button
            onClick={saveTemplate}
            disabled={loading}
            className="h-12 px-8 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 rounded-2xl group transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
          >
            {loading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Save className="mr-3 h-4 w-4 group-hover:rotate-12 transition-transform" />}
            Commit Blueprint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <Card className="standard-card p-1 pb-1 overflow-hidden shadow-2xl border-primary/5">
            <div className="bg-muted/5 p-8 border-b border-muted-foreground/10">
              <h3 className="text-sm font-Inter flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Save className="h-3 w-3 text-primary" />
                </div>
                Global Parameters
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-50">Blueprint Metadata</p>
            </div>
            <div className="p-8 space-y-8 bg-card">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Strategic Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. MISSION: KITCHEN OPS"
                  className="h-14 bg-muted/20 border-muted rounded-2xl font-black italic tracking-tight text-lg focus:ring-primary/10 transition-all px-6"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="category" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Sector Class</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="h-14 bg-muted/20 border-muted rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 focus:ring-primary/10 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hygiene" className="font-bold uppercase tracking-widest text-[10px]">Hygiene Control</SelectItem>
                    <SelectItem value="safety" className="font-bold uppercase tracking-widest text-[10px]">Safety Protocol</SelectItem>
                    <SelectItem value="inventory" className="font-bold uppercase tracking-widest text-[10px]">Mass Management</SelectItem>
                    <SelectItem value="custom" className="font-bold uppercase tracking-widest text-[10px]">Custom Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="rounded-3xl border border-muted-foreground/10 bg-foreground text-background p-10 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10 text-muted-foreground">ENGINEERING LOG</h4>
            <ul className="text-xs font-medium space-y-4 relative z-10 leading-relaxed italic opacity-80">
              <li className="flex gap-3">
                <span className="text-primary font-black not-italic tracking-[0.2em] opacity-40">01</span>
                Design critical modules for non-negotiable compliance failure checks.
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-black not-italic tracking-[0.2em] opacity-40">02</span>
                Mandate visual evidence where analytical proof is strictly necessary.
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-black not-italic tracking-[0.2em] opacity-40">03</span>
                Reorder sequence to match logical field deployment patterns.
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8 pb-32">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-Inter flex items-center gap-3">
                Intelligence Modules <Badge className="bg-primary text-primary-foreground font-black italic tracking-tighter rounded-lg px-2 text-xs">{questions.length}</Badge>
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-50">Construct specific analytical data points</p>
            </div>
            <Button size="lg" onClick={addEmptyQuestion} className="h-14 px-8 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Plus className="h-4 w-4 mr-3" /> Append Module
            </Button>
          </div>

          <div className="space-y-6">
            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-32 border-2 border-dashed border-muted-foreground/20 rounded-[2.5rem] bg-muted/5 text-muted-foreground transition-all hover:bg-muted/10">
                <Plus className="h-16 w-16 mb-8 opacity-10" />
                <p className="text-2xl font-Inter text-foreground/40">Zero Intelligence Defined</p>
                <p className="text-sm font-medium opacity-60 mt-2 max-w-[320px] text-center">Your blueprint requires analytical modules to be operational.</p>
                <Button variant="outline" size="lg" onClick={addEmptyQuestion} className="mt-8 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] border-primary/20 text-primary hover:bg-primary/5 transition-all">Start Engineering</Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full" defaultValue={questions.map(q => q.order.toString())}>
                {questions.map((q, idx) => (
                  <AccordionItem id={`question-${q.order}`} value={q.order.toString()} key={q.order} className="border-2 border-muted/30 rounded-[2rem] bg-card mb-6 overflow-hidden shadow-2xl shadow-black/5 transition-all hover:border-primary/30 group">
                    <AccordionTrigger className="hover:no-underline px-10 py-8 data-[state=open]:bg-muted/5">
                      <div className="flex items-center space-x-6 text-left w-full pr-8">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center p-0 shrink-0 bg-muted/10 font-black italic text-xl tabular-nums group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-muted-foreground/10">{q.order}</div>
                        <div className="flex-1 overflow-hidden">
                          <span className="font-black italic text-xl uppercase tracking-tighter block truncate group-hover:text-primary transition-colors">{q.questionText || 'UNDEFINED MODULE'}</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block mt-1 opacity-50">MOD_REF_{q.order.toString().padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          {q.requiresPhoto && (
                            <Badge variant="outline" className="text-[9px] font-black bg-primary/5 text-primary border-primary/20 uppercase tracking-widest px-3 py-1">
                              <Camera className="h-3 w-3 mr-1.5" /> Evidence
                            </Badge>
                          )}
                          <Badge
                            variant={q.severity === 'critical' ? 'destructive' : q.severity === 'medium' ? 'secondary' : 'outline'}
                            className={cn(
                              "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 shadow-lg",
                              q.severity === 'critical' ? "shadow-destructive/20 border-none" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            {q.severity} SEVERITY
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-10 py-10 border-t-2 border-muted/10 bg-muted/5">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        <div className="md:col-span-12 space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Inquiry Definition</Label>
                          <Input
                            value={q.questionText}
                            onChange={e => updateQuestion(idx, 'questionText', e.target.value)}
                            placeholder="Define the specific analytical inquiry..."
                            className="h-16 bg-background border-muted rounded-2xl font-black italic tracking-tight text-xl focus:ring-primary/10 transition-all px-8 focus:scale-[1.01]"
                          />
                        </div>

                        <div className="md:col-span-4 space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Data Model</Label>
                          <Select value={q.questionType} onValueChange={val => updateQuestion(idx, 'questionType', val)}>
                            <SelectTrigger className="h-14 bg-background border-muted rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 focus:ring-primary/10 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes_no" className="font-bold uppercase tracking-widest text-[10px]">Boolean (Yes/No)</SelectItem>
                              <SelectItem value="rating" className="font-bold uppercase tracking-widest text-[10px]">Scalar (1-10)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Risk Impact</Label>
                          <Select value={q.severity} onValueChange={val => updateQuestion(idx, 'severity', val)}>
                            <SelectTrigger className="h-14 bg-background border-muted rounded-2xl font-black uppercase tracking-widest text-[10px] px-6 focus:ring-primary/10 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low" className="font-bold uppercase tracking-widest text-[10px]">Low Impact</SelectItem>
                              <SelectItem value="medium" className="font-bold uppercase tracking-widest text-[10px]">Medium Impact</SelectItem>
                              <SelectItem value="critical" className="font-bold uppercase tracking-widest text-[10px] text-destructive">Mission Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-4 space-y-3 flex flex-col justify-end">
                          <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-muted bg-background px-6 h-14 group/switch transition-all hover:border-primary/20">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest cursor-pointer group-hover/switch:text-foreground transition-colors" htmlFor={`photo-${idx}`}>Mandate Proof</Label>
                            <Switch id={`photo-${idx}`} checked={q.requiresPhoto} onCheckedChange={val => updateQuestion(idx, 'requiresPhoto', val)} className="data-[state=checked]:bg-primary" />
                          </div>
                        </div>

                        <div className="md:col-span-12 pt-10 flex justify-between items-center border-t border-muted/20 mt-4">
                          <div className="flex gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={idx === 0}
                              onClick={() => moveQuestion(idx, 'up')}
                              className="h-12 w-12 rounded-2xl border-2 border-muted hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-90 disabled:opacity-20"
                            >
                              <ArrowUp className="w-5 h-5 text-current" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={idx === questions.length - 1}
                              onClick={() => moveQuestion(idx, 'down')}
                              className="h-12 w-12 rounded-2xl border-2 border-muted hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-90 disabled:opacity-20"
                            >
                              <ArrowDown className="w-5 h-5 text-current" />
                            </Button>
                          </div>
                          <Button variant="ghost" className="h-12 px-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all active:scale-90" onClick={() => removeQuestion(idx)}>
                            <Trash2 className="w-4 h-4 mr-3" /> Terminate Module
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
