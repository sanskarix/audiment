const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function run() {
  const orgSnap = await db.collection('organizations').limit(1).get();
  const orgId = orgSnap.docs[0]?.id;
  if (!orgId) { console.log("No organization found"); return; }
  console.log(`\n=== Organization: ${orgId} ===\n`);

  // 1. Fetch all active locations
  const locSnap = await db.collection('locations')
    .where('organizationId', '==', orgId)
    .where('isActive', '==', true)
    .get();

  // 2. Fetch all managers
  const managerSnap = await db.collection('users')
    .where('organizationId', '==', orgId)
    .where('role', '==', 'MANAGER')
    .get();
  const managers = {};
  managerSnap.forEach(d => { managers[d.id] = d.data().name; });

  // 3. Fetch all flashmob-enabled auditors
  const audSnap = await db.collection('users')
    .where('organizationId', '==', orgId)
    .where('role', '==', 'AUDITOR')
    .where('isFlashmobEnabled', '==', true)
    .get();
  const auditors = audSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // 4. Print locations with their assigned managers and matching auditors
  console.log("─── LOCATIONS ───────────────────────────────────────\n");
  locSnap.forEach(d => {
    const loc = d.data();
    const assignedIds = loc.assignedManagerIds || (loc.assignedManagerId ? [loc.assignedManagerId] : []);
    const assignedNames = assignedIds.map(id => managers[id] ? `${managers[id]} (${id})` : `UNKNOWN (${id})`);

    const matchingAuditors = auditors.filter(a => assignedIds.includes(a.managerId));

    console.log(`📍 ${loc.name}`);
    console.log(`   assignedManagerIds : [${assignedIds.join(', ') || 'EMPTY — THIS IS THE BUG'}]`);
    console.log(`   Assigned Managers  : ${assignedNames.length ? assignedNames.join(', ') : '⚠️  NONE'}`);
    console.log(`   Matching Auditors  : ${matchingAuditors.length ? matchingAuditors.map(a => `${a.name} (managerId=${a.managerId})`).join(', ') : '⚠️  NONE — dropdown will be empty'}`);
    console.log();
  });

  // 5. Print all flashmob auditors with their managerId
  console.log("─── FLASHMOB-ENABLED AUDITORS ───────────────────────\n");
  if (auditors.length === 0) {
    console.log("⚠️  No auditors have isFlashmobEnabled=true");
  }
  auditors.forEach(a => {
    const managerName = a.managerId ? (managers[a.managerId] || `UNKNOWN MANAGER`) : 'NO MANAGER SET';
    console.log(`👤 ${a.name}`);
    console.log(`   managerId : ${a.managerId || '⚠️  NOT SET'}`);
    console.log(`   Manager   : ${managerName}`);
    console.log();
  });

  // 6. Print all managers for reference
  console.log("─── ALL MANAGERS ────────────────────────────────────\n");
  managerSnap.forEach(d => {
    console.log(`🧑‍💼 ${d.data().name} — ID: ${d.id}`);
  });
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
