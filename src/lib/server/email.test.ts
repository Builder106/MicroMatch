import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the SvelteKit private-env virtual module BEFORE importing the SUT.
// vi.hoisted() lifts the state alongside the vi.mock factory so they share scope.
const { envState } = vi.hoisted(() => ({ envState: {} as Record<string, string | undefined> }));
vi.mock('$env/dynamic/private', () => ({
  env: new Proxy(envState, { get: (_, key: string) => envState[key] })
}));

// Now import after mock.
import { sendVerificationApproved, sendVerificationRejected } from './email';

function setEnv(values: Record<string, string | undefined>) {
  for (const k of Object.keys(envState)) delete envState[k];
  Object.assign(envState, values);
}

describe('email module (Mailgun)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setEnv({});
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('returns an error when Mailgun is not configured (dev mode no-op)', async () => {
    setEnv({ NODE_ENV: 'development' });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = await sendVerificationApproved({ to: 'jane@example.com', orgName: 'Example' });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Mailgun not configured/);
    expect(logSpy).toHaveBeenCalled(); // dev-mode debug log fired
  });

  it('hits the US Mailgun endpoint by default and uses Basic auth', async () => {
    setEnv({
      MAILGUN_API_KEY: 'key-test',
      MAILGUN_DOMAIN: 'mg.example.com',
      MAILGUN_FROM_EMAIL: 'MicroMatch <noreply@mg.example.com>'
    });
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'mailgun-msg-id' }),
      text: async () => ''
    } as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    const result = await sendVerificationApproved({ to: 'jane@example.com', orgName: 'Doctors Without Borders' });

    expect(result.ok).toBe(true);
    expect(result.id).toBe('mailgun-msg-id');
    expect(fetchSpy).toHaveBeenCalledOnce();

    const call = fetchSpy.mock.calls[0]!;
    const url = call[0];
    const init = call[1] as RequestInit;
    expect(url).toBe('https://api.mailgun.net/v3/mg.example.com/messages');
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toMatch(/^Basic /);
    // base64("api:key-test") should be in the auth header
    const decoded = Buffer.from(headers.Authorization.replace('Basic ', ''), 'base64').toString();
    expect(decoded).toBe('api:key-test');
  });

  it('hits the EU endpoint when MAILGUN_REGION=eu', async () => {
    setEnv({
      MAILGUN_API_KEY: 'k',
      MAILGUN_DOMAIN: 'mg.example.com',
      MAILGUN_FROM_EMAIL: 'a <a@b>',
      MAILGUN_REGION: 'eu'
    });
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, status: 200, json: async () => ({}), text: async () => '' } as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    await sendVerificationRejected({ to: 'x@y', orgName: 'Org', reason: 'docs unclear' });

    const url = fetchSpy.mock.calls[0]![0];
    expect(url).toBe('https://api.eu.mailgun.net/v3/mg.example.com/messages');
  });

  it('includes html and text body fields in the form payload', async () => {
    setEnv({ MAILGUN_API_KEY: 'k', MAILGUN_DOMAIN: 'd', MAILGUN_FROM_EMAIL: 'a <a@b>' });
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, status: 200, json: async () => ({}), text: async () => '' } as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    await sendVerificationApproved({ to: 'jane@example.com', orgName: 'Example Org' });

    const body = (fetchSpy.mock.calls[0]![1] as RequestInit).body as URLSearchParams;
    expect(body).toBeInstanceOf(URLSearchParams);
    expect(body.get('to')).toBe('jane@example.com');
    expect(body.get('subject')).toBe("Your NGO is verified");
    expect(body.get('html')).toMatch(/Example Org/);
    expect(body.get('text')).toMatch(/Example Org/);
  });

  it('escapes HTML in the org name to prevent template injection', async () => {
    setEnv({ MAILGUN_API_KEY: 'k', MAILGUN_DOMAIN: 'd', MAILGUN_FROM_EMAIL: 'a <a@b>' });
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, status: 200, json: async () => ({}), text: async () => '' } as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    const malicious = '<script>alert(1)</script>';
    await sendVerificationApproved({ to: 'a@b', orgName: malicious });

    const body = (fetchSpy.mock.calls[0]![1] as RequestInit).body as URLSearchParams;
    expect(body.get('html')).not.toContain('<script>');
    expect(body.get('html')).toContain('&lt;script&gt;');
  });

  it('escapes HTML in the rejection reason', async () => {
    setEnv({ MAILGUN_API_KEY: 'k', MAILGUN_DOMAIN: 'd', MAILGUN_FROM_EMAIL: 'a <a@b>' });
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, status: 200, json: async () => ({}), text: async () => '' } as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    await sendVerificationRejected({ to: 'a@b', orgName: 'Org', reason: '<img src=x onerror=alert(1)>' });

    const body = (fetchSpy.mock.calls[0]![1] as RequestInit).body as URLSearchParams;
    expect(body.get('html')).not.toContain('<img');
    expect(body.get('html')).toContain('&lt;img');
  });

  it('returns an error with status code when Mailgun rejects the request', async () => {
    setEnv({ MAILGUN_API_KEY: 'k', MAILGUN_DOMAIN: 'd', MAILGUN_FROM_EMAIL: 'a <a@b>' });
    const fetchSpy = vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({}),
      text: async () => 'Forbidden'
    }) as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    const result = await sendVerificationApproved({ to: 'a@b', orgName: 'Org' });

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Mailgun 401/);
  });

  it('catches network errors and surfaces them', async () => {
    setEnv({ MAILGUN_API_KEY: 'k', MAILGUN_DOMAIN: 'd', MAILGUN_FROM_EMAIL: 'a <a@b>' });
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('socket hangup'); }));

    const result = await sendVerificationApproved({ to: 'a@b', orgName: 'Org' });
    expect(result.ok).toBe(false);
    expect(result.error).toBe('socket hangup');
  });
});
