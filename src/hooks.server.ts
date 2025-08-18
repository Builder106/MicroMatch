import { building } from '$app/environment';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '$env/static/private';
import { getUserRole } from '$lib/server/auth';
import { getSession } from '$lib/server/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Demo-only: Needed to make Appwrite SDK work in SvelteKit SSR.
  // In a real app, you should use the server-side SDKs instead.
  // See https://github.com/appwrite/appwrite/discussions/5435
  if (building && !globalThis.atob) {
    globalThis.atob = (str) => Buffer.from(str, 'base64').toString('binary');
    globalThis.sessionStorage = new Map<any, any>() as any;
  }

  // Set Appwrite context from server-side variables
  event.locals.appwrite = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID
  };

  // Prefer HttpOnly session cookie if present
  const sessionId = event.cookies.get('mm_session');
  if (sessionId) {
    const s = getSession(sessionId);
    if (s) {
      event.locals.userRole = s.role;
      event.locals.session = { user: { id: s.userId, email: s.email } } as any;
    } else {
      event.locals.userRole = await getUserRole(event);
    }
  } else {
    event.locals.userRole = await getUserRole(event);
  }
  return await resolve(event);
};

