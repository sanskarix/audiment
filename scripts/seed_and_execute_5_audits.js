/**
 * scripts/seed_and_execute_5_audits.js
 * Creates templates, locations, and conducts 5 complete realistic audits with full scoring trace,
 * question responses, and corrective actions for the test organization.
 */
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const config = require('./test_accounts_config.json');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

// Severity Weights and scoring engine (identical to src/lib/scoring.ts)
const SEVERITY_WEIGHTS = { low: 1, medium: 2, critical: 5 };

function calculateScore(questions) {
  let totalWeightedContribution = 0;
  let totalWeight = 0;
  let criticalFailureCount = 0;
  const trace = [];

  for (const q of questions) {
    let normalizedScore = 0;
    let isCriticalFailure = false;
    const weight = SEVERITY_WEIGHTS[q.severity] || 1;

    if (q.questionType === 'yes_no') {
      if (q.answer === 'Yes') normalizedScore = 1;
      else {
        normalizedScore = 0;
        if (q.severity === 'critical') isCriticalFailure = true;
      }
    } else {
      const rating = typeof q.answer === 'number' ? q.answer : 0;
      normalizedScore = Math.max(0, Math.min(10, rating)) / 10;
      if (q.severity === 'critical' && rating < 6) isCriticalFailure = true;
    }

    const contribution = normalizedScore * weight;
    totalWeightedContribution += contribution;
    totalWeight += weight;
    if (isCriticalFailure) criticalFailureCount++;

    trace.push({
      questionId: q.questionId,
      questionText: q.questionText,
      questionType: q.questionType,
      severity: q.severity,
      rawAnswer: q.answer,
      normalizedScore,
      weight,
      weightedContribution: contribution,
      isCriticalFailure,
    });
  }

  const finalScore = totalWeight > 0 ? Math.round((totalWeightedContribution / totalWeight) * 100) : 0;
  const hasCriticalFailure = criticalFailureCount > 0;

  let grade = 'fail';
  if (hasCriticalFailure) grade = 'critical_fail';
  else if (finalScore >= 90) grade = 'excellent';
  else if (finalScore >= 75) grade = 'good';
  else if (finalScore >= 60) grade = 'needs_improvement';

  return {
    finalScore,
    grade,
    hasCriticalFailure,
    criticalFailureCount,
    scoringVersion: 'v2-weighted-critical-threshold-6',
    trace,
    weightedEarned: totalWeightedContribution,
    weightedMax: totalWeight,
  };
}

