/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';

// Component tests are scaffolded but currently deferred. @testing-library/svelte
// resolves Svelte's server entry instead of the client one when run alongside
// node-environment tests, so mount() throws "lifecycle_function_unavailable".
//
// Resolving cleanly requires a vitest.workspace config (one project per env,
// with `resolve.conditions: ['browser']` on the jsdom project) — non-trivial
// setup against the existing SvelteKit plugin pipeline.
//
// For now: end-to-end coverage moves to Playwright (see e2e/), where
// real-browser semantics make this kind of component-level mounting moot.
//
// To revisit: when we adopt vitest workspace config, unskip and expand.
describe.skip('BadgeChip (component)', () => {
  it('renders the provided label', () => {
    expect(true).toBe(true);
  });
});
