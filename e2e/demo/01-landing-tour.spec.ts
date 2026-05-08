import { test, expect } from '@playwright/test';
import { dwellForDemo, setupDemoPage, patchFillForDemo, DEMO_TAIL_MS } from './helpers';

test.describe('01-landing-tour', () => {
  test.beforeEach(async ({ page }) => {
    patchFillForDemo();
    await setupDemoPage(page);
  });

  test.afterEach(async ({ page }) => {
    // Tail dwell so the final frame reads as a still image at the end of the GIF.
    if (process.env.DEMO === '1') {
      try { await page.waitForTimeout(DEMO_TAIL_MS); } catch {}
    }
  });

  test('hero, how-it-works, and impact', async ({ page }) => {
    await page.goto('/');
    await dwellForDemo(page, 1800); // hero animation in

    // Beat 1: hero
    await expect(page.getByRole('heading', { name: /Make a big impact/i })).toBeVisible();
    await dwellForDemo(page, 2000);

    // Beat 2: scroll to "How it works"
    await page.getByRole('heading', { name: /How It Works/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 2200);

    // Beat 3: scroll to featured tasks (empty state mascot animates in)
    await page.getByRole('heading', { name: /Featured Tasks/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 2500);

    // Beat 4: scroll to impact / gamification (progress ring + badges)
    await page.getByRole('heading', { name: /Track Your Impact/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 2800);
  });
});
