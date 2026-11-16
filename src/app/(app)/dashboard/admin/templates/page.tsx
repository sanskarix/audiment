'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/app-ui/table';
import { Button } from '@/components/app-ui/button';
import { Badge } from '@/components/app-ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/app-ui/dialog';
import { Switch } from '@/components/app-ui/switch';
import { Card } from '@/components/app-ui/card';
import {
  MoreHorizontal,
  Plus,
  ClipboardCheck,
  Settings2,
  Trash2,
  Globe,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/app-ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthSync } from '@/components/AuthProvider';
import {
  TOP_10_COUNTRIES,
  COMPLIANCE_TEMPLATES,
  getDefaultTemplatesForCountry,
  getCountryInfo,
  ComplianceTemplate,
  INDUSTRY_OPTIONS,
  INDUSTRY_TEMPLATES,
  normalizeIndustry,
  getIndustryTemplate,
} from '@/lib/compliance-templates';

export default function AdminTemplatesPage() {
  const { isSynced, orgId, uid } = useAuthSync();
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orgCountries, setOrgCountries] = useState<string[]>(['IN']);
  const [orgPrimaryCountry, setOrgPrimaryCountry] = useState<string>('IN');
  const [orgIndustry, setOrgIndustry] = useState<string>('');
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraryMode, setLibraryMode] = useState<'industry' | 'country'>('industry');
  const [activeIndustryTab, setActiveIndustryTab] = useState<string>('restaurant');
  const [activeCountryTab, setActiveCountryTab] = useState<string>('IN');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  // Fetch organization settings to identify operating country and industry
  useEffect(() => {
    if (!isSynced || !orgId) return;

    const fetchOrgData = async () => {
      try {
        const orgSnap = await getDoc(doc(db, 'organizations', orgId));
        if (orgSnap.exists()) {
          const data = orgSnap.data();
          const primary = data?.country || (Array.isArray(data?.countries) && data?.countries[0]) || 'IN';
          const countries = Array.isArray(data?.countries) && data?.countries.length > 0 ? data.countries : [primary];
          const industry = data?.industry || '';
          setOrgPrimaryCountry(primary);
          setOrgCountries(countries);
          setActiveCountryTab(primary);
          setOrgIndustry(industry);
          if (industry) {
            setActiveIndustryTab(normalizeIndustry(industry));
          }
        }
      } catch (err) {
        console.error('Error fetching org country:', err);
      }
    };

    fetchOrgData();
  }, [orgId, isSynced]);

  const fetchTemplates = async () => {
    if (!isSynced || !orgId) return;
    try {
      const q = query(collection(db, 'auditTemplates'), where('organizationId', '==', orgId));
      const snapshot = await getDocs(q);
      const fetched: any[] = [];
      snapshot.forEach((d) => fetched.push({ id: d.id, ...d.data() }));
      fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis() || 0);
      setTemplates(fetched);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [orgId, isSynced]);

  // Load templates into Firestore
  const importTemplates = async (templatesToImport: ComplianceTemplate[]) => {
    if (!orgId || !uid || templatesToImport.length === 0) return;
    setImporting(true);

    try {
      const batch = writeBatch(db);

      templatesToImport.forEach((tmpl) => {
        const tRef = doc(collection(db, 'auditTemplates'));
        batch.set(tRef, {
          organizationId: orgId,
          title: tmpl.title,
          category: tmpl.category,
          description: tmpl.description,
          country: tmpl.country,
          countryName: tmpl.countryName,
          authority: tmpl.authority,
          isCountryDefault: Boolean(tmpl.isCountryDefault),
          isIndustryDefault: Boolean(tmpl.isIndustryDefault),
          industry: tmpl.industry || '',
          industryName: tmpl.industryName || '',
          isFssaiDefault: tmpl.authority === 'FSSAI',
          isActive: true,
          createdBy: uid,
          createdAt: serverTimestamp(),
        });

        tmpl.questions.forEach((q) => {
          const qRef = doc(collection(db, `auditTemplates/${tRef.id}/questions`));
          batch.set(qRef, {
            ...q,
            maxScore: q.questionType === 'yes_no' ? 1 : 10,
          });
        });
      });

      await batch.commit();
      await fetchTemplates();
      setLibraryModalOpen(false);
      setSelectedTemplateIds([]);
    } catch (e) {
      console.error('Error importing templates:', e);
      alert('Failed to import templates. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  // Quick 1-click load for organization's industry ready-to-run template
  const loadIndustryDefault = async () => {
    const tmpl = getIndustryTemplate(orgIndustry);
    await importTemplates([tmpl]);
  };

  // Quick 1-click load for organization's primary country
  const loadCountryDefaults = async () => {
    const countryTemplates = getDefaultTemplatesForCountry(orgPrimaryCountry);
    await importTemplates(countryTemplates);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'auditTemplates', id), { isActive: !currentStatus });
      await fetchTemplates();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template and all its questions? This cannot be undone.')) return;

    try {
      const qRef = collection(db, `auditTemplates/${templateId}/questions`);
      const qSnap = await getDocs(qRef);

      const batch = writeBatch(db);
      qSnap.forEach((qDoc) => {
        batch.delete(qDoc.ref);
      });
      batch.delete(doc(db, 'auditTemplates', templateId));

      await batch.commit();
      await fetchTemplates();
    } catch (e) {
      console.error('Error deleting template:', e);
      alert('Failed to delete template');
    }
  };

  const primaryCountryInfo = getCountryInfo(orgPrimaryCountry);
  const activeTabInfo = getCountryInfo(activeCountryTab);
  const activeTabTemplates = COMPLIANCE_TEMPLATES[activeCountryTab] || COMPLIANCE_TEMPLATES.GLOBAL;

  const toggleSelectTemplate = (id: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        {/* Header */}
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="page-heading">Audit Templates</h1>
              {orgIndustry && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>{INDUSTRY_OPTIONS.find((opt) => opt.value === normalizeIndustry(orgIndustry))?.label || orgIndustry}</span>
                </span>
              )}
              {primaryCountryInfo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted/30 text-muted-foreground border border-border/60">
                  <span>{primaryCountryInfo.flag}</span>
                  <span>{primaryCountryInfo.name}</span>
                </span>
              )}
            </div>
            <p className="body-text text-muted-text">
              Configure SOP inspection checklists and compliance standards across your outlets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                setLibraryMode('industry');
                setActiveIndustryTab(normalizeIndustry(orgIndustry));
                setLibraryModalOpen(true);
              }}
              disabled={loading || importing}
              className="h-11 px-4 text-[13px] font-medium border-border/80 hover:bg-muted/30 transition-all active:scale-95 gap-2"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span>Compliance & Industry Library</span>
            </Button>

            <Link href="/dashboard/admin/templates/new">
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all">
                <Plus className="mr-1 h-4 w-4" /> New Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Table of templates */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Title</TableHead>
                <TableHead className="standard-table-head">Category</TableHead>
                <TableHead className="standard-table-head">Standard / Authority</TableHead>
                <TableHead className="standard-table-head">Date</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="standard-table-cell text-center py-16">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                        <ClipboardCheck className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">
                        No templates loaded yet
                      </h3>
                      <p className="body-text text-muted-text text-[13px] leading-relaxed">
                        Load pre-built compliance blueprints tailored for{' '}
                        <strong className="text-heading font-semibold">
                          {primaryCountryInfo.flag} {primaryCountryInfo.name}
                        </strong>{' '}
                        or create a custom checklist from scratch.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button
                          onClick={loadIndustryDefault}
                          disabled={importing}
                          className="h-10 px-5 text-[13px] gap-2 shadow-md shadow-primary/20"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Load Industry Ready-to-Run Template</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setLibraryMode('industry');
                            setActiveIndustryTab(normalizeIndustry(orgIndustry));
                            setLibraryModalOpen(true);
                          }}
                          className="h-10 px-4 text-[13px] gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          <span>Browse Templates Library</span>
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((t) => (
                  <TableRow key={t.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell font-normal text-heading">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[14px] text-heading group-hover:text-primary transition-colors">
                            {t.title}
                          </span>
                          {t.isIndustryDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5" /> Ready-to-Run
                            </span>
                          )}
                        </div>
                        {t.description && (
                          <span className="text-xs text-muted-text line-clamp-1">
                            {t.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Badge variant="secondary" className="status-badge-sm badge-muted capitalize">
                        {t.category || 'general'}
                      </Badge>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      {t.authority ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {t.authority}
                        </span>
                      ) : t.isFssaiDefault ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          FSSAI
                        </span>
                      ) : (
                        <span className="text-xs text-muted-text">Custom SOP</span>
                      )}
                    </TableCell>
                    <TableCell className="standard-table-cell tabular-nums text-body font-normal">
                      {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <div className="flex items-center">
                        <Switch
                          checked={t.isActive !== false}
                          onCheckedChange={() => handleToggleActive(t.id, t.isActive !== false)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/templates/${t.id}/edit`)}
                            className="text-body cursor-pointer"
                          >
                            <Settings2 className="mr-2 h-4 w-4 text-muted-text" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => handleDeleteTemplate(t.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* ── Compliance & Industry Library Modal ────────────────────────── */}
        <Dialog open={libraryModalOpen} onOpenChange={setLibraryModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="p-6 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Audit Templates & Regulatory Standards Library
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-text mt-1">
                    Pre-built blueprints tailored for your industry and verified against national compliance standards.
                  </DialogDescription>
                </div>
              </div>

              {/* Mode Switcher: Industry vs Country */}
              <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl w-fit mb-2">
                <button
                  type="button"
                  onClick={() => setLibraryMode('industry')}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    libraryMode === 'industry'
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
                  onClick={() => setLibraryMode('country')}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    libraryMode === 'country'
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
              {libraryMode === 'industry' ? (
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
                    const isOrgCountry = orgCountries.includes(c.code);
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

            {/* Template Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {libraryMode === 'industry' ? (
                (() => {
                  const indTemplate = INDUSTRY_TEMPLATES[activeIndustryTab] || INDUSTRY_TEMPLATES.restaurant;
                  const activeIndOption = INDUSTRY_OPTIONS.find((opt) => opt.value === activeIndustryTab);
                  const isAlreadyAdded = templates.some(
                    (existing) => existing.title === indTemplate.title
                  );

                  return (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/10">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-semibold text-heading flex items-center gap-1.5">
                              <span>{activeIndOption?.icon}</span>
                              <span>{indTemplate.title}</span>
                            </span>
                            <Badge variant="secondary" className="status-badge-xs badge-muted capitalize">
                              {indTemplate.category}
                            </Badge>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {indTemplate.authority}
                            </span>
                            {isAlreadyAdded && (
                              <Badge variant="outline" className="status-badge-xs text-muted-text">
                                Already in workspace
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-text leading-relaxed">
                            {indTemplate.description}
                          </p>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-4 pt-1 flex-wrap">
                            <span>📋 {indTemplate.questions.length} questions</span>
                            <span>📸 {indTemplate.questions.filter((q) => q.requiresPhoto).length} photo verifications</span>
                            <span>⚡ {indTemplate.questions.filter((q) => q.severity === 'critical').length} critical checkpoints</span>
                          </div>
                        </div>

                        <Button
                          disabled={importing || isAlreadyAdded}
                          onClick={() => importTemplates([indTemplate])}
                          className="h-9 px-4 text-xs gap-1.5 shadow-sm active:scale-95 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {isAlreadyAdded ? 'Already Added' : 'Import to Workspace'}
                        </Button>
                      </div>

                      {/* Question Breakdown */}
                      <div className="space-y-2 pt-1">
                        <h5 className="text-xs font-semibold text-heading uppercase tracking-wider text-muted-foreground">
                          Included Checklist Questions ({indTemplate.questions.length})
                        </h5>
                        <div className="space-y-2">
                          {indTemplate.questions.map((q, idx) => (
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
                <>
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <h4 className="text-sm font-semibold text-heading flex items-center gap-2">
                        <span>{activeTabInfo.flag}</span>
                        <span>{activeTabInfo.name}</span>
                        <span className="text-xs font-normal text-muted-text">
                          ({activeTabTemplates.length} templates available)
                        </span>
                      </h4>
                      {activeTabInfo.authority && (
                        <p className="text-xs text-primary font-medium mt-0.5">
                          Authority: {activeTabInfo.authority}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => importTemplates(activeTabTemplates)}
                      disabled={importing}
                      className="h-8 px-3 text-xs gap-1.5 shadow-sm active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Import All {activeTabInfo.name} Checklists
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-1">
                    {activeTabTemplates.map((t) => {
                      const isSelected = selectedTemplateIds.includes(t.id);
                      const isAlreadyAdded = templates.some(
                        (existing) => existing.title === t.title
                      );

                      return (
                        <div
                          key={t.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isAlreadyAdded
                              ? 'bg-muted/10 border-border/40 opacity-75'
                              : isSelected
                              ? 'bg-primary/5 border-primary shadow-xs'
                              : 'bg-white border-border/60 hover:border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-heading">
                                  {t.title}
                                </span>
                                <Badge variant="secondary" className="status-badge-xs badge-muted capitalize">
                                  {t.category}
                                </Badge>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {t.authority}
                                </span>
                                {isAlreadyAdded && (
                                  <Badge variant="outline" className="status-badge-xs text-muted-text">
                                    Already in workspace
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-text leading-relaxed">
                                {t.description}
                              </p>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-3 pt-1">
                                <span>📋 {t.questions.length} questions</span>
                                <span>📸 Photo proof required</span>
                                <span>⚡ Critical failure alerts</span>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={importing || isAlreadyAdded}
                                onClick={() => importTemplates([t])}
                                className="h-8 px-3 text-xs gap-1 border-primary/20 text-primary hover:bg-primary/5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                {isAlreadyAdded ? 'Added' : 'Import'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="p-4 bg-muted/5 border-t border-border/40 flex items-center justify-between sm:justify-between">
              <span className="text-xs text-muted-text">
                Templates are fully customizable once imported into your workspace.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLibraryModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
