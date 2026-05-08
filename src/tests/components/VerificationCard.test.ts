import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';

// Stub the Appwrite client — VerificationCard imports it for createJWT
// inside handleFileChange. We're not exercising that path here.
vi.mock('$lib/appwrite.client', () => ({
  account: { createJWT: vi.fn().mockResolvedValue({ jwt: 'fake-jwt' }) }
}));

import VerificationCard from '$lib/components/VerificationCard.svelte';

function mockFetch(handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(handler));
}

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
}

describe('VerificationCard', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the NOT-SUBMITTED state when /api/verifications/me returns null', async () => {
    mockFetch(async () => jsonResponse({ verification: null }));

    render(VerificationCard, {});

    // The "Verify your org" CTA should appear once the fetch resolves.
    const cta = await screen.findByRole('button', { name: /Verify your org/i });
    expect(cta).toBeInTheDocument();

    // No status pill should be rendered yet.
    expect(screen.queryByText(/Verified NGO/i)).toBeNull();
    expect(screen.queryByText(/Under review/i)).toBeNull();
    expect(screen.queryByText(/Needs changes/i)).toBeNull();
  });

  it('renders the PENDING state with the submission summary', async () => {
    mockFetch(async () => jsonResponse({
      verification: {
        id: 'v1',
        userId: 'u1',
        orgName: 'Doctors Without Borders',
        country: 'US',
        taxId: '13-3433452',
        status: 'pending',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h ago
      }
    }));

    render(VerificationCard, {});

    expect(await screen.findByText(/Under review/i)).toBeInTheDocument();
    expect(screen.getByText('Doctors Without Borders')).toBeInTheDocument();
    expect(screen.getByText('13-3433452')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Withdraw/i })).toBeInTheDocument();
  });

  it('renders the APPROVED state with a confirmation message', async () => {
    mockFetch(async () => jsonResponse({
      verification: {
        id: 'v1',
        userId: 'u1',
        orgName: 'Doctors Without Borders',
        country: 'US',
        taxId: '13-3433452',
        status: 'approved',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString()
      }
    }));

    render(VerificationCard, {});

    expect(await screen.findByText(/Verified NGO/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks you post show a/i)).toBeInTheDocument();
  });

  it('renders the REJECTED state with the reviewer reason quoted', async () => {
    const reason = 'Document does not show tax-exempt status.';
    mockFetch(async () => jsonResponse({
      verification: {
        id: 'v1',
        userId: 'u1',
        orgName: 'Org',
        country: 'US',
        taxId: '111',
        status: 'rejected',
        reason,
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString()
      }
    }));

    render(VerificationCard, {});

    expect(await screen.findByText(/Needs changes/i)).toBeInTheDocument();
    expect(screen.getByText(reason)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resubmit/i })).toBeInTheDocument();
  });

  it('opens the form when the "Verify your org" CTA is clicked', async () => {
    mockFetch(async () => jsonResponse({ verification: null }));

    const { getByRole } = render(VerificationCard, {});
    const cta = await screen.findByRole('button', { name: /Verify your org/i });

    cta.click();

    await waitFor(() => {
      expect(getByRole('button', { name: /Submit for review/i })).toBeInTheDocument();
    });
    expect(getByRole('textbox', { name: /Organization name/i })).toBeInTheDocument();
  });
});
