# Audiment UI Route & Page Inventory (Phase 2)

Total Pages Discovered: 69

## 1. Summary by Role / Boundary

- **Admin**: 13 pages
- **Auditor**: 5 pages
- **Manager**: 9 pages
- **Public / Unauthenticated**: 1 pages
- **Dev / Internal Tool**: 1 pages
- **Public**: 40 pages

## 2. Exhaustive Page Ledger

| ID | Route Path | Role / Access | Parent Layout | Loading / Empty / Error | Source File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PAGE-001` | `/dashboard/admin/audits` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx) |
| `PAGE-002` | `/dashboard/admin/corrective-actions` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx) |
| `PAGE-003` | `/dashboard/admin/flashmob/[flashmobId]` | Admin | `DashboardShell` | Loading, Error | [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx) |
| `PAGE-004` | `/dashboard/admin/flashmob` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/flashmob/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx) |
| `PAGE-005` | `/dashboard/admin/locations` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/locations/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx) |
| `PAGE-006` | `/dashboard/admin` | Admin | `DashboardShell` | Loading, Error | [`src/app/(app)/dashboard/admin/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx) |
| `PAGE-007` | `/dashboard/admin/reports/[auditId]` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx) |
| `PAGE-008` | `/dashboard/admin/reports` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/reports/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx) |
| `PAGE-009` | `/dashboard/admin/settings` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/settings/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx) |
| `PAGE-010` | `/dashboard/admin/templates/[id]/edit` | Admin | `DashboardShell` | Standard | [`src/app/(app)/dashboard/admin/templates/[id]/edit/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/[id]/edit/page.tsx) |
| `PAGE-011` | `/dashboard/admin/templates/new` | Admin | `DashboardShell` | Standard | [`src/app/(app)/dashboard/admin/templates/new/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/new/page.tsx) |
| `PAGE-012` | `/dashboard/admin/templates` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/templates/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx) |
| `PAGE-013` | `/dashboard/admin/users` | Admin | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/admin/users/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx) |
| `PAGE-014` | `/dashboard/auditor/audits/[auditId]` | Auditor | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx) |
| `PAGE-015` | `/dashboard/auditor/flashmob` | Auditor | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx) |
| `PAGE-016` | `/dashboard/auditor/history` | Auditor | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/auditor/history/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx) |
| `PAGE-017` | `/dashboard/auditor` | Auditor | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/auditor/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx) |
| `PAGE-018` | `/dashboard/auditor/settings` | Auditor | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/auditor/settings/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx) |
| `PAGE-019` | `/dashboard/manager/auditors/[id]` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx) |
| `PAGE-020` | `/dashboard/manager/auditors` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/auditors/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx) |
| `PAGE-021` | `/dashboard/manager/audits` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx) |
| `PAGE-022` | `/dashboard/manager/calendar` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/calendar/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/calendar/page.tsx) |
| `PAGE-023` | `/dashboard/manager/corrective-actions` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx) |
| `PAGE-024` | `/dashboard/manager` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx) |
| `PAGE-025` | `/dashboard/manager/reports/[auditId]` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx) |
| `PAGE-026` | `/dashboard/manager/reports` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/reports/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx) |
| `PAGE-027` | `/dashboard/manager/settings` | Manager | `DashboardShell` | Loading, Empty, Error | [`src/app/(app)/dashboard/manager/settings/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx) |
| `PAGE-028` | `/login` | Public / Unauthenticated | `LoginLayout` | Loading, Empty, Error | [`src/app/(app)/login/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx) |
| `PAGE-029` | `/test-recording` | Dev / Internal Tool | `TestRecordingLayout` | Empty, Error | [`src/app/(app)/test-recording/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/test-recording/page.tsx) |
| `PAGE-030` | `/cookie-policy` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/(public)/cookie-policy/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/(public)/cookie-policy/page.tsx) |
| `PAGE-031` | `/privacy-policy` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/(public)/privacy-policy/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/(public)/privacy-policy/page.tsx) |
| `PAGE-032` | `/terms-of-service` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/(public)/terms-of-service/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/(public)/terms-of-service/page.tsx) |
| `PAGE-033` | `/about` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/about/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/about/page.tsx) |
| `PAGE-034` | `/blog/[slug]` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/blog/[slug]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/blog/[slug]/page.tsx) |
| `PAGE-035` | `/blog` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/blog/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/blog/page.tsx) |
| `PAGE-036` | `/compare/audiment-vs-checklist-apps` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/compare/audiment-vs-checklist-apps/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-checklist-apps/page.tsx) |
| `PAGE-037` | `/compare/audiment-vs-goaudits` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/compare/audiment-vs-goaudits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-goaudits/page.tsx) |
| `PAGE-038` | `/compare/audiment-vs-jolt` | Public | `WebsiteLayout` | Empty | [`src/app/(website)/compare/audiment-vs-jolt/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-jolt/page.tsx) |
| `PAGE-039` | `/compare/audiment-vs-safetyculture` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/compare/audiment-vs-safetyculture/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-safetyculture/page.tsx) |
| `PAGE-040` | `/compare/audiment-vs-zenput` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/compare/audiment-vs-zenput/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-zenput/page.tsx) |
| `PAGE-041` | `/compare` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/compare/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/page.tsx) |
| `PAGE-042` | `/fssai-audit-software` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/fssai-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/fssai-audit-software/page.tsx) |
| `PAGE-043` | `/glossary` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/glossary/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/glossary/page.tsx) |
| `PAGE-044` | `/healthcare-audit-software` | Public | `WebsiteLayout` | Error | [`src/app/(website)/healthcare-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/healthcare-audit-software/page.tsx) |
| `PAGE-045` | `/hidden-operational-issues` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/hidden-operational-issues/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/hidden-operational-issues/page.tsx) |
| `PAGE-046` | `/improving-accountability` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/improving-accountability/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/improving-accountability/page.tsx) |
| `PAGE-047` | `/maintaining-standards-across-locations` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/maintaining-standards-across-locations/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/maintaining-standards-across-locations/page.tsx) |
| `PAGE-048` | `/multi-location-audit-software` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/multi-location-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/multi-location-audit-software/page.tsx) |
| `PAGE-049` | `/operational-drift` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/operational-drift/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/operational-drift/page.tsx) |
| `PAGE-050` | `/` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/page.tsx) |
| `PAGE-051` | `/platform/corrective-actions` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/platform/corrective-actions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/corrective-actions/page.tsx) |
| `PAGE-052` | `/platform/geo-verified-audits` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/platform/geo-verified-audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/geo-verified-audits/page.tsx) |
| `PAGE-053` | `/platform/issue-tracking` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/platform/issue-tracking/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/issue-tracking/page.tsx) |
| `PAGE-054` | `/platform/operational-dashboards` | Public | `WebsiteLayout` | Error | [`src/app/(website)/platform/operational-dashboards/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/operational-dashboards/page.tsx) |
| `PAGE-055` | `/platform/proof-based-audits` | Public | `WebsiteLayout` | Empty, Error | [`src/app/(website)/platform/proof-based-audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/proof-based-audits/page.tsx) |
| `PAGE-056` | `/solutions/food-safety-audit-software` | Public | `WebsiteLayout` | Loading, Error | [`src/app/(website)/solutions/food-safety-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/food-safety-audit-software/page.tsx) |
| `PAGE-057` | `/solutions/franchise-audit-software` | Public | `WebsiteLayout` | Empty, Error | [`src/app/(website)/solutions/franchise-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/franchise-audit-software/page.tsx) |
| `PAGE-058` | `/solutions/hotel-audit-software` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/solutions/hotel-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/hotel-audit-software/page.tsx) |
| `PAGE-059` | `/solutions/manufacturing-audit-software` | Public | `WebsiteLayout` | Empty | [`src/app/(website)/solutions/manufacturing-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/manufacturing-audit-software/page.tsx) |
| `PAGE-060` | `/solutions` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/solutions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/page.tsx) |
| `PAGE-061` | `/solutions/qsr-audit-software` | Public | `WebsiteLayout` | Error | [`src/app/(website)/solutions/qsr-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/qsr-audit-software/page.tsx) |
| `PAGE-062` | `/solutions/restaurant-audit-software` | Public | `WebsiteLayout` | Error | [`src/app/(website)/solutions/restaurant-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/restaurant-audit-software/page.tsx) |
| `PAGE-063` | `/solutions/retail-audit-software` | Public | `WebsiteLayout` | Empty | [`src/app/(website)/solutions/retail-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/retail-audit-software/page.tsx) |
| `PAGE-064` | `/staying-ahead-of-compliance` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/staying-ahead-of-compliance/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/staying-ahead-of-compliance/page.tsx) |
| `PAGE-065` | `/use-cases/audit-checklist-software` | Public | `WebsiteLayout` | Loading | [`src/app/(website)/use-cases/audit-checklist-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/audit-checklist-software/page.tsx) |
| `PAGE-066` | `/use-cases/corrective-action-tracking` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/use-cases/corrective-action-tracking/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/corrective-action-tracking/page.tsx) |
| `PAGE-067` | `/use-cases/inspection-management-software` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/use-cases/inspection-management-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/inspection-management-software/page.tsx) |
| `PAGE-068` | `/use-cases/multi-location-compliance` | Public | `WebsiteLayout` | Empty | [`src/app/(website)/use-cases/multi-location-compliance/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/multi-location-compliance/page.tsx) |
| `PAGE-069` | `/use-cases` | Public | `WebsiteLayout` | Standard | [`src/app/(website)/use-cases/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/page.tsx) |

