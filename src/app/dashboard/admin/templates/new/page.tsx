'use client';

import DashboardShell from '@/components/DashboardShell';
import TemplateBuilder from '@/components/admin/TemplateBuilder';

export default function NewTemplatePage() {
  return (
    <DashboardShell role="Admin">
      <div className="px-4 py-4 sm:px-0">
        <TemplateBuilder />
      </div>
    </DashboardShell>
  );
}
