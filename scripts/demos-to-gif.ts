// Converts e2e/demo/output/*.mp4 → static/demos/*.gif at README-friendly settings.
//   - 10 fps, ≤ 960 px wide → comfortably under GitHub's 10 MB attach limit
//   - palettegen + paletteuse for crisp color reproduction
//
// GitHub refuses to render a GIF over 10 MB, so anything that lands over budget
// is re-encoded a step smaller until it fits rather than being committed broken.
// A long scenario blows past it easily: the closed-loop demo runs ~110s and
// came out at 11 MB on the first pass.
//
// Run: bun run demo:gif

import { readdirSync, mkdirSync, existsSync, statSync, unlinkSync } from 'node:fs';
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

// The mobile clip is filmed at a 390px phone viewport (see 05-mobile-nav).
// Scaling it up to the desktop width would blur it and produce a ~2000px-tall
// GIF, so it stays at native width.
const MOBILE_GIF_WIDTH = Number(process.env.DEMO_GIF_MOBILE_WIDTH ?? 390);

const MAX_BYTES = Number(process.env.DEMO_GIF_MAX_BYTES ?? 10 * 1024 * 1024);

/** Width is dropped before fps — a blurry GIF reads worse than a choppy one. */
function ladderFor(baseFps: number, baseWidth: number): Array<{ fps: number; width: number }> {
  return [
    { fps: baseFps, width: baseWidth },
    { fps: baseFps, width: Math.round(baseWidth * 0.85) },
    { fps: 8, width: Math.round(baseWidth * 0.85) },
    { fps: 8, width: Math.round(baseWidth * 0.7) },
    { fps: 8, width: Math.round(baseWidth * 0.6) }
  ];
}

function encode(inPath: string, gifPath: string, stem: string, fps: number, width: number): number {
  // Two-pass palette approach for cleaner GIF colors than the single-step
  // ffmpeg conversion produces.
  const filter = `fps=${fps},scale=${width}:-1:flags=lanczos`;
  const palettegen = `${filter},palettegen=stats_mode=diff`;
  const paletteuse = `[0:v]${filter}[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;
  const palette = resolve(outputDir, `${stem}.palette.png`);

  execSync(`ffmpeg -y -i "${inPath}" -vf "${palettegen}" -loglevel error "${palette}"`, {
    stdio: 'inherit'
  });
  execSync(
    `ffmpeg -y -i "${inPath}" -i "${palette}" -lavfi "${paletteuse}" -loglevel error "${gifPath}"`,
    { stdio: 'inherit' }
  );
  try { unlinkSync(palette); } catch { /* already gone */ }
  return statSync(gifPath).size;
}

const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

for (const mp4 of mp4s) {
  // Strip the "chromium-" project-name prefix that the reporter prepends.
  const stem = basename(mp4, '.mp4').replace(/^chromium-/, '');
  const inPath = resolve(inputDir, mp4);
  const gifPath = resolve(outputDir, `${stem}.gif`);
  const baseWidth = stem.includes('mobile') ? MOBILE_GIF_WIDTH : WIDTH;

  try {
    console.log(`→ ${stem}.gif`);
    const ladder = ladderFor(FPS, baseWidth);
    let size = 0;
    let used = ladder[0];

    for (const [i, step] of ladder.entries()) {
      used = step;
      size = encode(inPath, gifPath, stem, step.fps, step.width);
      if (size <= MAX_BYTES) break;
      if (i < ladder.length - 1) {
        console.log(`  ${mb(size)} MB over budget — retrying at ${ladder[i + 1].fps} fps / ${ladder[i + 1].width}px`);
      }
    }

    if (size > MAX_BYTES) {
      console.error(
        `✗ ${stem}.gif is ${mb(size)} MB and won't render on GitHub (limit ${mb(MAX_BYTES)} MB).\n` +
          `  Shorten the scenario's dwells or split it in two.`
      );
      continue;
    }

    console.log(`✓ ${stem}.gif — ${mb(size)} MB @ ${used.fps} fps / ${used.width}px`);
  } catch (err) {
    console.error(`✗ Failed: ${stem}`, (err as Error).message);
  }
}
