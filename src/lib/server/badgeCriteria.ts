// Badge criteria system for automatic badge awarding
// Based on gamification systems like PatronBadge and Orgo

export type BadgeCriteria = {
  id: string;
  type: 'task-completion' | 'task-specific' | 'time-based' | 'milestone' | 'custom';
  conditions: {
    // For task-completion
    anyTask?: boolean;
    minTimeMinutes?: number;
    maxTimeMinutes?: number;

    // For task-specific
    taskIds?: string[];

    // For time-based
    afterHours?: number;
    beforeHours?: number;

    // For milestone
    taskCount?: number;
    withinDays?: number;

    // For custom
    customLogic?: string;
  };
  badgeTemplate: {
    label: string;
    color: string;
    description: string;
  };
};

export const defaultBadgeCriteria: BadgeCriteria[] = [
  {
    id: 'first-contribution',
    type: 'milestone',
    conditions: {
      taskCount: 1,
      withinDays: 365 // Any time
    },
    badgeTemplate: {
      label: 'First Contribution',
      color: '#10b981',
      description: 'Awarded for completing your first task'
    }
  },
  {
    id: 'quick-responder',
    type: 'task-completion',
    conditions: {
      anyTask: true,
      maxTimeMinutes: 15
    },
    badgeTemplate: {
      label: 'Quick Responder',
      color: '#3b82f6',
      description: 'Awarded for completing tasks under 15 minutes'
    }
  },
  {
    id: 'dedicated-volunteer',
    type: 'milestone',
    conditions: {
      taskCount: 5,
      withinDays: 30
    },
    badgeTemplate: {
      label: 'Dedicated Volunteer',
      color: '#f59e0b',
      description: 'Awarded for completing 5+ tasks in a month'
    }
  },
  {
    id: 'task-master',
    type: 'milestone',
    conditions: {
      taskCount: 10,
      withinDays: 90
    },
    badgeTemplate: {
      label: 'Task Master',
      color: '#16a34a',
      description: 'Awarded for completing 10+ tasks in 3 months'
    }
  }
];

export async function evaluateBadgeCriteria(
  userId: string,
  action: {
    type: 'task-completed' | 'task-claimed' | 'profile-updated';
    taskId?: string;
    taskTimeMinutes?: number;
    completedAt?: string;
  }
): Promise<BadgeCriteria[]> {
  // This would normally check the database for user's history
  // For demo purposes, return some criteria that match
  const matchingCriteria: BadgeCriteria[] = [];

  if (action.type === 'task-completed') {
    // Quick responder check
    if (action.taskTimeMinutes && action.taskTimeMinutes <= 15) {
      matchingCriteria.push(defaultBadgeCriteria[1]); // Quick responder
    }

    // Task completion badge
    matchingCriteria.push({
      id: 'task-completion-' + action.taskId,
      type: 'task-completion',
      conditions: { anyTask: true },
      badgeTemplate: {
        label: 'Task Completed',
        color: '#16a34a',
        description: 'Awarded for completing a task'
      }
    });
  }

  return matchingCriteria;
}

export async function checkMilestoneCriteria(userId: string): Promise<BadgeCriteria[]> {
  // This would check user's overall stats from database
  // For demo, return milestone criteria
  return [defaultBadgeCriteria[0], defaultBadgeCriteria[2], defaultBadgeCriteria[3]];
}
