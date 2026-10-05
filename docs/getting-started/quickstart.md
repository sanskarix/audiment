# Quickstart & Local Development Setup

This guide helps software engineers set up and run **Audiment** locally for development, testing, and debugging.

---

## 📋 Prerequisites

Before running Audiment locally, ensure you have the following installed on your machine:

* **Node.js:** v20.x or higher
* **npm:** v10.x or higher
* **Git:** Installed and configured
* **Firebase Account:** Access to Firebase Console (Firestore + Auth)
* **Cloudinary Account:** Account for media upload unsigned/signed presets

---

## 🚀 Step-by-Step Setup

### 1. Clone & Install Dependencies

Clone the repository and install all Node packages:

```bash
git clone https://github.com/sanskarix/audiment.git
cd Audiment
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root directory:

```bash
cp .env.development .env.local
```

Populate `.env.local` with your development credentials (see [Environment Variables Guide](./environment-variables.md) for detailed key descriptions):

```env
# Next.js App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Client SDK Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK Credentials (Server Side)
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=audiment_preset
CLOUDINARY_API_SECRET=your_api_secret

# Cron Job Security
CRON_SECRET=development_cron_secret_token
```

### 3. Initialize Firebase Auth & Firestore Indexing

Ensure your Firestore database rules and indexes are applied:

```bash
# Verify firestore rules syntax
cat firestore.rules

# If using Firebase CLI:
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. Start the Development Server

Launch the Next.js development server with Webpack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Seeding & Test User Accounts

To seed an initial Admin user into Firebase Auth and Firestore:

```bash
node createAdmin.js
```

Default dev accounts created:
* **Admin:** `admin@audiment.in` / `Password123!`
* **Manager:** `manager@audiment.in` / `Password123!`
* **Auditor:** `auditor@audiment.in` / `Password123!`

---

## 🔍 Useful Helper Scripts

The project includes several CLI scripts for debugging and database verification:

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Runs Next.js dev server with 4GB memory allocation |
| `node checkAudits.js` | Inspects recent audit Firestore documents and scoring consistency |
| `node test-firestore.js` | Validates Firebase Admin SDK connection |
| `node testAudit.js` | Runs isolated scoring calculation checks |
| `npm run clean` | Purges `.next` build cache |
