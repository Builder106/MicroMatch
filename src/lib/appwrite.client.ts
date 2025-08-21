import { Client, Account, ID, OAuthProvider, Storage } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { env as PUBLIC_ENV } from '$env/dynamic/public';

const client = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const storage = new Storage(client);

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

export async function createRecovery(email: string, url: string): Promise<void> {
  await account.createRecovery(email, url);
}

export async function updateRecovery(userId: string, secret: string, passwordA: string, passwordB: string): Promise<void> {
  await account.updateRecovery(userId, secret, passwordA, passwordB);
}

export function signInWithGoogle() {
  const success = `${window.location.origin}/profile`;
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

export async function refreshSessionCookie(): Promise<void> {
  try {
    const jwt = await getJWT();
    if (!jwt) return;
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ jwt })
    });
  } catch {}
}

export async function assignTeamForCurrentRole(): Promise<void> {
  try {
    const headers = await authHeader();
    if (!headers.Authorization) return;
    await fetch('/api/teams/assign', { method: 'POST', headers });
  } catch {}
}

export async function uploadAvatar(file: File): Promise<{ fileId: string; url: string }> {
  // Upload via our server endpoint to apply secure permissions
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/profile/avatar', { method: 'POST', body: form, credentials: 'include' });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error || 'Upload failed');
  }
  const data = await res.json();
  return { fileId: data.fileId, url: data.url };
}

export function getAvatarUrl(fileId: string, size = 128): string {
  try {
    const bucketId = PUBLIC_ENV.PUBLIC_APPWRITE_AVATARS_BUCKET_ID;
    if (!bucketId) return '';
    const url = storage.getFilePreview(bucketId, fileId, size, size);
    return String(url);
  } catch {
    return '';
  }
}