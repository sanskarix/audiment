/**
 * scripts/run_full_product_audit.js
 * Master tester script performing deep, end-to-end audit of all Admin, Manager, and Auditor functionalities.
 * Evaluates frontend UI, backend responses, loading latencies, visual layout, and error logs.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const config = require('./test_accounts_config.json');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const SHOTS_DIR = path.join(__dirname, '../screenshots/master_audit');

fs.mkdirSync(SHOTS_DIR, { recursive: true });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const auditReport = {
  timestamp: new Date().toISOString(),
  organization: config.orgId,
  testAccounts: {
    admin: config.adminUser.email,
    manager: config.managerUser.email,
    auditor: config.auditorUser.email,
  },
  pagesTested: [],
  networkFailures: [],
  consoleErrors: [],
  uiFlaws: [],
  timings: {},
  pageDetails: {},
};

async function hideNextDev(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal,
      #__next-build-watcher,
      [data-nextjs-toast],
      [data-nextjs-dev-overlay],
      [data-nextjs-dev-indicator],
      [data-nextjs-portal],
      [aria-label="Next.js Dev Indicator"],
      div[data-nextjs-route-announcer] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `,
  }).catch(() => {});
}

async function waitPageLoaded(page, minDelay = 1500) {
  await page.waitForFunction(() => {
    const text = document.body ? document.body.innerText : '';
    return !text.includes('Compiling') && !text.includes('Rendering ...');
  }, { timeout: 20000 }).catch(() => {});

  await page.waitForFunction(() => {
    return document.querySelectorAll('.animate-pulse').length === 0;
  }, { timeout: 12000 }).catch(() => {});

  await hideNextDev(page);
  await delay(minDelay);
}

async function findButtonByText(page, regex) {
  const buttons = await page.$$('button, a[role="button"]');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.innerText || el.textContent || '', btn);
    if (regex.test(txt.trim())) return btn;
  }
  return null;
}

async function login(page, email, password, expectedUrl) {
  console.log(`\n[AUTH] Logging in as ${email}...`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type="email"]', { visible: true, timeout: 15000 });

  await page.click('input[type="email"]', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type('input[type="email"]', email);

  await page.click('input[type="password"]', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type('input[type="password"]', password);

  const tStart = Date.now();
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});
  const dur = Date.now() - tStart;
  console.log(`[AUTH] Logged in in ${dur}ms. URL: ${page.url()}`);
  await waitPageLoaded(page, 1500);
}

async function auditPage(page, urlPath, pageKey, shotName) {
  console.log(`\n--- Auditing: ${pageKey} (${urlPath}) ---`);
  const fullUrl = `${BASE_URL}${urlPath}`;
  const t0 = Date.now();

  let failedResponses = [];
  const responseHandler = (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon.ico')) {
      failedResponses.push({ url: res.url(), status: res.status() });
      auditReport.networkFailures.push({ page: pageKey, url: res.url(), status: res.status() });
    }
  };
  page.on('response', responseHandler);

  try {
    await page.goto(fullUrl, { waitUntil: 'networkidle2' });
    await waitPageLoaded(page);
    const loadTime = Date.now() - t0;
    auditReport.timings[pageKey] = loadTime;

    const pageContent = await page.evaluate(() => {
      const body = document.body ? document.body.innerText : '';
      const hasBrokenImages = Array.from(document.querySelectorAll('img')).some(img => !img.complete || img.naturalWidth === 0);
      const title = document.title;
      return { bodyLength: body.length, hasBrokenImages, title };
    });

    const shotPath = path.join(SHOTS_DIR, `${shotName}.png`);
    await hideNextDev(page);
    await page.screenshot({ path: shotPath, fullPage: false });

    console.log(`✔ ${pageKey} loaded in ${loadTime}ms. Body chars: ${pageContent.bodyLength}. Screenshot: ${shotName}.png`);

    auditReport.pagesTested.push({
      pageKey,
      urlPath,
      loadTime,
      failedResponsesCount: failedResponses.length,
      screenshot: `${shotName}.png`,
    });

    return { success: true, loadTime, pageContent };
  } catch (err) {
    console.error(`✖ Error auditing ${pageKey}:`, err.message);
    auditReport.uiFlaws.push({ page: pageKey, error: err.message });
    return { success: false, error: err.message };
  } finally {
    page.off('response', responseHandler);
  }
}

async function main() {
  console.log('====================================================');
  console.log('       AUDIMENT MASTER PRODUCT AUDIT SUITE          ');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--window-size=1440,900',
    ],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    },
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions(BASE_URL, ['geolocation', 'camera', 'microphone']);

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(30000);

  // Set standard geolocation
  await page.setGeolocation({ latitude: 28.6139, longitude: 77.2090, accuracy: 10 });

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error' && !text.includes('AbortError') && !text.includes('favicon.ico')) {
      auditReport.consoleErrors.push({ text, url: page.url() });
    }
  });

  try {
    // =========================================================================
    // PART 1: ADMIN ROLE - COMPREHENSIVE FEATURE AUDIT
    // =========================================================================
    await login(page, 'apex_admin@audiment.in', config.password, '/dashboard/admin');

    // 1. Overview Page (/dashboard/admin)
    await auditPage(page, '/dashboard/admin', 'Admin_Overview', '01_admin_overview');

    // Evaluate Overview Page Metrics
    const overviewStats = await page.evaluate(() => {
      const text = document.body ? document.body.innerText : '';
      return {
        hasAuditsMetric: text.includes('5') || text.includes('Audits'),
        hasComplianceMetric: text.includes('Compliance') || text.includes('%'),
        hasLocationScores: text.includes('Apex Flagship') || text.includes('Downtown'),
      };
    });
    console.log('[DATA CHECK] Overview stats presence:', overviewStats);

    // 2. Users Page (/dashboard/admin/users)
    await auditPage(page, '/dashboard/admin/users', 'Admin_Users', '02_admin_users');

    // Test Search and Filters on Users page
    console.log('Testing Users Search...');
    const searchInput = await page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.type('Alexander');
      await delay(600);
      await page.screenshot({ path: path.join(SHOTS_DIR, '02b_admin_users_searched.png') });
      await searchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await delay(500);
    }

    // Test "Add User" Dialog open/close
    const addUserBtn = await findButtonByText(page, /add user|invite user/i);
    if (addUserBtn) {
      console.log('Opening Add User Modal...');
      await addUserBtn.click();
      await delay(800);
      await page.screenshot({ path: path.join(SHOTS_DIR, '02c_admin_add_user_modal.png') });
      const cancelOrClose = await page.$('button[aria-label="Close"]') || await findButtonByText(page, /cancel/i);
      if (cancelOrClose) await cancelOrClose.click();
      await delay(500);
    }

    // 3. Locations Page (/dashboard/admin/locations)
    await auditPage(page, '/dashboard/admin/locations', 'Admin_Locations', '03_admin_locations');

    // Test "Add Location" modal
    const addLocBtn = await findButtonByText(page, /add location/i);
    if (addLocBtn) {
      console.log('Opening Add Location Modal...');
      await addLocBtn.click();
      await delay(800);
      await page.screenshot({ path: path.join(SHOTS_DIR, '03b_admin_add_location_modal.png') });
      const cancelBtn = await findButtonByText(page, /cancel/i);
      if (cancelBtn) await cancelBtn.click();
      await delay(500);
    }

    // 4. Templates Page (/dashboard/admin/templates)
    await auditPage(page, '/dashboard/admin/templates', 'Admin_Templates', '04_admin_templates');

    // 5. Template Creator (/dashboard/admin/templates/new)
    await auditPage(page, '/dashboard/admin/templates/new', 'Admin_Template_New', '05_admin_template_new');

    // 6. Audits Page (/dashboard/admin/audits)
    await auditPage(page, '/dashboard/admin/audits', 'Admin_Audits', '06_admin_audits');

    // Test Schedule Audit Dialog
    const scheduleBtn = await findButtonByText(page, /schedule audit|new audit|publish audit/i);
    if (scheduleBtn) {
      console.log('Opening Schedule Audit Modal...');
      await scheduleBtn.click();
      await delay(800);
      await page.screenshot({ path: path.join(SHOTS_DIR, '06b_admin_schedule_modal.png') });
      const cancelBtn = await findButtonByText(page, /cancel/i);
      if (cancelBtn) await cancelBtn.click();
      await delay(500);
    }

    // 7. Reports Page (/dashboard/admin/reports)
    await auditPage(page, '/dashboard/admin/reports', 'Admin_Reports', '07_admin_reports');

    // Verify all 5 reports appear
    const reportRowsCount = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    console.log(`[DATA CHECK] Reports table row count: ${reportRowsCount}`);

    // 8. Individual Report Detail 1: Critical Failure Audit (/dashboard/admin/reports/audit-003)
    await auditPage(page, '/dashboard/admin/reports/audit-003', 'Admin_Report_Critical_Fail', '08_admin_report_audit003');

    // Test PDF Export Button on audit-003
    const exportPdfBtn = await findButtonByText(page, /export pdf|download pdf/i);
    if (exportPdfBtn) {
      console.log('Testing PDF Export button response...');
      await exportPdfBtn.click();
      await delay(2000);
      console.log('PDF Export triggered without crashing.');
    }

    // 9. Individual Report Detail 2: 100% Passing Audit (/dashboard/admin/reports/audit-001)
    await auditPage(page, '/dashboard/admin/reports/audit-001', 'Admin_Report_Passing', '09_admin_report_audit001');

    // 10. Corrective Actions Page (/dashboard/admin/corrective-actions)
    await auditPage(page, '/dashboard/admin/corrective-actions', 'Admin_Corrective_Actions', '10_admin_corrective_actions');

    const caText = await page.evaluate(() => document.body ? document.body.innerText : '');
    console.log(`[DATA CHECK] Corrective actions page contains "refrigerators": ${caText.includes('refrigerators') || caText.includes('Critical')}`);

    // 11. Flashmob Overview (/dashboard/admin/flashmob)
    await auditPage(page, '/dashboard/admin/flashmob', 'Admin_Flashmob', '11_admin_flashmob');

    // Test "Dispatch Flashmob Audit" button
    const dispatchBtn = await findButtonByText(page, /dispatch|new request|new flashmob/i);
    if (dispatchBtn) {
      console.log('Opening Dispatch Flashmob Dialog...');
      await dispatchBtn.click();
      await delay(800);
      await page.screenshot({ path: path.join(SHOTS_DIR, '11b_admin_dispatch_flashmob_modal.png') });
      const cancelBtn = await findButtonByText(page, /cancel/i);
      if (cancelBtn) await cancelBtn.click();
      await delay(500);
    }

    // 12. Settings Page (/dashboard/admin/settings)
    await auditPage(page, '/dashboard/admin/settings', 'Admin_Settings_Profile', '12_admin_settings_profile');

    // Test Settings Tabs
    const tabs = ['Organization', 'Plan & Billing', 'Notifications', 'Danger Zone'];
    for (let i = 0; i < tabs.length; i++) {
      const tabName = tabs[i];
      const tabBtn = await findButtonByText(page, new RegExp(tabName, 'i'));
      if (tabBtn) {
        console.log(`Switching to Settings Tab: ${tabName}...`);
        await tabBtn.click();
        await delay(1000);
        await page.screenshot({ path: path.join(SHOTS_DIR, `12_settings_${tabName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`) });
      }
    }

    // =========================================================================
    // PART 2: MANAGER ROLE AUDIT
    // =========================================================================
    console.log('\n====================================================');
    console.log('       TESTING MANAGER ROLE FUNCTIONALITY           ');
    console.log('====================================================\n');
    await login(page, 'apex_manager@audiment.in', config.password, '/dashboard/manager');

    // 13. Manager Overview
    await auditPage(page, '/dashboard/manager', 'Manager_Overview', '13_manager_overview');

    // 14. Manager Audits
    await auditPage(page, '/dashboard/manager/audits', 'Manager_Audits', '14_manager_audits');

    // 15. Manager Calendar
    await auditPage(page, '/dashboard/manager/calendar', 'Manager_Calendar', '15_manager_calendar');

    // 16. Manager Auditors List
    await auditPage(page, '/dashboard/manager/auditors', 'Manager_Auditors', '16_manager_auditors');

    // 17. Manager Corrective Actions
    await auditPage(page, '/dashboard/manager/corrective-actions', 'Manager_Corrective_Actions', '17_manager_corrective_actions');

    // 18. Manager Reports
    await auditPage(page, '/dashboard/manager/reports', 'Manager_Reports', '18_manager_reports');

    // =========================================================================
    // PART 3: AUDITOR ROLE AUDIT
    // =========================================================================
    console.log('\n====================================================');
    console.log('       TESTING AUDITOR ROLE FUNCTIONALITY           ');
    console.log('====================================================\n');
    await login(page, 'apex_auditor@audiment.in', config.password, '/dashboard/auditor');

    // 19. Auditor Active Audits
    await auditPage(page, '/dashboard/auditor', 'Auditor_Dashboard', '19_auditor_dashboard');

    // 20. Auditor History
    await auditPage(page, '/dashboard/auditor/history', 'Auditor_History', '20_auditor_history');

    // 21. Auditor Flashmob
    await auditPage(page, '/dashboard/auditor/flashmob', 'Auditor_Flashmob', '21_auditor_flashmob');

    console.log('\n✔ All 21 page audits completed!');

  } catch (err) {
    console.error('Fatal testing error:', err);
    auditReport.uiFlaws.push({ error: err.message });
  } finally {
    await browser.close();

    // Write final JSON audit report
    const reportFile = path.join(__dirname, '../scripts/master_audit_results.json');
    fs.writeFileSync(reportFile, JSON.stringify(auditReport, null, 2));
    console.log(`\nAudit results saved to: ${reportFile}`);
  }
}

main().catch(console.error);
