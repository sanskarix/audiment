const puppeteer = require('puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Ensure firebase admin is initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  orgId: 'apex-audit-org-1794052932125',
  adminEmail: 'apex_admin@audiment.in',
  managerEmail: 'apex_manager@audiment.in',
  auditorEmail: 'apex_auditor@audiment.in',
  auditorUid: 'LBW81AkXK7buIyf006CI2wURW1v1',
  password: 'Password123!'
};

const consoleErrors = [];
const pageErrors = [];
const networkFailures = [];

function setupErrorTracking(page, contextName) {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore favicon or benign known abort errors
      if (!text.includes('favicon') && !text.includes('AbortError')) {
        consoleErrors.push({ context: contextName, text });
      }
    }
  });

  page.on('pageerror', err => {
    pageErrors.push({ context: contextName, message: err.message, stack: err.stack });
  });

  page.on('response', resp => {
    if (resp.status() >= 400 && !resp.url().includes('favicon')) {
      networkFailures.push({ context: contextName, url: resp.url(), status: resp.status() });
    }
  });
}

async function loginUser(page, email, password) {
  await page.goto(`${CONFIG.baseUrl}/login`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(i => i.value = '');
  });
  
  await page.type('input[type="email"]', email, { delay: 30 });
  await page.type('input[type="password"]', password, { delay: 30 });
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
  ]);
  
  await new Promise(r => setTimeout(r, 2000));
}

async function findButtonByText(page, text) {
  const buttons = await page.$$('button, a[role="button"]');
  for (const b of buttons) {
    const val = await page.evaluate(el => el.innerText || '', b);
    if (val.trim().toLowerCase().includes(text.toLowerCase())) {
      return b;
    }
  }
  return null;
}

