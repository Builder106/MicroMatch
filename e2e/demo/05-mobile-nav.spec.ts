import { test, expect } from '@playwright/test';
import { dwellForDemo, setupDemoPage, patchFillForDemo, DEMO_TAIL_MS } from './helpers';

// The landing page's hamburger nav, which only exists below the 768px
// breakpoint — the rest of the demo suite films at 2560px and can never see it.
//
// Viewport AND video size are both overridden here: they have to match, or the
// phone-shaped page records letterboxed inside a desktop-shaped frame. The
// project-level `use` in playwright.demo.config.ts pins both, so both need
// re-pinning at the file level to win.
//
// scripts/demos-to-gif.ts leaves this one at native width instead of upscaling
// it to 960px like the desktop clips.

const PHONE = { width: 390, height: 844 }; // iPhone 14-ish

test.use({
  viewport: PHONE,
  video: { mode: 'on', size: PHONE }
});

test.describe('05-mobile-nav', () => {
  test.beforeEach(async ({ page }) => {
    patchFillForDemo();
    // zoom: 1 — the desktop "filmed close" zoom would overflow a 390px layout.
    await setupDemoPage(page, { zoom: 1 });
  });

  test.afterEach(async ({ page }) => {
    if (process.env.DEMO === '1') {
      try { await page.waitForTimeout(DEMO_TAIL_MS); } catch {}
    }
  });

  test('hamburger menu on a phone', async ({ page }) => {
    await page.goto('/');
    await dwellForDemo(page, 2000);

    // Beat 1: the hero, phone-width
    await expect(page.getByRole('heading', { name: /Make a big impact/i })).toBeVisible();
    await dwellForDemo(page, 1800);

    // Beat 2: open the menu
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('navigation', { name: 'Mobile' });
    await expect(menu).toBeVisible();
    await dwellForDemo(page, 2500);

    // Beat 3: the menu's contents
    await expect(menu.getByRole('link', { name: /How it Works/i })).toBeVisible();
    await expect(menu.getByRole('link', { name: /Join Now/i })).toBeVisible();
    await dwellForDemo(page, 2000);

    // Beat 4: close it again — the toggle relabels itself
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(menu).toBeHidden();
    await dwellForDemo(page, 1500);

    // Beat 5: reopen and follow a link, so the menu is shown doing its job
    await page.getByRole('button', { name: 'Open menu' }).click();
    await dwellForDemo(page, 1200);
    await menu.getByRole('link', { name: /Browse Tasks/i }).click();
    await dwellForDemo(page, 2500);
  });
});
