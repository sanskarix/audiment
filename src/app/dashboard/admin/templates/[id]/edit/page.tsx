'use client';

import { useParams } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import TemplateBuilder from '@/components/admin/TemplateBuilder';

export default function EditTemplatePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <TemplateBuilder templateId={id} />
      </div>
    </DashboardShell>
  );
}
