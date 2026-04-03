'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MoreHorizontal, Plus, ClipboardCheck, Settings2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string, uid: string } | null>(null);
  const [loading, setLoading] = useState(false);


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
    if (!session?.orgId) return;
    const q = query(collection(db, 'auditTemplates'), where('organizationId', '==', session.orgId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach(d => fetched.push({ id: d.id, ...d.data() }));
      fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis() || 0);
      setTemplates(fetched);
    });
    return () => unsubscribe();
  }, [session]);

  const loadFssaiDefaults = async () => {
    if (!session?.orgId || !session?.uid) return;
    setLoading(true);

    const washroomQuestions = [
      { questionText: "Are washrooms completely separated from the food preparation area?", questionType: "yes_no", severity: "critical", requiresPhoto: false, order: 1 },
      { questionText: "Rate the availability of liquid soap and hand sanitizers.", questionType: "rating", severity: "medium", requiresPhoto: true, order: 2 },
      { questionText: "Are proper hand drying facilities (paper towels/air dryers) functioning?", questionType: "yes_no", severity: "medium", requiresPhoto: false, order: 3 },
      { questionText: "Is there continuous supply of clean water in the washrooms?", questionType: "yes_no", severity: "critical", requiresPhoto: false, order: 4 },
      { questionText: "Rate the general cleanliness and odor control of the washroom.", questionType: "rating", severity: "low", requiresPhoto: true, order: 5 },
      { questionText: "Are garbage bins adequately covered and foot-operated?", questionType: "yes_no", severity: "medium", requiresPhoto: true, order: 6 },
      { questionText: "Are cleaning schedules displayed and signed by housekeeping?", questionType: "yes_no", severity: "low", requiresPhoto: true, order: 7 },
      { questionText: "Are the washroom floors dry and slip-free?", questionType: "yes_no", severity: "medium", requiresPhoto: false, order: 8 },
    ];

    const kitchenQuestions = [
      { questionText: "Are all raw and cooked foods stored separately?", questionType: "yes_no", severity: "critical", requiresPhoto: true, order: 1 },
      { questionText: "Are refrigerators maintained at ≤ 5°C and freezers at ≤ -18°C?", questionType: "yes_no", severity: "critical", requiresPhoto: true, order: 2 },
      { questionText: "Is pest control mechanism intact and effective?", questionType: "yes_no", severity: "critical", requiresPhoto: true, order: 3 },
      { questionText: "Are food handlers wearing clean uniforms, aprons, hairnets, and gloves?", questionType: "rating", severity: "medium", requiresPhoto: false, order: 4 },
      { questionText: "Are chopping boards color-coded and free from deep cuts?", questionType: "yes_no", severity: "medium", requiresPhoto: true, order: 5 },
      { questionText: "Rate the cleanliness of floors, walls, and ceilings in the food prep area.", questionType: "rating", severity: "medium", requiresPhoto: true, order: 6 },
      { questionText: "Is there a proper waste segregation and disposal system in place?", questionType: "yes_no", severity: "low", requiresPhoto: false, order: 7 },
      { questionText: "Are food grade containers used for storing prepared items?", questionType: "yes_no", severity: "medium", requiresPhoto: false, order: 8 },
    ];

    try {
      const batch = writeBatch(db);

      const t1Ref = doc(collection(db, 'auditTemplates'));
      batch.set(t1Ref, {
        organizationId: session.orgId, title: "FSSAI Washroom Standards", category: "hygiene", description: "Default washroom audit compliant with FSSAI regulations.", isActive: true, createdBy: session.uid, createdAt: serverTimestamp(), isFssaiDefault: true
      });
      washroomQuestions.forEach(q => {
        const qRef = doc(collection(db, `auditTemplates/${t1Ref.id}/questions`));
        batch.set(qRef, { ...q, maxScore: q.questionType === 'yes_no' ? 1 : 10 });
      });

      const t2Ref = doc(collection(db, 'auditTemplates'));
      batch.set(t2Ref, {
        organizationId: session.orgId, title: "FSSAI Kitchen Hygiene Standards", category: "hygiene", description: "Kitchen hygiene check compliant with FSSAI.", isActive: true, createdBy: session.uid, createdAt: serverTimestamp(), isFssaiDefault: true
      });
      kitchenQuestions.forEach(q => {
        const qRef = doc(collection(db, `auditTemplates/${t2Ref.id}/questions`));
        batch.set(qRef, { ...q, maxScore: q.questionType === 'yes_no' ? 1 : 10 });
      });

      await batch.commit();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };



  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'auditTemplates', id), { isActive: !currentStatus });
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
      qSnap.forEach(qDoc => {
        batch.delete(qDoc.ref);
      });
      batch.delete(doc(db, 'auditTemplates', templateId));

      await batch.commit();
    } catch (e) {
      console.error('Error deleting template:', e);
      alert('Failed to delete template');
    }
  };

  const hasFssai = templates.some(t => t.isFssaiDefault);

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Templates</h1>
            <p className="body-text text-muted-text">Add or edit audit templates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!hasFssai && (
              <Button
                variant="outline"
                size="default"
                onClick={loadFssaiDefaults}
                disabled={loading}
                className="h-11 px-5 text-[14px] font-medium text-success hover:text-success hover:bg-success/5 border-success/20 transition-all active:scale-95"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" /> Load Defaults
              </Button>
            )}
            <Link href="/dashboard/admin/templates/new">
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all">
                <Plus className="mr-2 h-4 w-4" /> New Template
              </Button>
            </Link>
          </div>
        </div>



        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Title</TableHead>
                <TableHead className="standard-table-head">Category</TableHead>
                <TableHead className="standard-table-head">Date</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ClipboardCheck className="h-8 w-8 opacity-20" />
                      <p className="text-body">No templates found. Start by loading defaults or creating a new template.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((t) => (
                  <TableRow key={t.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell font-normal text-sm text-heading">
                      <div className="flex items-center">
                        {t.title}
                        {t.isFssaiDefault && (
                          <Badge variant="secondary" className="ml-2 h-6 rounded-full bg-success/10 text-success border-none text-[12px] font-normal px-2.5">
                            FSSAI
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 text-body bg-muted/60 text-muted-text border-none"
                        style={{ fontSize: 12, fontWeight: 400 }}
                      >
                        {t.category.charAt(0).toUpperCase() + t.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="standard-table-cell tabular-nums text-body font-normal">{t.createdAt?.toDate().toLocaleDateString()}</TableCell>
                    <TableCell className="standard-table-cell">
                      <div className="flex items-center">
                        <Switch checked={t.isActive !== false} onCheckedChange={() => handleToggleActive(t.id, t.isActive !== false)} />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/templates/${t.id}/edit`)} className="text-body">
                            <Settings2 className="mr-2 h-4 w-4 text-muted-text" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteTemplate(t.id)}>
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
      </div>
    </DashboardShell>
  );
}
