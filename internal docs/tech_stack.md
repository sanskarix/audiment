# Audiment – Tech Stack

## Frontend & Backend
**Next.js (App Router)**
- Single codebase for UI and server logic
- API routes handle all backend operations
- Server components for performance
- Client components for interactivity

## Styling
**Tailwind CSS + Shadcn UI**
- Preset: shadcn --preset b1D5T6KA
- Responsive design out of the box
- Mobile-first approach for auditor interface
- Clean, minimal UI

## Database
**Firebase Firestore**
- NoSQL document database
- Real-time updates
- Free Spark plan sufficient for testing phase
- Scales naturally with usage

## Authentication
**Firebase Auth**
- Email and password login
- Role stored in Firestore user document
- On login, role is read and user is routed automatically to correct interface

## File Storage
**Firebase Storage**
- Audit response photos
- Flashmob audit videos and selfies
- Corrective action resolution photos

## Hosting
**Vercel**
- Connected directly to project repository
- Auto-deploys on every change
- Free tier sufficient for testing phase
- Optimised for Next.js

## Role-Based Routing Logic
- User logs in via single /login page
- Firebase Auth verifies credentials
- App reads role field from Firestore users collection
- Next.js middleware redirects:
  - admin → /dashboard/admin
  - manager → /dashboard/manager
  - auditor → /dashboard/auditor

## Environment Variables Required
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID