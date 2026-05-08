import { test } from '@playwright/test';

// Warmup tests for the slowMo + video 0-byte first-test bug. The reporter
// detects them by slug prefix and discards their videos. Two warmups is the
// floor; one is sometimes not enough.

test.describe('00-warmup', () => {
  test('A', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
  });

  test('B', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
  });
});
