import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mocks } = vi.hoisted(() => ({ mocks: { getTasks: vi.fn(), getBadgeAnalytics: vi.fn() } }));
vi.mock('$lib/server/appwrite', () => ({ getTasks: mocks.getTasks, getBadgeAnalytics: mocks.getBadgeAnalytics }));

import { load } from '../../routes/badges/analytics/+page.server';

function makeEvent(opts: { userRole?: string; userId?: string } = {}) {
  return {
    locals: {
      userRole: opts.userRole ?? 'anonymous',
      session: opts.userId ? { user: { id: opts.userId, email: 'jane@example.com' } } : undefined
    }
  } as any;
}

describe('/badges/analytics load', () => {
  beforeEach(() => Object.values(mocks).forEach((m) => m.mockReset()));

  it('throws for non-NGO roles', async () => {
    await expect(load(makeEvent({ userRole: 'volunteer' }))).rejects.toThrow(/NGO access required/);
  });

  it('returns tasks + analytics for an NGO user', async () => {
    mocks.getTasks.mockResolvedValue([{ id: 't1' }]);
    mocks.getBadgeAnalytics.mockResolvedValue({ totalBadgesAwarded: 5 });

    const result: any = await load(makeEvent({ userRole: 'ngo', userId: 'org-1' }));

    expect(result.userRole).toBe('ngo');
    expect(result.user).toEqual({ id: 'org-1', email: 'jane@example.com' });
    expect(result.tasks).toEqual([{ id: 't1' }]);
    expect(result.analytics).toEqual({ totalBadgesAwarded: 5 });
  });
});
