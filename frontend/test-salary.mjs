import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('Salary') || t.includes('PayrollContext') || t.includes('fetchPayroll') || t.includes('loading') || t.includes('Loading')) {
      console.log('[CONSOLE]', t);
    }
  });

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      console.log('[REQ]', req.method(), req.url().split('?')[0]);
    }
  });

  page.on('response', res => {
    if (res.url().includes('/api/')) {
      console.log('[RES]', res.status(), res.url().split('?')[0]);
    }
  });

  page.on('pageerror', err => console.log('[PAGE ERROR]', err.message));

  console.log('=== Navigating to /login ===');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('=== Logging in ===');
  await page.fill('input[name="email"]', 'admin@contractor.com');
  await page.fill('input[name="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  console.log('=== Navigating to /salary ===');
  await page.goto('http://localhost:5173/salary', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  console.log('=== Checking content ===');
  const content = await page.content();
  console.log('Has loading text:', content.includes('Loading salary records'));
  console.log('Has Salary Management:', content.includes('Salary Management'));

  await browser.close();
})();
