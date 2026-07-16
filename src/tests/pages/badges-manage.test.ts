import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mocks } = vi.hoisted(() => ({ mocks: { getTasks: vi.fn(), listBadgeDefinitions: vi.fn() } }));
vi.mock('$lib/server/appwrite', () => ({ getTasks: mocks.getTasks }));
vi.mock('$lib/server/badgeDefs', () => ({ listBadgeDefinitions: mocks.listBadgeDefinitions }));

import { load } from '../../routes/badges/manage/+page.server';

function makeEvent(opts: { userRole?: string; userId?: string } = {}) {
  return {
    locals: {
      userRole: opts.userRole ?? 'anonymous',
      session: opts.userId ? { user: { id: opts.userId, email: 'jane@example.com' } } : undefined
    }
  } as any;
}

describe('/badges/manage load', () => {
  beforeEach(() => Object.values(mocks).forEach((m) => m.mockReset()));

  it('403s for non-NGO roles', async () => {
    await expect(load(makeEvent({ userRole: 'volunteer' }))).rejects.toMatchObject({ status: 403 });
  });

  it('403s for an NGO role with no resolvable user id', async () => {
    await expect(load(makeEvent({ userRole: 'ngo' }))).rejects.toMatchObject({ status: 403 });
  });

  it('scopes tasks and badge definitions to the NGO\'s own org', async () => {
    mocks.getTasks.mockResolvedValue([{ id: 't1', orgId: 'org-1' }]);
    mocks.listBadgeDefinitions.mockResolvedValue([{ id: 'b1', orgId: 'org-1' }]);

    const result: any = await load(makeEvent({ userRole: 'ngo', userId: 'org-1' }));

    expect(mocks.getTasks).toHaveBeenCalledWith({ orgId: 'org-1', includeInactive: true });
    expect(mocks.listBadgeDefinitions).toHaveBeenCalledWith('org-1');
    expect(result.tasks).toEqual([{ id: 't1', orgId: 'org-1' }]);
    expect(result.badges).toEqual([{ id: 'b1', orgId: 'org-1' }]);
  });
});
