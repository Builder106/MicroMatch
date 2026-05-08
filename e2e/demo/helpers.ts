import type { Locator, Page } from '@playwright/test';

// Tunable knobs (env-overridable per CLAUDE.md preferences).
export const DEMO_DWELL_MS = Number(process.env.DEMO_DWELL_MS ?? 1500);
export const DEMO_TYPE_DELAY = Number(process.env.DEMO_TYPE_DELAY ?? 70);
export const DEMO_TAIL_MS = Number(process.env.DEMO_TAIL_MS ?? 1500);
export const DEMO_ZOOM = Number(process.env.DEMO_ZOOM ?? 1.3);

const DEMO = process.env.DEMO === '1';

/**
 * Hold a frame after an assertion or navigation. slowMo only pauses *between*
 * Playwright actions — it doesn't cover page.goto(), and assertions resolve
 * the moment the element exists. Without dwellForDemo, modals and empty
 * states flash on screen before the eye can register them.
 */
export async function dwellForDemo(page: Page, ms = DEMO_DWELL_MS): Promise<void> {
  if (!DEMO) return;
  try { await page.waitForTimeout(ms); } catch { /* page closed */ }
}

/**
 * Inject a visible cursor dot + a counter-scaled zoom CSS into every page.
 * `addInitScript` re-runs on every navigation so this needs to be called once
 * per page (Playwright handles re-injection internally for init scripts).
 */
export async function setupDemoPage(page: Page): Promise<void> {
  if (!DEMO) return;

  // Visible cursor — headless mode hides the system cursor, so the viewer
  // can't see where the test is "looking" without this.
  await page.addInitScript(() => {
    const install = () => {
      if (document.getElementById('demo-cursor')) return;
      const dot = document.createElement('div');
      dot.id = 'demo-cursor';
      dot.style.cssText = [
        'position: fixed', 'top: -100px', 'left: -100px',
        'width: 28px', 'height: 28px',
        'background: rgba(255, 107, 107, 0.9)',
        'border: 4px solid white',
        'border-radius: 50%',
        'pointer-events: none',
        'z-index: 2147483647',
        'transform: translate(-50%, -50%)',
        'box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35)',
        'transition: transform 120ms ease-out, background 120ms ease-out'
      ].join(';');
      document.body.appendChild(dot);

      window.addEventListener('mousemove', (e) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      }, { passive: true });
      window.addEventListener('mousedown', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(0.7)';
        dot.style.background = 'rgba(232, 85, 85, 1)';
      });
      window.addEventListener('mouseup', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.background = 'rgba(255, 107, 107, 0.9)';
      });
    };
    if (document.body) install();
    else document.addEventListener('DOMContentLoaded', install);
  });

  // CSS zoom + counter-scale for "filmed close" feel without losing centered
  // content. zoom: 1.3 on <html> makes min-h-screen render at 130vh, so we
  // counter-scale by 1/zoom to keep the layout fitting the viewport.
  await page.addInitScript((zoom) => {
    const apply = () => {
      if (document.getElementById('demo-zoom')) return;
      const style = document.createElement('style');
      style.id = 'demo-zoom';
      style.textContent = `
        html { zoom: ${zoom}; }
        body, .min-h-screen { min-height: ${100 / zoom}vh !important; }
      `;
      document.head.appendChild(style);
    };
    if (document.head) apply();
    else document.addEventListener('DOMContentLoaded', apply);
  }, DEMO_ZOOM);
}

/**
 * Type a value character-by-character so the form-fill animates in the
 * recorded video. Without this, slowMo only pauses *between* Playwright
 * actions — the field itself fills instantly.
 *
 * Use in demos instead of `.fill()`:
 *   await slowFill(page.getByPlaceholder('jane@example.com'), 'jane@example.com');
 *
 * (We can't patch Locator.prototype globally because @playwright/test only
 * exports Locator as a type, not a runtime class.)
 */
export async function slowFill(locator: Locator, value: string): Promise<void> {
  if (!DEMO) {
    await locator.fill(value);
    return;
  }
  await locator.click();
  await locator.pressSequentially(value, { delay: DEMO_TYPE_DELAY });
}

/** No-op kept so existing `patchFillForDemo()` calls in demo specs still compile. */
export function patchFillForDemo(): void {
  /* see slowFill() — explicit helper replaces the prototype patch */
}
