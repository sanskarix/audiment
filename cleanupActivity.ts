import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
let credential;
const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccountVar) {
  credential = admin.credential.cert(JSON.parse(serviceAccountVar));
} else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  credential = admin.credential.cert({
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
}

if (!admin.apps.length && credential) {
  admin.initializeApp({ credential });
}

const db = admin.firestore();

async function cleanupActivity() {
  console.log("🧹 Cleaning up all dashboard activity (templates, locations, audits, etc.)...");

  const collections = ['locations', 'auditTemplates', 'audits', 'correctiveActions', 'notifications'];
  
  for (const coll of collections) {
    console.log(`Clearing collection: ${coll}...`);
    const snap = await db.collection(coll).get();
    const batch = db.batch();
    
    // Deleting one by one in batch
    for (const doc of snap.docs) {
      batch.delete(doc.ref);
      
      // If it's a template, also delete the 'questions' subcollection
      if (coll === 'auditTemplates') {
        const qSnap = await doc.ref.collection('questions').get();
        const subBatch = db.batch();
        qSnap.docs.forEach(qDoc => subBatch.delete(qDoc.ref));
        await subBatch.commit();
      }
    }
    
    if (!snap.empty) {
      await batch.commit();
      console.log(`Cleared ${snap.size} documents from ${coll}.`);
    } else {
      console.log(`${coll} was already empty.`);
    }
  }

  console.log("✨ Activity cleanup complete. Accounts are now fresh and ready for production testing! ✨");
}

cleanupActivity().catch(console.error);
