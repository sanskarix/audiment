# Notifications & Escalation Cron Setup

The Audiment platform uses a dedicated API route to handle time-sensitive escalations and alerts. This route should be triggered by a cron job (e.g., via Vercel).

## API Route
- **Path**: `/api/cron/check-missed-audits`
- **Method**: `GET`
- **Authentication**: Bearer token via `CRON_SECRET` environment variable.

## Escalation Logic

### 1. Audit Missed Alert
The cron job scans all audits where:
- `status` is one of `['published', 'assigned', 'in_progress']`
- `deadline` < `current_time`

**Actions**:
- Status is updated to `missed`.
- Notification sent to the assigned Manager.
- Notification sent to all Admins of the organization.

### 2. Corrective Action Reminder
The cron job scans all corrective actions where:
- `status` is `open` or `in_progress`.
- `deadline` is within the next 4px (6 hours).

**Actions**:
- Notification reminder sent to the assigned Manager.
- `lastDeadlineReminderSentAt` is updated to prevent duplicate reminders.

## Vercel Deployment Instructions

1. **Environment Variables**:
   Add the following to your Vercel project environment variables:
   - `CRON_SECRET`: A long random string (e.g., `openssl rand -base64 32`).
   - `FIREBASE_CLIENT_EMAIL`: Your Firestore service account email.
   - `FIREBASE_PRIVATE_KEY`: Your Firestore service account private key.

2. **Cron Configuration (`vercel.json`)**:
   Add the following configuration to your root `vercel.json` to trigger the job every hour:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-missed-audits",
      "schedule": "0 * * * *"
    }
  ]
}
```

3. **Manual Trigger**:
   You can manually test the route using:
   ```bash
   curl -X GET -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/check-missed-audits
   ```
