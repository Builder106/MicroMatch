import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: {} }));

import { load, actions } from '../../routes/profile/+page.server';

function makeLoadEvent(opts: { userRole?: string; userId?: string } = {}) {
  return {
    locals: {
      userRole: opts.userRole ?? 'anonymous',
      session: opts.userId ? { user: { id: opts.userId, email: 'jane@example.com' } } : undefined
    }
  } as any;
}

describe('/profile load', () => {
  it('passes through userRole/user from locals, with user:null when signed out', async () => {
    const result = await load(makeLoadEvent());
    expect(result).toEqual({ userRole: 'anonymous', user: null });
  });

  it('returns the session user when signed in', async () => {
    const result = await load(makeLoadEvent({ userRole: 'ngo', userId: 'org-1' }));
    expect(result).toEqual({ userRole: 'ngo', user: { id: 'org-1', email: 'jane@example.com' } });
  });
});

function makeActionEvent(opts: { userId?: string; fields?: Record<string, string> }) {
  const form = new FormData();
  for (const [k, v] of Object.entries(opts.fields ?? {})) form.set(k, v);
  return {
    request: { formData: async () => form },
    locals: { session: opts.userId ? { user: { id: opts.userId, email: 'jane@example.com' } } : undefined },
    fetch: vi.fn()
  } as any;
}

describe('/profile action (update)', () => {
  it('fails with 401 when there is no session', async () => {
    const result: any = await actions.default(makeActionEvent({}));
    expect(result.status).toBe(401);
  });

  it('acknowledges the update with the trimmed field values', async () => {
    const result: any = await actions.default(makeActionEvent({
      userId: 'user-1',
      fields: { displayName: '  Jane  ', role: 'ngo', bio: 'Hello', orgName: 'Acme' }
    }));

    expect(result).toEqual({ ok: true, role: 'ngo', displayName: 'Jane', bio: 'Hello', orgName: 'Acme' });
  });
});
