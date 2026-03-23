import DashboardShell from '@/components/DashboardShell';

export default function AuditorDashboardPage() {
  return (
    <DashboardShell role="Auditor">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">My Audits</h2>
        <p className="text-muted-foreground">
          Welcome to the auditor dashboard. Here you can view and complete your assigned audits, and submit flashmob reports.
        </p>
      </div>
    </DashboardShell>
  );
}
