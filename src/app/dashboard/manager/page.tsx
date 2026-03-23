import DashboardShell from '@/components/DashboardShell';

export default function ManagerDashboardPage() {
  return (
    <DashboardShell role="Manager">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the manager dashboard. Here you can assign audits, monitor your locations, and manage corrective actions.
        </p>
      </div>
    </DashboardShell>
  );
}