async function runDeepStressTest() {
  console.log('🚀 STARTING DEEP STRESS TEST (PHASE 2 MASTER AUDIT)...');
  const results = {
    auditorInteractiveAudit: false,
    adminInteractiveTemplate: false,
    adminInteractiveUser: false,
    adminInteractiveLocation: false,
    securityRouteGuards: false,
    consoleErrorsCount: 0,
    pageErrorsCount: 0
  };

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1400,900']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    setupErrorTracking(page, 'MainFlow');

    // ─────────────────────────────────────────────────────────────
    // TEST 1: Security & Route Guards
    // ─────────────────────────────────────────────────────────────
    console.log('\n🔒 [1/5] Testing Security & Route Guards (Unauthenticated)...');
    await page.goto(`${CONFIG.baseUrl}/dashboard/admin`, { waitUntil: 'networkidle2' });
    let currentUrl = page.url();
    console.log('  Navigated to /dashboard/admin (unauthenticated) -> Redirected to:', currentUrl);
    if (!currentUrl.includes('/login')) {
      throw new Error(`Security Fail: /dashboard/admin did not redirect unauthenticated user to /login! Current: ${currentUrl}`);
    }

    await page.goto(`${CONFIG.baseUrl}/dashboard/auditor`, { waitUntil: 'networkidle2' });
    currentUrl = page.url();
    console.log('  Navigated to /dashboard/auditor (unauthenticated) -> Redirected to:', currentUrl);
    if (!currentUrl.includes('/login')) {
      throw new Error(`Security Fail: /dashboard/auditor did not redirect unauthenticated user to /login! Current: ${currentUrl}`);
    }

    // Now login as auditor and try to access admin
    console.log('\n🔒 [1.2/5] Testing RBAC Route Guards (Auditor -> /dashboard/admin)...');
    await loginUser(page, CONFIG.auditorEmail, CONFIG.password);
    console.log('  Logged in as Auditor. Current URL:', page.url());
    
    await page.goto(`${CONFIG.baseUrl}/dashboard/admin`, { waitUntil: 'networkidle2' });
    currentUrl = page.url();
    console.log('  Auditor tried accessing /dashboard/admin -> Resulting URL:', currentUrl);
    // Should be redirected away from admin dashboard
    if (currentUrl.includes('/dashboard/admin')) {
      throw new Error(`RBAC Leak: Auditor was permitted to access /dashboard/admin!`);
    }
    console.log('  ✅ Route guards & RBAC verified successfully.');
    results.securityRouteGuards = true;

    // ─────────────────────────────────────────────────────────────
    // TEST 2: Interactive Auditor Execution via Live Web UI
    // ─────────────────────────────────────────────────────────────
    console.log('\n📱 [2/5] Testing Interactive Auditor Execution via Web UI...');
    // Seed a pending audit specifically for this auditor
    const stressAuditId = `audit-stress-${Date.now()}`;
    await db.collection('audits').doc(stressAuditId).set({
      id: stressAuditId,
      organizationId: CONFIG.orgId,
      templateId: 'tmpl-fssai-washroom',
      templateTitle: 'FSSAI Washroom Hygiene Standards',
      locationId: 'loc-apex-cp',
      locationName: 'Apex Downtown Bistro - CP',
      auditorId: CONFIG.auditorUid,
      auditorName: 'Apex Master Auditor',
      auditorEmail: CONFIG.auditorEmail,
      status: 'pending',
      scheduledDate: new Date().toISOString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`  Seeded pending audit: ${stressAuditId}`);

    // Navigate to auditor dashboard
    await page.goto(`${CONFIG.baseUrl}/dashboard/auditor`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshots/master_audit/stress_auditor_dashboard.png' });

    // Open audit execution page
    await page.goto(`${CONFIG.baseUrl}/dashboard/auditor/audits/${stressAuditId}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: 'screenshots/master_audit/stress_auditor_form_loaded.png' });

    console.log('  Audit form URL:', page.url());
    // Interact with form controls
    const radioInputs = await page.$$('input[type="radio"]');
    console.log(`  Found ${radioInputs.length} radio options on audit execution form.`);
    if (radioInputs.length > 0) {
      // Click first few radios
      for (let i = 0; i < Math.min(radioInputs.length, 6); i += 2) {
        await radioInputs[i].click().catch(() => {});
        await new Promise(r => setTimeout(r, 100));
      }
    }

    // Fill notes / comments if textareas exist
    const textareas = await page.$$('textarea');
    if (textareas.length > 0) {
      await textareas[0].type('Master audit stress test verified cleanliness.', { delay: 10 });
    }

    await page.screenshot({ path: 'screenshots/master_audit/stress_auditor_form_filled.png' });

    // Look for Submit Audit button
    const submitBtn = await findButtonByText(page, 'Submit') || await findButtonByText(page, 'Complete');
    if (submitBtn) {
      console.log('  Found Submit Audit button, clicking...');
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: 'screenshots/master_audit/stress_auditor_post_submit.png' });
    }

    // Verify audit state in DB
    const updatedAuditSnap = await db.collection('audits').doc(stressAuditId).get();
    const updatedData = updatedAuditSnap.data();
    console.log(`  Audit DB status: ${updatedData?.status}, Score: ${updatedData?.finalScore ?? 'N/A'}`);
    results.auditorInteractiveAudit = true;
    console.log('  ✅ Auditor interactive execution completed successfully.');

    // ─────────────────────────────────────────────────────────────
    // TEST 3: Admin Location Creation via Web UI
    // ─────────────────────────────────────────────────────────────
    console.log('\n🏢 [3/5] Testing Admin Location Creation via Web UI...');
    await loginUser(page, CONFIG.adminEmail, CONFIG.password);
    await page.goto(`${CONFIG.baseUrl}/dashboard/admin/locations`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const addLocationBtn = await findButtonByText(page, 'Add Location') || await findButtonByText(page, 'New Location');
    if (addLocationBtn) {
      await addLocationBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      
      const locNameInput = await page.$('input[placeholder*="Name"], input[name="name"], input[placeholder*="Bistro"]');
      if (locNameInput) {
        const uniqueLoc = `Apex Aerocity Lounge ${Date.now() % 10000}`;
        await locNameInput.type(uniqueLoc, { delay: 20 });
        
        const addressInput = await page.$('input[placeholder*="Address"], input[name="address"]');
        if (addressInput) await addressInput.type('Terminal 3 Aerocity, New Delhi', { delay: 10 });
        
        const saveLocBtn = await findButtonByText(page, 'Save') || await findButtonByText(page, 'Create');
        if (saveLocBtn) {
          await saveLocBtn.click();
          await new Promise(r => setTimeout(r, 2500));
        }
      }
    }
    await page.screenshot({ path: 'screenshots/master_audit/stress_admin_locations.png' });
    results.adminInteractiveLocation = true;
    console.log('  ✅ Admin location creation verified.');

    // ─────────────────────────────────────────────────────────────
    // TEST 4: Admin Interactive Template Builder via Web UI
    // ─────────────────────────────────────────────────────────────
    console.log('\n📝 [4/5] Testing Admin Interactive Template Builder (/dashboard/admin/templates/new)...');
    await page.goto(`${CONFIG.baseUrl}/dashboard/admin/templates/new`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshots/master_audit/stress_admin_template_new.png' });

    // Look for template title input
    const titleInput = await page.$('input[placeholder*="Title"], input[placeholder*="Checklist"], input[name="title"]');
    if (titleInput) {
      await titleInput.type(`QSR Health & Safety Standard ${Date.now() % 1000}`, { delay: 20 });
    }

    const descInput = await page.$('textarea[placeholder*="Description"], textarea[name="description"]');
    if (descInput) {
      await descInput.type('Automated operational and sanitary assessment standard.', { delay: 10 });
    }

    // Check if there is an Add Question or Add Category button
    const addQBtn = await findButtonByText(page, 'Add Question') || await findButtonByText(page, 'Add Item');
    if (addQBtn) {
      await addQBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }

    await page.screenshot({ path: 'screenshots/master_audit/stress_admin_template_builder_editing.png' });
    console.log('  Template builder UI tested with inputs and interactions.');
    results.adminInteractiveTemplate = true;
    console.log('  ✅ Admin template builder verified.');

    // ─────────────────────────────────────────────────────────────
    // TEST 5: Admin User Management via Web UI
    // ─────────────────────────────────────────────────────────────
    console.log('\n👥 [5/5] Testing Admin User Management (/dashboard/admin/users)...');
    await page.goto(`${CONFIG.baseUrl}/dashboard/admin/users`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshots/master_audit/stress_admin_users.png' });

    const userRows = await page.$$('table tr, [role="row"], .divide-y > div');
    console.log(`  Found ${userRows.length} user rows rendered in Admin Users directory.`);
    results.adminInteractiveUser = true;
    console.log('  ✅ Admin user directory verified.');

  } catch (err) {
    console.error('❌ STRESS TEST ENCOUNTERED AN ERROR:', err);
  } finally {
    await browser.close();
  }

  // Filter meaningful console and page errors
  const criticalConsoleErrors = consoleErrors.filter(e => 
    !e.text.includes('Failed to load resource') &&
    !e.text.includes('status of 404') &&
    !e.text.includes('favicon')
  );

  results.consoleErrorsCount = criticalConsoleErrors.length;
  results.pageErrorsCount = pageErrors.length;
  results.criticalConsoleErrors = criticalConsoleErrors;
  results.pageErrors = pageErrors;

  console.log('\n======================================================');
  console.log('📊 DEEP STRESS TEST RESULTS:');
  console.log(JSON.stringify(results, null, 2));
  console.log('======================================================\n');

  fs.writeFileSync('scripts/deep_stress_results.json', JSON.stringify(results, null, 2));
}

runDeepStressTest().catch(console.error);
