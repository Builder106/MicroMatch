// Converts e2e/demo/output/*.mp4 → static/demos/*.gif at README-friendly settings.
//   - 10 fps, ≤ 960 px wide → comfortably under GitHub's 10 MB attach limit
//   - palettegen + paletteuse for crisp color reproduction
//
// Run: bun run demo:gif

import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, basename, extname } from 'node:path';
import { execSync } from 'node:child_process';

const inputDir = resolve('e2e/demo/output');
const outputDir = resolve('static/demos');

if (!existsSync(inputDir)) {
  console.error(`No demos found at ${inputDir}. Run \`bun run test:demo\` first.`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const mp4s = readdirSync(inputDir).filter(
  (f) => extname(f) === '.mp4' && !f.includes('00-warmup')
);
if (mp4s.length === 0) {
  console.error(`No .mp4 files in ${inputDir}.`);
  process.exit(1);
}

const FPS = Number(process.env.DEMO_GIF_FPS ?? 10);
const WIDTH = Number(process.env.DEMO_GIF_WIDTH ?? 960);

for (const mp4 of mp4s) {
  // Strip the "chromium-" project-name prefix that the reporter prepends.
  const stem = basename(mp4, '.mp4').replace(/^chromium-/, '');
  const inPath = resolve(inputDir, mp4);
  const gifPath = resolve(outputDir, `${stem}.gif`);

  // Two-pass palette approach for cleaner GIF colors than the single-step
  // ffmpeg conversion produces.
  const filter = `fps=${FPS},scale=${WIDTH}:-1:flags=lanczos`;
  const palettegen = `${filter},palettegen=stats_mode=diff`;
  const paletteuse = `[0:v]${filter}[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;

  const palette = resolve(outputDir, `${stem}.palette.png`);

  try {
    console.log(`→ ${stem}.gif`);
    execSync(
      `ffmpeg -y -i "${inPath}" -vf "${palettegen}" -loglevel error "${palette}"`,
      { stdio: 'inherit' }
    );
    execSync(
      `ffmpeg -y -i "${inPath}" -i "${palette}" -lavfi "${paletteuse}" -loglevel error "${gifPath}"`,
      { stdio: 'inherit' }
    );
    // Clean up intermediate palette
    execSync(`rm "${palette}"`);
    console.log(`✓ ${gifPath}`);
  } catch (err) {
    console.error(`✗ Failed: ${stem}`, (err as Error).message);
  }
}
