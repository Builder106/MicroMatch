import { test, expect } from '@playwright/test';
import {
  dwellForDemo,
  setupDemoPage,
  patchFillForDemo,
  signIn,
  DEMO_PASSWORD,
  NGO_EMAIL,
  DEMO_TAIL_MS
} from './helpers';

// The NGO's badge tooling: /badges/manage and /badges/analytics. Both are
// desktop-shaped, both post-date the 2026-05 recordings, and neither had any
// coverage.
//
// Runs after 04-closed-loop (specs execute in filename order, single worker),
// so analytics has a real award to show rather than an empty state. It doesn't
// assert on that data though — running this file alone should still pass, it
// just films the empty state instead.

test.describe('06-ngo-badge-tools', () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    patchFillForDemo();
    await setupDemoPage(page);
  });

  test.afterEach(async ({ page }) => {
    if (process.env.DEMO === '1') {
      try { await page.waitForTimeout(DEMO_TAIL_MS); } catch {}
    }
  });

  test('define a badge, read the analytics', async ({ page }) => {
    expect(DEMO_PASSWORD, 'SEED_DEMO_PASSWORD must be set — run `bun run seed` first').not.toBe('');

    await signIn(page, NGO_EMAIL, DEMO_PASSWORD);
    await dwellForDemo(page, 1200);

    // Beat 1: badge management
    await page.goto('/badges/manage');
    await expect(page.getByRole('heading', { name: /Reward what matters/i })).toBeVisible();
    await dwellForDemo(page, 2500);

    // Beat 2: the templates rail — badges are org-owned definitions, not a
    // hardcoded list
    await page.getByRole('heading', { name: /Start from a template/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 2200);

    // Beat 3: the org's live badges
    await page.getByRole('heading', { name: /Active badges/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 2500);

    // Beat 4: open the create modal so the shape of a definition is visible —
    // label, color, icon, criteria. Closed again without saving; the demo
    // shouldn't leave a stray badge definition behind on re-runs.
    await page.getByRole('button', { name: /Create badge/i }).first().click();
    await expect(page.getByRole('heading', { name: /Create new badge/i })).toBeVisible();
    await dwellForDemo(page, 3000);
    await page.getByRole('button', { name: 'Close' }).click();
    await dwellForDemo(page, 1200);

    // Beat 5: analytics
    await page.goto('/badges/analytics');
    await expect(page.getByRole('heading', { name: /The story your badges tell/i })).toBeVisible();
    await dwellForDemo(page, 2800);

    // Beat 6: distribution + engagement
    await page.getByRole('heading', { name: /Distribution/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 2500);
    await page.getByRole('heading', { name: /Recent awards/i }).scrollIntoViewIfNeeded();
    await dwellForDemo(page, 3000);
  });
});
