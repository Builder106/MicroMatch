import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const signedIn = Boolean((locals as any)?.session?.user?.email);
    return { signedIn };
  } catch {
    return { signedIn: false };
  }
};

