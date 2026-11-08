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
  console.log('=== Starting Auditor Screenshots Capture ===');
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

  page.on('dialog', async (d) => {
    console.log('[AUTO-ACCEPT DIALOG]', d.message());
    await d.accept();
  });

  // Auto-grant permissions for geolocation, camera, microphone
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(BASE_URL, ['geolocation', 'camera', 'microphone']);
  await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

  const takeShot = async (relPath) => {
    const fullPath = path.join(ROOT_DIR, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    await hideNextDev(page);
    await delay(300);
    await page.screenshot({ path: fullPath });
    console.log(`[SAVED] ${relPath}`);
  };

  try {
    // 1. Login as auditor
    console.log('Navigating to login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', 'auditor@test.com');
    await page.type('input[type="password"]', 'password');
    console.log('Submitting login form...');
    await page.click('button[type="submit"]');

    console.log('Waiting for auditor dashboard navigation...');
    await page.waitForFunction(() => window.location.pathname.startsWith('/dashboard/auditor'), { timeout: 30000 });
    console.log('Auditor dashboard reached!');
    await waitPageLoaded(page, 3000);

    // Light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await delay(500);

    // 1. Auditor Dashboard Overview
    console.log('--- 1. Auditor Dashboard Overview ---');
    await takeShot('screenshots/auditor/overview/dashboard.png');

    // 2. Audit Execution - Questions 1 to 5
    console.log('--- 2. Auditor Execution ---');
    await page.goto(`${BASE_URL}/dashboard/auditor/audits/z7vesZJgeFHs3aBvKxr7`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 3000);

    // Dismiss initial location prompt if present
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enableBtn = btns.find(b => b.textContent.includes('Enable Location'));
      if (enableBtn) enableBtn.click();
    });
    await delay(1200);

    // Question 1
    console.log('Capturing Question 1...');
    await takeShot('screenshots/auditor/execution/question_1.png');

    // Answer Question 1 and Next
    console.log('Answering Question 1 and navigating to Question 2...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const yesBtn = btns.find(b => b.textContent.trim() === 'Yes') || btns.find(b => b.textContent.trim() === '10');
      if (yesBtn) yesBtn.click();
    });
    await delay(600);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    await waitPageLoaded(page, 1500);

    // Question 2
    console.log('Capturing Question 2...');
    await takeShot('screenshots/auditor/execution/question_2.png');

    // Answer Question 2 and Next
    console.log('Answering Question 2 and navigating to Question 3...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ansBtn = btns.find(b => b.textContent.trim() === 'Yes') || btns.find(b => b.textContent.trim() === '10');
      if (ansBtn) ansBtn.click();
    });
    await delay(600);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    await waitPageLoaded(page, 1500);

    // Question 3
    console.log('Capturing Question 3...');
    await takeShot('screenshots/auditor/execution/question_3.png');

    // Answer Question 3 and Next
    console.log('Answering Question 3 and navigating to Question 4...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ansBtn = btns.find(b => b.textContent.trim() === 'Yes') || btns.find(b => b.textContent.trim() === '10');
      if (ansBtn) ansBtn.click();
    });
    await delay(600);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    await waitPageLoaded(page, 1500);

    // Question 4
    console.log('Capturing Question 4...');
    await takeShot('screenshots/auditor/execution/question_4.png');

    // Answer Question 4 and Next
    console.log('Answering Question 4 and navigating to Question 5...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ansBtn = btns.find(b => b.textContent.trim() === 'Yes') || btns.find(b => b.textContent.trim() === '10');
      if (ansBtn) ansBtn.click();
    });
    await delay(600);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    await waitPageLoaded(page, 1500);

    // Question 5 - Photo Required Prompt
    console.log('Answering Question 5 before photo...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ansBtn = btns.find(b => b.textContent.trim() === 'Yes') || btns.find(b => b.textContent.trim() === '8');
      if (ansBtn) ansBtn.click();
    });
    await delay(800);
    await takeShot('screenshots/auditor/execution/question_5_photo_required.png');

    // Question 5 - Photo Attached
    console.log('Attaching Photo for Question 5...');
    await page.evaluate(() => {
      // Find photo area and inject local photo thumbnail preview
      const photosArea = document.querySelector('div.flex.flex-wrap.gap-3');
      if (photosArea) {
        photosArea.innerHTML = '';
        const thumb = document.createElement('div');
        thumb.className = 'group relative w-20 h-20 rounded-xl overflow-hidden border border-border/50 bg-muted/30 shadow-sm';
        thumb.innerHTML = `<img src="/images/photoevidence.jpeg" alt="Evidence" class="h-full w-full object-cover" />`;
        photosArea.appendChild(thumb);
      }
      // Remove pulsing required text if present
      const reqText = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Evidence photo is required'));
      if (reqText) reqText.style.display = 'none';

      // Also enable the Next button style
      const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next'));
      if (nextBtn) {
        nextBtn.removeAttribute('disabled');
        nextBtn.classList.remove('opacity-50');
      }
    });
    await delay(800);
    await takeShot('screenshots/auditor/execution/question_5_photo_attached.png');

    // ==========================================
    // 3. FLASHMOB AUDITOR (8 screenshots)
    // ==========================================
    console.log('--- 3. Auditor Flashmob ---');
    await page.goto(`${BASE_URL}/dashboard/auditor/flashmob`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    // 8. Flashmob Verification Tasks
    await takeShot('screenshots/auditor/flashmob/verification_tasks.png');

    // 9. Flashmob Step 1 - Location
    console.log('Entering Flashmob Wizard (Step 1)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.textContent.includes('Start Self Audit') || b.textContent.includes('Self Audit') || b.textContent.includes('Start'));
      if (startBtn) startBtn.click();
    });
    await waitPageLoaded(page, 1500);
    await takeShot('screenshots/auditor/flashmob/step1_location.png');

    // 10. Flashmob Step 1 - Arrival Confirmed
    console.log('Selecting site in Step 1...');
    await page.evaluate(() => {
      const triggers = Array.from(document.querySelectorAll('button[role="combobox"]'));
      if (triggers.length > 0) {
        triggers[triggers.length - 1].click();
      }
    });
    await delay(800);
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="option"]'));
      if (items.length > 0) items[0].click();
    });
    await delay(1000);
    await takeShot('screenshots/auditor/flashmob/step1_arrival_confirmed.png');

    // 11. Flashmob Step 2 - Capture Feed
    console.log('Advancing to Step 2 (Capture Feed)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const contBtn = btns.find(b => b.textContent.includes('Confirm Arrival') || b.textContent.includes('Continue'));
      if (contBtn) contBtn.click();
    });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/auditor/flashmob/step2_capture_feed.png');

    // 12. Flashmob Step 2 - Recording Active
    console.log('Starting Recording in Step 2...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const recBtn = btns.find(b => b.textContent.includes('Record Footage') || b.textContent.includes('Record'));
      if (recBtn) recBtn.click();
    });
    await delay(1500);
    await takeShot('screenshots/auditor/flashmob/step2_recording_active.png');

    // 13. Flashmob Step 3 - Video Review
    console.log('Stopping recording to advance to Step 3...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const stopBtn = btns.find(b => b.textContent.includes('Stop'));
      if (stopBtn) stopBtn.click();
    });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/auditor/flashmob/step3_video_review.png');

    // 14. Flashmob Step 4 - ID Proof (Selfie)
    console.log('Advancing to Step 4 (Selfie)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const looksGoodBtn = btns.find(b => b.textContent.includes('Looks Good') || b.textContent.includes('Use Footage') || b.textContent.includes('Next'));
      if (looksGoodBtn) looksGoodBtn.click();
    });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/auditor/flashmob/step4_id_proof.png');

    // 15. Flashmob Step 5 - Final Verification
    console.log('Taking selfie to advance to Step 5...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const selfieBtn = btns.find(b => b.textContent.includes('Capture Selfie') || b.textContent.includes('Take Selfie'));
      if (selfieBtn) selfieBtn.click();
    });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/auditor/flashmob/step5_final_verification.png');

    // ==========================================
    // 4. AUDITOR HISTORY (1 screenshot)
    // ==========================================
    console.log('--- 4. Auditor History ---');
    await page.goto(`${BASE_URL}/dashboard/auditor/history`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await takeShot('screenshots/auditor/history/audit_history.png');

    // ==========================================
    // 5. AUDITOR SETTINGS (2 screenshots)
    // ==========================================
    console.log('--- 5. Auditor Settings ---');
    await page.goto(`${BASE_URL}/dashboard/auditor/settings`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitPageLoaded(page, 2500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(500);
    await takeShot('screenshots/auditor/settings/profile_settings.png');

    console.log('Scrolling to Security Settings...');
    await page.evaluate(() => {
      window.scrollTo({ top: 460, behavior: 'instant' });
    });
    await delay(800);
    await takeShot('screenshots/auditor/settings/security_settings.png');

    console.log('=== All 18 Auditor Screenshots Captured Successfully! ===');
  } catch (err) {
    console.error('Error during auditor capture:', err);
  } finally {
    await browser.close();
  }
}

main();
