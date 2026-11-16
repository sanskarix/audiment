'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, doc, addDoc, getDocs, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { Button } from '@/components/app-ui/button';
import { Badge } from '@/components/app-ui/badge';
import { Input } from '@/components/app-ui/input';
import { Label } from '@/components/app-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/app-ui/select';
import { Switch } from '@/components/app-ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/app-ui/accordion';
import { Card } from '@/components/app-ui/card';
import { cn } from '@/lib/utils';
import { Plus, ArrowUp, ArrowDown, Trash2, ArrowLeft, Save, AlertCircle, Camera, FileText, Globe, Sparkles, Check } from 'lucide-react';
import { Skeleton } from "@/components/app-ui/skeleton";
import { Textarea } from '@/components/app-ui/textarea';
import { useRouter } from 'next/navigation';
import { useAuthSync } from '@/components/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/app-ui/dialog';
import {
  TOP_10_COUNTRIES,
  COMPLIANCE_TEMPLATES,
  getCountryInfo,
  ComplianceTemplate,
  INDUSTRY_OPTIONS,
  INDUSTRY_TEMPLATES,
  normalizeIndustry,
} from '@/lib/compliance-templates';

const CATEGORY_OPTIONS = [
  { value: 'hygiene', label: 'Hygiene' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'safety', label: 'Safety' },
  { value: 'operations', label: 'Operations' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'general', label: 'General' },
  { value: 'custom', label: 'Other' },
];

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
  // orgId and uid come from Firebase ID token claims via AuthProvider –
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

  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState<'industry' | 'country'>('industry');
  const [orgCountry, setOrgCountry] = useState('IN');
  const [activeCountryTab, setActiveCountryTab] = useState('IN');
  const [orgIndustry, setOrgIndustry] = useState('');
  const [activeIndustryTab, setActiveIndustryTab] = useState('restaurant');

  useEffect(() => {
    if (!orgId) return;
    const fetchOrgCountry = async () => {
      try {
        const snap = await getDoc(doc(db, 'organizations', orgId));
        if (snap.exists()) {
          const c = snap.data()?.country || (Array.isArray(snap.data()?.countries) && snap.data()?.countries[0]) || 'IN';
          const ind = snap.data()?.industry || '';
          setOrgCountry(c);
          setActiveCountryTab(c);
          setOrgIndustry(ind);
          if (ind) {
            setActiveIndustryTab(normalizeIndustry(ind));
          }
        }
      } catch (err) {
        console.error('Error fetching org country in builder:', err);
      }
    };
    fetchOrgCountry();
  }, [orgId]);

  const applyPreset = (preset: ComplianceTemplate) => {
    if (questions.length > 0) {
      if (!confirm(`Apply "${preset.title}"? This will replace your current ${questions.length} question(s).`)) {
        return;
      }
    }
    setTitle(preset.title);
    setCategory(preset.category);
    const drafts: QuestionDraft[] = preset.questions.map((q, idx) => ({
      questionText: q.questionText,
      questionType: q.questionType,
      severity: q.severity,
      requiresPhoto: q.requiresPhoto,
      order: idx + 1,
    }));
    setQuestions(drafts);
    setExpandedQuestion('1');
    setPresetModalOpen(false);
  };

  useEffect(() => {
    if (!isSynced || !templateId || !orgId) return;

    const loadTemplate = async () => {
      setFetching(true);
      try {
        const tDoc = await getDoc(doc(db, 'auditTemplates', templateId));
        if (tDoc.exists()) {
          const data = tDoc.data();
          setTitle(data.title || '');
          setCategory(data.category ? String(data.category).toLowerCase().trim() : 'hygiene');

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

  const saveTemplate = async () => {
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
      router.push('/dashboard/admin/templates');
    } catch (e: any) {
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
      <div className="sticky top-0 z-50 -mx-6 -mt-8 px-6 py-4 bg-background/95 backdrop-blur-xl border-b border-border/50 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-muted-text hover:text-primary transition-colors flex items-center">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="h-5 w-[1px] bg-border/80"></div>
            <h1 className="text-xl font-semibold text-heading">
              {templateId ? (title || 'Edit Template') : (title || 'New Template')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-destructive/5 border border-destructive/20 rounded-lg text-destructive text-sm font-normal animate-in slide-in-from-right">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setPresetModalOpen(true)}
            className="h-11 px-4 gap-2 border-border/80 hover:bg-muted/30 font-medium text-[13px]"
          >
            <Globe className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Load Country Standard</span>
            <span className="sm:hidden">Standards</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-11 px-4 font-medium text-muted-text hover:text-foreground"
          >
            Discard
          </Button>
          <Button
            onClick={saveTemplate}
            disabled={loading}
            className="h-11 px-5 font-medium shadow-lg shadow-primary/20 gap-2 active:scale-95 transition-all"
          >
            {loading
              ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              : <Save className="h-4 w-4" />
            }
            {loading ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>

      {/* ── Mobile error ── */}
      {error && (
        <div className="md:hidden bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-md text-sm font-normal animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

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
                <Label htmlFor="title" className="field-label">Template Title</Label>
                <Textarea
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Kitchen Hygiene Audit"
                  rows={2}
                  className="text-body min-h-[52px] resize-none text-[13px] leading-snug"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="field-label">Category</Label>
                <Select value={category || 'hygiene'} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full text-body bg-background border-border/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-body">
                        {opt.label}
                      </SelectItem>
                    ))}
                    {category && !CATEGORY_OPTIONS.some(opt => opt.value === category) && (
                      <SelectItem value={category} className="text-body">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    )}
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
                <span className="status-badge-xs badge-muted">
                  {questions.length}
                </span>
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
            <div className="empty-state">
              <div className="empty-state-icon mb-4">
                <FileText className="h-8 w-8 opacity-40 text-muted-text" />
              </div>
              <p className="empty-state-title mb-1">No questions yet</p>
              <p className="empty-state-body mb-6">
                Start from an official national compliance standard or create your custom checklist from scratch.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="default"
                  onClick={() => setPresetModalOpen(true)}
                  className="h-11 px-5 gap-2 shadow-md shadow-primary/20 text-[13px]"
                >
                  <Sparkles className="h-4 w-4" />
                  Load Country Standard
                </Button>
                <Button
                  variant="outline"
                  onClick={addEmptyQuestion}
                  className="h-11 px-5 gap-2 border-primary/20 text-primary hover:bg-primary/5 text-[13px]"
                >
                  <Plus className="h-4 w-4" />
                  Blank Question
                </Button>
              </div>
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
                  {/* ── Question Header (trigger) ── */}
                  <AccordionTrigger className="hover:no-underline px-5 py-3.5 data-[state=open]:bg-muted/15 transition-colors">
                    <div className="flex items-center gap-3.5 text-left flex-1 min-w-0">
                      {/* Order number */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-muted/40 font-semibold text-[13px] tabular-nums text-heading border border-border/60 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        {q.order}
                      </div>
                      {/* Question text */}
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-[14px] font-medium text-heading line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {q.questionText || 'New question...'}
                        </p>
                      </div>
                      {/* Badges */}
                      <div className="flex items-center gap-2 shrink-0 ml-auto mr-1">
                        {q.requiresPhoto && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
                            <Camera className="h-3 w-3" />
                            Photo
                          </span>
                        )}
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border',
                            q.severity === 'critical'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : q.severity === 'medium'
                                ? 'bg-warning/10 text-warning border-warning/20'
                                : 'bg-muted/40 text-muted-foreground border-border/50'
                          )}
                        >
                          {q.severity.charAt(0).toUpperCase() + q.severity.slice(1)}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* ── Question Body ── */}
                  <AccordionContent className="px-5 py-5 border-t border-border/50 bg-muted/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                      {/* Question text */}
                      <div className="md:col-span-12 flex flex-col gap-2">
                        <Label className="field-label">Question</Label>
                        <Textarea
                          value={q.questionText}
                          onChange={e => updateQuestion(idx, 'questionText', e.target.value)}
                          placeholder="What needs to be checked?"
                          rows={2}
                          className="text-body min-h-[64px] resize-y text-[13px] leading-relaxed"
                        />
                      </div>

                      {/* Response type */}
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <Label className="field-label">Response Type</Label>
                        <Select value={q.questionType} onValueChange={val => updateQuestion(idx, 'questionType', val)}>
                          <SelectTrigger className="w-full text-body bg-background border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes_no" className="text-body">Yes / No</SelectItem>
                            <SelectItem value="rating" className="text-body">Rating (1–10)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Severity */}
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <Label className="field-label">Severity</Label>
                        <Select value={q.severity} onValueChange={val => updateQuestion(idx, 'severity', val)}>
                          <SelectTrigger className="w-full text-body bg-background border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low" className="text-body">Low</SelectItem>
                            <SelectItem value="medium" className="text-body">Medium</SelectItem>
                            <SelectItem value="critical" className="text-body text-destructive">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Photo toggle */}
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <Label className="field-label invisible md:visible">Photo Proof</Label>
                        <div className="flex items-center justify-between w-full h-10 px-3.5 rounded-md border border-border/50 bg-background">
                          <Label
                            className="text-body font-normal text-[13px] cursor-pointer"
                            htmlFor={`photo-${idx}`}
                          >
                            Require Photo
                          </Label>
                          <Switch
                            id={`photo-${idx}`}
                            checked={q.requiresPhoto}
                            onCheckedChange={val => updateQuestion(idx, 'requiresPhoto', val)}
                          />
                        </div>
                      </div>

                      {/* Row actions */}
                      <div className="md:col-span-12 pt-3 flex justify-between items-center border-t border-border/50">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={idx === 0}
                            onClick={() => moveQuestion(idx, 'up')}
                            aria-label="Move question up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={idx === questions.length - 1}
                            onClick={() => moveQuestion(idx, 'down')}
                            aria-label="Move question down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 gap-1.5 font-medium"
                          onClick={() => removeQuestion(idx)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
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

      {/* ── Industry & National Compliance Blueprint Modal ── */}
      <Dialog open={presetModalOpen} onOpenChange={setPresetModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Load Audit Blueprint into Builder
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-text mt-1">
                  Select a tailored industry template or official national checklist to auto-populate title, category, and audit questions.
                </DialogDescription>
              </div>
            </div>

            {/* Mode Switcher: Industry vs Country */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl w-fit mb-2">
              <button
                type="button"
                onClick={() => setBlueprintMode('industry')}
                className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  blueprintMode === 'industry'
                    ? 'bg-white text-heading shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-heading'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Industry Templates (All 8 Sectors)</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBlueprintMode('country')}
                className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  blueprintMode === 'country'
                    ? 'bg-white text-heading shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-heading'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>National Regulatory Standards</span>
                </span>
              </button>
            </div>

            {/* Sub-Tabs: Industry List Carousel OR Country Carousel */}
            {blueprintMode === 'industry' ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
                {INDUSTRY_OPTIONS.map((ind) => {
                  const isActive = activeIndustryTab === ind.value;
                  const isOrgInd = normalizeIndustry(orgIndustry) === ind.value;
                  return (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => setActiveIndustryTab(ind.value)}
                      className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : isOrgInd
                          ? 'bg-primary/5 text-primary border-primary/30 hover:bg-primary/10'
                          : 'bg-muted/20 text-muted-foreground border-border/60 hover:bg-muted/40'
                      }`}
                    >
                      <span>{ind.icon}</span>
                      <span>{ind.label}</span>
                      {isOrgInd && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Your Organization Industry" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
                {TOP_10_COUNTRIES.map((c) => {
                  const isActive = activeCountryTab === c.code;
                  const isOrgCountry = orgCountry === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setActiveCountryTab(c.code)}
                      className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : isOrgCountry
                          ? 'bg-primary/5 text-primary border-primary/30 hover:bg-primary/10'
                          : 'bg-muted/20 text-muted-foreground border-border/60 hover:bg-muted/40'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      {isOrgCountry && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Your Workspace Country" />
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveCountryTab('GLOBAL')}
                  className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border ${
                    activeCountryTab === 'GLOBAL'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-muted/20 text-muted-foreground border-border/60 hover:bg-muted/40'
                  }`}
                >
                  <span>🌐</span>
                  <span>Universal / Global</span>
                </button>
              </div>
            )}
          </DialogHeader>

          {/* Preset Cards */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {blueprintMode === 'industry' ? (
              (() => {
                const tmpl = INDUSTRY_TEMPLATES[activeIndustryTab] || INDUSTRY_TEMPLATES.restaurant;
                const activeIndOption = INDUSTRY_OPTIONS.find((opt) => opt.value === activeIndustryTab);

                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-semibold text-heading flex items-center gap-1.5">
                              <span>{activeIndOption?.icon}</span>
                              <span>{tmpl.title}</span>
                            </span>
                            <Badge variant="secondary" className="status-badge-xs badge-muted capitalize">
                              {tmpl.category}
                            </Badge>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {tmpl.authority}
                            </span>
                          </div>
                          <p className="text-xs text-muted-text leading-relaxed">
                            {tmpl.description}
                          </p>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-4 pt-1 flex-wrap">
                            <span>📋 {tmpl.questions.length} questions</span>
                            <span>📸 {tmpl.questions.filter((q) => q.requiresPhoto).length} photo verifications</span>
                            <span>⚡ {tmpl.questions.filter((q) => q.severity === 'critical').length} critical checkpoints</span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={() => applyPreset(tmpl)}
                          className="h-9 px-4 text-xs gap-1.5 shadow-sm active:scale-95 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Apply to Builder
                        </Button>
                      </div>
                    </div>

                    {/* Question Breakdown */}
                    <div className="space-y-2 pt-1">
                      <h5 className="text-xs font-semibold text-heading uppercase tracking-wider text-muted-foreground">
                        Included Questions ({tmpl.questions.length})
                      </h5>
                      <div className="space-y-2">
                        {tmpl.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-border/50 bg-white flex items-start gap-3 text-xs"
                          >
                            <span className="font-mono text-muted-foreground w-5 shrink-0 pt-0.5">
                              {idx + 1}.
                            </span>
                            <div className="flex-1 space-y-1">
                              <p className="text-heading font-medium leading-relaxed">
                                {q.questionText}
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <Badge
                                  variant={q.severity === 'critical' ? 'destructive' : 'secondary'}
                                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0"
                                >
                                  {q.severity}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {q.questionType === 'yes_no' ? 'Yes / No' : '1–10 Rating'}
                                </span>
                                {q.requiresPhoto && (
                                  <span className="text-[10px] text-amber-600 font-medium">
                                    📸 Photo proof required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const activeInfo = getCountryInfo(activeCountryTab);
                const templates = COMPLIANCE_TEMPLATES[activeCountryTab] || COMPLIANCE_TEMPLATES.GLOBAL;

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <h4 className="text-sm font-semibold text-heading flex items-center gap-2">
                        <span>{activeInfo.flag}</span>
                        <span>{activeInfo.name} Standards</span>
                      </h4>
                      {activeInfo.authority && (
                        <span className="text-xs text-primary font-medium">
                          Governing Body: {activeInfo.authority}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {templates.map((tmpl) => (
                        <div
                          key={tmpl.id}
                          className="p-4 rounded-xl border border-border/60 hover:border-primary/40 bg-card transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-heading">
                                  {tmpl.title}
                                </span>
                                <Badge variant="secondary" className="status-badge-xs badge-muted capitalize">
                                  {tmpl.category}
                                </Badge>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {tmpl.authority}
                                </span>
                              </div>
                              <p className="text-xs text-muted-text leading-relaxed">
                                {tmpl.description}
                              </p>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-3 pt-1">
                                <span>📋 {tmpl.questions.length} questions</span>
                                <span>📸 {tmpl.questions.filter((q) => q.requiresPhoto).length} photo verifications</span>
                                <span>⚡ {tmpl.questions.filter((q) => q.severity === 'critical').length} critical checkpoints</span>
                              </div>
                            </div>

                            <div className="shrink-0 pt-1">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => applyPreset(tmpl)}
                                className="h-8 px-3 text-xs gap-1.5 shadow-sm active:scale-95"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Apply to Builder
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          <DialogFooter className="p-4 bg-muted/5 border-t border-border/40 flex items-center justify-between sm:justify-between">
            <span className="text-xs text-muted-text">
              Applying a template loads its questions into the editor so you can customize them.
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPresetModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
