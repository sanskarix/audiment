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

async function bootstrap() {
  const db = admin.firestore();
  
  // 1. Create a dummy organization to bind the admin
  const orgRef = db.collection('organizations').doc();
  const orgId = orgRef.id;
  await orgRef.set({
    name: "Default Organization",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    tier: "enterprise",
    status: "active"
  });
  console.log(`Created Organization: ${orgId}`);

  // 2. Fetch or Create the Admin user
  const email = "admin@test.com";
  const password = "password";
  const name = "System Admin";
  let uid = null;

  try {
    const existing = await admin.auth().getUserByEmail(email);
    uid = existing.uid;
    console.log("User already exists, updating password...");
    await admin.auth().updateUser(uid, { password });
  } catch(e) {
    if (e.code === 'auth/user-not-found') {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });
      uid = userRecord.uid;
    } else {
      throw e;
    }
  }

  // 3. Set Custom Claims exactly like route.ts
  await admin.auth().setCustomUserClaims(uid, {
    role: "admin",
    organizationId: orgId,
  });

  // 4. Create Firestore User Document
  const userData = {
    uid,
    email,
    name,
    role: "ADMIN",
    organizationId: orgId,
    isActive: true,
    createdAt: new Date(),
  };

  await db.collection('users').doc(uid).set(userData);
  
  console.log(`Bound Admin user: ${email} with uid: ${uid} to Organization: ${orgId}`);
  console.log("Bootstrap complete!");
}

bootstrap().catch(console.error);
