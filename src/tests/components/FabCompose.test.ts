import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import FabCompose from '$lib/components/FabCompose.svelte';

describe('FabCompose', () => {
  it('links to /org by default', () => {
    render(FabCompose, {});
    expect(screen.getByRole('link', { name: /Post task/i })).toHaveAttribute('href', '/org');
  });

  it('links to a custom href when provided', () => {
    render(FabCompose, { href: '/custom' });
    expect(screen.getByRole('link', { name: /Post task/i })).toHaveAttribute('href', '/custom');
  });
});
