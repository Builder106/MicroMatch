// Renders static/social-preview.html to static/social-preview.png at the
// 1280×640 size GitHub recommends for the repo's Social preview setting.
//
// Run: bun run scripts/social-preview.ts
// Prereq: bunx playwright install chromium  (one-time, ~150 MB browser binary)

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '../static/social-preview.html');
const pngPath = resolve(__dirname, '../static/social-preview.png');

console.log('Launching headless Chromium…');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 640 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  console.log(`Opening ${htmlPath}`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Wait for Plus Jakarta Sans + Inter to load before snapping.
  await page.evaluate(() => (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready);

  await page.screenshot({ path: pngPath, fullPage: false });
  console.log(`✓ Wrote ${pngPath}`);
} finally {
  await browser.close();
}