async function main() {
  const orgId = config.orgId;
  const adminUid = config.adminUser.uid;
  const managerUid = config.managerUser.uid;
  const auditorUid = config.auditorUser.uid;

  console.log(`Setting up data for Org: ${orgId}`);

  // 1. Create 3 Locations
  const locations = [
    { id: config.loc1Id, name: 'Apex Flagship Bistro - Downtown', address: '100 Metro Boulevard', city: 'New Delhi' },
    { id: 'loc-apex-cp', name: 'Apex Downtown Bistro - CP', address: '45 Connaught Place, Block B', city: 'New Delhi' },
    { id: 'loc-apex-cyber', name: 'Apex Cyber Hub Kitchen', address: 'Tower 8, DLF Cyber City', city: 'Gurugram' },
  ];

  for (const loc of locations) {
    await db.collection('locations').doc(loc.id).set({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      city: loc.city,
      organizationId: orgId,
      isActive: true,
      defaultStartTime: '09:00',
      defaultEndTime: '23:00',
      assignedManagerIds: [managerUid],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`[✔] Location ready: ${loc.name}`);
  }

  // Update manager's assigned locations
  await db.collection('users').doc(managerUid).update({
    assignedLocationIds: locations.map(l => l.id),
    assignedLocations: locations.map(l => l.id),
  });

  // 2. Create 2 Audit Templates with Questions
  // Template A: FSSAI Washroom Standards
  const templateARef = db.collection('auditTemplates').doc('tmpl-fssai-washroom');
  await templateARef.set({
    id: 'tmpl-fssai-washroom',
    organizationId: orgId,
    title: 'FSSAI Washroom Standards',
    category: 'hygiene',
    description: 'Washroom hygiene compliance check under FSSAI.',
    isActive: true,
    createdBy: adminUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const washroomQuestions = [
    { id: 'w1', questionText: 'Are washrooms completely separated from the food preparation area?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 1 },
    { id: 'w2', questionText: 'Rate the availability of liquid soap and hand sanitizers.', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 2 },
    { id: 'w3', questionText: 'Are proper hand drying facilities functioning?', questionType: 'yes_no', severity: 'medium', requiresPhoto: false, order: 3 },
    { id: 'w4', questionText: 'Is there continuous supply of clean water?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 4 },
    { id: 'w5', questionText: 'Rate general cleanliness and odor control.', questionType: 'rating', severity: 'low', requiresPhoto: false, order: 5 },
  ];

  for (const q of washroomQuestions) {
    await templateARef.collection('questions').doc(q.id).set({ ...q, maxScore: q.questionType === 'yes_no' ? 1 : 10 });
  }
  console.log('[✔] Template A created: FSSAI Washroom Standards (5 questions)');

  // Template B: FSSAI Kitchen Hygiene Standards
  const templateBRef = db.collection('auditTemplates').doc('tmpl-fssai-kitchen');
  await templateBRef.set({
    id: 'tmpl-fssai-kitchen',
    organizationId: orgId,
    title: 'FSSAI Kitchen Hygiene Standards',
    category: 'hygiene',
    description: 'Kitchen preparation and storage hygiene compliance.',
    isActive: true,
    createdBy: adminUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const kitchenQuestions = [
    { id: 'k1', questionText: 'Are all raw and cooked foods stored separately?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 1 },
    { id: 'k2', questionText: 'Are refrigerators maintained at ≤ 5°C and freezers at ≤ -18°C?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 2 },
    { id: 'k3', questionText: 'Is pest control mechanism intact and effective?', questionType: 'yes_no', severity: 'critical', requiresPhoto: false, order: 3 },
    { id: 'k4', questionText: 'Rate food handlers cleanliness and uniform compliance.', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 4 },
    { id: 'k5', questionText: 'Rate cleanliness of floors, walls, and prep surfaces.', questionType: 'rating', severity: 'medium', requiresPhoto: false, order: 5 },
  ];

  for (const q of kitchenQuestions) {
    await templateBRef.collection('questions').doc(q.id).set({ ...q, maxScore: q.questionType === 'yes_no' ? 1 : 10 });
  }
  console.log('[✔] Template B created: FSSAI Kitchen Hygiene Standards (5 questions)');

  // 3. Conduct 5 Audits
  const auditDefinitions = [
    {
      id: 'audit-001',
      title: 'FSSAI Washroom Standards',
      templateId: 'tmpl-fssai-washroom',
      questions: washroomQuestions,
      location: locations[0], // Flagship
      answers: { w1: 'Yes', w2: 10, w3: 'Yes', w4: 'Yes', w5: 10 }, // 100%
      notes: { w2: 'Sanitizer stations fully stocked and functioning properly.' },
      daysAgo: 4,
    },
    {
      id: 'audit-002',
      title: 'FSSAI Kitchen Hygiene Standards',
      templateId: 'tmpl-fssai-kitchen',
      questions: kitchenQuestions,
      location: locations[1], // CP
      answers: { k1: 'Yes', k2: 'Yes', k3: 'Yes', k4: 8, k5: 9 }, // 93%
      notes: { k4: 'Staff in full uniform with hairnets.' },
      daysAgo: 3,
    },
    {
      id: 'audit-003', // CRITICAL FAILURE AUDIT
      title: 'FSSAI Kitchen Hygiene Standards',
      templateId: 'tmpl-fssai-kitchen',
      questions: kitchenQuestions,
      location: locations[2], // Cyber Hub
      answers: { k1: 'Yes', k2: 'No', k3: 'Yes', k4: 6, k5: 5 }, // Critical Fail on k2!
      notes: { k2: 'Chiller temp reading 9.2°C (must be ≤5°C). Immediate defrost & service required.' },
      daysAgo: 2,
    },
    {
      id: 'audit-004',
      title: 'FSSAI Washroom Standards',
      templateId: 'tmpl-fssai-washroom',
      questions: washroomQuestions,
      location: locations[1], // CP
      answers: { w1: 'Yes', w2: 7, w3: 'Yes', w4: 'Yes', w5: 8 }, // 88%
      notes: { w5: 'Exhaust fan operational, regular cleaning logged.' },
      daysAgo: 1,
    },
    {
      id: 'audit-005',
      title: 'FSSAI Kitchen Hygiene Standards',
      templateId: 'tmpl-fssai-kitchen',
      questions: kitchenQuestions,
      location: locations[0], // Flagship
      answers: { k1: 'Yes', k2: 'Yes', k3: 'Yes', k4: 9, k5: 9 }, // 96%
      notes: { k1: 'Walk-in refrigerator impeccably organized with color tags.' },
      daysAgo: 0,
    },
  ];

  console.log('\nConducting 5 Audits...');

  for (const aDef of auditDefinitions) {
    const questionsForScore = aDef.questions.map(q => ({
      questionId: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      severity: q.severity,
      answer: aDef.answers[q.id],
    }));

    const scoreResult = calculateScore(questionsForScore);
    const date = new Date(Date.now() - aDef.daysAgo * 24 * 60 * 60 * 1000);
    const dateTimestamp = admin.firestore.Timestamp.fromDate(date);

    // Save Responses
    const batch = db.batch();

    for (const q of aDef.questions) {
      const respRef = db.collection('auditResponses').doc(`${aDef.id}_${q.id}`);
      const rawAns = aDef.answers[q.id];
      const traceItem = scoreResult.trace.find(t => t.questionId === q.id);

      batch.set(respRef, {
        auditId: aDef.id,
        questionId: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        answer: typeof rawAns === 'number' ? rawAns.toString() : rawAns,
        score: typeof rawAns === 'number' ? rawAns : (rawAns === 'Yes' ? 1 : 0),
        severity: q.severity,
        auditorId: auditorUid,
        locationId: aDef.location.id,
        photoUrls: [],
        notes: aDef.notes[q.id] || '',
        submittedAt: dateTimestamp,
        isCriticalFailure: traceItem ? traceItem.isCriticalFailure : false,
      });

      // If critical failure, create corrective action!
      if (traceItem && traceItem.isCriticalFailure) {
        const caRef = db.collection('correctiveActions').doc(`ca-${aDef.id}-${q.id}`);
        batch.set(caRef, {
          id: `ca-${aDef.id}-${q.id}`,
          auditId: aDef.id,
          questionId: q.id,
          questionText: q.questionText,
          locationId: aDef.location.id,
          locationName: aDef.location.name,
          organizationId: orgId,
          assignedManagerId: managerUid,
          description: aDef.notes[q.id] || `Critical Failure detected: ${q.questionText}`,
          severity: q.severity,
          status: 'open',
          reminderSent: false,
          deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
          createdAt: dateTimestamp,
        });
        console.log(`[!] Generated Corrective Action for Audit ${aDef.id}: ${q.questionText}`);
      }
    }

    // Save Audit Doc
    const auditRef = db.collection('audits').doc(aDef.id);
    batch.set(auditRef, {
      id: aDef.id,
      organizationId: orgId,
      templateId: aDef.templateId,
      templateTitle: aDef.title,
      locationId: aDef.location.id,
      locationName: aDef.location.name,
      assignedManagerId: managerUid,
      assignedAuditorId: auditorUid,
      status: 'completed',
      finalScore: scoreResult.finalScore,
      scorePercentage: scoreResult.finalScore,
      grade: scoreResult.grade,
      hasCriticalFailure: scoreResult.hasCriticalFailure,
      criticalFailureCount: scoreResult.criticalFailureCount,
      scoringVersion: scoreResult.scoringVersion,
      scoringTrace: scoreResult.trace,
      weightedEarned: scoreResult.weightedEarned,
      weightedMax: scoreResult.weightedMax,
      latitude: 28.6139,
      longitude: 77.2090,
      locationCaptured: true,
      scheduledDate: dateTimestamp,
      deadline: admin.firestore.Timestamp.fromDate(new Date(date.getTime() + 12 * 60 * 60 * 1000)),
      completedAt: dateTimestamp,
      createdAt: dateTimestamp,
      updatedAt: dateTimestamp,
    });

    await batch.commit();
    console.log(`[✔] Audit completed: ${aDef.id} | Location: ${aDef.location.name} | Score: ${scoreResult.finalScore}% (${scoreResult.grade})`);
  }

  console.log('\n=== All 5 Audits Completed and Seeded Successfully! ===\n');
}

main().catch(console.error);

