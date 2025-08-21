import type { PageServerLoad } from './$types';
import { getTasks, getClaims } from '$lib/server/appwrite';

export const load: PageServerLoad = async ({ locals }) => {
  const userRole = (locals as any)?.userRole ?? 'anonymous';
  const session = (locals as any)?.session as { user?: { id?: string; email?: string } } | undefined;
  const user = session?.user?.id ? { id: session.user.id, email: session.user.email } : null;

  if (userRole === 'ngo' && user) {
    // For NGOs, include inactive tasks for management
    const allTasks = await getTasks({ orgId: user.id, includeInactive: true });
    const myTasks = allTasks.filter(t => t.orgId === user.id);
    
    // Get claims for this NGO's tasks
    const allClaims = await getClaims();
    const myTaskIds = myTasks.map(t => t.id);
    const myTaskClaims = allClaims.filter(c => myTaskIds.includes(c.taskId));
    
    const pendingReviews = myTaskClaims.filter(c => c.status === 'pending');
    const approvedClaims = myTaskClaims.filter(c => c.status === 'approved');
    
    // Calculate total hours contributed
    const totalHours = approvedClaims.reduce((total, claim) => {
      const task = myTasks.find(t => t.id === claim.taskId);
      return total + (task?.estimatedMinutes || 30) / 60;
    }, 0);

    return {
      signedIn: true,
      userRole,
      user,
      userData: {
        myTasks,
        pendingReviews,
        totalTasks: myTasks.length,
        pendingReviewsCount: pendingReviews.length,
        approvedClaimsCount: approvedClaims.length,
        totalHours: Math.round(totalHours * 10) / 10,
        myClaims: myTaskClaims
      }
    };
  } else if (userRole === 'volunteer' && user) {
    // For volunteers, only show active tasks
    const allTasks = await getTasks();
    const allClaims = await (getClaims as any)({ userId: user.id });
    const myClaims = allClaims.filter(c => c.userId === user.id);
    const approvedClaims = myClaims.filter(c => c.status === 'approved');
    
    // Calculate total hours contributed
    const totalHours = approvedClaims.reduce((total, claim) => {
      const task = allTasks.find(t => t.id === claim.taskId);
      return total + (task?.estimatedMinutes || 30) / 60;
    }, 0);

    return {
      signedIn: true,
      userRole,
      user,
      userData: {
        myClaims,
        approvedClaimsCount: approvedClaims.length,
        totalHours: Math.round(totalHours * 10) / 10
      }
    };
  }

  return {
    signedIn: false,
    userRole,
    user: null,
    userData: null
  };
};

