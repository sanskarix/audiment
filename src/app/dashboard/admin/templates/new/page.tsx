'use client';

import DashboardShell from '@/components/DashboardShell';
import TemplateBuilder from '@/components/admin/TemplateBuilder';

export default function NewTemplatePage() {
  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <TemplateBuilder />
      </div>
    </DashboardShell>
  );
}
