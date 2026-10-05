# Vercel Deployment & Build Configuration

Audiment is optimized for single-command deployment to **Vercel**.

---

## ⚙️ Vercel Project Configuration (`vercel.json`)

Vercel configuration defines standard environment routes and hourly cron schedules:

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

---

## 🚀 Step-by-Step Production Deployment

### 1. Import Repository into Vercel
1. Log into your Vercel Dashboard and click **Add New > Project**.
2. Import the `Audiment` Git repository.
3. Framework Preset: Select **Next.js**.

### 2. Configure Environment Variables
Add the required production environment variables in **Project Settings > Environment Variables**:
* `NEXT_PUBLIC_APP_URL`
* `NEXT_PUBLIC_FIREBASE_API_KEY`
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
* `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
* `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
* `NEXT_PUBLIC_FIREBASE_APP_ID`
* `FIREBASE_CLIENT_EMAIL`
* `FIREBASE_PRIVATE_KEY`
* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
* `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
* `CLOUDINARY_API_KEY`
* `CLOUDINARY_API_SECRET`
* `CRON_SECRET`

### 3. Deploy
Click **Deploy**. Vercel will run `npm run build` (`next build`), bundle serverless API routes, and deploy edge assets automatically.
