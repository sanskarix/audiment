# Environment Variables Reference

This document details all required and optional environment variables used by Audiment across client components, server API routes, and cron background tasks.

---

## 🔑 Key Overview & Security Scope

Environment variables in Audiment strictly adhere to Next.js security boundaries:
* Variables prefixed with `NEXT_PUBLIC_` are exposed to client-side JavaScript bundles.
* Variables without `NEXT_PUBLIC_` are private and strictly accessible on the Next.js server side.

---

## 🌐 Next.js App Configuration

| Variable Name | Required | Description | Example Value |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Canonical root URL of the application. Used for absolute links and meta tags. | `https://audiment.in` |
| `NODE_ENV` | **Yes** | Runtime environment. | `development` / `production` |

---

## 🔥 Firebase Client SDK (Client Side)

Required for client-side authentication listeners and real-time Firestore subscriptions.

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | **Yes** | Web API Key from Firebase Console Project Settings. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **Yes** | Firebase Auth domain (e.g. `audiment-app.firebaseapp.com`). |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | **Yes** | Unique Firebase Project ID (e.g. `audiment-prod`). |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | **Yes** | Default Firebase Storage bucket URL. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | **Yes** | FCM Sender ID for push notifications. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | **Yes** | Firebase App ID. |

---

## 🛡️ Firebase Admin SDK (Server Side Only)

Required for server-side API routes, user account provisioning in Member Directory, and Vercel Cron execution.

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `FIREBASE_CLIENT_EMAIL` | **Yes** | Service Account Email from Google Cloud IAM. |
| `FIREBASE_PRIVATE_KEY` | **Yes** | RSA Private key for service account authentication. Must handle `\n` line breaks correctly. |
| `FIREBASE_PROJECT_ID` | **Yes** | Project ID (matches client SDK). |

> ⚠️ **Important Note on `FIREBASE_PRIVATE_KEY`:**  
> When setting this variable in Vercel or `.env.local`, ensure literal newline characters (`\n`) are preserved or wrapped in double quotes: `"-----BEGIN PRIVATE KEY-----\n..."`.

---

## ☁️ Cloudinary Media Pipeline

Audiment uses Cloudinary to store audit photo evidence, manager CAPA resolution proof, and 20-second Flashmob videos.

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary account name. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | **Yes** | Unsigned upload preset configured for client-side direct media uploads. |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key (Server side). |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret (Server side). Used for generating signed video transformations and HLS streams. |

---

## ⏰ Cron & Background Jobs

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `CRON_SECRET` | **Yes** | Shared secret token used to authenticate calls to `/api/cron/check-missed-audits`. Passed in `Authorization: Bearer <CRON_SECRET>`. |

---

## 📁 Sample `.env.local` File Template

```env
# Next.js Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=audiment-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=audiment-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=audiment-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123def456

# Firebase Admin SDK (Server Side)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@audiment-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Cloudinary Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=audiment-cloud
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=audiment_photos
CLOUDINARY_API_KEY=9876543210
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123

# Security & Cron Secrets
CRON_SECRET=super_secret_cron_bearer_token_123
```
