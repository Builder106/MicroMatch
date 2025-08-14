import { Client, Account } from 'appwrite';

const endpoint = (import.meta as any).env.PUBLIC_APPWRITE_ENDPOINT as string | undefined;
const project = (import.meta as any).env.PUBLIC_APPWRITE_PROJECT_ID as string | undefined;

const client = new Client();
if (endpoint && project) {
  client.setEndpoint(endpoint).setProject(project);
}

export const account = new Account(client);

export async function signInEmail(email: string, password: string) {
  await account.createEmailPasswordSession(email, password);
}

export async function signUpEmail(email: string, password: string, name?: string) {
  // Use email as ID for demo simplicity
  await account.create(email, email, password, name);
  await signInEmail(email, password);
}

export function signInWithGoogle() {
  const success = window.location.origin + '/dashboard';
  const failure = window.location.origin + '/login?error=oauth';
  account.createOAuth2Session('google', success, failure);
}

export async function signOut() {
  try { await account.deleteSessions(); } catch {}
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

