import { env } from '$env/dynamic/private';
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
      .setEndpoint(env.APPWRITE_ENDPOINT!)
      .setProject(env.APPWRITE_PROJECT_ID!)
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
  // Prefer locals set by our session
  try {
    const localsRole = (event.locals as any)?.userRole as UserRole | undefined;
    if (localsRole && localsRole !== 'anonymous') return localsRole;
  } catch {}

  // Try Appwrite JWT first
  const jwt = parseBearer(event);
  if (jwt && env.APPWRITE_ENDPOINT && env.APPWRITE_PROJECT_ID) {
    const user = await getUserFromJWT(jwt);
    if (user) {
      // Check team memberships first if configured
      try {
        const { NGO_TEAM_ID, VOLUNTEER_TEAM_ID, isUserInTeam } = await import('./teams');
        const userId: string | undefined = user.$id ?? user.id;
        if (userId) {
          if (await isUserInTeam(userId, (NGO_TEAM_ID as any))) return 'ngo';
          if (await isUserInTeam(userId, (VOLUNTEER_TEAM_ID as any))) return 'volunteer';
        }
      } catch {}
      // Fallback to prefs.role
      return roleFromUser(user);
    }
  }

  // Fallback to temporary shared tokens
  const token = jwt ?? '';
  const ngoToken = env.NGO_API_TOKEN ?? '';
  const userToken = env.USER_API_TOKEN ?? '';
  if (ngoToken && token === ngoToken) return 'ngo';
  if (userToken && token === userToken) return 'user';
  return 'anonymous';
}

