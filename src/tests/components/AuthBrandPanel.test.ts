import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AuthBrandPanel from '$lib/components/AuthBrandPanel.svelte';

describe('AuthBrandPanel', () => {
  it('renders the MicroMatch logo lockup', () => {
    render(AuthBrandPanel, {});
    expect(screen.getByText('MicroMatch')).toBeInTheDocument();
  });

  it('shows the marketing copy by default', () => {
    render(AuthBrandPanel, {});
    expect(screen.getByText(/Step into a thriving civic world/i)).toBeInTheDocument();
  });

  it('hides the marketing copy when showCopy is false', () => {
    render(AuthBrandPanel, { showCopy: false });
    expect(screen.queryByText(/Step into a thriving civic world/i)).toBeNull();
  });

  it('applies the compact class when compact is true', () => {
    const { container } = render(AuthBrandPanel, { compact: true });
    expect(container.querySelector('section.brand-stage.compact')).toBeInTheDocument();
  });
});
