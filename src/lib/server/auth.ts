import type { RequestEvent } from '@sveltejs/kit';

export type UserRole = 'anonymous' | 'user' | 'ngo' | 'volunteer';

function parseBearer(event: RequestEvent): string | null {
  const authHeader = event.request.headers.get('authorization') ?? '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  return authHeader.slice(7).trim() || null;
}

async function getUserFromJWT(jwt: string): Promise<any | null> {
  try {
    const { Client, Account } = await import('node-appwrite');
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setJWT(jwt);
    const account = new Account(client);
    return await account.get();
  } catch {
    return null;
  }
}

function roleFromUser(user: any): UserRole {
  const prefs = (user?.prefs ?? {}) as Record<string, unknown>;
  const role = typeof prefs.role === 'string' ? prefs.role : '';
  if (role === 'ngo') return 'ngo';
  if (role === 'volunteer') return 'volunteer';
  return 'user';
}

/**
 * Preferred: Appwrite JWT in Authorization header → derive role from user.prefs.role
 * Fallback (MVP): NGO_API_TOKEN / USER_API_TOKEN shared secrets.
 */
export async function getUserRole(event: RequestEvent): Promise<UserRole> {
  // Try Auth.js session via locals.auth()
  try {
    const authFn = (event.locals as any)?.auth as (() => Promise<any>) | undefined;
    const session = authFn ? await authFn() : undefined;
    const sessionEmail = session?.user?.email as string | undefined;
    if (sessionEmail) {
      const ngoList = (process.env.NGO_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
      if (ngoList.includes(sessionEmail.toLowerCase())) return 'ngo';
      return 'user';
    }
  } catch {}

  // Try Appwrite JWT first
  const jwt = parseBearer(event);
  if (jwt && process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID) {
    const user = await getUserFromJWT(jwt);
    if (user) return roleFromUser(user);
  }

  // Fallback to temporary shared tokens
  const token = jwt ?? '';
  const ngoToken = process.env.NGO_API_TOKEN ?? '';
  const userToken = process.env.USER_API_TOKEN ?? '';
  if (ngoToken && token === ngoToken) return 'ngo';
  if (userToken && token === userToken) return 'user';
  return 'anonymous';
}

