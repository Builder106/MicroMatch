import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ProgressBar from '$lib/components/ProgressBar.svelte';

function fillFor(container: Element): HTMLElement {
  // ProgressBar's structure is track → fill → shimmer overlay. The fill is
  // the second div in document order; selecting it directly avoids matching
  // the track (querySelector('div > div') would also match the track since
  // it's a child of the testing-library container div).
  const divs = container.querySelectorAll('div');
  const fill = divs[1];
  if (!fill) throw new Error('progress fill not rendered');
  return fill as HTMLElement;
}

describe('ProgressBar', () => {
  it('renders zero width when value is 0', () => {
    const { container } = render(ProgressBar, { value: 0 });
    const fill = fillFor(container);
    expect(fill.getAttribute('style') ?? '').toContain('width: 0%');
  });

  it('renders full width when value is 1', () => {
    const { container } = render(ProgressBar, { value: 1 });
    const fill = fillFor(container);
    expect(fill.getAttribute('style') ?? '').toContain('width: 100%');
  });

  it('renders an intermediate width for fractional values', () => {
    const { container } = render(ProgressBar, { value: 0.42 });
    const fill = fillFor(container);
    expect(fill.getAttribute('style') ?? '').toContain('width: 42%');
  });

  it('clamps values above 1 to 100%', () => {
    const { container } = render(ProgressBar, { value: 1.5 });
    const fill = fillFor(container);
    expect(fill.getAttribute('style') ?? '').toContain('width: 100%');
  });

  it('clamps negative values to 0%', () => {
    const { container } = render(ProgressBar, { value: -0.2 });
    const fill = fillFor(container);
    expect(fill.getAttribute('style') ?? '').toContain('width: 0%');
  });

  it('defaults to 0% when value is omitted', () => {
    const { container } = render(ProgressBar, {});
    const fill = fillFor(container);
    expect(fill.getAttribute('style') ?? '').toContain('width: 0%');
  });
});
