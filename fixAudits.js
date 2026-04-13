const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

try {
  let credential;
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const serviceAccount = serviceAccountVar ? JSON.parse(serviceAccountVar) : {};

  if (serviceAccount && serviceAccount.project_id) {
    credential = admin.credential.cert(serviceAccount);
  }

  if (!credential && 
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  admin.initializeApp({ credential });
} catch(e) {}

async function run() {
  const db = admin.firestore();
  const snap = await db.collection('audits').get();
  const batch = db.batch();
  let count = 0;
  console.log(`Found ${snap.size} audits.`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`Audit ${doc.id} status: [${data.status}]`);
    if (data.status === undefined || data.status === null || data.status === "") {
      console.log(`Setting status for ${doc.id}`);
      batch.update(doc.ref, { status: 'published' });
      count++;
    }
  });
  if (count > 0) {
    await batch.commit();
    console.log(`Updated ${count} audits with status: published`);
  } else {
    console.log("No audits needed updating.");
  }
}
run().catch(console.error);
