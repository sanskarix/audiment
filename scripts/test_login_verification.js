/**
 * scripts/test_login_verification.js
 * Verifies that Puppeteer can log in as Admin, Manager, and Auditor
 */
const puppeteer = require('puppeteer-core');
const config = require('./test_accounts_config.json');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';

async function testLogin(email, password, expectedUrl) {
  console.log(`\nTesting login for ${email}...`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);

    // Click submit button
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    const currentUrl = page.url();
    console.log(`Current URL after login: ${currentUrl}`);

    const success = currentUrl.includes(expectedUrl);
    console.log(`Login ${success ? 'SUCCESSFUL' : 'FAILED'}. Target: ${expectedUrl}`);
    if (errors.length) {
      console.log('Console errors encountered:', errors.slice(0, 3));
    }
    return success;
  } finally {
    await browser.close();
  }
}

async function main() {
  const adminSuccess = await testLogin('apex_admin@audiment.in', config.password, '/dashboard/admin');
  const mgrSuccess = await testLogin('apex_manager@audiment.in', config.password, '/dashboard/manager');
  const audSuccess = await testLogin('apex_auditor@audiment.in', config.password, '/dashboard/auditor');

  console.log('\nVerification Summary:');
  console.log(`Admin login:   ${adminSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`Manager login: ${mgrSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`Auditor login: ${audSuccess ? 'PASS' : 'FAIL'}`);
}

main().catch(console.error);

