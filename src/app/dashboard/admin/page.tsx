import DashboardShell from '@/components/DashboardShell';

export default function AdminDashboardPage() {
  return (
    <DashboardShell role="Admin">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Here you can manage users, locations, templates, and view organization-wide reports.
        </p>
      </div>
    </DashboardShell>
  );
}
