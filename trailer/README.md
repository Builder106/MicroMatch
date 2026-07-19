# MicroMatch trailer

36-second marketing trailer for MicroMatch, built with Remotion. The register is "come use this / contribute to this": MicroMatch is free and open source, so no investor language, no fabricated usage numbers. The climax rings show the loop closing (Claimed / Approved / Badged), not stats.

## Structure

1080 frames at 30 fps, 1920×1080. Scene order and frame ranges live in `src/Composition.tsx`:

| Frames | Scene | Content |
| ------ | ----- | ------- |
| 0–150 | TheHook | Site's own hero line on the coral gradient |
| 150–270 | Mission | "Everyone wants to help." on dark slate |
| 270–480 | TheSolution | 3D laptop sway + Claim/Submit/Earn cards |
| 480–780 | MicroInteractions | Real feed + badge studio, submit → approved, badge lands |
| 780–930 | TheClimax | Loop rings + "One small task. One real badge." |
| 930–1080 | Outro | Logo tile + trymicromatch.vercel.app |

## Commands

```bash
npm run dev
npx remotion render src/index.ts MicroMatchTrailer out/micromatch-trailer.mp4
```

## Rebuilding assets

- **Screenshots** (`public/mm_*.png`): run `bun run seed` in the repo root first (demo tasks auto-archive after 30 days), then `node scratch/capture.cjs` with `SEED_DEMO_PASSWORD` exported. The login page has two submit buttons; the script scopes to `form.auth-form`. Each account needs a fresh browser context.
- **Laptop sequence** (`public/mm_laptop_0001–0060.png`): `blender -b -P scratch/laptop.py` renders the ±35° sway loop at 2400×1600 with the current `mm_home.png` on screen. `STILL=1` renders a single test frame to `scratch/test_still.png` — always eyeball that before committing to the full hour of rendering.
- **Audio**: `public/audio.mp3` is Kevin MacLeod's "Wallpaper" (CC BY 4.0), trimmed and loudness-normalized; the publish description must carry the credit in `public/CREDITS.md`. SFX are ffmpeg-synthesized, no license needed.
