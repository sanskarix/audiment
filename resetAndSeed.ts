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
} else {
  console.error("Missing Firebase Admin credentials");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({ credential });
}

const db = admin.firestore();
const auth = admin.auth();

async function resetAndSeed() {
  console.log("🚀 Starting full reset and seed process...");

  const orgId = "org_test_reset_999";
  const password = "password";

  // 1. Delete ALL users from Auth
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

  // 2. Clear Firestore Collections
  const collections = ['users', 'locations', 'auditTemplates', 'audits', 'correctiveActions', 'notifications'];
  for (const coll of collections) {
    console.log(`Clearing collection: ${coll}...`);
    const snap = await db.collection(coll).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // 3. Create Users
  async function createUser(email: string, name: string, role: string, managerId: string | null = null) {
    const userRes = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    await auth.setCustomUserClaims(userRes.uid, { organizationId: orgId, role });
    
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

  const adminId = await createUser('admin@test.com', 'System Admin', 'ADMIN');
  const managerId = await createUser('manager@test.com', 'Regional Manager', 'MANAGER');
  const auditorId = await createUser('auditor@test.com', 'Field Auditor', 'AUDITOR', managerId);

  // 4. Create 3 Locations
  console.log("Creating 3 locations...");
  const locationNames = ["North Plaza", "South Station", "East Harbor"];
  const locationIds: string[] = [];
  for (const name of locationNames) {
    const locRef = await db.collection('locations').add({
      organizationId: orgId,
      name,
      address: `${Math.floor(Math.random() * 900) + 100} Main Rd`,
      city: "Central City",
      assignedManagerIds: [managerId],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    locationIds.push(locRef.id);
  }

  // 5. Create 2 Audit Templates
  console.log("Creating 2 templates...");
  const templates = [
    { title: "Standard Hygiene Audit", category: "hygiene" },
    { title: "Fire Safety Compliance", category: "safety" }
  ];
  const templateIds: string[] = [];
  for (const t of templates) {
    const tRef = await db.collection('auditTemplates').add({
      organizationId: orgId,
      title: t.title,
      category: t.category,
      description: `Evaluation for ${t.title}`,
      isActive: true,
      createdBy: adminId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    templateIds.push(tRef.id);
    
    // Add 3 generic questions to each
    const qColl = tRef.collection('questions');
    await qColl.add({ questionText: "Is everything clean?", questionType: "yes_no", severity: "high", order: 1, maxScore: 1 });
    await qColl.add({ questionText: "Manual overrides functional?", questionType: "yes_no", severity: "medium", order: 2, maxScore: 1 });
    await qColl.add({ questionText: "Condition of assets (1-10)", questionType: "rating", severity: "low", order: 3, maxScore: 10 });
  }

  // 6. Publish 20 Audits (10 of each)
  console.log("Publishing 20 audits...");
  const auditIds: string[] = [];
  for (let i = 0; i < 20; i++) {
    const templateIdx = i < 10 ? 0 : 1;
    const locIdx = i % 3;
    
    const schedDate = new Date();
    schedDate.setDate(schedDate.getDate() - (i % 5)); // Past dates mostly
    
    const auditData = {
      organizationId: orgId,
      templateId: templateIds[templateIdx],
      templateTitle: templates[templateIdx].title,
      locationId: locationIds[locIdx],
      locationName: locationNames[locIdx],
      assignedManagerId: managerId,
      assignedAuditorId: auditorId,
      status: 'assigned',
      isSurprise: false,
      scheduledDate: admin.firestore.Timestamp.fromDate(schedDate),
      deadline: admin.firestore.Timestamp.fromDate(new Date(schedDate.getTime() + 86400000 * 7)),
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      publishedBy: adminId,
      recurring: 'none',
    };
    
    const auditRef = await db.collection('audits').add(auditData);
    auditIds.push(auditRef.id);
  }

  // 7. Complete 70% of audits (14 out of 20)
  console.log("Completing 14 audits (70%)...");
  for (let i = 0; i < 14; i++) {
    const auditId = auditIds[i];
    const totalScore = Math.floor(Math.random() * 12) + 1;
    const maxScore = 12;
    
    await db.collection('audits').doc(auditId).update({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      totalScore,
      maxPossibleScore: maxScore,
      scorePercentage: Math.round((totalScore / maxScore) * 100),
    });
  }

  console.log("✅ Reset and Seed complete!");
  console.log("Credentials:");
  console.log("Email: admin@test.com, manager@test.com, auditor@test.com");
  console.log("Password: password");
}

resetAndSeed().catch(console.error);
