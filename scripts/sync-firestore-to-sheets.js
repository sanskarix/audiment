require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// ── 1. Validate Environment ──────────────────────────────────────────────────
const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountVar) {
  console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT is missing in .env.local');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountVar);
} catch {
  serviceAccount = JSON.parse(Buffer.from(serviceAccountVar, 'base64').toString('utf-8'));
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const webhookUrl = process.env.GOOGLE_SHEET_SIGNUP_WEBHOOK_URL;

function formatISTTime(date) {
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const timeParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  return {
    dateStr,
    timeStr: `${timeParts} (IST / UTC+5:30)`,
    isoStr: date.toISOString(),
  };
}

async function runSync() {
  console.log('\n======================================================');
  console.log('🔄 AUDIMENT FIRESTORE -> GOOGLE SHEET SYNC');
  console.log('======================================================\n');

  if (!webhookUrl || webhookUrl.includes('...') || !webhookUrl.startsWith('https://script.google.com/')) {
    console.warn('⚠️ Warning: GOOGLE_SHEET_SIGNUP_WEBHOOK_URL is not configured yet or has a placeholder.');
    console.warn('   Once you deploy your Google Apps Script, update GOOGLE_SHEET_SIGNUP_WEBHOOK_URL in .env.local');
    console.warn('   and rerun this command to sync all users directly!\n');
    console.log('   Checking users currently in Firestore...\n');
  } else {
    console.log(`📡 Connecting to Webhook URL: ${webhookUrl}\n`);
  }

  const usersSnap = await db.collection('users').get();
  console.log(`📊 Found ${usersSnap.size} total user(s) in Firestore 'users' collection.\n`);

  let syncedCount = 0;
  let skippedCount = 0;

  for (const doc of usersSnap.docs) {
    const u = doc.data();
    const uid = doc.id;

    // Fetch organization name if available
    let companyName = u.companyName || '';
    if (!companyName && u.organizationId) {
      try {
        const orgDoc = await db.collection('organizations').doc(u.organizationId).get();
        if (orgDoc.exists) {
          companyName = orgDoc.data().name || '';
        }
      } catch (err) {
        // ignore
      }
    }

    // Determine timestamp
    let dateObj = new Date();
    if (u.createdAt) {
      if (typeof u.createdAt.toDate === 'function') {
        dateObj = u.createdAt.toDate();
      } else if (u.createdAt._seconds) {
        dateObj = new Date(u.createdAt._seconds * 1000);
      } else if (typeof u.createdAt === 'number') {
        dateObj = new Date(u.createdAt);
      }
    }

    const { dateStr, timeStr, isoStr } = formatISTTime(dateObj);
    const attr = u.attribution || u.metadata || {};

    const payload = {
      date: u.metadata?.signupDate || dateStr,
      fullName: u.name || '',
      email: u.email || '',
      utmSource: attr.utmSource || u.utmSource || 'direct',
      time: u.metadata?.signupTimeIST || timeStr,
      device: u.device || u.metadata?.device || attr.deviceType || 'Desktop (macOS / Chrome)',
      companyName: companyName,
      phone: u.phone || '',
      industry: u.industry || '',
      city: attr.city || u.city || '',
      region: attr.region || u.region || '',
      country: u.country || attr.country || 'IN',
      operatingCountries: Array.isArray(u.countries) ? u.countries.join(', ') : u.country || 'IN',
      utmMedium: attr.utmMedium || '',
      utmCampaign: attr.utmCampaign || '',
      utmContent: attr.utmContent || '',
      utmTerm: attr.utmTerm || '',
      referrer: attr.referrer || 'Direct',
      landingPage: attr.landingPage || '/',
      ip: attr.ip || 'Unknown',
      browser: attr.browser || 'Chrome',
      os: attr.os || 'macOS',
      screenResolution: attr.screenResolution || '',
      timezone: attr.timezone || 'Asia/Kolkata',
      organizationId: u.organizationId || '',
      uid: uid,
      role: u.role || 'ADMIN',
      accountStatus: u.isActive !== false ? 'Active' : 'Inactive',
      userAgent: attr.userAgent || '',
      rawTimestamp: isoStr,
    };

    console.log(`👤 Processing: ${payload.fullName || 'No Name'} (${payload.email})`);
    console.log(`   - Date:       ${payload.date}`);
    console.log(`   - Time:       ${payload.time}`);
    console.log(`   - UTM Source: ${payload.utmSource}`);
    console.log(`   - Device:     ${payload.device}`);
    console.log(`   - Org ID:     ${payload.organizationId}`);

    if (webhookUrl && !webhookUrl.includes('...') && webhookUrl.startsWith('https://script.google.com/')) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });
        const result = await response.json();
        console.log(`   ✅ Synced to Google Sheet! Row: ${result.row || 'N/A'}`);
        syncedCount++;
      } catch (postErr) {
        console.error(`   ❌ Failed to push to Google Sheet:`, postErr.message);
        skippedCount++;
      }
    } else {
      skippedCount++;
    }

    console.log('------------------------------------------------------');
  }

  console.log(`\n🎉 Processed ${usersSnap.size} user(s).`);
  if (webhookUrl && !webhookUrl.includes('...')) {
    console.log(`✅ Successfully synced: ${syncedCount}`);
    if (skippedCount > 0) console.log(`⚠️ Skipped/Failed: ${skippedCount}`);
  } else {
    console.log(`💡 Once you deploy the Apps Script and add your Webhook URL to .env.local,`);
    console.log(`   run 'node scripts/sync-firestore-to-sheets.js' to auto-push these users to the Sheet!`);
  }
}

runSync().catch(console.error);
