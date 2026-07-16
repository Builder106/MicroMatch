import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

const { envState } = vi.hoisted(() => ({ envState: {} as Record<string, string | undefined> }));
vi.mock('$env/dynamic/private', () => ({
  env: new Proxy(envState, { get: (_, key: string) => envState[key] })
}));

import { translateText } from './azure';

describe('translateText', () => {
  beforeEach(() => {
    for (const key of Object.keys(envState)) delete envState[key];
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the original text unchanged when Azure Translator env vars are unset', async () => {
    const result = await translateText({ text: 'Hello world', to: 'es' });
    expect(result).toBe('Hello world');
  });

  it('calls the Azure endpoint and returns the translated text when configured', async () => {
    envState.AZURE_TRANSLATOR_ENDPOINT = 'https://translator.example.com';
    envState.AZURE_TRANSLATOR_KEY = 'fake-key';
    envState.AZURE_TRANSLATOR_REGION = 'eastus';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ translations: [{ text: 'Hola mundo' }] }]
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await translateText({ text: 'Hello world unique-1', to: 'es' });

    expect(result).toBe('Hola mundo');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/translate?api-version=3.0&to=es'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Ocp-Apim-Subscription-Key': 'fake-key',
          'Ocp-Apim-Subscription-Region': 'eastus'
        })
      })
    );
  });

  it('caches translations by locale+text so a second call skips the network', async () => {
    envState.AZURE_TRANSLATOR_ENDPOINT = 'https://translator.example.com';
    envState.AZURE_TRANSLATOR_KEY = 'fake-key';
    envState.AZURE_TRANSLATOR_REGION = 'eastus';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ translations: [{ text: 'Bonjour unique-2' }] }]
    });
    vi.stubGlobal('fetch', fetchMock);

    const first = await translateText({ text: 'Hi unique-2', to: 'fr' });
    const second = await translateText({ text: 'Hi unique-2', to: 'fr' });

    expect(first).toBe('Bonjour unique-2');
    expect(second).toBe('Bonjour unique-2');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to the original text when the API responds with a non-ok status', async () => {
    envState.AZURE_TRANSLATOR_ENDPOINT = 'https://translator.example.com';
    envState.AZURE_TRANSLATOR_KEY = 'fake-key';
    envState.AZURE_TRANSLATOR_REGION = 'eastus';

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));

    const result = await translateText({ text: 'Fallback me unique-3', to: 'de' });
    expect(result).toBe('Fallback me unique-3');
  });

  it('falls back to the original text when fetch throws', async () => {
    envState.AZURE_TRANSLATOR_ENDPOINT = 'https://translator.example.com';
    envState.AZURE_TRANSLATOR_KEY = 'fake-key';
    envState.AZURE_TRANSLATOR_REGION = 'eastus';

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const result = await translateText({ text: 'Network error unique-4', to: 'de' });
    expect(result).toBe('Network error unique-4');
  });

  it('falls back to the original text when the response shape is unexpected', async () => {
    envState.AZURE_TRANSLATOR_ENDPOINT = 'https://translator.example.com';
    envState.AZURE_TRANSLATOR_KEY = 'fake-key';
    envState.AZURE_TRANSLATOR_REGION = 'eastus';

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));

    const result = await translateText({ text: 'Weird shape unique-5', to: 'de' });
    expect(result).toBe('Weird shape unique-5');
  });
});
