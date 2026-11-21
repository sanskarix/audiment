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
  writeBatch,
} from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/app-ui/table';
import { Button } from '@/components/app-ui/button';
import { Badge } from '@/components/app-ui/badge';
import { Switch } from '@/components/app-ui/switch';
import { Card } from '@/components/app-ui/card';
import {
  MoreHorizontal,
  Plus,
  ClipboardCheck,
  Settings2,
  Trash2,
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

export default function AdminTemplatesPage() {
  const { isSynced, orgId } = useAuthSync();
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    if (!isSynced || !orgId) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'auditTemplates'), where('organizationId', '==', orgId));
      const snapshot = await getDocs(q);
      const fetched: any[] = [];
      snapshot.forEach((d) => fetched.push({ id: d.id, ...d.data() }));
      fetched.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis() || 0);
      setTemplates(fetched);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [orgId, isSynced]);

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

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        {/* Header */}
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="page-heading">Audit Templates</h1>
            <p className="body-text text-muted-text">
              Configure SOP inspection checklists across your outlets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
                <TableHead className="standard-table-head">Date</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell text-center py-16">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                        <ClipboardCheck className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">
                        No templates loaded yet
                      </h3>
                      <p className="body-text text-muted-text text-[13px] leading-relaxed">
                        Create a custom checklist from scratch.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link href="/dashboard/admin/templates/new">
                          <Button className="h-10 px-5 text-[13px] gap-2 shadow-md shadow-primary/20">
                            <Plus className="h-4 w-4" />
                            <span>Create Template</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((t) => (
                  <TableRow key={t.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell font-normal text-heading">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[14px] text-heading group-hover:text-primary transition-colors">
                          {t.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Badge variant="secondary" className="status-badge-sm badge-muted capitalize">
                        {t.category || 'general'}
                      </Badge>
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
      </div>
    </DashboardShell>
  );
}