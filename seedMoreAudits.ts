import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
let credential;
const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccountVar) {
  credential = admin.credential.cert(JSON.parse(serviceAccountVar));
} else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  credential = admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
}

if (!admin.apps.length && credential) {
  admin.initializeApp({ credential });
}

const db = admin.firestore();

async function seedMore() {
  console.log("Pushing more audits...");
  
  // 1. Find Admin Org ID
  const usersRef = db.collection('users');
  const adminsSnap = await usersRef.where('role', '==', 'ADMIN').limit(1).get();
  
  if (adminsSnap.empty) {
    console.error("No ADMIN user found.");
    return;
  }
  
  const adminId = adminsSnap.docs[0].id;
  const orgId = adminsSnap.docs[0].data().organizationId;

  // 2. Fetch all necessary data
  const locationsSnap = await db.collection('locations').where('organizationId', '==', orgId).get();
  const locations = locationsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const templatesSnap = await db.collection('auditTemplates').where('organizationId', '==', orgId).get();
  const templates = templatesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const managersSnap = await db.collection('users').where('organizationId', '==', orgId).where('role', '==', 'MANAGER').get();
  const managers = managersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const auditorsSnap = await db.collection('users').where('organizationId', '==', orgId).where('role', '==', 'AUDITOR').get();
  const auditors = auditorsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (locations.length === 0 || templates.length === 0 || managers.length === 0) {
    console.error("Missing required data (locations, templates, managers).");
    return;
  }

  const auditsRef = db.collection('audits');

  // Push 10 more random audits
  let count = 0;
  for (let i = 0; i < 15; i++) {
    // Randomize selection
    const loc: any = locations[Math.floor(Math.random() * locations.length)];
    const tmpl: any = templates[Math.floor(Math.random() * templates.length)];
    
    // Select manager who owns the location, or just first manager
    const assignedManagerIds = loc.assignedManagerIds || [loc.assignedManagerId];
    if (!assignedManagerIds || assignedManagerIds.length === 0) continue;
    const mgrId = assignedManagerIds[0];

    // Find auditor for this manager (can be null/empty string)
    const validAuditors = auditors.filter((a: any) => a.managerId === mgrId);
    let auditorId = '';
    let status = 'published';

    // 50% chance to assign an auditor
    if (Math.random() > 0.5 && validAuditors.length > 0) {
      auditorId = validAuditors[Math.floor(Math.random() * validAuditors.length)].id;
      status = 'assigned';
      
      // 50% chance if assigned, it might be in progress
      if (Math.random() > 0.5) {
        status = 'in_progress';
      }
    }

    // Dates
    const today = new Date();
    const isFuture = Math.random() > 0.3; // 70% future, 30% past/overdue

    const scheduledDate = new Date();
    scheduledDate.setDate(today.getDate() + (isFuture ? Math.floor(Math.random() * 14) : -Math.floor(Math.random() * 7)));
    
    const deadline = new Date(scheduledDate);
    deadline.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 5) + 1);

    if (!isFuture && deadline < today && status !== 'in_progress') {
        // Change to overdue status basically, but Audiment uses 'missed' for logic, or we leave it 'assigned' and check date in UI
        if(Math.random() > 0.5) status = 'missed';
    }

    await auditsRef.add({
      organizationId: orgId,
      templateId: tmpl.id,
      templateTitle: tmpl.title,
      locationId: loc.id,
      locationName: loc.name,
      assignedManagerId: mgrId,
      assignedAuditorId: auditorId,
      status: status,
      isSurprise: Math.random() > 0.8,
      scheduledDate: admin.firestore.Timestamp.fromDate(scheduledDate),
      deadline: admin.firestore.Timestamp.fromDate(deadline),
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      publishedBy: adminId,
      recurring: 'none',
    });
    count++;
  }

  console.log(`Successfully pushed ${count} more audits!`);
}

seedMore().catch(console.error);
