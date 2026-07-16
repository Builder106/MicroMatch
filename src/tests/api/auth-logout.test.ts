import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mocks } = vi.hoisted(() => ({ mocks: { deleteSession: vi.fn() } }));
vi.mock('$lib/server/session', () => ({ deleteSession: mocks.deleteSession }));
vi.mock('$env/dynamic/private', () => ({ env: {} }));

import { POST } from '../../routes/api/auth/logout/+server';

function makeEvent(opts: { sessionCookie?: string; protocol?: string } = {}) {
  const cookies = new Map<string, string>();
  if (opts.sessionCookie) cookies.set('mm_session', opts.sessionCookie);
  const setCalls: Array<{ name: string; value: string; opts: any }> = [];
  return {
    cookies: {
      get: (name: string) => cookies.get(name),
      set: (name: string, value: string, opts: any) => setCalls.push({ name, value, opts })
    },
    url: new URL(`${opts.protocol ?? 'https:'}//test/api/auth/logout`),
    setCalls
  } as any;
}

describe('POST /api/auth/logout', () => {
  beforeEach(() => mocks.deleteSession.mockReset());

  it('deletes the session referenced by the mm_session cookie', async () => {
    const event = makeEvent({ sessionCookie: 'sess-1' });
    await POST(event);
    expect(mocks.deleteSession).toHaveBeenCalledWith('sess-1');
  });

  it('is a no-op on deleteSession when there is no session cookie', async () => {
    const event = makeEvent();
    await POST(event);
    expect(mocks.deleteSession).not.toHaveBeenCalled();
  });

  it('clears both mm_session and mm_role cookies', async () => {
    const event = makeEvent({ sessionCookie: 'sess-1' });
    await POST(event);

    const names = event.setCalls.map((c: any) => c.name);
    expect(names).toEqual(['mm_session', 'mm_role']);
    expect(event.setCalls.every((c: any) => c.value === '' && c.opts.maxAge === 0)).toBe(true);
  });

  it('returns { ok: true }', async () => {
    const res = await POST(makeEvent());
    expect(await res.json()).toEqual({ ok: true });
  });
});
