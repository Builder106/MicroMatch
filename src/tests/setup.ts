// Vitest setup — runs once per worker. Loads jest-dom matchers and
// registers an after-each DOM cleanup so component tests don't leak
// renders into each other.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

// Only attach the DOM cleanup when running against jsdom (component tests).
// On node-environment server tests, document/window don't exist.
if (typeof document !== 'undefined') {
  // Lazy-import so the node project doesn't try to resolve @testing-library/svelte.
  const { cleanup } = await import('@testing-library/svelte');
  afterEach(() => cleanup());
}
