import type { PageServerLoad } from './$types';
import { getTasks, getBadges } from '$lib/server/appwrite';
import type { Badge } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
  const userRole = (locals as any)?.userRole ?? 'anonymous';
  const session = (locals as any)?.session as { user?: { id?: string; email?: string } } | undefined;
  const user = session?.user?.id ? { id: session.user.id, email: session.user.email } : null;

  if (userRole !== 'ngo') {
    throw new Error('Access denied: NGO access required');
  }

  // Get tasks for badge creation context
  const tasks = await getTasks();

  // Fetch badges from Appwrite database
  const badges = await getBadges();

  return {
    userRole,
    user,
    tasks,
    badges
  };
};
