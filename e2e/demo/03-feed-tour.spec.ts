import { test, expect } from '@playwright/test';
import { dwellForDemo, setupDemoPage, patchFillForDemo, slowFill, DEMO_TAIL_MS } from './helpers';

test.describe('03-feed-tour', () => {
  test.beforeEach(async ({ page }) => {
    patchFillForDemo();
    await setupDemoPage(page);
  });

  test.afterEach(async ({ page }) => {
    if (process.env.DEMO === '1') {
      try { await page.waitForTimeout(DEMO_TAIL_MS); } catch {}
    }
  });

  test('search, filter chips, and empty state', async ({ page }) => {
    await page.goto('/tasks');
    await dwellForDemo(page, 1800);

    // Beat 1: header + search
    await expect(page.getByRole('heading', { name: /Find your next/i })).toBeVisible();
    await dwellForDemo(page, 1800);

    // Beat 2: type a search query
    await slowFill(page.getByPlaceholder(/Search tasks/i), 'translate');
    await dwellForDemo(page, 1500);

    // Beat 3: clear it via the X button
    await page.getByLabel('Clear search').click();
    await dwellForDemo(page, 800);

    // Beat 4: click each time-filter chip
    await page.getByRole('button', { name: /≤ 15 min/ }).click();
    await dwellForDemo(page, 1200);
    await page.getByRole('button', { name: /≤ 15 min/ }).click(); // toggle off
    await dwellForDemo(page, 600);

    await page.getByRole('button', { name: /≤ 30 min/ }).click();
    await dwellForDemo(page, 1200);

    // Beat 5: pick a hashtag
    await page.getByRole('button', { name: /#design/ }).click();
    await dwellForDemo(page, 1800);

    // Beat 6: clear filters
    const clearBtn = page.getByRole('button', { name: /Clear filters/i });
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click();
      await dwellForDemo(page, 1500);
    }

    // Beat 7: hold on the empty state mascot
    await dwellForDemo(page, 2500);
  });
});
