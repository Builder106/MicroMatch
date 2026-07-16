import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';

const { pageState } = vi.hoisted(() => ({
  pageState: { url: new URL('http://test/about'), data: {} as Record<string, unknown> }
}));
vi.mock('$app/state', () => ({ page: pageState }));

import StaticArticle from '$lib/components/StaticArticle.svelte';

describe('StaticArticle', () => {
  it('renders the title, lede, and updated date', () => {
    render(StaticArticle, { title: 'About us', lede: 'Our mission', updated: '2026-01-01' });

    expect(screen.getByRole('heading', { name: 'About us', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Our mission')).toBeInTheDocument();
    expect(screen.getByText(/2026-01-01/)).toBeInTheDocument();
  });

  it('omits the lede and updated line when not provided', () => {
    render(StaticArticle, { title: 'About us' });
    expect(screen.queryByText(/Last updated/i)).toBeNull();
  });

  it('shows "Sign in" and "Create account" links when signed out', () => {
    pageState.data = { userRole: 'anonymous' };
    render(StaticArticle, { title: 'About us' });

    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create account' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Dashboard' })).toBeNull();
  });

  it('shows a "Dashboard" link when signed in', () => {
    pageState.data = { userRole: 'volunteer' };
    render(StaticArticle, { title: 'About us' });

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull();
  });

  it('excludes the current page from the related-pages nav', () => {
    pageState.url = new URL('http://test/about');
    pageState.data = {};
    render(StaticArticle, { title: 'About us' });

    expect(screen.queryByRole('link', { name: 'About' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });
});
