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
const auth = admin.auth();

async function fullReset() {
  console.log("🚀 Starting full database reset...");

  const orgId = "org_production_fresh";
  const password = "password";

  // 1. Delete ALL Auth Users
  console.log("Deleting all Auth users...");
  let nextPageToken;
  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    const uids = listUsersResult.users.map(user => user.uid);
    if (uids.length > 0) {
      await auth.deleteUsers(uids);
      console.log(`Deleted ${uids.length} users from Auth.`);
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  // 2. Delete ALL Firestore Collections
  const collections = ['users', 'locations', 'auditTemplates', 'audits', 'correctiveActions', 'notifications'];
  for (const coll of collections) {
    console.log(`Clearing collection: ${coll}...`);
    const snap = await db.collection(coll).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // 3. Create Fresh Users
  async function createUser(email: string, name: string, role: string, managerId: string | null = null) {
    const userRes = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    // Custom claims
    await auth.setCustomUserClaims(userRes.uid, { organizationId: orgId, role });
    
    // Firestore Profile
    await db.collection('users').doc(userRes.uid).set({
      email,
      name,
      role,
      organizationId: orgId,
      managerId,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(role === 'AUDITOR' ? { flashmobAccess: true } : {})
    });
    console.log(`Created ${role}: ${email}`);
    return userRes.uid;
  }

  console.log("Creating fresh accounts...");
  const adminId = await createUser('admin@test.com', 'System Admin', 'ADMIN');
  const managerId = await createUser('manager@test.com', 'Regional Manager', 'MANAGER');
  await createUser('auditor@test.com', 'Field Auditor', 'AUDITOR', managerId);

  console.log("✨ Full reset and seed complete! ✨");
}

fullReset().catch(console.error);
