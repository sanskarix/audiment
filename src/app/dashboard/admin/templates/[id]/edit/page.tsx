'use client';

import { useParams } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import TemplateBuilder from '@/components/admin/TemplateBuilder';

export default function EditTemplatePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <DashboardShell role="Admin">
      <div className="px-4 py-4 sm:px-0">
        <TemplateBuilder templateId={id} />
      </div>
    </DashboardShell>
  );
}
