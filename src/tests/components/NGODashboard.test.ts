import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';

const { mocks } = vi.hoisted(() => ({ mocks: { accountGet: vi.fn() } }));
vi.mock('$lib/appwrite.client', () => ({ account: { get: mocks.accountGet } }));

import NGODashboard from '$lib/components/NGODashboard.svelte';

const baseData = {
  signedIn: true,
  user: { id: 'org-1', email: 'org@example.com' },
  userData: {
    myTasks: [],
    pendingReviews: [],
    totalTasks: 0,
    pendingReviewsCount: 0,
    approvedClaimsCount: 0,
    totalHours: 0
  }
};

describe('NGODashboard', () => {
  beforeEach(() => {
    mocks.accountGet.mockReset().mockResolvedValue({ prefs: {} });
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the inbox-zero empty state when there are no pending reviews', async () => {
    render(NGODashboard, { data: baseData });
    expect(await screen.findByText('Inbox zero.')).toBeInTheDocument();
  });

  it('renders a pending review card with notes, and the stats strip', async () => {
    const data = {
      ...baseData,
      userData: {
        ...baseData.userData,
        pendingReviewsCount: 1,
        totalTasks: 2,
        approvedClaimsCount: 3,
        totalHours: 4.5,
        pendingReviews: [{ id: 'c1', notes: 'Done and done', task: { title: 'Translate flyer' } }]
      }
    };
    render(NGODashboard, { data });

    expect(await screen.findByText('Translate flyer')).toBeInTheDocument();
    expect(screen.getByText('Done and done')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument(); // hours generated
  });

  it('resolves the org display name from prefs.orgName on mount', async () => {
    mocks.accountGet.mockResolvedValue({ prefs: { orgName: 'Acme NGO' } });
    render(NGODashboard, { data: baseData });

    expect(await screen.findByText('Acme NGO')).toBeInTheDocument();
  });

  it('approving a claim posts to the approve endpoint and reloads on success', async () => {
    const data = {
      ...baseData,
      userData: {
        ...baseData.userData,
        pendingReviewsCount: 1,
        pendingReviews: [{ id: 'claim-1', notes: 'n', task: { title: 'T' } }]
      }
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    const reloadMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    Object.defineProperty(window, 'location', { value: { reload: reloadMock }, writable: true });

    render(NGODashboard, { data });
    const approveBtn = await screen.findByRole('button', { name: /Approve/i });
    approveBtn.click();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/claims/claim-1/approve', expect.objectContaining({ method: 'POST' }));
    });
    await waitFor(() => expect(reloadMock).toHaveBeenCalled());
  });

  it('alerts the user when the claim action request fails', async () => {
    const data = {
      ...baseData,
      userData: {
        ...baseData.userData,
        pendingReviewsCount: 1,
        pendingReviews: [{ id: 'claim-1', notes: 'n', task: { title: 'T' } }]
      }
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const alertMock = vi.fn();
    vi.stubGlobal('alert', alertMock);

    render(NGODashboard, { data });
    const rejectBtn = await screen.findByRole('button', { name: /Reject/i });
    rejectBtn.click();

    await waitFor(() => expect(alertMock).toHaveBeenCalled());
  });

  it('shows a task grid when the NGO has tasks', async () => {
    const data = {
      ...baseData,
      userData: {
        ...baseData.userData,
        myTasks: [{ id: 't1', title: 'Translate flyer', shortDescription: 'Short' }]
      }
    };
    render(NGODashboard, { data });
    expect(await screen.findByText('Translate flyer')).toBeInTheDocument();
  });

  it('prompts sign-in when not signed in and there are no tasks', async () => {
    render(NGODashboard, { data: { ...baseData, signedIn: false, userData: { pendingReviews: [] } } });
    expect(await screen.findByText(/Sign in to manage your NGO workspace/i)).toBeInTheDocument();
  });
});
