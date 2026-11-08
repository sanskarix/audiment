const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const ROOT_DIR = '/Users/sanskar/Documents/Asellus/Audiment';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    `
  }).catch(() => {});
}

async function waitPageLoaded(page, minDelay = 2000) {
  await page.waitForFunction(() => {
    const text = document.body ? document.body.innerText : '';
    return !text.includes('Compiling') && !text.includes('Rendering ...');
  }, { timeout: 35000 }).catch(() => {});

  await page.waitForFunction(() => {
    const skeletons = document.querySelectorAll('.animate-pulse');
    return skeletons.length === 0;
  }, { timeout: 20000 }).catch(() => {});

  await hideNextDev(page);
  await delay(minDelay);
}

async function main() {
  console.log('=== Starting Manager Screenshots Capture ===');
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
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(60000);

  const takeShot = async (relPath) => {
    const fullPath = path.join(ROOT_DIR, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    await hideNextDev(page);
    await delay(300);
    await page.screenshot({ path: fullPath });
    console.log(`[SAVED] ${relPath}`);
  };

  try {
    // Login as Manager
    console.log('Navigating to login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', 'manager@test.com');
    await page.type('input[type="password"]', 'password');
    console.log('Submitting login form...');
    await page.click('button[type="submit"]');

    console.log('Waiting for manager dashboard navigation...');
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard/manager'), { timeout: 30000 });
    console.log('Manager dashboard reached!');
    await waitPageLoaded(page, 3000);

    // ==========================================
    // 1. MANAGER OVERVIEW (3 screenshots)
    // ==========================================
    console.log('--- 1. Manager Overview ---');
    await page.goto(`${BASE_URL}/dashboard/manager`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 3000);
    // 1. Overview full dashboard
    await takeShot('screenshots/manager/overview/overview.png');

    // 2. Performance Trend (scroll down to center the trend chart)
    console.log('Scrolling to Performance Trend...');
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Performance Trend'));
      if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await delay(1000);
    await takeShot('screenshots/manager/overview/performance_trend.png');

    // 3. Auditor Workload (scroll down to center workload card)
    console.log('Scrolling to Auditor Workload...');
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Auditor Workload'));
      if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await delay(1000);
    await takeShot('screenshots/manager/overview/auditor_workload.png');

    // Reset scroll
    await page.evaluate(() => window.scrollTo(0, 0));

    // ==========================================
    // 2. MANAGER AUDITS (5 screenshots)
    // ==========================================
    console.log('--- 2. Manager Audits ---');
    await page.goto(`${BASE_URL}/dashboard/manager/audits`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);

    // 4. Audits List
    await takeShot('screenshots/manager/audits/audits_list.png');

    // 5. Audits Filters Dropdown (Open Filters dropdown)
    console.log('Opening Audits Filters Dropdown...');
    const filtersBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Filters'));
    });
    if (filtersBtn && filtersBtn.asElement()) {
      await filtersBtn.asElement().click();
      await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/audits/audits_filters.png');
      await page.keyboard.press('Escape');
      await delay(600);
    } else {
      console.error('Could not find Filters button on manager audits page');
    }

    // 6. Audit Actions Menu / Assign row button hover/focus
    console.log('Capturing audit actions menu / button...');
    // In Manager Audits, each row has an Assign/Reassign button. Let's focus/hover or click
    const assignBtn = await page.$('table tbody tr:first-child button');
    if (assignBtn) {
      await assignBtn.hover();
      await delay(300);
    }
    await takeShot('screenshots/manager/audits/audit_actions_menu.png');

    // 7. Reassign Auditor Modal
    console.log('Opening Reassign Auditor Modal...');
    if (assignBtn) {
      await assignBtn.click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/audits/reassign_auditor_modal.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // 8. Schedule New Audit Modal
    console.log('Opening New Audit Modal...');
    const newAuditBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('New audit'));
    });
    if (newAuditBtn && newAuditBtn.asElement()) {
      await newAuditBtn.asElement().click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/audits/new_audit_modal.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // ==========================================
    // 3. MANAGER CALENDAR (1 screenshot)
    // ==========================================
    console.log('--- 3. Manager Calendar ---');
    await page.goto(`${BASE_URL}/dashboard/manager/calendar`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    // 9. Calendar view
    await takeShot('screenshots/manager/calendar/calendar_view.png');

    // ==========================================
    // 4. MANAGER AUDITORS (4 screenshots)
    // ==========================================
    console.log('--- 4. Manager Auditors ---');
    await page.goto(`${BASE_URL}/dashboard/manager/auditors`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);

    // 10. Auditors List
    await takeShot('screenshots/manager/auditors/auditors_list.png');

    // 11. Auditor Actions Menu (3 dots)
    console.log('Opening Auditor Row Actions Menu...');
    const auditorRowMenuBtn = await page.$('table tbody tr:first-child button[data-slot="dropdown-menu-trigger"]');
    if (auditorRowMenuBtn) {
      await auditorRowMenuBtn.click();
      await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/auditors/auditor_actions_menu.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // 12. Add Auditor Modal
    console.log('Opening Add Auditor Modal...');
    const addAuditorBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('add auditor') || b.innerText.includes('Add auditor'));
    });
    if (addAuditorBtn && addAuditorBtn.asElement()) {
      await addAuditorBtn.asElement().click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/auditors/add_auditor_modal.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // 13. Auditor Performance Metrics (Click first auditor row or navigate to auditor detail)
    console.log('Navigating to Auditor Performance Metrics...');
    await page.click('table tbody tr:first-child');
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard/manager/auditors/'), { timeout: 25000 });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/manager/auditors/auditors_metrics.png');

    // ==========================================
    // 5. MANAGER CORRECTIVE ACTIONS (2 screenshots)
    // ==========================================
    console.log('--- 5. Manager Corrective Actions ---');
    await page.goto(`${BASE_URL}/dashboard/manager/corrective-actions`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);

    // 14. Corrective actions list
    await takeShot('screenshots/manager/corrective-actions/corrective_actions_list.png');

    // 15. Resolve Issue Modal
    console.log('Opening Resolve Issue Modal...');
    const resolveBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Resolve') || b.innerText.includes('Take action'));
    });
    if (resolveBtn && resolveBtn.asElement()) {
      await resolveBtn.asElement().click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/corrective-actions/resolve_issue_modal.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // ==========================================
    // 6. MANAGER REPORTS (2 screenshots)
    // ==========================================
    console.log('--- 6. Manager Reports ---');
    await page.goto(`${BASE_URL}/dashboard/manager/reports`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);

    // 16. Reports List
    await takeShot('screenshots/manager/reports/reports_list.png');

    // 17. Reports Filters Dropdown
    console.log('Opening Reports Location Filters Dropdown...');
    const reportsFilterBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button[data-slot="dropdown-menu-trigger"]'));
      return btns.find(b => b.innerText.includes('Filters') || b.innerText.includes('Location'));
    });
    if (reportsFilterBtn && reportsFilterBtn.asElement()) {
      await reportsFilterBtn.asElement().click();
      await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/manager/reports/reports_filters.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // ==========================================
    // 7. MANAGER SETTINGS (1 screenshot)
    // ==========================================
    console.log('--- 7. Manager Settings ---');
    await page.goto(`${BASE_URL}/dashboard/manager/settings`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    // 18. Profile settings
    await takeShot('screenshots/manager/settings/profile_settings.png');

    console.log('=== All 18 Manager Screenshots Captured Successfully! ===');
  } catch (err) {
    console.error('Error in Manager capture:', err);
  } finally {
    await browser.close();
  }
}

main();
