# Cron Jobs & Background Alert Engine

Audiment relies on background cron jobs to manage audit deadlines, send escalation reminders, and flag missed audits.

---

## ⏰ Cron API Endpoint

* **Endpoint Path:** `/api/cron/check-missed-audits`
* **HTTP Method:** `GET`
* **Authentication:** Bearer token via `CRON_SECRET` environment variable.
* **Cron Schedule:** Every hour (`0 * * * *`) configured via `vercel.json`.

---

## ⚡ Execution Logic Breakdown

```
[ Cron Job Triggered (Every Hour) ]
                 |
                 +---> Task 1: Check Overdue Audits
                 |     Query: status IN ['published', 'assigned', 'in_progress'] AND deadline < NOW()
                 |     Action: Update status to 'missed', Notify Manager & Org Admins
                 |
                 +---> Task 2: Check CAPA SLA Reminders
                       Query: status IN ['open', 'in_progress'] AND deadline <= NOW() + 6 Hours
                       Action: Send Urgent Reminder to Manager, Update lastDeadlineReminderSentAt
```

---

## 🔒 Security & Bearer Token Authentication

To prevent unauthorized manual triggering, the API route validates the request header:

```typescript
// Excerpt from src/app/api/cron/check-missed-audits/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Execute cron tasks...
}
```

---

## 🧪 Manual Testing via cURL

You can test the cron route locally or against production using cURL:

```bash
curl -X GET \
  -H "Authorization: Bearer development_cron_secret_token" \
  http://localhost:3000/api/cron/check-missed-audits
```
