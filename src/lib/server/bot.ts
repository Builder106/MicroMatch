// Minimal Azure Bot Service Direct Line token generator
import { AZURE_BOT_DIRECT_LINE_SECRET } from '$env/static/private';

export async function createDirectLineToken(userId?: string): Promise<{ token?: string; error?: string }>
{
  const secret = AZURE_BOT_DIRECT_LINE_SECRET;
  if (!secret) {
    return { error: 'Direct Line secret not configured' };
  }

  try {
    const res = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: userId ? { id: userId } : undefined })
    });
    if (!res.ok) {
      return { error: `Failed to get token: ${res.status}` };
    }
    const data = await res.json();
    return { token: data?.token };
  } catch (e) {
    return { error: 'Failed to get token' };
  }
}

