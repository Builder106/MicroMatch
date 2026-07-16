import { describe, it, expect, beforeEach, vi } from 'vitest';

const { envState, mocks } = vi.hoisted(() => ({
  envState: {} as Record<string, string | undefined>,
  mocks: {
    createSession: vi.fn(),
    accountGet: vi.fn(),
    isUserInTeam: vi.fn()
  }
}));

vi.mock('$env/dynamic/private', () => ({
  env: new Proxy(envState, { get: (_, key: string) => envState[key] })
}));
vi.mock('$lib/server/session', () => ({
  createSession: mocks.createSession,
  SESSION_TTL_SECONDS: 1209600
}));
vi.mock('node-appwrite', () => ({
  Client: class {
    setEndpoint() { return this; } setProject() { return this; } setJWT() { return this; }
  },
  Account: class { get = mocks.accountGet; }
}));
vi.mock('$lib/server/teams', () => ({
  NGO_TEAM_ID: 'ngo-team',
  VOLUNTEER_TEAM_ID: 'volunteer-team',
  isUserInTeam: mocks.isUserInTeam
}));

import { POST } from '../../routes/api/auth/session/+server';

function makeEvent(body: unknown, protocol = 'https:') {
  const setCalls: Array<{ name: string; value: string; opts: any }> = [];
  return {
    request: {
      json: async () => {
        if (body === undefined) throw new Error('bad json');
        return body;
      }
    },
    cookies: { set: (name: string, value: string, opts: any) => setCalls.push({ name, value, opts }) },
    url: new URL(`${protocol}//test/api/auth/session`),
    setCalls
  } as any;
}

describe('POST /api/auth/session', () => {
  beforeEach(() => {
    for (const key of Object.keys(envState)) delete envState[key];
    Object.values(mocks).forEach((m) => m.mockReset());
    mocks.createSession.mockImplementation((input: any) => ({ id: 'sess-1', ...input, expiresAt: Date.now() + 1000 }));
  });

  it('returns 400 when the body has no jwt', async () => {
    const res = await POST(makeEvent({}));
    expect(res.status).toBe(400);
  });

  it('returns 400 on invalid JSON', async () => {
    const res = await POST(makeEvent(undefined));
    expect(res.status).toBe(400);
  });

  it('returns 401 when the JWT does not resolve to an Appwrite user', async () => {
    mocks.accountGet.mockRejectedValue(new Error('invalid'));
    const res = await POST(makeEvent({ jwt: 'bad-jwt' }));
    expect(res.status).toBe(401);
  });

  it('returns 401 when the resolved user has no email/id', async () => {
    mocks.accountGet.mockResolvedValue({});
    const res = await POST(makeEvent({ jwt: 'jwt' }));
    expect(res.status).toBe(401);
  });

  it('creates a session with role="user" by default and sets both cookies', async () => {
    mocks.accountGet.mockResolvedValue({ $id: 'user-1', email: 'jane@example.com', prefs: {} });

    const event = makeEvent({ jwt: 'good-jwt' });
    const res = await POST(event);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true, role: 'user', email: 'jane@example.com', roleSource: 'default' });
    expect(mocks.createSession).toHaveBeenCalledWith({ userId: 'user-1', email: 'jane@example.com', role: 'user' });
    expect(event.setCalls.map((c: any) => c.name)).toEqual(['mm_session', 'mm_role']);
  });

  it('derives role="ngo" from prefs when set', async () => {
    mocks.accountGet.mockResolvedValue({ $id: 'user-1', email: 'jane@example.com', prefs: { role: 'ngo' } });
    const res = await POST(makeEvent({ jwt: 'good-jwt' }));
    const body = await res.json();
    expect(body.role).toBe('ngo');
    expect(body.roleSource).toBe('preferences');
  });

  it('team membership overrides prefs when an API key is configured', async () => {
    envState.APPWRITE_API_KEY = 'key';
    mocks.accountGet.mockResolvedValue({ $id: 'user-1', email: 'jane@example.com', prefs: { role: 'volunteer' } });
    mocks.isUserInTeam.mockImplementation(async (_id: string, teamId: string) => teamId === 'ngo-team');

    const res = await POST(makeEvent({ jwt: 'good-jwt' }));
    const body = await res.json();

    expect(body.role).toBe('ngo');
    expect(body.roleSource).toBe('team_membership');
  });

  it('falls back to role=user if the team check throws', async () => {
    envState.APPWRITE_API_KEY = 'key';
    mocks.accountGet.mockResolvedValue({ $id: 'user-1', email: 'jane@example.com', prefs: {} });
    mocks.isUserInTeam.mockRejectedValue(new Error('teams down'));

    const res = await POST(makeEvent({ jwt: 'good-jwt' }));
    expect(res.status).toBe(200);
    expect((await res.json()).role).toBe('user');
  });
});
