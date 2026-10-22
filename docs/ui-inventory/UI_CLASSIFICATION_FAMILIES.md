# Audiment UI Classification — Component Families, Design Variants & Contextual Usages

This document establishes the three-tier classification layer above the raw inventory records:
1. **Component Family**: The broad functional type (e.g. Search Input, Action Button, Status Badge).
2. **Design Variant**: A genuinely distinct visual or behavioral design within that family (e.g. Tactile Spring Button vs. Filter Toolbar Button).
3. **Contextual Usage**: The specific instance of that design variant being used on a particular page/container.

## Summary Metrics

- **Component Families**: 14
- **Distinct Design Variants**: 28
- **Total Contextual Usages**: 333
- **Provisional Duplicate Pairs**: 50 pairs (between `src/components/ui` and `app-ui`)

---

## FAM-SEARCH: Search Input (1 Design Variants, 13 Usages)

*Search text input with leading/trailing icon and keyboard filter trigger*

### Variant: `VAR-SEARCH-ICON-INPUT` &mdash; Standard Icon Search Bar

- **Design Distinctions**: Search input with magnifying glass leading icon (pl-9/pl-8), rounded-lg border.
- **Contextual Usages Count**: 13 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `FIL-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L52`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L52) | Admin Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-003` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L75`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L75) | Admin Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-005` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L82`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L82) | Admin Portal | Auto / Fluid | `placeholder="Search managers..."` |
| `FIL-006` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L62`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L62) | Admin Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-007` | [`src/app/(app)/dashboard/admin/users/page.tsx#L129`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L129) | Admin Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-008` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L67`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L67) | Auditor Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-009` | [`src/app/(app)/dashboard/auditor/page.tsx#L45`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L45) | Auditor Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-010` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L97`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L97) | Manager Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-012` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L66`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L66) | Manager Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-014` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L57`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L57) | Manager Portal | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState('');` |
| `FIL-015` | [`src/app/(website)/blog/page.tsx#L35`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/blog/page.tsx#L35) | Public Marketing | Auto / Fluid | `const searchQuery = resolvedSearchParams?.q || '';` |
| `FIL-016` | [`src/components/blog/AudimentBlogHubClient.tsx#L122`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/blog/AudimentBlogHubClient.tsx#L122) | Shared Component System | Auto / Fluid | `const [searchQuery, setSearchQuery] = useState(initialSearchQuery);` |
| `FIL-017` | [`src/components/glossary/AudimentGlossaryClient.tsx#L209`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/glossary/AudimentGlossaryClient.tsx#L209) | Shared Component System | Auto / Fluid | `placeholder="Search operational terms (e.g. FSSAI, Operational Drift, ` |

---

## FAM-FILTER: Filter Dropdown & Toolbar Trigger (1 Design Variants, 4 Usages)

*Facet filter button and dropdown controls for table/list filtering*

### Variant: `VAR-FILTER-SELECT-DROPDOWN` &mdash; Select Dropdown Filter

- **Design Distinctions**: Dropdown menu trigger with chevron and status facet options.
- **Contextual Usages Count**: 4 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `FIL-002` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L53`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L53) | Admin Portal | Auto / Fluid | `const [statusFilter, setStatusFilter] = useState('all');` |
| `FIL-004` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L83`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L83) | Admin Portal | Auto / Fluid | `const [statusFilter, setStatusFilter] = useState<string>('all');` |
| `FIL-011` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L98`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L98) | Manager Portal | Auto / Fluid | `const [statusFilter, setStatusFilter] = useState('all');` |
| `FIL-013` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L67`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L67) | Manager Portal | Auto / Fluid | `const [statusFilter, setStatusFilter] = useState('all');` |

---

## FAM-BTN: Action Button (5 Design Variants, 91 Usages)

*Interactive button controls across primary, secondary, tactile, outline, and icon actions*

### Variant: `VAR-BTN-PRIMARY` &mdash; Primary Solid Button

- **Design Distinctions**: Solid bg-primary text-primary-foreground with rounded-lg radius.
- **Contextual Usages Count**: 58 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BTN-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L347`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L347) | Admin Portal | Height: 44px (h-11) | `<Button size="default" className="shadow-lg shadow-primary/20 h-11 px-` |
| `BTN-005` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L399`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L399) | Admin Portal | Height: 28px (h-7) | `<Button size="sm" className="h-7 px-3 text-[11px] font-medium bg-succe` |
| `BTN-007` | [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L123`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L123) | Admin Portal | Auto / Fluid | `<Button` |
| `BTN-008` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L207`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L207) | Admin Portal | Height: 44px (h-11) | `<Button size="default" className="shadow-lg shadow-primary/20 font-med` |
| `BTN-010` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L44`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L44) | Admin Portal | Auto / Fluid | `<Button` |
| `BTN-012` | [`src/app/(app)/dashboard/admin/page.tsx#L248`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx#L248) | Admin Portal | Auto / Fluid | `<Button` |
| `BTN-013` | [`src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx#L154`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx#L154) | Admin Portal | Auto / Fluid | `<Button` |
| `BTN-015` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L459`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L459) | Admin Portal | Auto / Fluid | `<button` |
| `BTN-019` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L151`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L151) | Admin Portal | Auto / Fluid | `<Button` |
| `BTN-021` | [`src/app/(app)/dashboard/admin/users/page.tsx#L109`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L109) | Admin Portal | Auto / Fluid | `<Button` |
| `BTN-025` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L633`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L633) | Auditor Portal | Auto / Fluid | `<Button` |
| `BTN-027` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L518`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L518) | Auditor Portal | Auto / Fluid | `<Button` |
| `BTN-029` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L303`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L303) | Auditor Portal | Auto / Fluid | `<Button` |
| `BTN-031` | [`src/app/(app)/dashboard/auditor/page.tsx#L256`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L256) | Auditor Portal | Height: 36px (h-9) | `<Button size="sm" className="h-9 px-5 font-semibold text-[13px] shadow` |
| `BTN-032` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L294`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L294) | Auditor Portal | Auto / Fluid | `<button` |
| `BTN-034` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L239`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L239) | Manager Portal | Height: 44px (h-11) | `<Button className="h-11 px-5 gap-2 font-medium text-xs shadow-lg shado` |
| `BTN-037` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L410`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L410) | Manager Portal | Height: 44px (h-11) | `<Button size="default" className="shadow-lg shadow-primary/20 h-11 px-` |
| `BTN-040` | [`src/app/(app)/dashboard/manager/calendar/page.tsx#L162`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/calendar/page.tsx#L162) | Manager Portal | Auto / Fluid | `<Button` |
| `BTN-041` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L390`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L390) | Manager Portal | Auto / Fluid | `<Button` |
| `BTN-043` | [`src/app/(app)/dashboard/manager/page.tsx#L511`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L511) | Manager Portal | Auto / Fluid | `<button` |
| `BTN-045` | [`src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx#L153`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx#L153) | Manager Portal | Auto / Fluid | `<Button` |
| `BTN-047` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L267`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L267) | Manager Portal | Auto / Fluid | `<button` |
| `BTN-050` | [`src/app/(app)/login/page.tsx#L148`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx#L148) | Shared Component System | Height: 44px (h-11) | `<Button type="submit" className="w-full h-11 text-[14px] font-normal t` |
| `BTN-052` | [`src/app/(app)/test-recording/page.tsx#L113`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/test-recording/page.tsx#L113) | Shared Component System | Auto / Fluid | `<button onClick={startCamera} disabled={status !== 'idle'}>1. Start Ca` |
| `BTN-053` | [`src/components/ConsentBanner.tsx#L143`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ConsentBanner.tsx#L143) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-054` | [`src/components/DashboardShell.tsx#L252`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/DashboardShell.tsx#L252) | Shared Component System | Height: 36px (h-9) | `<button className="h-9 w-9 rounded-full border border-border/50 flex i` |
| `BTN-056` | [`src/components/NotificationBell.tsx#L241`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/NotificationBell.tsx#L241) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-057` | [`src/components/ThemeToggle.tsx#L23`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ThemeToggle.tsx#L23) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-058` | [`src/components/admin/TemplateBuilder.tsx#L222`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L222) | Admin Portal | Auto / Fluid | `<button onClick={() => router.back()} className="text-muted-text hover` |
| `BTN-059` | [`src/components/app-ui/alert-dialog.tsx#L158`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/alert-dialog.tsx#L158) | Shared Component System | Auto / Fluid | `<Button variant={variant} size={size} asChild>` |
| `BTN-060` | [`src/components/app-ui/cal-button.tsx#L42`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/cal-button.tsx#L42) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-061` | [`src/components/app-ui/calendar.tsx#L198`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/calendar.tsx#L198) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-062` | [`src/components/app-ui/dialog.tsx#L72`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/dialog.tsx#L72) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-064` | [`src/components/app-ui/faq-accordion.tsx#L56`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/faq-accordion.tsx#L56) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-065` | [`src/components/app-ui/hero-section-3.tsx#L75`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/hero-section-3.tsx#L75) | Shared Component System | Auto / Fluid | `<Button asChild size="lg" className="rounded-full px-8 h-12 text-base"` |
| `BTN-066` | [`src/components/app-ui/input-group.tsx#L94`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/input-group.tsx#L94) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-067` | [`src/components/app-ui/login-1.tsx#L30`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/login-1.tsx#L30) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-068` | [`src/components/app-ui/modem-animated-footer.tsx#L11`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/modem-animated-footer.tsx#L11) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-069` | [`src/components/app-ui/navbar.tsx#L44`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/navbar.tsx#L44) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-070` | [`src/components/app-ui/sheet.tsx#L73`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/sheet.tsx#L73) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-071` | [`src/components/app-ui/sidebar.tsx#L261`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/sidebar.tsx#L261) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-073` | [`src/components/blog/AudimentBlogHubClient.tsx#L250`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/blog/AudimentBlogHubClient.tsx#L250) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-074` | [`src/components/glossary/AudimentGlossaryClient.tsx#L226`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/glossary/AudimentGlossaryClient.tsx#L226) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-075` | [`src/components/home/AudimentLandingClient.tsx#L716`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/home/AudimentLandingClient.tsx#L716) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-076` | [`src/components/theme-toggle.tsx#L22`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/theme-toggle.tsx#L22) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-077` | [`src/components/ui/alert-dialog.tsx#L158`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/alert-dialog.tsx#L158) | Shared Component System | Auto / Fluid | `<Button variant={variant} size={size} asChild>` |
| `BTN-078` | [`src/components/ui/cal-button.tsx#L42`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/cal-button.tsx#L42) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-079` | [`src/components/ui/calendar.tsx#L198`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/calendar.tsx#L198) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-080` | [`src/components/ui/dialog.tsx#L72`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/dialog.tsx#L72) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-082` | [`src/components/ui/faq-accordion.tsx#L56`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/faq-accordion.tsx#L56) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-083` | [`src/components/ui/hero-section-3.tsx#L75`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/hero-section-3.tsx#L75) | Shared Component System | Auto / Fluid | `<Button asChild size="lg" className="rounded-full px-8 h-12 text-base"` |
| `BTN-084` | [`src/components/ui/input-group.tsx#L94`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/input-group.tsx#L94) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-085` | [`src/components/ui/login-1.tsx#L30`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/login-1.tsx#L30) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-086` | [`src/components/ui/modem-animated-footer.tsx#L11`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/modem-animated-footer.tsx#L11) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-087` | [`src/components/ui/navbar.tsx#L44`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/navbar.tsx#L44) | Shared Component System | Auto / Fluid | `<button` |
| `BTN-088` | [`src/components/ui/sheet.tsx#L73`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/sheet.tsx#L73) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-089` | [`src/components/ui/sidebar.tsx#L261`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/sidebar.tsx#L261) | Shared Component System | Auto / Fluid | `<Button` |
| `BTN-091` | [`src/components/website/Header.tsx#L112`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/website/Header.tsx#L112) | Public Marketing | Auto / Fluid | `<button` |

### Variant: `VAR-BTN-OUTLINE` &mdash; Outline Bordered Button

- **Design Distinctions**: 1px border-border, transparent background, text-foreground.
- **Contextual Usages Count**: 20 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BTN-002` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L613`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L613) | Admin Portal | Height: 44px (h-11) | `<Button variant="outline" className="h-11 px-6 font-medium" onClick={(` |
| `BTN-004` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L393`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L393) | Admin Portal | Height: 28px (h-7) | `<Button variant="outline" size="sm" className="h-7 px-3 text-[11px] fo` |
| `BTN-006` | [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L92`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L92) | Admin Portal | Height: 44px (h-11) | `<Button variant="outline" className="h-11 px-6 gap-2 border-border/50"` |
| `BTN-009` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L514`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L514) | Admin Portal | Height: 36px (h-9) | `<Button variant="outline" size="icon" className="h-9 w-9 border-border` |
| `BTN-014` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L178`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L178) | Admin Portal | Auto / Fluid | `<Button variant="outline" className={cn(` |
| `BTN-018` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L779`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L779) | Admin Portal | Auto / Fluid | `<Button variant="outline" onClick={() => setCropModalOpen(false)} disa` |
| `BTN-022` | [`src/app/(app)/dashboard/admin/users/page.tsx#L386`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L386) | Admin Portal | Auto / Fluid | `<Button variant="outline" className={cn(` |
| `BTN-024` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L613`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L613) | Auditor Portal | Auto / Fluid | `<Button variant="outline" onClick={() => router.push('/dashboard/audit` |
| `BTN-026` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L498`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L498) | Auditor Portal | Height: 44px (h-11) | `<Button variant="outline" className="h-11 px-6 border-border/50" onCli` |
| `BTN-033` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L468`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L468) | Auditor Portal | Height: 44px (h-11) | `<Button variant="outline" className="rounded-xl h-11" onClick={() => s` |
| `BTN-035` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L277`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L277) | Manager Portal | Auto / Fluid | `<Button type="button" variant="outline" onClick={() => setIsAddDialogO` |
| `BTN-038` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L456`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L456) | Manager Portal | Auto / Fluid | `<Button variant="outline" className={cn("h-10 w-full justify-start tex` |
| `BTN-042` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L548`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L548) | Manager Portal | Auto / Fluid | `<Button variant="outline" onClick={stopCamera}>Cancel</Button>` |
| `BTN-044` | [`src/app/(app)/dashboard/manager/page.tsx#L785`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L785) | Manager Portal | Height: 28px (h-7) | `<Button size="sm" variant="outline" className="h-7 px-3 text-[11px] fo` |
| `BTN-046` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L241`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L241) | Manager Portal | Auto / Fluid | `<Button variant="outline" className={cn(` |
| `BTN-049` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L427`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L427) | Manager Portal | Auto / Fluid | `<Button variant="outline" onClick={() => setCropModalOpen(false)} disa` |
| `BTN-063` | [`src/components/app-ui/dialog.tsx#L118`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/dialog.tsx#L118) | Shared Component System | Auto / Fluid | `<Button variant="outline">Close</Button>` |
| `BTN-072` | [`src/components/app-ui/solutions-hero.tsx#L77`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/solutions-hero.tsx#L77) | Shared Component System | Auto / Fluid | `<Button asChild size="lg" variant="outline" className="rounded-full px` |
| `BTN-081` | [`src/components/ui/dialog.tsx#L118`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/dialog.tsx#L118) | Shared Component System | Auto / Fluid | `<Button variant="outline">Close</Button>` |
| `BTN-090` | [`src/components/ui/solutions-hero.tsx#L77`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/solutions-hero.tsx#L77) | Shared Component System | Auto / Fluid | `<Button asChild size="lg" variant="outline" className="rounded-full px` |

### Variant: `VAR-BTN-GHOST` &mdash; Ghost Button

- **Design Distinctions**: Borderless transparent background with subtle hover background tint.
- **Contextual Usages Count**: 9 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BTN-003` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L772`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L772) | Admin Portal | Height: 32px (h-8) | `<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal classN` |
| `BTN-011` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L410`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L410) | Admin Portal | Height: 32px (h-8) | `<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal classN` |
| `BTN-017` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L749`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L749) | Admin Portal | Height: 36px (h-9) | `<Button variant="ghost" disabled className="text-destructive h-9 px-5 ` |
| `BTN-020` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L224`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L224) | Admin Portal | Height: 32px (h-8) | `<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal classN` |
| `BTN-023` | [`src/app/(app)/dashboard/admin/users/page.tsx#L470`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L470) | Admin Portal | Height: 32px (h-8) | `<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal classN` |
| `BTN-036` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L417`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L417) | Manager Portal | Height: 32px (h-8) | `<Button variant="ghost" className="h-8 w-8 p-0 text-muted-text hover:t` |
| `BTN-039` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L749`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L749) | Manager Portal | Height: 32px (h-8) | `<Button size="sm" variant="ghost" className="h-8 text-[11px] font-norm` |
| `BTN-051` | [`src/app/(app)/login/page.tsx#L159`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx#L159) | Shared Component System | Height: 44px (h-11) | `<Button type="button" variant="ghost" className="w-full h-11 text-[14p` |
| `BTN-055` | [`src/components/NotificationBell.tsx#L198`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/NotificationBell.tsx#L198) | Shared Component System | Height: 28px (h-7) | `<Button variant="ghost" size="sm" onClick={markAllAsRead} className="h` |

### Variant: `VAR-BTN-SETTINGS-NAV` &mdash; Settings Navigation Item Button (.settings-nav-btn)

- **Design Distinctions**: Full-width left-aligned text-[13px] navigation item with hover/active state.
- **Contextual Usages Count**: 2 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BTN-016` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L463`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L463) | Admin Portal | Auto / Fluid | `'settings-nav-btn',` |
| `BTN-048` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L271`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L271) | Manager Portal | Auto / Fluid | `'settings-nav-btn',` |

### Variant: `VAR-BTN-FILTER-TOOLBAR` &mdash; Filter Toolbar Button (.filter-btn)

- **Design Distinctions**: Explicit h-11 height, text-[13px], border-border/50, active:scale-[0.98].
- **Contextual Usages Count**: 2 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BTN-028` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L222`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L222) | Auditor Portal | Auto / Fluid | `<Button variant="outline" className="filter-btn">` |
| `BTN-030` | [`src/app/(app)/dashboard/auditor/page.tsx#L178`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L178) | Auditor Portal | Auto / Fluid | `<Button variant="outline" className="filter-btn shrink-0 hidden md:fle` |

---

## FAM-TABLE: Data Table & Grid (3 Design Variants, 16 Usages)

*Tabular data display components with headers, rows, and action cells*

### Variant: `VAR-TBL-STANDARD` &mdash; Standard Entity Data Table

- **Design Distinctions**: Striped/bordered table grid with header row and status pill column.
- **Contextual Usages Count**: 13 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `TBL-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L692`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L692) | Admin Portal | Auto / Fluid | `<Table>` |
| `TBL-002` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L321`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L321) | Admin Portal | Auto / Fluid | `<Table>` |
| `TBL-003` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L379`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L379) | Admin Portal | Auto / Fluid | `<Table>` |
| `TBL-005` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L172`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L172) | Admin Portal | Auto / Fluid | `<Table>` |
| `TBL-007` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L237`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L237) | Auditor Portal | Auto / Fluid | `<Table>` |
| `TBL-008` | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L237`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L237) | Manager Portal | Auto / Fluid | `<Table>` |
| `TBL-009` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L375`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L375) | Manager Portal | Auto / Fluid | `<Table>` |
| `TBL-010` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L611`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L611) | Manager Portal | Auto / Fluid | `<Table>` |
| `TBL-012` | [`src/app/(website)/blog/[slug]/page.tsx#L220`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(website)/blog/[slug]/page.tsx#L220) | Public Marketing | Auto / Fluid | `<table className="aud-prose-table" {...props} />` |
| `TBL-013` | [`src/components/app-ui/table.tsx#L13`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/table.tsx#L13) | Shared Component System | Auto / Fluid | `<table` |
| `TBL-014` | [`src/components/compare/AudimentCompareDetailClient.tsx#L293`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/compare/AudimentCompareDetailClient.tsx#L293) | Shared Component System | Auto / Fluid | `<table style={{ width: '100%', minWidth: '760px', borderCollapse: 'col` |
| `TBL-015` | [`src/components/solutions/AudimentSolutionDetailClient.tsx#L336`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/solutions/AudimentSolutionDetailClient.tsx#L336) | Shared Component System | Auto / Fluid | `<table className="aud-checklist-clean-table">` |
| `TBL-016` | [`src/components/ui/table.tsx#L13`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/table.tsx#L13) | Shared Component System | Auto / Fluid | `<table` |

### Variant: `VAR-TBL-REPORT` &mdash; Report Summary Data Table

- **Design Distinctions**: Custom scoring columns, compliance percentage badges, and date filters.
- **Contextual Usages Count**: 2 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `TBL-004` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L208`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L208) | Admin Portal | Auto / Fluid | `<Table>` |
| `TBL-011` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L269`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L269) | Manager Portal | Auto / Fluid | `<Table>` |

### Variant: `VAR-TBL-USERS` &mdash; User Management Directory Table

- **Design Distinctions**: Avatar indicators, role badges, and row-level context action buttons.
- **Contextual Usages Count**: 1 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `TBL-006` | [`src/app/(app)/dashboard/admin/users/page.tsx#L420`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L420) | Admin Portal | Auto / Fluid | `<Table>` |

---

## FAM-BADGE: Status Badge & Tag (3 Design Variants, 19 Usages)

*Pill badges denoting audit statuses, severities, and record states*

### Variant: `VAR-BDG-COMPLETED` &mdash; Audit Completed Badge (.badge-completed)

- **Design Distinctions**: h-6 px-2.5 rounded-full bg-success/10 text-success text-[12px] tracking-[0.02em].
- **Contextual Usages Count**: 1 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BDG-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L267`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L267) | Admin Portal | Auto / Fluid | `return <Badge variant="secondary" className="badge-completed">Complete` |

### Variant: `VAR-BDG-INFORMATIONAL` &mdash; Generic Informational Tag

- **Design Distinctions**: Muted background tag with text-[10px] label.
- **Contextual Usages Count**: 17 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BDG-002` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L271`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L271) | Admin Portal | Auto / Fluid | `return <Badge variant="secondary" className="badge-danger">Deadline hi` |
| `BDG-004` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L282`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L282) | Admin Portal | Auto / Fluid | `return <Badge variant="secondary" className="badge-assigned">Pending</` |
| `BDG-005` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L246`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L246) | Admin Portal | Height: 28px (h-7) | `<Badge variant="secondary" className="h-7 rounded-full bg-destructive/` |
| `BDG-006` | [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L192`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L192) | Admin Portal | Auto / Fluid | `<Badge variant="outline" className="bg-primary/5 text-primary border-p` |
| `BDG-007` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L498`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L498) | Admin Portal | Auto / Fluid | `<Badge className="bg-black/40 backdrop-blur-md border-white/20 text-wh` |
| `BDG-008` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L53`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L53) | Admin Portal | Auto / Fluid | `<Badge` |
| `BDG-009` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L199`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L199) | Admin Portal | Auto / Fluid | `<Badge variant="secondary" className="ml-2 status-badge-xs badge-succe` |
| `BDG-010` | [`src/app/(app)/dashboard/admin/users/page.tsx#L393`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L393) | Admin Portal | Auto / Fluid | `<Badge variant="secondary" className="ml-1 px-1 py-0 h-4 text-[10px] r` |
| `BDG-011` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L675`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L675) | Auditor Portal | Auto / Fluid | `<Badge` |
| `BDG-012` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L532`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L532) | Auditor Portal | Auto / Fluid | `<Badge className="ml-2 bg-primary text-white border-none py-0 px-1.5 h` |
| `BDG-013` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L267`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L267) | Auditor Portal | Auto / Fluid | `<Badge variant="outline" className="bg-primary/5 text-primary border-p` |
| `BDG-014` | [`src/app/(app)/dashboard/auditor/page.tsx#L163`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L163) | Auditor Portal | Auto / Fluid | `<Badge variant="secondary" className="status-badge-sm badge-primary ta` |
| `BDG-015` | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L134`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L134) | Manager Portal | Auto / Fluid | `return <Badge variant="secondary" className="status-badge-sm badge-war` |
| `BDG-016` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L354`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L354) | Manager Portal | Auto / Fluid | `<Badge className="bg-amber-500/10 text-amber-600 border-none px-2 py-0` |
| `BDG-017` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L322`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L322) | Manager Portal | Auto / Fluid | `<Badge className={cn(` |
| `BDG-018` | [`src/components/NotificationBell.tsx#L182`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/NotificationBell.tsx#L182) | Shared Component System | Auto / Fluid | `<Badge className="h-4 w-4 p-0 flex items-center justify-center bg-prim` |
| `BDG-019` | [`src/components/admin/TemplateBuilder.tsx#L337`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L337) | Admin Portal | Auto / Fluid | `<span className="status-badge-xs badge-muted">` |

### Variant: `VAR-BDG-IN-PROGRESS` &mdash; In Progress Badge (.badge-in-progress)

- **Design Distinctions**: h-6 px-2.5 rounded-full bg-primary/10 text-primary text-[12px] tracking-[0.02em].
- **Contextual Usages Count**: 1 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `BDG-003` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L275`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L275) | Admin Portal | Auto / Fluid | `return <Badge variant="secondary" className="badge-in-progress">In pro` |

---

## FAM-INPUT: Text Input & Form Field (2 Design Variants, 42 Usages)

*Single-line and multi-line form text inputs and textareas*

### Variant: `VAR-INP-TEXT` &mdash; Standard Text Input Field

- **Design Distinctions**: Single-line input with border-border/60 and focus ring.
- **Contextual Usages Count**: 35 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `INP-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L631`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L631) | Admin Portal | Auto / Fluid | `<Input` |
| `INP-002` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L295`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L295) | Admin Portal | Auto / Fluid | `<Input` |
| `INP-003` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L423`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L423) | Admin Portal | Auto / Fluid | `<Input` |
| `INP-004` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L80`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L80) | Admin Portal | Auto / Fluid | `<input` |
| `INP-005` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L167`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L167) | Admin Portal | Auto / Fluid | `<Input` |
| `INP-006` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L504`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L504) | Admin Portal | Auto / Fluid | `<input type="file" accept="image/*" ref={userPhotoInputRef} className=` |
| `INP-007` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L532`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L532) | Admin Portal | Height: 40px (h-10) | `<Input type="email" value={profileForm.email} onChange={e => setProfil` |
| `INP-008` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L554`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L554) | Admin Portal | Height: 40px (h-10) | `<Input type="password" value={passwordForm.currentPassword} onChange={` |
| `INP-009` | [`src/app/(app)/dashboard/admin/users/page.tsx#L30`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L30) | Admin Portal | Auto / Fluid | `<Input` |
| `INP-011` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L215`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L215) | Auditor Portal | Auto / Fluid | `<Input` |
| `INP-012` | [`src/app/(app)/dashboard/auditor/page.tsx#L171`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L171) | Auditor Portal | Auto / Fluid | `<Input` |
| `INP-013` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L301`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L301) | Auditor Portal | Auto / Fluid | `<input` |
| `INP-014` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L254`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L254) | Manager Portal | Auto / Fluid | `<Input` |
| `INP-015` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L547`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L547) | Manager Portal | Auto / Fluid | `<Input` |
| `INP-017` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L569`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L569) | Manager Portal | Auto / Fluid | `<input` |
| `INP-019` | [`src/app/(app)/dashboard/manager/page.tsx#L868`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L868) | Manager Portal | Auto / Fluid | `<input type="file" className="hidden" ref={fileInputRef} accept="image` |
| `INP-020` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L231`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L231) | Manager Portal | Auto / Fluid | `<Input` |
| `INP-021` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L310`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L310) | Manager Portal | Auto / Fluid | `<input type="file" accept="image/*" ref={userPhotoInputRef} className=` |
| `INP-022` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L338`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L338) | Manager Portal | Height: 40px (h-10) | `<Input type="email" value={profileForm.email} onChange={e => setProfil` |
| `INP-023` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L364`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L364) | Manager Portal | Height: 40px (h-10) | `<Input type="password" value={passwordForm.currentPassword} onChange={` |
| `INP-024` | [`src/app/(app)/login/page.tsx#L104`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx#L104) | Shared Component System | Auto / Fluid | `<Input` |
| `INP-025` | [`src/components/ConsentBanner.tsx#L214`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ConsentBanner.tsx#L214) | Shared Component System | Auto / Fluid | `<input` |
| `INP-026` | [`src/components/admin/TemplateBuilder.tsx#L282`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L282) | Admin Portal | Auto / Fluid | `<Input` |
| `INP-027` | [`src/components/app-ui/combobox.tsx#L65`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/combobox.tsx#L65) | Shared Component System | Auto / Fluid | `<InputGroup className={cn("w-auto", className)}>` |
| `INP-028` | [`src/components/app-ui/input-group.tsx#L121`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/input-group.tsx#L121) | Shared Component System | Auto / Fluid | `<Input` |
| `INP-030` | [`src/components/app-ui/input.tsx#L7`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/input.tsx#L7) | Shared Component System | Auto / Fluid | `<input` |
| `INP-031` | [`src/components/app-ui/login-1.tsx#L117`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/login-1.tsx#L117) | Shared Component System | Auto / Fluid | `<Input` |
| `INP-032` | [`src/components/app-ui/sidebar.tsx#L322`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/sidebar.tsx#L322) | Shared Component System | Auto / Fluid | `<Input` |
| `INP-034` | [`src/components/blog/AudimentBlogHubClient.tsx#L242`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/blog/AudimentBlogHubClient.tsx#L242) | Shared Component System | Auto / Fluid | `<input` |
| `INP-035` | [`src/components/glossary/AudimentGlossaryClient.tsx#L207`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/glossary/AudimentGlossaryClient.tsx#L207) | Shared Component System | Auto / Fluid | `<input` |
| `INP-036` | [`src/components/ui/combobox.tsx#L65`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/combobox.tsx#L65) | Shared Component System | Auto / Fluid | `<InputGroup className={cn("w-auto", className)}>` |
| `INP-037` | [`src/components/ui/input-group.tsx#L121`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/input-group.tsx#L121) | Shared Component System | Auto / Fluid | `<Input` |
| `INP-039` | [`src/components/ui/input.tsx#L7`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/input.tsx#L7) | Shared Component System | Auto / Fluid | `<input` |
| `INP-040` | [`src/components/ui/login-1.tsx#L117`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/login-1.tsx#L117) | Shared Component System | Auto / Fluid | `<Input` |
| `INP-041` | [`src/components/ui/sidebar.tsx#L322`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/sidebar.tsx#L322) | Shared Component System | Auto / Fluid | `<Input` |

### Variant: `VAR-INP-TEXTAREA` &mdash; Multiline Form Textarea

- **Design Distinctions**: Resizable/fixed vertical textarea with multiline text overflow.
- **Contextual Usages Count**: 7 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `INP-010` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L789`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L789) | Auditor Portal | Auto / Fluid | `<Textarea` |
| `INP-016` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L489`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L489) | Manager Portal | Auto / Fluid | `<Textarea` |
| `INP-018` | [`src/app/(app)/dashboard/manager/page.tsx#L840`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L840) | Manager Portal | Auto / Fluid | `<Textarea` |
| `INP-029` | [`src/components/app-ui/input-group.tsx#L137`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/input-group.tsx#L137) | Shared Component System | Auto / Fluid | `<Textarea` |
| `INP-033` | [`src/components/app-ui/textarea.tsx#L7`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/textarea.tsx#L7) | Shared Component System | Auto / Fluid | `<textarea` |
| `INP-038` | [`src/components/ui/input-group.tsx#L137`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/input-group.tsx#L137) | Shared Component System | Auto / Fluid | `<Textarea` |
| `INP-042` | [`src/components/ui/textarea.tsx#L7`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/textarea.tsx#L7) | Shared Component System | Auto / Fluid | `<textarea` |

---

## FAM-SELECT: Select & Context Menu (2 Design Variants, 25 Usages)

*Dropdown selection pickers and action menus*

### Variant: `VAR-SEL-FORM-PICKER` &mdash; Form Select Picker

- **Design Distinctions**: Select dropdown with value display and chevron trigger.
- **Contextual Usages Count**: 13 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `SEL-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L362`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L362) | Admin Portal | Auto / Fluid | `<Select value={formData.templateId} onValueChange={(val) => updateForm` |
| `SEL-003` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L303`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L303) | Admin Portal | Height: 44px (h-11) | `<SelectTrigger className="w-[180px] h-11 bg-background text-body borde` |
| `SEL-004` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L227`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L227) | Admin Portal | Auto / Fluid | `<Select value={selectedLocation} onValueChange={(val) => {` |
| `SEL-007` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L639`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L639) | Admin Portal | Auto / Fluid | `<Select value={orgForm.timezone} onValueChange={val => setOrgForm(p =>` |
| `SEL-009` | [`src/app/(app)/dashboard/admin/users/page.tsx#L65`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L65) | Admin Portal | Auto / Fluid | `<Select value={formData.role} onValueChange={(val) => setFormData({ ..` |
| `SEL-011` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L681`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L681) | Auditor Portal | Auto / Fluid | `<Select` |
| `SEL-012` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L349`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L349) | Auditor Portal | Auto / Fluid | `<Select value={profileForm.language} onValueChange={val => setProfileF` |
| `SEL-014` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L424`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L424) | Manager Portal | Auto / Fluid | `<Select value={formData.templateId} onValueChange={(val) => updateForm` |
| `SEL-019` | [`src/components/admin/TemplateBuilder.tsx#L292`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L292) | Admin Portal | Auto / Fluid | `<Select value={category} onValueChange={setCategory}>` |
| `SEL-020` | [`src/components/app-ui/combobox.tsx#L28`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/combobox.tsx#L28) | Shared Component System | Auto / Fluid | `<ComboboxPrimitive.Trigger` |
| `SEL-022` | [`src/components/app-ui/select.tsx#L20`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/select.tsx#L20) | Shared Component System | Auto / Fluid | `<SelectPrimitive.Group` |
| `SEL-023` | [`src/components/ui/combobox.tsx#L28`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/combobox.tsx#L28) | Shared Component System | Auto / Fluid | `<ComboboxPrimitive.Trigger` |
| `SEL-025` | [`src/components/ui/select.tsx#L20`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/select.tsx#L20) | Shared Component System | Auto / Fluid | `<SelectPrimitive.Group` |

### Variant: `VAR-SEL-DROPDOWN-MENU` &mdash; Context Action Dropdown Menu

- **Design Distinctions**: Floating overlay menu triggered by icon or button click.
- **Contextual Usages Count**: 12 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `SEL-002` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L649`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L649) | Admin Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-005` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L408`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L408) | Admin Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-006` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L176`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L176) | Admin Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-008` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L222`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L222) | Admin Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-010` | [`src/app/(app)/dashboard/admin/users/page.tsx#L384`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L384) | Admin Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-013` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L351`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L351) | Manager Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-015` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L575`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L575) | Manager Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-016` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L239`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L239) | Manager Portal | Auto / Fluid | `<DropdownMenu>` |
| `SEL-017` | [`src/components/DashboardShell.tsx#L167`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/DashboardShell.tsx#L167) | Shared Component System | Auto / Fluid | `<DropdownMenu>` |
| `SEL-018` | [`src/components/NotificationBell.tsx#L191`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/NotificationBell.tsx#L191) | Shared Component System | Auto / Fluid | `<DropdownMenuContent align={variant === 'sidebar-item' ? 'start' : 'en` |
| `SEL-021` | [`src/components/app-ui/dropdown-menu.tsx#L19`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/dropdown-menu.tsx#L19) | Shared Component System | Auto / Fluid | `<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...pro` |
| `SEL-024` | [`src/components/ui/dropdown-menu.tsx#L19`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/dropdown-menu.tsx#L19) | Shared Component System | Auto / Fluid | `<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...pro` |

---

## FAM-CARD: Card & Metric Widget (2 Design Variants, 28 Usages)

*KPI hero statistics and surface container cards*

### Variant: `VAR-CRD-SURFACE` &mdash; Standard Card Container

- **Design Distinctions**: Bordered white/dark card with rounded-xl radius and subtle shadow.
- **Contextual Usages Count**: 22 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `CRD-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L691`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L691) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-002` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L254`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L254) | Admin Portal | Auto / Fluid | `<Card className="standard-card p-6 overflow-hidden relative">` |
| `CRD-004` | [`src/app/(app)/dashboard/admin/loading.tsx#L16`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/loading.tsx#L16) | Admin Portal | Auto / Fluid | `<Card key={i} className="standard-card">` |
| `CRD-005` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L378`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L378) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-006` | [`src/app/(app)/dashboard/admin/page.tsx#L265`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx#L265) | Admin Portal | Auto / Fluid | `<Card className="standard-card p-6">` |
| `CRD-008` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L207`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L207) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-009` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L483`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L483) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-010` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L171`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L171) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-011` | [`src/app/(app)/dashboard/admin/users/page.tsx#L419`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L419) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-012` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L178`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L178) | Auditor Portal | Auto / Fluid | `<Card className="standard-card p-6">` |
| `CRD-014` | [`src/app/(app)/dashboard/auditor/page.tsx#L133`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L133) | Auditor Portal | Auto / Fluid | `<Card className="standard-card p-4 md:p-6">` |
| `CRD-016` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L272`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L272) | Auditor Portal | Auto / Fluid | `<Card className="standard-card overflow-hidden">` |
| `CRD-017` | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L189`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L189) | Manager Portal | Auto / Fluid | `<Card className="standard-card p-6">` |
| `CRD-019` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L289`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L289) | Manager Portal | Auto / Fluid | `<Card className="standard-card p-6">` |
| `CRD-020` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L609`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L609) | Manager Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-021` | [`src/app/(app)/dashboard/manager/calendar/page.tsx#L186`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/calendar/page.tsx#L186) | Manager Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-022` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L346`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L346) | Manager Portal | Auto / Fluid | `<Card key={ca.id} className="p-0 border border-border/50 overflow-hidd` |
| `CRD-023` | [`src/app/(app)/dashboard/manager/page.tsx#L454`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L454) | Manager Portal | Auto / Fluid | `<Card className="standard-card p-6 bg-card">` |
| `CRD-025` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L268`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L268) | Manager Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-026` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L288`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L288) | Manager Portal | Auto / Fluid | `<Card className="standard-card">` |
| `CRD-027` | [`src/app/(app)/login/page.tsx#L91`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx#L91) | Shared Component System | Auto / Fluid | `<Card className="border-border/50 shadow-xl shadow-black/[0.02] backdr` |
| `CRD-028` | [`src/components/admin/TemplateBuilder.tsx#L272`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L272) | Admin Portal | Auto / Fluid | `<Card className="standard-card">` |

### Variant: `VAR-CRD-KPI-HERO` &mdash; Hero KPI Stat Display (.stat-number)

- **Design Distinctions**: Text-[32px] optical tracking-[-0.03em] tabular numerals with uppercase stat label.
- **Contextual Usages Count**: 6 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `CRD-003` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L260`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L260) | Admin Portal | Auto / Fluid | `<div className="stat-number text-destructive">` |
| `CRD-007` | [`src/app/(app)/dashboard/admin/page.tsx#L271`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx#L271) | Admin Portal | Auto / Fluid | `<div className="stat-number text-heading">{stats?.totalAuditsThisMonth` |
| `CRD-013` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L184`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L184) | Auditor Portal | Auto / Fluid | `<div className="stat-number text-heading">{history.length}</div>` |
| `CRD-015` | [`src/app/(app)/dashboard/auditor/page.tsx#L139`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L139) | Auditor Portal | Auto / Fluid | `<div className="stat-number text-heading">{completedAudits.length}</di` |
| `CRD-018` | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L195`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L195) | Manager Portal | Auto / Fluid | `<div className="stat-number text-heading">{stats.total}</div>` |
| `CRD-024` | [`src/app/(app)/dashboard/manager/page.tsx#L456`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L456) | Manager Portal | Auto / Fluid | `<div className="stat-number-lg text-heading mt-3">` |

---

## FAM-MODAL: Dialog, Modal & Sheet (3 Design Variants, 24 Usages)

*Modal windows, alert confirmation overlays, and slide-over sheets*

### Variant: `VAR-MOD-MODAL` &mdash; Standard Interactive Modal Window

- **Design Distinctions**: Centered overlay modal with header, body content, and action footer.
- **Contextual Usages Count**: 16 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `MOD-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L311`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L311) | Admin Portal | Auto / Fluid | `<Dialog open={open} onOpenChange={(val) => {` |
| `MOD-002` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L412`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L412) | Admin Portal | Auto / Fluid | `<Dialog open={!!editingCA} onOpenChange={(open) => !open && setEditing` |
| `MOD-003` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L195`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L195) | Admin Portal | Auto / Fluid | `<Dialog open={isDialogOpen} onOpenChange={(open) => {` |
| `MOD-004` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L42`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L42) | Admin Portal | Auto / Fluid | `<Dialog open={open} onOpenChange={setOpen}>` |
| `MOD-005` | [`src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx#L376`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx#L376) | Admin Portal | Auto / Fluid | `<Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSel` |
| `MOD-006` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L759`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L759) | Admin Portal | Auto / Fluid | `<Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>` |
| `MOD-007` | [`src/app/(app)/dashboard/admin/users/page.tsx#L341`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L341) | Admin Portal | Auto / Fluid | `<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>` |
| `MOD-010` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L448`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L448) | Auditor Portal | Auto / Fluid | `<Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>` |
| `MOD-011` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L237`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L237) | Manager Portal | Auto / Fluid | `<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>` |
| `MOD-012` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L408`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L408) | Manager Portal | Auto / Fluid | `<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>` |
| `MOD-013` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L477`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L477) | Manager Portal | Auto / Fluid | `<Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelect` |
| `MOD-014` | [`src/app/(app)/dashboard/manager/page.tsx#L826`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L826) | Manager Portal | Auto / Fluid | `<Dialog open={!!selectedCA} onOpenChange={(open) => !open && setSelect` |
| `MOD-015` | [`src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx#L372`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx#L372) | Manager Portal | Auto / Fluid | `<Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSel` |
| `MOD-016` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L407`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L407) | Manager Portal | Auto / Fluid | `<Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>` |
| `MOD-018` | [`src/components/app-ui/dialog.tsx#L39`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/dialog.tsx#L39) | Shared Component System | Auto / Fluid | `<DialogPrimitive.Overlay` |
| `MOD-022` | [`src/components/ui/dialog.tsx#L39`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/dialog.tsx#L39) | Shared Component System | Auto / Fluid | `<DialogPrimitive.Overlay` |

### Variant: `VAR-MOD-ALERT` &mdash; Confirmation Alert Dialog

- **Design Distinctions**: Centered modal overlay for critical confirm/cancel actions.
- **Contextual Usages Count**: 4 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `MOD-008` | [`src/app/(app)/dashboard/admin/users/page.tsx#L531`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L531) | Admin Portal | Auto / Fluid | `<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>` |
| `MOD-009` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L836`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L836) | Auditor Portal | Auto / Fluid | `<AlertDialog open={showInitialLocationPrompt}>` |
| `MOD-017` | [`src/components/app-ui/alert-dialog.tsx#L19`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/alert-dialog.tsx#L19) | Shared Component System | Auto / Fluid | `<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...pro` |
| `MOD-021` | [`src/components/ui/alert-dialog.tsx#L19`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/alert-dialog.tsx#L19) | Shared Component System | Auto / Fluid | `<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...pro` |

### Variant: `VAR-MOD-SHEET` &mdash; Slide-over Drawer Sheet

- **Design Distinctions**: Side sliding panel animation anchored to right viewport edge.
- **Contextual Usages Count**: 4 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `MOD-019` | [`src/components/app-ui/sheet.tsx#L37`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/sheet.tsx#L37) | Shared Component System | Auto / Fluid | `<SheetPrimitive.Overlay` |
| `MOD-020` | [`src/components/app-ui/sidebar.tsx#L183`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/sidebar.tsx#L183) | Shared Component System | Auto / Fluid | `<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>` |
| `MOD-023` | [`src/components/ui/sheet.tsx#L37`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/sheet.tsx#L37) | Shared Component System | Auto / Fluid | `<SheetPrimitive.Overlay` |
| `MOD-024` | [`src/components/ui/sidebar.tsx#L183`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/sidebar.tsx#L183) | Shared Component System | Auto / Fluid | `<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>` |

---

## FAM-NAV: Tabs & Segment Navigation (2 Design Variants, 14 Usages)

*Horizontal segment pills, tab bars, and settings navigation lists*

### Variant: `VAR-NAV-UNDERLINE-TAB` &mdash; Underline Tab Strip

- **Design Distinctions**: Horizontal tab row with active bottom border highlight.
- **Contextual Usages Count**: 13 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `NAV-001` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L410`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L410) | Admin Portal | Width: 100% (w-full) | `<Tabs defaultValue="all" className="w-full">` |
| `NAV-002` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L457`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L457) | Admin Portal | Auto / Fluid | `<nav className="w-48 flex-shrink-0 flex flex-col gap-1">` |
| `NAV-003` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L527`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L527) | Auditor Portal | Auto / Fluid | `<Tabs value={viewTab} onValueChange={(v) => setViewTab(v as any)}>` |
| `NAV-004` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L319`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L319) | Manager Portal | Auto / Fluid | `<Tabs defaultValue="active" className="space-y-6">` |
| `NAV-006` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L265`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L265) | Manager Portal | Auto / Fluid | `<nav className="w-48 flex-shrink-0 flex flex-col gap-1">` |
| `NAV-007` | [`src/components/DashboardShell.tsx#L309`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/DashboardShell.tsx#L309) | Shared Component System | Auto / Fluid | `<nav className="shrink-0 fixed bottom-0 left-0 right-0 z-30 pb-[env(sa` |
| `NAV-008` | [`src/components/app-ui/navbar.tsx#L31`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/navbar.tsx#L31) | Shared Component System | Auto / Fluid | `<nav` |
| `NAV-009` | [`src/components/app-ui/tabs.tsx#L15`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/tabs.tsx#L15) | Shared Component System | Auto / Fluid | `<TabsPrimitive.Root` |
| `NAV-010` | [`src/components/blog/AudimentBlogHubClient.tsx#L266`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/blog/AudimentBlogHubClient.tsx#L266) | Shared Component System | Auto / Fluid | `<nav className="aud-blog-tabs-nav" ref={tabsNavRef}>` |
| `NAV-011` | [`src/components/blog/AudimentBlogPostClient.tsx#L191`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/blog/AudimentBlogPostClient.tsx#L191) | Shared Component System | Auto / Fluid | `<nav className="aud-toc-list">` |
| `NAV-012` | [`src/components/ui/navbar.tsx#L31`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/navbar.tsx#L31) | Shared Component System | Auto / Fluid | `<nav` |
| `NAV-013` | [`src/components/ui/tabs.tsx#L15`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/tabs.tsx#L15) | Shared Component System | Auto / Fluid | `<TabsPrimitive.Root` |
| `NAV-014` | [`src/components/website/Header.tsx#L30`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/website/Header.tsx#L30) | Public Marketing | Auto / Fluid | `<nav>` |

### Variant: `VAR-NAV-SEGMENT-PILL` &mdash; Segment Control Switcher Pill (.segment-btn)

- **Design Distinctions**: Background track with active tab pill transition and active:scale-[0.97].
- **Contextual Usages Count**: 1 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `NAV-005` | [`src/app/(app)/dashboard/manager/page.tsx#L636`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L636) | Manager Portal | Auto / Fluid | `"segment-btn",` |

---

## FAM-LOADING: Loading Indicator & Skeleton (1 Design Variants, 33 Usages)

*Content shimmer placeholder blocks and spinning loaders*

### Variant: `VAR-SKL-PULSE` &mdash; Animated Pulse Skeleton Shimmer

- **Design Distinctions**: Rounded grey blocks with pulse opacity animation.
- **Contextual Usages Count**: 33 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `SKL-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L619`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L619) | Admin Portal | Auto / Fluid | `{loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}` |
| `SKL-002` | [`src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L220`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/corrective-actions/page.tsx#L220) | Admin Portal | Auto / Fluid | `<Skeleton className="h-[32px] w-[250px]" />` |
| `SKL-003` | [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L64`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L64) | Admin Portal | Height: 40px (h-10) | `<Skeleton className="h-10 w-10 rounded-lg" />` |
| `SKL-004` | [`src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L132`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/[flashmobId]/page.tsx#L132) | Admin Portal | Auto / Fluid | `{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 c` |
| `SKL-005` | [`src/app/(app)/dashboard/admin/loading.tsx#L10`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/loading.tsx#L10) | Admin Portal | Height: 36px (h-9) | `<Skeleton className="h-9 w-48" />` |
| `SKL-006` | [`src/app/(app)/dashboard/admin/page.tsx#L192`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx#L192) | Admin Portal | Auto / Fluid | `<Skeleton className="h-[32px] w-[250px]" />` |
| `SKL-007` | [`src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx#L114`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/[auditId]/page.tsx#L114) | Admin Portal | Auto / Fluid | `<Clock className="h-5 w-5 animate-spin text-muted-text/40" />` |
| `SKL-008` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L140`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L140) | Admin Portal | Height: 32px (h-8) | `<Skeleton className="h-8 w-64" />` |
| `SKL-009` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L429`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L429) | Admin Portal | Height: 36px (h-9) | `<Skeleton className="h-9 w-40 mb-2" />` |
| `SKL-010` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L502`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L502) | Admin Portal | Auto / Fluid | `{uploadingPhoto ? <Loader2 className="h-3 w-3 animate-spin" /> : <Came` |
| `SKL-011` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L590`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L590) | Auditor Portal | Height: 24px (h-6) | `<Skeleton className="h-6 w-48" />` |
| `SKL-012` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L659`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L659) | Auditor Portal | Auto / Fluid | `{saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud ` |
| `SKL-013` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L474`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L474) | Auditor Portal | Height: 32px (h-8) | `<Skeleton className="h-8 w-48" />` |
| `SKL-014` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L899`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L899) | Auditor Portal | Auto / Fluid | `<div className="h-4 w-4 animate-spin rounded-full border-2 border-whit` |
| `SKL-015` | [`src/app/(app)/dashboard/auditor/history/page.tsx#L146`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/history/page.tsx#L146) | Auditor Portal | Height: 32px (h-8) | `<Skeleton className="h-8 w-64" />` |
| `SKL-016` | [`src/app/(app)/dashboard/auditor/page.tsx#L188`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L188) | Auditor Portal | Width: 100% (w-full) | `<Skeleton className="h-2 w-full" />` |
| `SKL-017` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L249`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L249) | Auditor Portal | Height: 36px (h-9) | `<Skeleton className="h-9 w-40 mb-2" />` |
| `SKL-018` | [`src/app/(app)/dashboard/auditor/settings/page.tsx#L299`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/settings/page.tsx#L299) | Auditor Portal | Auto / Fluid | `{uploadingPhoto ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <` |
| `SKL-019` | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L151`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L151) | Manager Portal | Auto / Fluid | `<Skeleton className="h-5 w-5 rounded" />` |
| `SKL-020` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L223`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L223) | Manager Portal | Height: 32px (h-8) | `<Loader2 className="h-8 w-8 animate-spin text-primary" />` |
| `SKL-021` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L535`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L535) | Manager Portal | Auto / Fluid | `{loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}` |
| `SKL-022` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L303`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L303) | Manager Portal | Height: 32px (h-8) | `<Loader2 className="h-8 w-8 animate-spin text-primary" />` |
| `SKL-023` | [`src/app/(app)/dashboard/manager/page.tsx#L418`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L418) | Manager Portal | Height: 32px (h-8) | `<Skeleton className="h-8 w-64" />` |
| `SKL-024` | [`src/app/(app)/dashboard/manager/page.tsx#L860`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L860) | Manager Portal | Auto / Fluid | `<Loader2 className="h-5 w-5 animate-spin text-primary" />` |
| `SKL-025` | [`src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx#L113`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/[auditId]/page.tsx#L113) | Manager Portal | Auto / Fluid | `<Clock className="h-5 w-5 animate-spin text-muted-text/40" />` |
| `SKL-026` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L200`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L200) | Manager Portal | Height: 32px (h-8) | `<Skeleton className="h-8 w-64" />` |
| `SKL-027` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L241`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L241) | Manager Portal | Height: 36px (h-9) | `<Skeleton className="h-9 w-40 mb-2" />` |
| `SKL-028` | [`src/app/(app)/dashboard/manager/settings/page.tsx#L308`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/settings/page.tsx#L308) | Manager Portal | Auto / Fluid | `{uploadingPhoto ? <Loader2 className="h-3 w-3 animate-spin" /> : <Came` |
| `SKL-029` | [`src/app/(app)/login/page.tsx#L151`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx#L151) | Shared Component System | Auto / Fluid | `<span className="w-4 h-4 border-2 border-primary-foreground/30 border-` |
| `SKL-030` | [`src/components/admin/TemplateBuilder.tsx#L198`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L198) | Admin Portal | Height: 24px (h-6) | `<Skeleton className="h-6 w-48" />` |
| `SKL-031` | [`src/components/admin/TemplateBuilder.tsx#L252`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L252) | Admin Portal | Auto / Fluid | `? <div className="h-4 w-4 animate-spin rounded-full border-2 border-cu` |
| `SKL-032` | [`src/components/app-ui/sidebar.tsx#L609`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/app-ui/sidebar.tsx#L609) | Shared Component System | Auto / Fluid | `<Skeleton` |
| `SKL-033` | [`src/components/ui/sidebar.tsx#L609`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/ui/sidebar.tsx#L609) | Shared Component System | Auto / Fluid | `<Skeleton` |

---

## FAM-EMPTY: Empty & Error State View (1 Design Variants, 18 Usages)

*Zero-state and no-records feedback containers*

### Variant: `VAR-EMP-ZERO-STATE` &mdash; Dashed Border Zero State Container

- **Design Distinctions**: Centered feedback with dashed border-border/70 and search icon.
- **Contextual Usages Count**: 18 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `EMP-001` | [`src/app/(app)/dashboard/admin/audits/page.tsx#L712`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/audits/page.tsx#L712) | Admin Portal | Auto / Fluid | `<p className="font-semibold text-heading opacity-40">No audits publish` |
| `EMP-002` | [`src/app/(app)/dashboard/admin/flashmob/page.tsx#L442`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/flashmob/page.tsx#L442) | Admin Portal | Auto / Fluid | `<h3 className="empty-state-title">No audit logs found</h3>` |
| `EMP-003` | [`src/app/(app)/dashboard/admin/locations/page.tsx#L90`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/locations/page.tsx#L90) | Admin Portal | Auto / Fluid | `No manager found.` |
| `EMP-004` | [`src/app/(app)/dashboard/admin/reports/page.tsx#L226`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/reports/page.tsx#L226) | Admin Portal | Auto / Fluid | `<p className="page-heading opacity-40">No matching reports found.</p>` |
| `EMP-005` | [`src/app/(app)/dashboard/admin/settings/page.tsx#L359`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/settings/page.tsx#L359) | Admin Portal | Auto / Fluid | `if (!audits.length) { alert('No data to export'); return; }` |
| `EMP-006` | [`src/app/(app)/dashboard/admin/templates/page.tsx#L188`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/templates/page.tsx#L188) | Admin Portal | Auto / Fluid | `<p className="text-body">No templates found. Start by loading defaults` |
| `EMP-007` | [`src/app/(app)/dashboard/admin/users/page.tsx#L434`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/users/page.tsx#L434) | Admin Portal | Auto / Fluid | `No users found matching your search.` |
| `EMP-008` | [`src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L611`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/audits/[auditId]/page.tsx#L611) | Auditor Portal | Auto / Fluid | `<p className="font-semibold text-heading text-lg">No questions found</` |
| `EMP-009` | [`src/app/(app)/dashboard/auditor/page.tsx#L201`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/page.tsx#L201) | Auditor Portal | Auto / Fluid | `<p className="text-[13px] font-medium text-muted-text opacity-50">No a` |
| `EMP-010` | [`src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L250`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/[id]/page.tsx#L250) | Manager Portal | Auto / Fluid | `No audits found for this auditor.` |
| `EMP-011` | [`src/app/(app)/dashboard/manager/auditors/page.tsx#L388`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/auditors/page.tsx#L388) | Manager Portal | Auto / Fluid | `No auditors found in your reporting list.` |
| `EMP-012` | [`src/app/(app)/dashboard/manager/audits/page.tsx#L640`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/audits/page.tsx#L640) | Manager Portal | Auto / Fluid | `No audits found matching your criteria.` |
| `EMP-013` | [`src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L418`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/corrective-actions/page.tsx#L418) | Manager Portal | Auto / Fluid | `<p className="font-semibold text-heading opacity-40">No history found<` |
| `EMP-014` | [`src/app/(app)/dashboard/manager/page.tsx#L774`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L774) | Manager Portal | Auto / Fluid | `<p className="py-6 text-center text-xs text-muted-text/40">No unassign` |
| `EMP-015` | [`src/app/(app)/dashboard/manager/reports/page.tsx#L294`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/reports/page.tsx#L294) | Manager Portal | Auto / Fluid | `: "No matching reports found."}` |
| `EMP-016` | [`src/app/(app)/login/page.tsx#L67`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/login/page.tsx#L67) | Shared Component System | Auto / Fluid | `else if (code === 'auth/user-not-found') setError('No account found wi` |
| `EMP-017` | [`src/components/blog/AudimentBlogHubClient.tsx#L442`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/blog/AudimentBlogHubClient.tsx#L442) | Shared Component System | Auto / Fluid | `<h3>No articles found</h3>` |
| `EMP-018` | [`src/components/home/AudimentLandingClient.tsx#L349`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/home/AudimentLandingClient.tsx#L349) | Shared Component System | Auto / Fluid | `{ industry: 'Retail chain – 45 stores', headline: 'No more skipped or ` |

---

## FAM-CHART: Data Visualization Chart (1 Design Variants, 3 Usages)

*Trend line charts, bar visualizations, and metric graphs*

### Variant: `VAR-CHT-BAR-TREND` &mdash; Bar & Trend Visualization Chart

- **Design Distinctions**: Recharts responsive svg bar and trend visualization wrapper.
- **Contextual Usages Count**: 3 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `CHT-001` | [`src/app/(app)/dashboard/admin/page.tsx#L314`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx#L314) | Admin Portal | Auto / Fluid | `<ResponsiveContainer width="100%" height="100%" minHeight={400}>` |
| `CHT-002` | [`src/app/(app)/dashboard/admin/page.tsx#L315`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/admin/page.tsx#L315) | Admin Portal | Auto / Fluid | `<BarChart data={stats?.locationScores} margin={{ top: 20, right: 30, l` |
| `CHT-003` | [`src/app/(app)/dashboard/manager/page.tsx#L566`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/manager/page.tsx#L566) | Manager Portal | Auto / Fluid | `<ResponsiveContainer width="100%" height="100%">` |

---

## FAM-SPECIALIZED: Specialized Audit Tool (1 Design Variants, 3 Usages)

*Checklist template builders, camera viewfinder feeds, and audio/video harnesses*

### Variant: `VAR-SPU-EXECUTION` &mdash; Audit Execution & Camera Verification Step

- **Design Distinctions**: Geo-tagged photo capture node and drag-and-drop question builder item.
- **Contextual Usages Count**: 3 pages/screens

| Raw ID | Page / Source File | Portal Context | Container Layout | Snippet |
| :--- | :--- | :--- | :--- | :--- |
| `SPU-001` | [`src/app/(app)/dashboard/auditor/flashmob/page.tsx#L71`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/dashboard/auditor/flashmob/page.tsx#L71) | Auditor Portal | Auto / Fluid | `{STEPS.map((step, i) => {` |
| `SPU-002` | [`src/app/(app)/test-recording/page.tsx#L89`](file:///Users/sanskar/Documents/Asellus/Audiment/src/app/(app)/test-recording/page.tsx#L89) | Shared Component System | Auto / Fluid | `setStatus('recording');` |
| `SPU-003` | [`src/components/admin/TemplateBuilder.tsx#L25`](file:///Users/sanskar/Documents/Asellus/Audiment/src/components/admin/TemplateBuilder.tsx#L25) | Admin Portal | Auto / Fluid | `questionText: string;` |

---

