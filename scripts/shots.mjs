// npm run shots — renders the 15 portfolio screenshots into shots/ (brief §10).
// Starts its own Vite server, so no manual steps are needed.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const PORT = 5199;
const OUT = new URL('../shots/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const server = await createServer({ server: { port: PORT, strictPort: true }, logLevel: 'error' });
await server.listen();
const base = `http://localhost:${PORT}`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
const page = await context.newPage();

const open = async (path) => {
  await page.goto(base + path);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(750); // loading skeletons are 600 ms
};
const click = (name, opts = {}) => page.getByRole('button', { name, ...opts }).first().click();
const scrollTo = async (selector, offset = 8) => {
  await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel);
      el.closest('#screen').scrollTop = el.offsetTop - off;
    },
    [selector, offset],
  );
  await page.waitForTimeout(150);
};
const setCheckin = (v) => page.getByLabel('Guest check-in').selectOption(String(v));
const shot = async (name) => {
  await page.waitForTimeout(250);
  await page.locator('#phone').screenshot({ path: fileURLToPath(new URL(name, OUT)) });
  console.log('  ✓', name);
};

const steps = [
  ['01-manager-today.png', async () => open('/m?role=manager&scenario=default')],
  [
    '02-manager-book.png',
    async () => {
      await open('/m/book?role=manager&scenario=default');
      await setCheckin(900);
      await scrollTo('#timing');
    },
  ],
  [
    '03-manager-book-at-risk.png',
    async () => {
      await open('/m/book?role=manager&scenario=at-risk');
      await scrollTo('#timing');
    },
  ],
  [
    '04-manager-price-breakdown.png',
    async () => {
      await open('/m/book?role=manager&scenario=default');
      await setCheckin(900);
      await click(/^Total/);
      await page.waitForTimeout(300);
    },
  ],
  [
    '05-manager-confirmed.png',
    async () => {
      await open('/m/book?role=manager&scenario=default');
      await setCheckin(900);
      await click(/Review booking/);
      await click(/^Pay ₪/);
      await page.waitForURL(/confirmed/);
    },
  ],
  ['06-manager-tracking.png', async () => open('/m/jobs/j-bograshov?role=manager&scenario=default')],
  ['07-patron-jobs.png', async () => open('/p?role=patron&scenario=default')],
  [
    '08-patron-checklist.png',
    async () => {
      await open('/p/jobs/j-bograshov/clean?role=patron&scenario=default');
      await scrollTo('#room-living', 150);
    },
  ],
  [
    '09-patron-missing-item.png',
    async () => {
      await open('/p/jobs/j-bograshov/clean?role=patron&scenario=default');
      await scrollTo('#room-living', 150);
      await click('Report missing item');
      await page.waitForTimeout(300);
    },
  ],
  ['10-patron-rework.png', async () => open('/p?role=patron&scenario=rework')],
  ['11-inspector-queue.png', async () => open('/i?role=inspector&scenario=default')],
  [
    '12-inspector-needs-redo.png',
    async () => {
      await open('/i/inspect/j-levinski?role=inspector&scenario=default');
      await page.getByRole('tab', { name: /Bathroom/ }).click();
      await click('Needs redo: Polish mirror');
      await page.getByLabel('What needs fixing').fill('Streaks on the mirror above the sink. Please polish it again with the glass cloth.');
      await click('Add photo');
      await page.waitForTimeout(300);
    },
  ],
  [
    '13-manager-ready-rate.png',
    async () => {
      await open('/m/jobs/j-benyehuda/rate?role=manager&scenario=ready');
      await page.getByRole('radio', { name: /^5 of 5/ }).dispatchEvent('click');
    },
  ],
  ['14-manager-empty.png', async () => open('/m?role=manager&scenario=empty')],
  [
    '15-payment-error.png',
    async () => {
      await open('/m/review?role=manager&scenario=payment-error');
      await click(/^Pay ₪/);
      await page.getByText('Your card was declined.').waitFor();
    },
  ],
];

let failed = 0;
for (const [name, run] of steps) {
  try {
    await run();
    await shot(name);
  } catch (e) {
    failed++;
    console.error('  ✗', name, e.message.split('\n')[0]);
  }
}

await browser.close();
await server.close();
console.log(failed ? `${failed} screenshot(s) failed` : `All ${steps.length} screenshots saved to shots/`);
process.exit(failed ? 1 : 0);
