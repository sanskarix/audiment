/**
 * scripts/setup_test_accounts.js
 * Creates 3 fresh test accounts (admin, manager, auditor) and a clean organization from scratch.
 */
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function createAccount(email, password, displayName, role, orgId, extra = {}) {
  // Check if exists and remove
  try {
    const existing = await auth.getUserByEmail(email);
    if (existing) {
      await auth.deleteUser(existing.uid);
      await db.collection('users').doc(existing.uid).delete();
    }
  } catch (_) {}

  // Create in Auth
  const userRecord = await auth.createUser({
    email,
    password,
    displayName,
  });

  const uid = userRecord.uid;

  // Set Custom Claims
  await auth.setCustomUserClaims(uid, {
    role: role.toLowerCase(),
    organizationId: orgId,
    plan: 'enterprise',
  });

  // Create in Firestore
  const userData = {
    uid,
    email,
    name: displayName,
    role: role.toUpperCase(),
    organizationId: orgId,
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...extra,
  };

  await db.collection('users').doc(uid).set(userData);
  console.log(`[✔] Created ${role} user: ${email} (UID: ${uid})`);
  return { uid, email, role, displayName };
}

async function main() {
  console.log('=== Provisioning Fresh Clean Test Organization & Accounts ===');

  const orgId = 'apex-audit-org-' + Date.now();
  const orgName = 'Apex Hospitality Group (Audit Test)';

  // 1. Create Organization
  const orgRef = db.collection('organizations').doc(orgId);
  await orgRef.set({
    id: orgId,
    name: orgName,
    plan: 'enterprise',
    tier: 'enterprise',
    planVersion: '2026.1',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'active',
    limits: {
      maxOutlets: 50,
      maxUsers: 100,
      maxAuditsPerMonth: 999999,
      maxPhotosPerMonth: 999999,
      maxCustomTemplates: 999,
      historyDays: 365 * 5,
      flashmobAllowed: true,
      recurringAllowed: true,
    },
    defaultStartTime: '09:00',
    defaultEndTime: '23:00',
  });
  console.log(`[✔] Created Organization: ${orgName} (${orgId})`);

  // 2. Create Initial Location
  const locRef = db.collection('locations').doc();
  const loc1Id = locRef.id;
  await locRef.set({
    id: loc1Id,
    name: 'Apex Flagship Bistro - Downtown',
    address: '100 Metro Boulevard',
    city: 'New Delhi',
    organizationId: orgId,
    isActive: true,
    defaultStartTime: '09:00',
    defaultEndTime: '23:00',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`[✔] Created Flagship Location: Apex Flagship Bistro - Downtown (${loc1Id})`);

  // 3. Create Admin
  const adminUser = await createAccount(
    'apex_admin@audiment.in',
    'Password123!',
    'Alexander Vance (Admin)',
    'admin',
    orgId,
    { title: 'Chief Quality & Audit Officer' }
  );

  // Link owner to org
  await orgRef.update({ ownerUid: adminUser.uid });

  // 4. Create Manager
  const managerUser = await createAccount(
    'apex_manager@audiment.in',
    'Password123!',
    'Marcus Sterling (Manager)',
    'manager',
    orgId,
    {
      title: 'Regional Operations Manager',
      assignedLocationIds: [loc1Id],
      assignedLocations: [loc1Id],
    }
  );

  // Link location to manager
  await locRef.update({ assignedManagerIds: [managerUser.uid] });

  // 5. Create Auditor
  const auditorUser = await createAccount(
    'apex_auditor@audiment.in',
    'Password123!',
    'Sarah Chen (Auditor)',
    'auditor',
    orgId,
    {
      title: 'Senior Field Compliance Auditor',
      managerId: managerUser.uid,
      assignedManagerId: managerUser.uid,
      managerIds: [managerUser.uid],
      isFlashmobEnabled: true,
    }
  );

  console.log('\n=============================================');
  console.log('TEST ACCOUNTS READY:');
  console.log('Organization ID:', orgId);
  console.log('Admin:   apex_admin@audiment.in   / Password123!');
  console.log('Manager: apex_manager@audiment.in / Password123!');
  console.log('Auditor: apex_auditor@audiment.in / Password123!');
  console.log('=============================================\n');

  // Save info to a local JSON file so other test scripts can read it
  const fs = require('fs');
  fs.writeFileSync(
    'scripts/test_accounts_config.json',
    JSON.stringify(
      {
        orgId,
        orgName,
        loc1Id,
        adminUser,
        managerUser,
        auditorUser,
        password: 'Password123!',
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error('Fatal error setting up accounts:', err);
  process.exit(1);
});

