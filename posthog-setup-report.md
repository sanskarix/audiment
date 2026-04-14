<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Audiment Next.js App Router project. Here is a summary of all changes made:

**Infrastructure (already in place):**
- `instrumentation-client.ts` — Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` approach. Enables session replay, autocapture, and exception tracking via `capture_exceptions: true`.
- `src/lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event capture in API routes.
- `next.config.ts` — `/ingest` reverse proxy rewrites route PostHog traffic through the app (avoids ad blockers); `skipTrailingSlashRedirect: true`; Content Security Policy includes PostHog hosts.
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` confirmed and updated.

**New event tracking added in this session (3 files):**

| Event Name | Description | File |
|---|---|---|
| `template_saved` | Admin saves a new or updated audit template; properties include `is_new`, `category`, `question_count` | `src/components/admin/TemplateBuilder.tsx` |
| `location_created` | Admin creates a new location; properties include `location_name`, `city`, `assigned_manager_count` | `src/app/dashboard/admin/locations/page.tsx` |
| `location_updated` | Admin edits an existing location | `src/app/dashboard/admin/locations/page.tsx` |
| `corrective_action_completed` | Manager submits a resolution for a corrective action; properties include `has_photos`, `photo_count`, `severity` | `src/app/dashboard/manager/corrective-actions/page.tsx` |
| `corrective_action_marked_ongoing` | Manager marks a corrective action as in-progress | `src/app/dashboard/manager/corrective-actions/page.tsx` |

**Previously instrumented events (existing):**

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; calls `posthog.identify()` | `src/app/login/page.tsx` |
| `user_login_failed` | Login attempt fails; captures error code | `src/app/login/page.tsx` |
| `password_reset_requested` | User requests a password reset email | `src/app/login/page.tsx` |
| `audit_started` | Auditor starts or resumes an audit | `src/app/dashboard/auditor/page.tsx` |
| `audit_submitted` | Auditor completes and submits an audit with final score | `src/app/dashboard/auditor/audits/[auditId]/page.tsx` |
| `audit_progress_saved` | Auditor saves in-progress audit | `src/app/dashboard/auditor/audits/[auditId]/page.tsx` |
| `audit_photo_captured` | Photo evidence captured and uploaded | `src/app/dashboard/auditor/audits/[auditId]/page.tsx` |
| `corrective_action_assigned` | Admin assigns a corrective action to a manager | `src/app/dashboard/admin/corrective-actions/page.tsx` |
| `corrective_action_resolved` | Admin approves and resolves a corrective action | `src/app/dashboard/admin/corrective-actions/page.tsx` |
| `corrective_action_rejected` | Admin rejects a corrective action resolution | `src/app/dashboard/admin/corrective-actions/page.tsx` |
| `user_created` | Admin creates a new user (client-side) | `src/app/dashboard/admin/users/page.tsx` |
| `user_deleted` | Admin deletes a user | `src/app/dashboard/admin/users/page.tsx` |
| `contact_form_submitted` | Visitor submits the marketing homepage contact/lead form | `src/components/ui/contact-section.tsx` |
| `user_created_server` | Server-side event when a new user is created via API | `src/app/api/users/route.ts` |

## Next steps

We've built a dashboard and 5 insights for you to keep an eye on user behavior:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/380029/dashboard/1464302
- **Audit completion funnel** (`audit_started` → `audit_submitted`): https://us.posthog.com/project/380029/insights/0QrEaDC9
- **Login success vs failure** (daily trend): https://us.posthog.com/project/380029/insights/EUelk41a
- **Corrective action resolution funnel** (assigned → completed → resolved): https://us.posthog.com/project/380029/insights/CdutkEy2
- **Contact form submissions** (weekly lead generation): https://us.posthog.com/project/380029/insights/hqIwyDpc
- **Audit activity trend** (completed vs in-progress, daily): https://us.posthog.com/project/380029/insights/1BnvWWgX

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
