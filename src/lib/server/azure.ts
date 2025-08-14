// Minimal Azure Translator helper with in-memory cache and safe fallbacks.

type TranslateParams = {
  text: string;
  to: string; // target locale, e.g., 'es'
};

const cache = new Map<string, string>();

export async function translateText({ text, to }: TranslateParams): Promise<string> {
  const key = `${to}::${text}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
  const apiKey = process.env.AZURE_TRANSLATOR_KEY;
  const region = process.env.AZURE_TRANSLATOR_REGION;

  if (!endpoint || !apiKey || !region) {
    // Fallback: return original text when not configured
    cache.set(key, text);
    return text;
  }

  try {
    const res = await fetch(`${endpoint}/translate?api-version=3.0&to=${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey,
        'Ocp-Apim-Subscription-Region': region
      },
      body: JSON.stringify([{ Text: text }])
    });

    if (!res.ok) throw new Error(`Translate failed: ${res.status}`);
    const data = await res.json();
    const translated = data?.[0]?.translations?.[0]?.text ?? text;
    cache.set(key, translated);
    return translated;
  } catch {
    // Graceful fallback
    cache.set(key, text);
    return text;
  }
}

