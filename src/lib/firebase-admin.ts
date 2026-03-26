import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let credential;

    // Safely parse the service account JSON
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    const serviceAccount = serviceAccountVar 
      ? JSON.parse(serviceAccountVar) 
      : {};

    if (serviceAccount && serviceAccount.project_id) {
      credential = admin.credential.cert(serviceAccount);
    }

    // Fallback to individual env vars if FIREBASE_SERVICE_ACCOUNT was missing or invalid
    if (!credential && 
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      } as admin.ServiceAccount);
    }

    if (credential) {
      admin.initializeApp({ credential });
    } else {
      console.warn('Firebase admin credentials missing. Initialization skipped.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

// Export getter-like constants to prevent "app does not exist" errors on module load
export const adminAuth = admin.apps.length ? admin.auth() : null as unknown as admin.auth.Auth;
export const adminDb = admin.apps.length ? admin.firestore() : null as unknown as admin.firestore.Firestore;
