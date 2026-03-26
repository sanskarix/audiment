import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let credential;

    // Safely parse the service account JSON as requested
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
    );

    if (serviceAccount && serviceAccount.project_id) {
      credential = admin.credential.cert(serviceAccount);
    }

    // Fallback to individual env vars if FIREBASE_SERVICE_ACCOUNT was missing or invalid
    if (!credential && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      } as admin.ServiceAccount);
    }

    if (credential) {
      admin.initializeApp({ credential });
    }
  } catch (error) {
    // Wrap entire initialization so a bad parse doesn't crash the entire server
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
