'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
    } catch (err) {
      console.error(err);
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
      <div className="flex flex-col space-y-6 max-w-full px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Templates</h1>
            <p className="text-muted-foreground text-sm">
              Build and manage the blueprints for audits across your organization.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!hasFssai && (
              <Button variant="outline" size="sm" onClick={loadFssaiDefaults} disabled={loading}>
                <ClipboardCheck className="mr-2 h-4 w-4" /> Load FSSAI Defaults
              </Button>
            )}
            <Link href="/dashboard/admin/templates/new">
              <Button size="sm" className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Template Title</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ClipboardCheck className="h-8 w-8 opacity-20" />
                      <p>No templates found. Start by loading FSSAI defaults or creating a new blueprint.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium min-w-[200px]">
                      <div className="flex items-center gap-2">
                        {t.title}
                        {t.isFssaiDefault && (
                          <Badge variant="secondary" className="border-emerald-500/30 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-[10px] uppercase font-bold tracking-tight">
                            FSSAI Certified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      <Badge variant="outline" className="bg-background">{t.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">{t.createdAt?.toDate().toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch checked={t.isActive !== false} onCheckedChange={() => handleToggleActive(t.id, t.isActive !== false)} />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{t.isActive !== false ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/templates/${t.id}/edit`)}>
                            <Settings2 className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Blueprint
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteTemplate(t.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  );
}