## 3. Route Components & UI Section Details

### PAGE-001: `/dashboard/admin/audits`

- **Source**: [`src/app/(app)/dashboard/admin/audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, `Button`, `useAuthSync`, `Badge`, `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `Input`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Switch`, `Calendar`, `Popover`, `PopoverContent`, `PopoverTrigger`, `Card`
- **Documented States**: loading, empty, error

### PAGE-002: `/dashboard/admin/corrective-actions`

- **Source**: [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Label`, `Input`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, `Badge`, `Calendar`, `Skeleton`, `Button`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-003: `/dashboard/admin/flashmob/[flashmobId]`

- **Source**: [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Button`, `Badge`, `Skeleton`
- **Documented States**: loading, error

### PAGE-004: `/dashboard/admin/flashmob`

- **Source**: [`src/app/(app)/dashboard/admin/flashmob/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `useAuthSync`, `DashboardShell`, `Button`, `Input`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Calendar`, `Badge`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Documented States**: loading, empty, error

### PAGE-005: `/dashboard/admin/locations`

- **Source**: [`src/app/(app)/dashboard/admin/locations/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, `Button`, `Badge`, `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `Input`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Switch`, `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger`, `Card`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-006: `/dashboard/admin`

- **Source**: [`src/app/(app)/dashboard/admin/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Progress`, `Button`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, error

### PAGE-007: `/dashboard/admin/reports/[auditId]`

- **Source**: [`src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Button`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-008: `/dashboard/admin/reports`

- **Source**: [`src/app/(app)/dashboard/admin/reports/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Label`, `Input`, `Button`, `Card`, `CardContent`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-009: `/dashboard/admin/settings`

- **Source**: [`src/app/(app)/dashboard/admin/settings/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `useAuthSync`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`, `CardFooter`, `Label`, `Input`, `Button`, `Switch`, `Avatar`, `AvatarFallback`, `AvatarImage`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Skeleton`
- **Documented States**: loading, empty, error

### PAGE-010: `/dashboard/admin/templates/[id]/edit`

- **Source**: [`src/app/(app)/dashboard/admin/templates/[id]/edit/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/[id]/edit/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `TemplateBuilder`
- **Documented States**: Standard Render

### PAGE-011: `/dashboard/admin/templates/new`

- **Source**: [`src/app/(app)/dashboard/admin/templates/new/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/new/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `TemplateBuilder`
- **Documented States**: Standard Render

### PAGE-012: `/dashboard/admin/templates`

- **Source**: [`src/app/(app)/dashboard/admin/templates/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, `Button`, `Badge`, `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Switch`, `Card`, `ScrollArea`, `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`, `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-013: `/dashboard/admin/users`

- **Source**: [`src/app/(app)/dashboard/admin/users/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx)
- **Role**: Admin
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, `Button`, `Badge`, `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `Input`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Switch`, `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `Card`, `CardContent`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-014: `/dashboard/auditor/audits/[auditId]`

- **Source**: [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx)
- **Role**: Auditor
- **Layout**: DashboardShell
- **Key Components Rendered**: `Button`, `Progress`, `Label`, `Textarea`, `Badge`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-015: `/dashboard/auditor/flashmob`

- **Source**: [`src/app/(app)/dashboard/auditor/flashmob/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx)
- **Role**: Auditor
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Card`, `CardContent`, `Button`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Label`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Skeleton`, `Badge`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-016: `/dashboard/auditor/history`

- **Source**: [`src/app/(app)/dashboard/auditor/history/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx)
- **Role**: Auditor
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Skeleton`, `Badge`, `Button`, `Input`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-017: `/dashboard/auditor`

- **Source**: [`src/app/(app)/dashboard/auditor/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx)
- **Role**: Auditor
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`, `Button`, `Badge`, `Input`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-018: `/dashboard/auditor/settings`

- **Source**: [`src/app/(app)/dashboard/auditor/settings/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx)
- **Role**: Auditor
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`, `CardFooter`, `Label`, `Input`, `Button`, `Avatar`, `AvatarFallback`, `AvatarImage`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-019: `/dashboard/manager/auditors/[id]`

- **Source**: [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Button`, `Badge`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-020: `/dashboard/manager/auditors`

- **Source**: [`src/app/(app)/dashboard/manager/auditors/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Badge`, `Button`, `Input`, `Label`, `Switch`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-021: `/dashboard/manager/audits`

- **Source**: [`src/app/(app)/dashboard/manager/audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, `Button`, `Badge`, `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `Label`, `Input`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Card`, `useAuthSync`, `Popover`, `PopoverContent`, `PopoverTrigger`, `Calendar`, `Switch`
- **Documented States**: loading, empty, error

### PAGE-022: `/dashboard/manager/calendar`

- **Source**: [`src/app/(app)/dashboard/manager/calendar/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/calendar/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Card`, `CardContent`, `Button`, `Badge`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-023: `/dashboard/manager/corrective-actions`

- **Source**: [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Badge`, `Button`, `Textarea`, `Label`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-024: `/dashboard/manager`

- **Source**: [`src/app/(app)/dashboard/manager/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Badge`, `Button`, `Textarea`, `Input`, `Label`, `Skeleton`, `ScrollArea`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-025: `/dashboard/manager/reports/[auditId]`

- **Source**: [`src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Button`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-026: `/dashboard/manager/reports`

- **Source**: [`src/app/(app)/dashboard/manager/reports/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Label`, `Input`, `Button`, `Badge`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-027: `/dashboard/manager/settings`

- **Source**: [`src/app/(app)/dashboard/manager/settings/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx)
- **Role**: Manager
- **Layout**: DashboardShell
- **Key Components Rendered**: `DashboardShell`, `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`, `CardFooter`, `Label`, `Input`, `Button`, `Avatar`, `AvatarFallback`, `AvatarImage`, `Skeleton`, `useAuthSync`
- **Documented States**: loading, empty, error

### PAGE-028: `/login`

- **Source**: [`src/app/(app)/login/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx)
- **Role**: Public / Unauthenticated
- **Layout**: LoginLayout
- **Key Components Rendered**: `Button`, `Input`, `Label`, `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`, `ShimmerText`
- **Documented States**: loading, empty, error

### PAGE-029: `/test-recording`

- **Source**: [`src/app/(app)/test-recording/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/test-recording/page.tsx)
- **Role**: Dev / Internal Tool
- **Layout**: TestRecordingLayout
- **Key Components Rendered**: Inline JSX / Layout Client
- **Documented States**: empty, error

### PAGE-030: `/cookie-policy`

- **Source**: [`src/app/(website)/(public)/cookie-policy/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/(public)/cookie-policy/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentCookieClient`
- **Documented States**: Standard Render

### PAGE-031: `/privacy-policy`

- **Source**: [`src/app/(website)/(public)/privacy-policy/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/(public)/privacy-policy/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentPrivacyClient`
- **Documented States**: Standard Render

### PAGE-032: `/terms-of-service`

- **Source**: [`src/app/(website)/(public)/terms-of-service/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/(public)/terms-of-service/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentTermsClient`
- **Documented States**: Standard Render

### PAGE-033: `/about`

- **Source**: [`src/app/(website)/about/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/about/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentAboutClient`
- **Documented States**: Standard Render

### PAGE-034: `/blog/[slug]`

- **Source**: [`src/app/(website)/blog/[slug]/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/blog/[slug]/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `BlogMetadataPublisher`
- **Documented States**: Standard Render

### PAGE-035: `/blog`

- **Source**: [`src/app/(website)/blog/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/blog/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentBlogHubClient`
- **Documented States**: Standard Render

### PAGE-036: `/compare/audiment-vs-checklist-apps`

- **Source**: [`src/app/(website)/compare/audiment-vs-checklist-apps/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-checklist-apps/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `CompareTemplate`
- **Documented States**: Standard Render

### PAGE-037: `/compare/audiment-vs-goaudits`

- **Source**: [`src/app/(website)/compare/audiment-vs-goaudits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-goaudits/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `CompareTemplate`
- **Documented States**: Standard Render

### PAGE-038: `/compare/audiment-vs-jolt`

- **Source**: [`src/app/(website)/compare/audiment-vs-jolt/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-jolt/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `CompareTemplate`
- **Documented States**: empty

### PAGE-039: `/compare/audiment-vs-safetyculture`

- **Source**: [`src/app/(website)/compare/audiment-vs-safetyculture/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-safetyculture/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `CompareTemplate`
- **Documented States**: Standard Render

### PAGE-040: `/compare/audiment-vs-zenput`

- **Source**: [`src/app/(website)/compare/audiment-vs-zenput/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/audiment-vs-zenput/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `CompareTemplate`
- **Documented States**: Standard Render

### PAGE-041: `/compare`

- **Source**: [`src/app/(website)/compare/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/compare/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentCompareClient`
- **Documented States**: Standard Render

### PAGE-042: `/fssai-audit-software`

- **Source**: [`src/app/(website)/fssai-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/fssai-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-043: `/glossary`

- **Source**: [`src/app/(website)/glossary/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/glossary/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentGlossaryClient`
- **Documented States**: Standard Render

### PAGE-044: `/healthcare-audit-software`

- **Source**: [`src/app/(website)/healthcare-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/healthcare-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: error

### PAGE-045: `/hidden-operational-issues`

- **Source**: [`src/app/(website)/hidden-operational-issues/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/hidden-operational-issues/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-046: `/improving-accountability`

- **Source**: [`src/app/(website)/improving-accountability/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/improving-accountability/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-047: `/maintaining-standards-across-locations`

- **Source**: [`src/app/(website)/maintaining-standards-across-locations/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/maintaining-standards-across-locations/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-048: `/multi-location-audit-software`

- **Source**: [`src/app/(website)/multi-location-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/multi-location-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-049: `/operational-drift`

- **Source**: [`src/app/(website)/operational-drift/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/operational-drift/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-050: `/`

- **Source**: [`src/app/(website)/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentLandingClient`
- **Documented States**: Standard Render

### PAGE-051: `/platform/corrective-actions`

- **Source**: [`src/app/(website)/platform/corrective-actions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/corrective-actions/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-052: `/platform/geo-verified-audits`

- **Source**: [`src/app/(website)/platform/geo-verified-audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/geo-verified-audits/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-053: `/platform/issue-tracking`

- **Source**: [`src/app/(website)/platform/issue-tracking/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/issue-tracking/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-054: `/platform/operational-dashboards`

- **Source**: [`src/app/(website)/platform/operational-dashboards/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/operational-dashboards/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: error

### PAGE-055: `/platform/proof-based-audits`

- **Source**: [`src/app/(website)/platform/proof-based-audits/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/platform/proof-based-audits/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: empty, error

### PAGE-056: `/solutions/food-safety-audit-software`

- **Source**: [`src/app/(website)/solutions/food-safety-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/food-safety-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: loading, error

### PAGE-057: `/solutions/franchise-audit-software`

- **Source**: [`src/app/(website)/solutions/franchise-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/franchise-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: empty, error

### PAGE-058: `/solutions/hotel-audit-software`

- **Source**: [`src/app/(website)/solutions/hotel-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/hotel-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: Standard Render

### PAGE-059: `/solutions/manufacturing-audit-software`

- **Source**: [`src/app/(website)/solutions/manufacturing-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/manufacturing-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: empty

### PAGE-060: `/solutions`

- **Source**: [`src/app/(website)/solutions/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentSolutionsClient`
- **Documented States**: Standard Render

### PAGE-061: `/solutions/qsr-audit-software`

- **Source**: [`src/app/(website)/solutions/qsr-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/qsr-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: error

### PAGE-062: `/solutions/restaurant-audit-software`

- **Source**: [`src/app/(website)/solutions/restaurant-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/restaurant-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: error

### PAGE-063: `/solutions/retail-audit-software`

- **Source**: [`src/app/(website)/solutions/retail-audit-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/solutions/retail-audit-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SolutionPageTemplate`
- **Documented States**: empty

### PAGE-064: `/staying-ahead-of-compliance`

- **Source**: [`src/app/(website)/staying-ahead-of-compliance/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/staying-ahead-of-compliance/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `SeoContentPage`
- **Documented States**: Standard Render

### PAGE-065: `/use-cases/audit-checklist-software`

- **Source**: [`src/app/(website)/use-cases/audit-checklist-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/audit-checklist-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `UseCaseTemplate`
- **Documented States**: loading

### PAGE-066: `/use-cases/corrective-action-tracking`

- **Source**: [`src/app/(website)/use-cases/corrective-action-tracking/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/corrective-action-tracking/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `UseCaseTemplate`
- **Documented States**: Standard Render

### PAGE-067: `/use-cases/inspection-management-software`

- **Source**: [`src/app/(website)/use-cases/inspection-management-software/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/inspection-management-software/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `UseCaseTemplate`
- **Documented States**: Standard Render

### PAGE-068: `/use-cases/multi-location-compliance`

- **Source**: [`src/app/(website)/use-cases/multi-location-compliance/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/multi-location-compliance/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `UseCaseTemplate`
- **Documented States**: empty

### PAGE-069: `/use-cases`

- **Source**: [`src/app/(website)/use-cases/page.tsx`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/use-cases/page.tsx)
- **Role**: Public
- **Layout**: WebsiteLayout
- **Key Components Rendered**: `AudimentUseCasesClient`
- **Documented States**: Standard Render

