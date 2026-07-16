import { describe, it, expect, beforeEach, vi } from 'vitest';

// ADMIN_TEAM_ID is read from env once at module load, so this configured
// case needs its own file/import rather than reusing teams.test.ts's module
// instance (which imports with no APPWRITE_ADMIN_TEAM_ID set).
const { mocks } = vi.hoisted(() => ({
  mocks: { listMemberships: vi.fn() }
}));

vi.mock('$env/dynamic/private', () => ({
  env: {
    APPWRITE_ENDPOINT: 'https://fake.appwrite.io/v1',
    APPWRITE_PROJECT_ID: 'proj',
    APPWRITE_API_KEY: 'key',
    APPWRITE_ADMIN_TEAM_ID: 'admins-team'
  }
}));
vi.mock('node-appwrite', () => ({
  Client: class {
    setEndpoint() { return this; }
    setProject() { return this; }
    setKey() { return this; }
  },
  Teams: class { listMemberships = mocks.listMemberships; },
  Query: { equal: (k: string, v: string) => `${k}=${v}`, limit: (n: number) => `limit=${n}` }
}));

import { isUserAdmin } from './teams';

describe('isUserAdmin (ADMIN_TEAM_ID configured)', () => {
  beforeEach(() => mocks.listMemberships.mockReset());

  it('checks membership in the configured admin team', async () => {
    mocks.listMemberships.mockResolvedValue({ total: 1, memberships: [{ $id: 'm1' }] });
    expect(await isUserAdmin('user-1')).toBe(true);
    expect(mocks.listMemberships).toHaveBeenCalledWith('admins-team', expect.any(Array));
  });

  it('returns false when the user has no membership in the admin team', async () => {
    mocks.listMemberships.mockResolvedValue({ total: 0, memberships: [] });
    expect(await isUserAdmin('user-2')).toBe(false);
  });
});
