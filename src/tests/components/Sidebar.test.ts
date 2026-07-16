import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';

const { pageState, mocks } = vi.hoisted(() => ({
  pageState: { url: new URL('http://test/tasks'), data: {} as Record<string, unknown> },
  mocks: { signOut: vi.fn() }
}));
vi.mock('$app/state', () => ({ page: pageState }));
vi.mock('$lib/appwrite.client', () => ({ signOut: mocks.signOut }));

import Sidebar from '$lib/components/Sidebar.svelte';

describe('Sidebar', () => {
  beforeEach(() => {
    mocks.signOut.mockReset().mockResolvedValue(undefined);
    document.cookie = 'mm_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    pageState.url = new URL('http://test/tasks');
    pageState.data = {};
  });

  it('shows Sign in for an anonymous visitor and no NGO/admin items', () => {
    pageState.data = { userRole: 'anonymous' };
    render(Sidebar, {});

    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Create Task/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /Sign out/i })).toBeNull();
  });

  it('shows Profile and Sign out for a signed-in volunteer', () => {
    pageState.data = { userRole: 'volunteer' };
    render(Sidebar, {});

    expect(screen.getByRole('link', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign out/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Create Task/i })).toBeNull();
  });

  it('shows NGO-only nav items for an ngo role', () => {
    pageState.data = { userRole: 'ngo' };
    render(Sidebar, {});

    expect(screen.getByRole('link', { name: /Create Task/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Manage Badges/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Analytics/i })).toBeInTheDocument();
  });

  it('shows the Verifications link when page.data.isAdmin is true', () => {
    pageState.data = { userRole: 'volunteer', isAdmin: true };
    render(Sidebar, {});
    expect(screen.getByRole('link', { name: /Verifications/i })).toBeInTheDocument();
  });

  it('respects the mm_role cookie as a fallback for showing NGO nav items', () => {
    document.cookie = 'mm_role=ngo; path=/;';
    pageState.data = { userRole: 'anonymous' };
    render(Sidebar, {});
    expect(screen.getByRole('link', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('marks the current page nav item active', () => {
    pageState.url = new URL('http://test/dashboard');
    pageState.data = { userRole: 'volunteer' };
    render(Sidebar, {});

    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveClass('active');
  });

  it('calls signOut when "Sign out" is clicked', async () => {
    pageState.data = { userRole: 'volunteer' };
    render(Sidebar, {});

    await fireEvent.click(screen.getByRole('link', { name: /Sign out/i }));
    expect(mocks.signOut).toHaveBeenCalled();
  });
});
