import { Client, Account, ID, OAuthProvider } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

const client = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export async function signInEmail(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

export async function signUpEmail(
  email: string,
  password: string,
  name?: string,
  role: 'volunteer' | 'ngo' = 'volunteer'
) {
  await account.create(ID.unique(), email, password, name);
  await account.updatePrefs({ role });
}

export function signInWithGoogle() {
  const success = `${window.location.origin}/dashboard`;
  const failure = `${window.location.origin}/login?error=oauth`;
  account.createOAuth2Session(OAuthProvider.Google, success, failure);
}

export async function signOut() {
  try {
    await account.deleteSessions();
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    try { localStorage.removeItem('mm_has_session'); } catch {}
  } catch (err) {
    if (import.meta.env.DEV) console.error('Signout error:', err);
  }
}

export async function getJWT(): Promise<string | null> {
  try {
    const jwt = await account.createJWT();
    return jwt?.jwt ?? null;
  } catch {
    return null;
  }
}

export async function authHeader(): Promise<Record<string, string>> {
  const jwt = await getJWT();
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}