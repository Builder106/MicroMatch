import type { PageServerLoad } from './$types';
import { getTasks, getBadgeAnalytics } from '$lib/server/appwrite';

export const load: PageServerLoad = async ({ locals }) => {
  const userRole = (locals as any)?.userRole ?? 'anonymous';
  const session = (locals as any)?.session as { user?: { id?: string; email?: string } } | undefined;
  const user = session?.user?.id ? { id: session.user.id, email: session.user.email } : null;

  if (userRole !== 'ngo') {
    throw new Error('Access denied: NGO access required');
  }

  // Get tasks for analytics context
  const tasks = await getTasks();

  // Get real analytics data from database
  const analytics = await getBadgeAnalytics();

  return {
    userRole,
    user,
    tasks,
    analytics
  };
};
