/**
 * scripts/provision-paid-org.ts
 *
 * Internal founder CLI script to provision a Paid (Pro / Enterprise) client workspace
 * after closing a contract on a sales call.
 *
 * Usage:
 *   npx tsx scripts/provision-paid-org.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ── Initialize Firebase Admin ────────────────────────────────────────────────
if (getApps().length === 0) {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  let serviceAccount: any;

  if (serviceAccountVar) {
    try {
      serviceAccount = JSON.parse(serviceAccountVar);
    } catch {
      serviceAccount = JSON.parse(Buffer.from(serviceAccountVar, 'base64').toString('utf-8'));
    }
  } else if (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  } else {
    throw new Error('Firebase credentials not found in environment.');
  }

  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

const auth = getAuth();
const db = getFirestore();
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Audiment <onboarding@resend.dev>';

// ── CLI Prompt Helper ────────────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q: string): Promise<string> =>
  new Promise((res) => rl.question(q, (ans) => res(ans.trim())));

async function main() {
  console.log('\n=============================================');
  console.log('   AUDIMENT PRO/ENTERPRISE PROVISIONING TOOL  ');
  console.log('=============================================\n');

  const companyName = await ask('1. Company / Brand Name: ');
  const ownerName = await ask('2. Client Admin Full Name: ');
  const ownerEmail = (await ask('3. Client Work Email: ')).toLowerCase();
  const password = await ask('4. Temporary Password (min 6 chars): ');
  const plan = ((await ask('5. Plan Tier [pro / enterprise] (default: pro): ')) || 'pro').toLowerCase();
  const maxOutlets = Number((await ask('6. Max Outlets (default: 10): ')) || '10');
  const maxUsers = Number((await ask('7. Max Users / Seats (default: 30): ')) || '30');

  console.log('\n[Provisioning] Verifying details and provisioning account...');

  try {
    // 1. Create Firebase Auth User
    const userRecord = await auth.createUser({
      email: ownerEmail,
      password,
      displayName: ownerName,
    });
    const uid = userRecord.uid;

    // 2. Generate Organization Document
    const orgRef = db.collection('organizations').doc();
    const orgId = orgRef.id;

    // 3. Inject Custom Claims
    await auth.setCustomUserClaims(uid, {
      role: 'admin',
      organizationId: orgId,
      plan: plan,
    });

    const batch = db.batch();

    // 4. Save Organization
    batch.set(orgRef, {
      id: orgId,
      name: companyName,
      plan: plan,
      planVersion: '2026.1',
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      limits: {
        maxOutlets,
        maxUsers,
        maxAuditsPerMonth: 999999,
        maxPhotosPerMonth: 999999,
        maxCustomTemplates: 999,
        historyDays: 365 * 3, // 3 years compliance record
        flashmobAllowed: true,
        recurringAllowed: true,
      },
    });

    // 5. Save Admin User
    const userRef = db.collection('users').doc(uid);
    batch.set(userRef, {
      uid,
      email: ownerEmail,
      name: ownerName,
      role: 'ADMIN',
      organizationId: orgId,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 6. Save Initial Flagship Outlet
    const locRef = db.collection('locations').doc();
    batch.set(locRef, {
      name: `${companyName} - Flagship Outlet`,
      address: 'Primary Location',
      city: '',
      organizationId: orgId,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    console.log(`\n✔ Workspace provisioned successfully!`);
    console.log(`  Organization ID: ${orgId}`);
    console.log(`  User UID:        ${uid}`);
    console.log(`  Plan:            ${plan.toUpperCase()}`);
    console.log(`  Outlets Allowed: ${maxOutlets}`);

    // 7. Send Welcome Email via Resend
    const sendWelcome = (await ask('\nSend welcome email with credentials to client? [Y/n]: ')).toLowerCase();

    if (sendWelcome !== 'n') {
      await resend.emails.send({
        from: fromEmail,
        to: [ownerEmail],
        subject: `Welcome to Audiment ${plan.toUpperCase()} • Your Workspace Credentials`,
        html: `
          <div style="font-family: sans-serif; background-color: #f4f4f5; padding: 24px;">
            <div style="max-width: 540px; background: #fff; padding: 32px; border-radius: 8px; margin: 0 auto; border: 1px solid #e4e4e7;">
              <h2 style="color: #09090b; margin-top: 0;">Welcome to Audiment, ${ownerName}</h2>
              <p style="color: #52525b; line-height: 22px;">Your dedicated <strong>Audiment ${plan.toUpperCase()}</strong> workspace for <strong>${companyName}</strong> is now live.</p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <div><strong>Login URL:</strong> <a href="https://audiment.in/login">https://audiment.in/login</a></div>
                <div style="margin-top: 6px;"><strong>Work Email:</strong> ${ownerEmail}</div>
                <div style="margin-top: 6px;"><strong>Temporary Password:</strong> <code>${password}</code></div>
              </div>

              <p style="color: #71717a; font-size: 13px;">Please sign in and update your password under Settings. If you have any questions, your dedicated operational specialist is on standby.</p>
            </div>
          </div>
        `,
      });
      console.log(`✔ Welcome email sent to ${ownerEmail}`);
    }

  } catch (err: any) {
    console.error('\n✖ Provisioning failed:', err.message || err);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();

