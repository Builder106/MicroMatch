// Automatic badge awarding system
// Integrates with task completion and user activity

import { awardBadge } from './appwrite';
import { evaluateBadgeCriteria, checkMilestoneCriteria, type BadgeCriteria } from './badgeCriteria';

export async function processBadgeAwards(
  userId: string,
  action: {
    type: 'task-completed' | 'task-claimed' | 'profile-updated';
    taskId?: string;
    taskTimeMinutes?: number;
    completedAt?: string;
  }
): Promise<string[]> {
  const awardedBadges: string[] = [];

  try {
    // Evaluate immediate criteria based on the action
    const immediateCriteria = await evaluateBadgeCriteria(userId, action);

    for (const criteria of immediateCriteria) {
      const badgeId = await awardBadgeForCriteria(userId, criteria, action);
      if (badgeId) {
        awardedBadges.push(badgeId);
      }
    }

    // Check milestone criteria (run less frequently, e.g., daily)
    if (action.type === 'task-completed' && Math.random() < 0.1) { // 10% chance to check milestones
      const milestoneCriteria = await checkMilestoneCriteria(userId);

      for (const criteria of milestoneCriteria) {
        const badgeId = await awardBadgeForCriteria(userId, criteria, action);
        if (badgeId) {
          awardedBadges.push(badgeId);
        }
      }
    }

  } catch (error) {
    console.error('Error processing badge awards:', error);
  }

  return awardedBadges;
}

async function awardBadgeForCriteria(
  userId: string,
  criteria: BadgeCriteria,
  action: any
): Promise<string | null> {
  try {
    // Check if user already has this badge (in real implementation)
    // const existingBadges = await listBadgesByUser(userId);
    // const alreadyHasBadge = existingBadges.some(b => b.label === criteria.badgeTemplate.label);
    // if (alreadyHasBadge) return null;

    // For demo purposes, we'll create the badge
    const badge = await awardBadge({
      userId,
      taskId: action.taskId,
      label: criteria.badgeTemplate.label,
      color: criteria.badgeTemplate.color
    });

    console.log(`Awarded badge "${criteria.badgeTemplate.label}" to user ${userId}`);
    return badge.id;

  } catch (error) {
    console.error(`Failed to award badge "${criteria.badgeTemplate.label}":`, error);
    return null;
  }
}

// Helper function to trigger badge checks after task completion
export async function onTaskCompleted(
  userId: string,
  taskId: string,
  completionTimeMinutes: number
): Promise<string[]> {
  return processBadgeAwards(userId, {
    type: 'task-completed',
    taskId,
    taskTimeMinutes: completionTimeMinutes,
    completedAt: new Date().toISOString()
  });
}
