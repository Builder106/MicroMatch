import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { existsSync, statSync, unlinkSync, mkdirSync, rmdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';

type Pending = { sourcePath: string; slug: string };

/**
 * Demo reporter: collects each scenario's video attachment in onTestEnd, then
 * processes them in onEnd (Playwright doesn't guarantee video files are
 * flushed by the time onTestEnd fires — onEnd is the safe spot).
 *
 * - Videos for tests whose slug starts with "00-warmup" are deleted instead
 *   of converted (workaround for the slowMo + video first-test 0-byte bug).
 * - 0-byte webms are skipped so ffmpeg isn't fed an empty file.
 * - Each surviving webm is converted to an MP4 with H.264 + faststart so it
 *   plays cleanly in browser-native players.
 * - Per-test output folders are removed once their video has moved out.
 */
export default class DemoReporter implements Reporter {
  private pending: Pending[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    const video = result.attachments.find((a) => a.name === 'video');
    if (!video?.path) return;

    const slug = test
      .titlePath()
      .filter((s) => s && !s.endsWith('.spec.ts'))
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    this.pending.push({ sourcePath: video.path, slug });
  }

  async onEnd(): Promise<void> {
    const outputDir = resolve('e2e/demo/output');
    mkdirSync(outputDir, { recursive: true });

    for (const { sourcePath, slug } of this.pending) {
      const sourceDir = dirname(sourcePath);

      // Warmup videos are throwaway by design. Match anywhere in the slug
      // since the project name (e.g. "chromium-") prefixes the title path.
      if (slug.includes('00-warmup')) {
        try { unlinkSync(sourcePath); } catch {}
        this.cleanupDir(sourceDir);
        continue;
      }

      // Skip 0-byte webms (the known slowMo+video flakiness).
      if (!existsSync(sourcePath) || statSync(sourcePath).size === 0) {
        try { unlinkSync(sourcePath); } catch {}
        this.cleanupDir(sourceDir);
        continue;
      }

      const mp4 = resolve(outputDir, `${slug}.mp4`);
      try {
        execSync(
          `ffmpeg -y -i "${sourcePath}" -c:v libx264 -preset veryfast -pix_fmt yuv420p -movflags +faststart "${mp4}" -loglevel error`,
          { stdio: 'inherit' }
        );
        unlinkSync(sourcePath);
        this.cleanupDir(sourceDir);
        console.log(`✓ ${slug}.mp4`);
      } catch (err) {
        console.error(`✗ Failed to convert ${slug}:`, (err as Error).message);
      }
    }
  }

  private cleanupDir(dir: string): void {
    try {
      if (readdirSync(dir).length === 0) rmdirSync(dir);
    } catch { /* fine */ }
  }
}
