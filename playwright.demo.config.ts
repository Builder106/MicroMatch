// Demo specs sign in as the seeded demo accounts, whose password lives in .env
// as SEED_DEMO_PASSWORD. Playwright doesn't read .env on its own the way
// scripts/seed.ts does, so load it here or every sign-in silently gets ''.
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 5173);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

const SLOWMO = Number(process.env.DEMO_SLOWMO ?? 1200);
const VIEWPORT = { width: 2560, height: 1600 };

// Demo suite — separate from QA. Records narrative videos for the README.
// Headless still records video; the wider viewport gives sharper GIF playback.
export default defineConfig({
  testDir: './e2e/demo',
  fullyParallel: false,    // single-worker avoids the multi-context 0-byte video bug
  workers: 1,
  retries: 0,              // re-runs would record over previous video
  timeout: 180_000,        // demos are long
  reporter: [['list'], ['./e2e/demo/reporter.ts']],

  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: VIEWPORT,
    video: { mode: 'on', size: VIEWPORT },
    launchOptions: { slowMo: SLOWMO },
    actionTimeout: 30_000
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Re-pin viewport + video at project level — the device preset
        // silently overrides the top-level `use` block.
        viewport: VIEWPORT,
        video: { mode: 'on', size: VIEWPORT }
      }
    }
  ],

  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'bun run dev',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000
      }
});
