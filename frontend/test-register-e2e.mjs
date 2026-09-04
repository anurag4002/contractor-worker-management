import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext()).newPage();

  let baseUrlLog = null;
  const allReqs = [];
  const allResps = [];

  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('[API] Base URL:')) baseUrlLog = t;
  });
  page.on('request', r => {
    if (r.url().includes('/auth/') || r.url().includes('/api/')) {
      allReqs.push({ method: r.method(), url: r.url() });
    }
  });
  page.on('response', res => {
    if (res.url().includes('/auth/') || res.url().includes('/api/')) {
      allResps.push({ status: res.status(), url: res.url() });
    }
  });
  page.on('pageerror', err => console.log(`[PAGE ERROR]: ${err.message}`));

  console.log('=== Loading /register ===');
  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Base URL log:', baseUrlLog);

  console.log('\n=== Filling form with real test data ===');
  const email = `test-fix-${Date.now()}@example.com`;
  await page.fill('input[name="companyName"]', 'Sharma Construction Services');
  await page.fill('input[name="fullName"]', 'Rahul Sharma');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="mobileNumber"]', '9876543210');
  await page.fill('input[name="username"]', `rahulsharma${Date.now().toString().slice(-6)}`);
  await page.fill('input[name="password"]', 'TestPass123!@#');
  await page.fill('input[name="confirmPassword"]', 'TestPass123!@#');
  await page.fill('input[name="address"]', '42, MG Road, Sector 18');
  await page.fill('input[name="city"]', 'Noida');
  await page.fill('input[name="state"]', 'Uttar Pradesh');
  await page.fill('input[name="pincode"]', '201301');

  console.log(`Email: ${email}`);
  console.log('\n=== Submitting form ===');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  console.log('\n=== /auth and /api requests captured ===');
  allReqs.forEach(r => console.log(`  ${r.method} ${r.url}`));
  console.log('\n=== /auth and /api responses captured ===');
  allResps.forEach(r => console.log(`  HTTP ${r.status} ${r.url}`));

  await browser.close();
})();
