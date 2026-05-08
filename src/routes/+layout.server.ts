import type { LayoutServerLoad } from './$types';
import { isUserAdmin } from '$lib/server/teams';

export const load: LayoutServerLoad = async ({ locals }) => {
  const userRole = (locals as any).userRole ?? 'anonymous';
  const session = (locals as any)?.session as { user?: { id?: string } } | undefined;
  const userId = session?.user?.id;
  const isAdmin = userId ? await isUserAdmin(userId) : false;
  return { userRole, isAdmin };
};

