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

async function seed() {
  console.log("Starting seed process...");
  
  // 1. Find Admin and get Organization ID
  const usersRef = db.collection('users');
  const adminsSnap = await usersRef.where('role', '==', 'ADMIN').limit(1).get();
  
  if (adminsSnap.empty) {
    console.error("No ADMIN user found. Cannot determine organizationId.");
    return;
  }
  
  const adminDoc = adminsSnap.docs[0];
  const orgId = adminDoc.data().organizationId;
  console.log(`Found Admin: ${adminDoc.data().email}, Org ID: ${orgId}`);

  // Create managers and auditors helper
  async function createUserAccount(email: string, name: string, role: string, managerId?: string) {
    // Check if user exists in Auth
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`User ${email} already exists in Auth. Updating...`);
      await auth.updateUser(userRecord.uid, { password: 'password123' });
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password: 'password123',
          displayName: name,
        });
        console.log(`Created Auth user: ${email} with uid ${userRecord.uid}`);
      } else {
        throw e;
      }
    }

    // Set custom claims
    await auth.setCustomUserClaims(userRecord.uid, { organizationId: orgId, role });

    // Ensure Firestore document exists
    const userDocRef = usersRef.doc(userRecord.uid);
    await userDocRef.set({
      email,
      name,
      role,
      organizationId: orgId,
      managerId: managerId || null,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(role === 'AUDITOR' ? { flashmobAccess: true } : {})
    }, { merge: true });

    return userRecord.uid;
  }

  // 2. Create Managers
  const manager1Id = await createUserAccount('manager1@test.com', 'Alex Manager', 'MANAGER');
  const manager2Id = await createUserAccount('manager2@test.com', 'Sam Manager', 'MANAGER');

  // 3. Create Auditors
  const auditor1Id = await createUserAccount('auditor1@test.com', 'John Auditor', 'AUDITOR', manager1Id);
  const auditor2Id = await createUserAccount('auditor2@test.com', 'Jane Auditor', 'AUDITOR', manager1Id);
  
  const auditor3Id = await createUserAccount('auditor3@test.com', 'Bob Auditor', 'AUDITOR', manager2Id);
  const auditor4Id = await createUserAccount('auditor4@test.com', 'Alice Auditor', 'AUDITOR', manager2Id);

  // 4. Create Locations
  console.log("Creating locations...");
  const locationsRef = db.collection('locations');
  
  // Clean up old test locations
  const oldLocs = await locationsRef.where('organizationId', '==', orgId).where('name', 'in', ['Downtown Branch', 'Uptown Store']).get();
  for (const doc of oldLocs.docs) await doc.ref.delete();

  const loc1Ref = await locationsRef.add({
    organizationId: orgId,
    name: "Downtown Branch",
    address: "100 Main St",
    city: "Metropolis",
    assignedManagerIds: [manager1Id],
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const loc2Ref = await locationsRef.add({
    organizationId: orgId,
    name: "Uptown Store",
    address: "200 High St",
    city: "Gotham",
    assignedManagerIds: [manager2Id],
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 5. Create Templates
  console.log("Creating templates...");
  const templatesRef = db.collection('auditTemplates');
  const template1Ref = await templatesRef.add({
    organizationId: orgId,
    title: "Quarterly Safety Equipment Check",
    category: "safety",
    description: "Inspect all primary safety equipment and emergency exits.",
    isActive: true,
    createdBy: adminDoc.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Add questions to template 1
  const t1qRef = template1Ref.collection('questions');
  await t1qRef.add({ questionText: "Are all emergency exits clearly marked?", questionType: "yes_no", severity: "critical", requiresPhoto: true, order: 1, maxScore: 1 });
  await t1qRef.add({ questionText: "Is the fire extinguisher accessible and up to date?", questionType: "yes_no", severity: "high", requiresPhoto: true, order: 2, maxScore: 1 });
  await t1qRef.add({ questionText: "Rate the condition of safety signage.", questionType: "rating", severity: "medium", requiresPhoto: false, order: 3, maxScore: 10 });

  const template2Ref = await templatesRef.add({
    organizationId: orgId,
    title: "Customer Experience Audit",
    category: "service",
    description: "Evaluate cleanliness and staff interaction.",
    isActive: true,
    createdBy: adminDoc.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const t2qRef = template2Ref.collection('questions');
  await t2qRef.add({ questionText: "Are staff members wearing appropriate uniforms?", questionType: "yes_no", severity: "medium", requiresPhoto: false, order: 1, maxScore: 1 });
  await t2qRef.add({ questionText: "Rate the cleanliness of the waiting area.", questionType: "rating", severity: "low", requiresPhoto: true, order: 2, maxScore: 10 });

  // 6. Create Audits & Reports (Completed Audits)
  console.log("Creating audits and reports...");
  const auditsRef = db.collection('audits');

  // Helper date function
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 3);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 7);

  // Completed Audit (Report) by Auditor 1 at Loc 1
  await auditsRef.add({
    organizationId: orgId,
    templateId: template1Ref.id,
    templateTitle: "Quarterly Safety Equipment Check",
    locationId: loc1Ref.id,
    locationName: "Downtown Branch",
    assignedManagerId: manager1Id,
    assignedAuditorId: auditor1Id,
    status: 'completed',
    isSurprise: false,
    scheduledDate: admin.firestore.Timestamp.fromDate(pastDate),
    deadline: admin.firestore.Timestamp.fromDate(futureDate),
    completedAt: admin.firestore.Timestamp.fromDate(today),
    createdAt: admin.firestore.Timestamp.fromDate(pastDate),
    publishedBy: adminDoc.id,
    recurring: 'none',
    maxPossibleScore: 12,
    totalScore: 10,
    scorePercentage: Math.round((10 / 12) * 100),
  });

  // Completed Audit (Report) by Auditor 3 at Loc 2
  await auditsRef.add({
    organizationId: orgId,
    templateId: template2Ref.id,
    templateTitle: "Customer Experience Audit",
    locationId: loc2Ref.id,
    locationName: "Uptown Store",
    assignedManagerId: manager2Id,
    assignedAuditorId: auditor3Id,
    status: 'completed',
    isSurprise: true,
    scheduledDate: admin.firestore.Timestamp.fromDate(pastDate),
    deadline: admin.firestore.Timestamp.fromDate(futureDate),
    completedAt: admin.firestore.Timestamp.fromDate(new Date()),
    createdAt: admin.firestore.Timestamp.fromDate(pastDate),
    publishedBy: adminDoc.id,
    recurring: 'none',
    maxPossibleScore: 11,
    totalScore: 4,
    scorePercentage: Math.round((4 / 11) * 100), // Bad score -> creates corrective actions mentally (we can add one)
  });

  // Pending Scheduled Audit assigned to Manager 1
  await auditsRef.add({
    organizationId: orgId,
    templateId: template2Ref.id,
    templateTitle: "Customer Experience Audit",
    locationId: loc1Ref.id,
    locationName: "Downtown Branch",
    assignedManagerId: manager1Id,
    assignedAuditorId: '', // not assigned by manager yet
    status: 'published',
    isSurprise: false,
    scheduledDate: admin.firestore.Timestamp.fromDate(futureDate),
    deadline: admin.firestore.Timestamp.fromDate(new Date(futureDate.getTime() + 86400000 * 2)),
    createdAt: admin.firestore.Timestamp.fromDate(today),
    publishedBy: adminDoc.id,
    recurring: 'none',
  });

  // Pending Audit assigned to Auditor 2 at Loc 1
  await auditsRef.add({
    organizationId: orgId,
    templateId: template1Ref.id,
    templateTitle: "Quarterly Safety Equipment Check",
    locationId: loc1Ref.id,
    locationName: "Downtown Branch",
    assignedManagerId: manager1Id,
    assignedAuditorId: auditor2Id,
    status: 'assigned',
    isSurprise: false,
    scheduledDate: admin.firestore.Timestamp.fromDate(today),
    deadline: admin.firestore.Timestamp.fromDate(futureDate),
    createdAt: admin.firestore.Timestamp.fromDate(today),
    publishedBy: adminDoc.id,
    recurring: 'none',
  });
  
  // 7. Create a Corrective Action for the bad score
  console.log("Creating corrective actions...");
  await db.collection('correctiveActions').add({
    organizationId: orgId,
    assignedManagerId: manager2Id,
    status: 'open',
    severity: 'medium',
    questionText: "Rate the cleanliness of the waiting area.",
    description: "Score was 3/10. Waiting area had trash and spilled liquids.",
    locationName: "Uptown Store",
    locationId: loc2Ref.id,
    deadline: admin.firestore.Timestamp.fromDate(futureDate),
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  });

  console.log("✨ Seed completed successfully! ✨");
  console.log("Manager credentials:");
  console.log(" - Email: manager1@test.com / manager2@test.com");
  console.log(" - Password: password123");
  console.log("Auditor credentials:");
  console.log(" - Email: auditor1@test.com .. auditor4@test.com");
  console.log(" - Password: password123");
}

seed().catch(console.error);
