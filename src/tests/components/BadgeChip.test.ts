import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import BadgeChip from '$lib/components/BadgeChip.svelte';

describe('BadgeChip', () => {
  it('renders the provided label', () => {
    const { getByText } = render(BadgeChip, { label: 'First Mission' });
    expect(getByText('First Mission')).toBeInTheDocument();
  });

  it('applies the provided color via inline style', () => {
    const { container } = render(BadgeChip, { label: 'Speedy', color: '#3b82f6' });
    const chip = container.querySelector('span.chip');
    expect(chip).toBeInTheDocument();
    // jsdom normalizes hex to rgb in inline styles, so accept either form.
    const style = chip?.getAttribute('style') ?? '';
    expect(style).toMatch(/#3b82f6|rgb\(\s*59,\s*130,\s*246\s*\)/i);
  });

  it('falls back to the default green color when color is omitted', () => {
    const { container } = render(BadgeChip, { label: 'Default' });
    const chip = container.querySelector('span.chip');
    const style = chip?.getAttribute('style') ?? '';
    expect(style).toMatch(/#16a34a|rgb\(\s*22,\s*163,\s*74\s*\)/i);
  });
});
