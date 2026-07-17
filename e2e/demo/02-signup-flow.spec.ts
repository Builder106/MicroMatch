import { test, expect } from '@playwright/test';
import {
  dwellForDemo,
  setupDemoPage,
  patchFillForDemo,
  slowFill,
  waitForAuthHydration,
  DEMO_TAIL_MS
} from './helpers';

test.describe('02-signup-flow', () => {
  test.beforeEach(async ({ page }) => {
    patchFillForDemo();
    await setupDemoPage(page);
  });

  test.afterEach(async ({ page }) => {
    if (process.env.DEMO === '1') {
      try { await page.waitForTimeout(DEMO_TAIL_MS); } catch {}
    }
  });

  test('pick a role and fill the form', async ({ page }) => {
    await page.goto('/signup');
    // The role picker is a Svelte on:click — clicking it before hydration does
    // nothing at all and the form never appears.
    await waitForAuthHydration(page);
    await dwellForDemo(page, 1500); // brand panel + role picker fade in

    // Beat 1: role picker
    await expect(page.getByRole('heading', { name: /Choose your path/i })).toBeVisible();
    await dwellForDemo(page, 2000);

    // Beat 2: pick Volunteer
    await page.getByRole('button', { name: /I'm a Volunteer/i }).click();
    await dwellForDemo(page, 1500);

    // Beat 3: form appears
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();
    await dwellForDemo(page, 1000);

    // Beat 4: fill out the form — slowFill animates character-by-character.
    await slowFill(page.getByPlaceholder(/Jane/), 'Jane');
    await slowFill(page.getByPlaceholder(/Doe/), 'Doe');
    await slowFill(page.getByPlaceholder(/jane@example/), 'jane@example.com');
    await slowFill(page.getByPlaceholder(/At least 8 characters/), 'volunteer123');

    // Beat 5: hover the submit button (don't click — would create a real account)
    await page.getByRole('button', { name: /Join MicroMatch/i }).hover();
    await dwellForDemo(page, 2500);
  });
});
