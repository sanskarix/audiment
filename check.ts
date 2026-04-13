import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config({ path: '.env.local' });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function run() {
  const users = await admin.auth().listUsers(10);
  for (const u of users.users) {
     console.log(`User: ${u.email}`);
     console.log(`Claims:`, JSON.stringify(u.customClaims));
  }
}

run().catch(console.error);
