// PROD: Add content moderation queue and background processing
// PROD: Add content moderation caching and result storage
// PROD: Add content moderation analytics and reporting
// Minimal Azure AI Content Safety text moderation helper with safe fallbacks.
import { AZURE_CONTENT_SAFETY_ENDPOINT, AZURE_CONTENT_SAFETY_KEY } from '$env/static/private';

// PROD: Add configurable moderation categories per environment
// PROD: Add custom moderation rules and policies
// PROD: Add moderation severity thresholds
export type ModerationCategory = 'Hate' | 'SelfHarm' | 'Sexual' | 'Violence';

export type ModerationResult = {
  blocked: boolean;
  reasons: Array<{ category: ModerationCategory | string; severity: number }>;
  raw?: unknown;
};

// PROD: Make moderation categories configurable
// PROD: Add category-specific thresholds
// PROD: Add custom category support
const DEFAULT_CATEGORIES: ModerationCategory[] = ['Hate', 'SelfHarm', 'Sexual', 'Violence'];

// PROD: Add content moderation caching
// PROD: Add batch processing for multiple content items
// PROD: Add content moderation retry logic with exponential backoff
export async function moderateText(text: string, categories: ModerationCategory[] = DEFAULT_CATEGORIES): Promise<ModerationResult> {
  const endpoint = AZURE_CONTENT_SAFETY_ENDPOINT;
  const apiKey = AZURE_CONTENT_SAFETY_KEY;

  if (!text || text.trim().length === 0) {
    return { blocked: false, reasons: [] };
  }

  // PROD: Add content moderation service health checks
  // PROD: Add fallback moderation services
  // PROD: Add content moderation circuit breaker
  if (!endpoint || !apiKey) {
    // Fallback: treat as safe when not configured
    return { blocked: false, reasons: [] };
  }

  try {
    const url = `${endpoint.replace(/\/$/, '')}/contentsafety/text:analyze?api-version=2024-09-01`; // tolerate trailing slash
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey
      },
      body: JSON.stringify({
        text,
        categories,
        outputType: 'EightSeverityLevels'
      })
    });

    if (!res.ok) {
      // PROD: Add proper error handling and logging
      // PROD: Add content moderation service monitoring
      // PROD: Add content moderation fallback strategies
      // Graceful fallback on API error
      return { blocked: false, reasons: [] };
    }

    const data: any = await res.json();

    // Normalize categories array (API response shape can vary by version)
    const items: Array<{ category: string; severity: number }> =
      data?.categoriesAnalysis || data?.categories || [];

    const reasons = items
      .filter(Boolean)
      .map((c) => ({ category: String(c.category), severity: Number(c.severity) }))
      .filter((c) => !Number.isNaN(c.severity));

    // PROD: Make moderation thresholds configurable
    // PROD: Add category-specific blocking rules
    // PROD: Add content moderation appeal process
    // Block if any category reaches medium+ severity. Using 8-level scale: >=4 considered concerning.
    const blocked = reasons.some((r) => r.severity >= 4);
    return { blocked, reasons, raw: data };
  } catch {
    // PROD: Add proper error logging and monitoring
    // PROD: Add content moderation service health checks
    // PROD: Add content moderation fallback services
    // Fail-open: do not block content if service fails
    return { blocked: false, reasons: [] };
  }
}

