import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const authFn = (locals as any)?.auth as (() => Promise<any>) | undefined;
    const session = authFn ? await authFn() : undefined;
    const signedIn = Boolean(session?.user?.email);
    return { signedIn };
  } catch {
    return { signedIn: false };
  }
};

