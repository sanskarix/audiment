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
  snap.forEach(doc => {
    console.log("Audit ID:", doc.id);
    console.log("Data:", JSON.stringify(doc.data(), null, 2));
  });
}
run().catch(console.error);
