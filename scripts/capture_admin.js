const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const ROOT_DIR = '/Users/sanskar/Documents/Asellus/Audiment';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  // Wait for compiling text to disappear
  await page.waitForFunction(() => {
    const text = document.body ? document.body.innerText : '';
    return !text.includes('Compiling') && !text.includes('Rendering ...');
  }, { timeout: 25000 }).catch(() => {});

  // Wait for skeletons to disappear
  await page.waitForFunction(() => {
    const skeletons = document.querySelectorAll('.animate-pulse');
    return skeletons.length === 0;
  }, { timeout: 15000 }).catch(() => {});

  await hideNextDev(page);
  await delay(minDelay);
}

async function main() {
  console.log('=== Starting Admin Screenshots Capture ===');
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
    await page.screenshot({ path: fullPath });
    console.log(`[SAVED] ${relPath}`);
  };

  try {
    // 1. Login
    console.log('Navigating to login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', 'admin@test.com');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    console.log('Waiting for admin dashboard navigation...');
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard/admin'), { timeout: 25000 });
    await delay(1500);

    // ==========================================
    // 1. OVERVIEW
    // ==========================================
    console.log('--- 1. Admin Overview ---');
    // Ensure trend alert is active in Firestore
    try {
      await signInWithEmailAndPassword(auth, 'admin@test.com', 'password');
      await updateDoc(doc(db, 'notifications', '2OkyNZPfn1GoiPRPHrSr'), { isRead: false });
    } catch (e) {
      console.log('Firebase trend alert toggle:', e.message);
    }

    await page.goto(`${BASE_URL}/dashboard/admin`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    // Take performance_alert.png with yellow banner visible
    await takeShot('screenshots/admin/overview/performance_alert.png');

    // Dismiss or mark trend alert as read
    try {
      await updateDoc(doc(db, 'notifications', '2OkyNZPfn1GoiPRPHrSr'), { isRead: true });
    } catch (e) {}

    await page.goto(`${BASE_URL}/dashboard/admin`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    // Take clean overview.png
    await takeShot('screenshots/admin/overview/overview.png');

    // ==========================================
    // 2. USERS
    // ==========================================
    console.log('--- 2. Admin Users ---');
    await page.goto(`${BASE_URL}/dashboard/admin/users`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await page.waitForSelector('table tbody tr', { visible: true });
    await takeShot('screenshots/admin/users/users_list.png');

    // Add User Modal
    console.log('Opening Add User Modal...');
    const addUserBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Add User'));
    });
    if (addUserBtn) {
      await addUserBtn.click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/admin/users/add_user_modal.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // Users Filter Dropdown
    console.log('Opening Users Filters Dropdown...');
    const userFilterBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button[data-slot="dropdown-menu-trigger"], button.filter-btn'));
      return btns.find(b => b.innerText.includes('Filters'));
    });
    if (userFilterBtn) {
      await userFilterBtn.click();
      await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/admin/users/users_filters.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // User Row Actions Menu
    console.log('Opening User Row Action Menu...');
    const userActionBtn = await page.waitForSelector('table tbody tr:first-child button[data-slot="dropdown-menu-trigger"]', { visible: true });
    await userActionBtn.click();
    await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
    await delay(600);
    await takeShot('screenshots/admin/users/user_actions_menu.png');
    await page.keyboard.press('Escape');
    await delay(600);

    // ==========================================
    // 3. LOCATIONS
    // ==========================================
    console.log('--- 3. Admin Locations ---');
    await page.goto(`${BASE_URL}/dashboard/admin/locations`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await page.waitForSelector('table tbody tr', { visible: true });
    await takeShot('screenshots/admin/locations/locations_list.png');

    // Location Action Menu
    console.log('Opening Location Action Menu...');
    const locActionBtn = await page.waitForSelector('table tbody tr:first-child button[data-slot="dropdown-menu-trigger"]', { visible: true });
    await locActionBtn.click();
    await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
    await delay(600);
    await takeShot('screenshots/admin/locations/location_actions_menu.png');
    await page.keyboard.press('Escape');
    await delay(600);

    // Add Location Modal
    console.log('Opening Add Location Modal...');
    const addLocBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Add Location'));
    });
    if (addLocBtn) {
      await addLocBtn.click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/admin/locations/add_location_modal.png');

      // Select Manager Dropdown within modal
      console.log('Opening Select Manager dropdown in modal...');
      const mgrCombobox = await page.waitForSelector('[role="dialog"] button[role="combobox"]', { visible: true, timeout: 5000 }).catch(() => null);
      if (mgrCombobox) {
        await mgrCombobox.click();
        await delay(800);
        await takeShot('screenshots/admin/locations/select_manager_dropdown.png');
        await page.keyboard.press('Escape');
        await delay(400);
      }
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // ==========================================
    // 4. TEMPLATES
    // ==========================================
    console.log('--- 4. Admin Templates ---');
    await page.goto(`${BASE_URL}/dashboard/admin/templates`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await page.waitForSelector('table tbody tr', { visible: true });
    await takeShot('screenshots/admin/templates/templates_list.png');

    // Template Editor
    console.log('Opening Template Editor...');
    await page.goto(`${BASE_URL}/dashboard/admin/templates/Gl0UW0kClQLnMKMWFlAD/edit`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 3000);
    await takeShot('screenshots/admin/templates/template_editor.png');

    // Template Question Expanded
    console.log('Expanding Question 1 in Template Editor...');
    const q1Trigger = await page.waitForSelector('[data-slot="accordion-trigger"], button[data-state="closed"]', { visible: true }).catch(() => null);
    if (q1Trigger) {
      await q1Trigger.click();
      await delay(800);
    }
    await takeShot('screenshots/admin/templates/template_question_expanded.png');

    // ==========================================
    // 5. AUDITS
    // ==========================================
    console.log('--- 5. Admin Audits ---');
    await page.goto(`${BASE_URL}/dashboard/admin/audits`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await page.waitForSelector('table tbody tr', { visible: true });
    await takeShot('screenshots/admin/audits/audits_list.png');

    // Audits Status Filter Dropdown
    console.log('Opening Audits Status Filter Dropdown...');
    const auditFilterBtn = await page.waitForSelector('button.filter-btn', { visible: true });
    await auditFilterBtn.click();
    await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
    await delay(600);
    await takeShot('screenshots/admin/audits/audits_status_filter.png');

    // Filter by Completed
    console.log('Filtering Audits by Completed...');
    const menuItems = await page.$$('[role="menu"] [role="menuitemradio"]');
    for (const item of menuItems) {
      const text = await page.evaluate(el => el.innerText, item);
      if (text && text.includes('Completed')) {
        await item.click();
        break;
      }
    }
    await delay(1500);
    await takeShot('screenshots/admin/audits/audits_filtered.png');

    // Clear filter
    await page.evaluate(() => {
      const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Clear'));
      if (clearBtn) clearBtn.click();
    });
    await delay(1000);

    // New Audit Modal
    console.log('Opening New Audit Modal...');
    const newAuditBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('New audit'));
    });
    if (newAuditBtn) {
      await newAuditBtn.click();
      await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/admin/audits/new_audit_modal.png');

      // New Audit Select Location & Manager
      console.log('Selecting Location to reveal Manager dropdown...');
      const locSelect = await page.waitForSelector('[role="dialog"] #location, [role="dialog"] [data-slot="select-trigger"]', { visible: true }).catch(() => null);
      if (locSelect) {
        await locSelect.click();
        await page.waitForSelector('[role="listbox"] [role="option"]', { visible: true, timeout: 5000 }).catch(() => {});
        await delay(400);
        const firstLocOpt = await page.$('[role="listbox"] [role="option"]');
        if (firstLocOpt) {
          await firstLocOpt.click();
          await delay(600);
          // Now click Manager select
          const mgrSelect = await page.waitForSelector('#manager, [role="dialog"] #manager', { visible: true }).catch(() => null);
          if (mgrSelect) {
            await mgrSelect.click();
            await page.waitForSelector('[role="listbox"]', { visible: true, timeout: 5000 }).catch(() => {});
            await delay(500);
          }
        }
      }
      await takeShot('screenshots/admin/audits/new_audit_select_manager.png');
      await page.keyboard.press('Escape');
      await delay(300);
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // ==========================================
    // 6. REPORTS
    // ==========================================
    console.log('--- 6. Admin Reports ---');
    await page.goto(`${BASE_URL}/dashboard/admin/reports`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await page.waitForSelector('table tbody tr', { visible: true });
    await takeShot('screenshots/admin/reports/reports_list.png');

    // Reports Location Filter Dropdown
    console.log('Opening Reports Location Filter Dropdown...');
    const reportsFilterBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button[data-slot="dropdown-menu-trigger"]'));
      return btns.find(b => b.innerText.includes('Filters'));
    });
    if (reportsFilterBtn) {
      await reportsFilterBtn.click();
      await page.waitForSelector('[role="menu"]', { visible: true, timeout: 8000 });
      await delay(600);
      await takeShot('screenshots/admin/reports/reports_location_filter.png');
      await page.keyboard.press('Escape');
      await delay(600);
    }

    // Detailed Report
    console.log('Navigating to Report Detail...');
    await page.goto(`${BASE_URL}/dashboard/admin/reports/1JwP818imJN4UBhq4WG2`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/admin/reports/report_detail.png');

    // ==========================================
    // 7. FLASHMOB
    // ==========================================
    console.log('--- 7. Admin Flashmob ---');
    await page.goto(`${BASE_URL}/dashboard/admin/flashmob`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/admin/flashmob/flashmob_dashboard.png');

    // Publish Flashmob Modal
    console.log('Opening Publish Flashmob Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Publish Flashmob'));
      if (btn) btn.click();
    });
    await page.waitForSelector('[role="dialog"]', { visible: true, timeout: 8000 });
    await delay(600);
    await takeShot('screenshots/admin/flashmob/publish_flashmob_modal.png');
    await page.keyboard.press('Escape');
    await delay(600);

    // ==========================================
    // 8. SETTINGS
    // ==========================================
    console.log('--- 8. Admin Settings ---');
    // Profile
    await page.goto(`${BASE_URL}/dashboard/admin/settings?tab=profile`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2000);
    await takeShot('screenshots/admin/settings/profile_settings.png');

    // Organization
    await page.goto(`${BASE_URL}/dashboard/admin/settings?tab=organization`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2000);
    await takeShot('screenshots/admin/settings/organization_settings.png');

    // Notifications
    await page.goto(`${BASE_URL}/dashboard/admin/settings?tab=notifications`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2000);
    await takeShot('screenshots/admin/settings/notification_settings.png');

    console.log('=== All 26 Admin Screenshots Captured Successfully! ===');
  } catch (err) {
    console.error('Error in Admin capture:', err);
  } finally {
    await browser.close();
  }
}

main();
