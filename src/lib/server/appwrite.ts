// src/lib/server/appwrite.ts
// PROD: Replace with proper database connection pooling and connection management
// PROD: Add comprehensive error handling with structured logging (e.g., Winston, Pino)
// PROD: Implement database migrations system for schema changes
// PROD: Add database connection retry logic and circuit breakers
import { env } from '$env/dynamic/private';
import type { Task, Claim, Badge } from '$lib/types';

// PROD: Use environment-specific configuration management (e.g., dotenv, config)
// PROD: Add validation for required environment variables on startup
const useAppwrite =
  !!env.APPWRITE_ENDPOINT &&
  !!env.APPWRITE_PROJECT_ID &&
  !!env.APPWRITE_API_KEY &&
  !!env.APPWRITE_DB_ID &&
  !!env.APPWRITE_TASKS_COL_ID &&
  !!env.APPWRITE_CLAIMS_COL_ID &&
  !!env.APPWRITE_BADGES_COL_ID;

// PROD: Replace with Redis or distributed cache for better performance
// PROD: Add cache invalidation strategies and TTL management
// PROD: Implement cache warming for frequently accessed data
const inMemory = {
  tasks: new Map<string, Task>(),
  claims: new Map<string, Claim>(),
  badges: new Map<string, Badge>()
};

// PROD: Add connection pooling and connection lifecycle management
// PROD: Implement proper error handling with exponential backoff
// PROD: Add metrics and monitoring for database operations
async function withAppwrite<T>(fn: (ctx: {
  databases: import('node-appwrite').Databases,
  dbId: string,
  tasksCol: string,
  claimsCol: string,
  badgesCol: string,
  ID: typeof import('node-appwrite').ID,
  Query: typeof import('node-appwrite').Query
}) => Promise<T>): Promise<T> {
  const { Client, Databases, ID, Query } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT!)
    .setProject(env.APPWRITE_PROJECT_ID!)
    .setKey(env.APPWRITE_API_KEY!);
  const databases = new Databases(client);
  return fn({
    databases,
    dbId: env.APPWRITE_DB_ID!,
    tasksCol: env.APPWRITE_TASKS_COL_ID!,
    claimsCol: env.APPWRITE_CLAIMS_COL_ID!,
    badgesCol: env.APPWRITE_BADGES_COL_ID!,
    ID,
    Query
  });
}

// PROD: Add pagination support with cursor-based pagination
// PROD: Implement proper filtering and sorting capabilities
// PROD: Add caching layer for frequently accessed task lists
// PROD: Implement rate limiting for API endpoints
export async function getTasks(filters?: { orgId?: string; includeInactive?: boolean }): Promise<Task[]> {
  if (!useAppwrite) {
    let tasks = Array.from(inMemory.tasks.values());
    if (filters?.orgId) {
      tasks = tasks.filter(t => t.orgId === filters.orgId);
    }
    // Apply feed filtering unless explicitly including inactive tasks
    if (!filters?.includeInactive) {
      tasks = await filterTasksForFeed(tasks);
    }
    return tasks;
  }
  return withAppwrite(async ({ databases, dbId, tasksCol, Query }) => {
    const queries = [Query.limit(100)];
    if (filters?.orgId) {
      queries.push(Query.equal('orgID', filters.orgId));
    }
    
    // Only show active tasks in public feed unless explicitly including inactive
    if (!filters?.includeInactive) {
      queries.push(Query.equal('status', 'active'));
      // Removed deadline filter - tasks without deadlines should still show
      // Removed isVerified filter - unverified tasks should still show
    }
    
    const res = await databases.listDocuments(dbId, tasksCol, queries);
    let tasks: Task[] = res.documents.map((d: any) => ({
      id: d.$id,
      orgId: d.orgID, // Map database orgID to code orgId
      title: d.title,
      shortDescription: d.shortDescription,
      description: d.description,
      language: d.language,
      tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []), // adjust if JSON
      estimatedMinutes: d.estimatedMinutes,
      createdAt: d.$createdAt,
      status: d.status || 'active',
      maxVolunteers: d.maxVolunteers,
      deadline: d.deadline,
      isVerified: d.isVerified ?? true,
      lastActivityAt: d.lastActivityAt
    }));
    
    // Apply additional filtering for volunteer limits and auto-archive
    if (!filters?.includeInactive) {
      tasks = await filterTasksForFeed(tasks);
    }
    
    return tasks;
  });
}

// PROD: Add proper error handling and logging
// PROD: Implement caching for frequently accessed tasks
export async function getTaskById(id: string): Promise<Task | undefined> {
  if (!useAppwrite) return inMemory.tasks.get(id);
  return withAppwrite(async ({ databases, dbId, tasksCol }) => {
    try {
      const d: any = await databases.getDocument(dbId, tasksCol, id);
      return {
        id: d.$id,
        orgId: d.orgID, // Map database orgID to code orgId
        title: d.title,
        shortDescription: d.shortDescription,
        description: d.description,
        language: d.language,
        tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []),
        estimatedMinutes: d.estimatedMinutes,
        createdAt: d.$createdAt,
        status: d.status || 'active',
        maxVolunteers: d.maxVolunteers,
        deadline: d.deadline,
        isVerified: d.isVerified ?? true,
        lastActivityAt: d.lastActivityAt
      };
    } catch {
      return undefined;
    }
  });
}

// PROD: Add database indexes for performance optimization
// PROD: Implement proper error handling and logging
// PROD: Add metrics for volunteer limit checks
async function hasReachedVolunteerLimit(taskId: string): Promise<boolean> {
  if (!useAppwrite) return false; // In-memory fallback doesn't track this yet
  
  return withAppwrite(async ({ databases, dbId, claimsCol, Query }) => {
    try {
      const claims = await databases.listDocuments(dbId, claimsCol, [
        Query.equal('taskID', taskId),
        Query.equal('status', 'approved'),
        Query.limit(1000) // Reasonable limit for checking
      ]);
      return claims.total >= 1000; // If we hit the limit, assume it's full
    } catch {
      return false; // Fail open - don't block tasks if we can't check
    }
  });
}

// PROD: Move this logic to a background job/cron for better performance
// PROD: Add caching for filtered results
// PROD: Implement proper error handling and retry logic
async function filterTasksForFeed(tasks: Task[]): Promise<Task[]> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const filteredTasks: Task[] = [];
  
  for (const task of tasks) {
    // Skip tasks that are not active
    if (task.status !== 'active') continue;
    
    // Skip tasks past their deadline (only if they have a deadline)
    if (task.deadline && new Date(task.deadline) <= now) continue;
    
    // Skip tasks from unverified NGOs (only if explicitly set to false)
    if (task.isVerified === false) continue;
    
    // Skip tasks that haven't had activity in 30+ days (auto-archive)
    // Only apply this if the task has a lastActivityAt timestamp
    if (task.lastActivityAt && new Date(task.lastActivityAt) < thirtyDaysAgo) continue;
    
    // Skip tasks that have reached their volunteer limit
    if (task.maxVolunteers) {
      const hasReachedLimit = await hasReachedVolunteerLimit(task.id);
      if (hasReachedLimit) continue;
    }
    
    filteredTasks.push(task);
  }
  
  return filteredTasks;
}

// PROD: Add input validation and sanitization
// PROD: Implement proper error handling with user-friendly messages
// PROD: Add audit logging for all database operations
export async function createTask(input: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  if (!useAppwrite) {
    const id = String(Date.now());
    const created: Task = { 
      ...input, 
      id, 
      createdAt: new Date().toISOString(),
      status: input.status || 'active',
      isVerified: input.isVerified ?? true
    };
    inMemory.tasks.set(id, created);
    return created;
  }
  return withAppwrite(async ({ databases, dbId, tasksCol, ID }) => {
    const now = new Date().toISOString();
    const payload: any = {
      title: input.title,
      shortDescription: input.shortDescription,
      description: input.description ?? '',
      language: input.language ?? 'English',
      estimatedMinutes: input.estimatedMinutes ?? null,
      tags: Array.isArray(input.tags) ? input.tags : [],
      createdAt: now,
      status: input.status || 'active',
      maxVolunteers: input.maxVolunteers ?? null,
      deadline: input.deadline ?? null,
      isVerified: input.isVerified ?? true,
      lastActivityAt: input.lastActivityAt ?? now
    };
    // Only add orgID if it exists (note: database uses orgID not orgId)
    if (input.orgId) {
      payload.orgID = input.orgId;
    }
    const d: any = await databases.createDocument(dbId, tasksCol, ID.unique(), payload);
    return {
      id: d.$id,
      orgId: d.orgID, // Map database orgID to code orgId
      title: d.title,
      shortDescription: d.shortDescription,
      description: d.description,
      language: d.language,
      tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []),
      estimatedMinutes: d.estimatedMinutes,
      createdAt: d.$createdAt,
      status: d.status || 'active',
      maxVolunteers: d.maxVolunteers,
      deadline: d.deadline,
      isVerified: d.isVerified ?? true,
      lastActivityAt: d.lastActivityAt
    };
  });
}

// PROD: Add transaction support for claim creation
// PROD: Implement duplicate claim prevention
// PROD: Add notification system for claim submissions
export async function createClaim(input: Omit<Claim, 'id' | 'status' | 'createdAt'> & { status?: Claim['status'] }): Promise<Claim> {
  if (!useAppwrite) {
    const id = String(Date.now());
    const created: Claim = { id, status: input.status ?? 'pending', createdAt: new Date().toISOString(), ...input };
    inMemory.claims.set(id, created);
    return created;
  }
  return withAppwrite(async ({ databases, dbId, claimsCol, ID }) => {
    const now = new Date().toISOString();
    const payload: any = {
      taskID: input.taskId, // Map taskId to database taskID
      status: input.status ?? 'pending',
      reviewedAt: now // Database requires this field, use current time as default
    };
    
    // Only add optional fields if they have values
    if (input.userId) payload.userID = input.userId; // Map userId to database userID
    if (input.notes) payload.notes = input.notes;
    if (input.proofUrl) payload.proofURL = input.proofUrl; // Map proofUrl to database proofURL
    
    const d: any = await databases.createDocument(dbId, claimsCol, ID.unique(), payload);
    return {
      id: d.$id,
      taskId: d.taskID, // Map database taskID to code taskId
      userId: d.userID ?? undefined, // Map database userID to code userId
      notes: d.notes ?? undefined,
      proofUrl: d.proofURL ?? undefined, // Map database proofURL to code proofUrl
      status: d.status,
      reviewedBy: d.reviewedBy ?? undefined,
      reviewedAt: d.reviewedAt ?? undefined,
      createdAt: d.$createdAt
    };
  });
}

// PROD: Add pagination support for large datasets
// PROD: Implement proper filtering and sorting
// PROD: Add caching for frequently accessed user claims
export async function getClaims(filters?: { userId?: string }): Promise<Claim[]> {
  if (!useAppwrite) {
    let claims = Array.from(inMemory.claims.values());
    if (filters?.userId) {
      claims = claims.filter(c => c.userId === filters.userId);
    }
    return claims;
  }
  return withAppwrite(async ({ databases, dbId, claimsCol, Query }) => {
    const queries = [Query.limit(100)];
    if (filters?.userId) {
      queries.push(Query.equal('userID', filters.userId));
    }
    const res = await databases.listDocuments(dbId, claimsCol, queries);
    return res.documents.map((d: any) => ({
      id: d.$id,
      taskId: d.taskID, // Map database taskID to code taskId
      userId: d.userID ?? undefined, // Map database userID to code userId
      notes: d.notes ?? undefined,
      proofUrl: d.proofURL ?? undefined, // Map database proofURL to code proofUrl
      status: d.status,
      reviewedBy: d.reviewedBy ?? undefined,
      reviewedAt: d.reviewedAt ?? undefined,
      createdAt: d.$createdAt
    } as Claim));
  });
}

// PROD: Add proper error handling and logging
// PROD: Implement caching for frequently accessed claims
export async function getClaimById(id: string): Promise<Claim | undefined> {
  if (!useAppwrite) return inMemory.claims.get(id);
  return withAppwrite(async ({ databases, dbId, claimsCol }) => {
    try {
      const d: any = await databases.getDocument(dbId, claimsCol, id);
      return {
        id: d.$id,
        taskId: d.taskID, // Map database taskID to code taskId
        userId: d.userID ?? undefined, // Map database userID to code userId
        notes: d.notes ?? undefined,
        proofUrl: d.proofURL ?? undefined, // Map database proofURL to code proofUrl
        status: d.status,
        reviewedBy: d.reviewedBy ?? undefined,
        reviewedAt: d.reviewedAt ?? undefined,
        createdAt: d.$createdAt
      } as Claim;
    } catch {
      return undefined;
    }
  });
}

// PROD: Add transaction support for status updates
// PROD: Implement notification system for status changes
// PROD: Add audit logging for all status changes
export async function updateClaimStatus(
  id: string,
  status: Claim['status'],
  reviewedBy?: string
): Promise<Claim | undefined> {
  if (!useAppwrite) {
    const existing = inMemory.claims.get(id);
    if (!existing) return undefined;
    const updated: Claim = {
      ...existing,
      status,
      reviewedBy,
      reviewedAt: new Date().toISOString()
    };
    inMemory.claims.set(id, updated);
    return updated;
  }
  return withAppwrite(async ({ databases, dbId, claimsCol }) => {
    try {
      const d: any = await databases.updateDocument(dbId, claimsCol, id, {
        status,
        reviewedBy: reviewedBy ?? null,
        reviewedAt: new Date().toISOString()
      });
      return {
        id: d.$id,
        taskId: d.taskID, // Map database taskID to code taskId
        userId: d.userID ?? undefined, // Map database userID to code userId
        notes: d.notes ?? undefined,
        proofUrl: d.proofURL ?? undefined, // Map database proofURL to code proofUrl
        status: d.status,
        reviewedBy: d.reviewedBy ?? undefined,
        reviewedAt: d.reviewedAt ?? undefined,
        createdAt: d.$createdAt
      } as Claim;
    } catch {
      return undefined;
    }
  });
}

// PROD: Add pagination support for user badges
// PROD: Implement caching for user badge collections
// PROD: Add badge analytics and reporting
export async function listBadgesByUser(userId: string): Promise<Badge[]> {
  if (!useAppwrite) {
    return Array.from(inMemory.badges.values()).filter((b) => b.userId === userId);
  }
  return withAppwrite(async ({ databases, dbId, badgesCol, Query }) => {
    try {
      const res = await databases.listDocuments(dbId, badgesCol, [Query.equal('userID', userId), Query.limit(100)]);
      return res.documents.map((d: any) => ({
        id: d.$id,
        userId: d.userID, // Map database userID to code userId
        taskId: d.taskID ?? undefined, // Map database taskID to code taskId
        label: d.label,
        color: d.color ?? undefined,
        awardedAt: d.awardedAt ?? d.$createdAt
      } as Badge));
    } catch (err) {
      // If userID attribute doesn't exist in schema, return empty array
      console.warn('Could not query badges by userID, schema may be missing userID attribute');
      return [];
    }
  });
}

// PROD: Add pagination support for all badges
// PROD: Implement filtering and sorting capabilities
// PROD: Add caching for badge collections
export async function getBadges(): Promise<Badge[]> {
  if (!useAppwrite) {
    return Array.from(inMemory.badges.values());
  }
  return withAppwrite(async ({ databases, dbId, badgesCol, Query }) => {
    try {
      const res = await databases.listDocuments(dbId, badgesCol, [
        Query.limit(1000), // Limit for performance
        Query.orderDesc('$createdAt')
      ]);
      return res.documents.map((d: any) => ({
        id: d.$id,
        userId: d.userID, // Map database userID to code userId
        taskId: d.taskID ?? undefined, // Map database taskID to code taskId
        label: d.label,
        color: d.color ?? undefined,
        awardedAt: d.awardedAt ?? d.$createdAt
      } as Badge));
    } catch (err) {
      console.warn('Could not query badges, schema may be missing required attributes');
      return [];
    }
  });
}

// PROD: Add duplicate badge prevention
// PROD: Implement badge achievement notifications
// PROD: Add badge analytics tracking
export async function awardBadge(input: Omit<Badge, 'id' | 'awardedAt'> & { awardedAt?: string }): Promise<Badge> {
  if (!useAppwrite) {
    const id = String(Date.now());
    const created: Badge = { id, awardedAt: input.awardedAt ?? new Date().toISOString(), ...input };
    inMemory.badges.set(id, created);
    return created;
  }
  return withAppwrite(async ({ databases, dbId, badgesCol, ID }) => {
    const now = new Date().toISOString();
    const payload: any = {
      userID: input.userId, // Map userId to database userID
      label: input.label,
      awardedAt: input.awardedAt ?? now
    };
    
    // Only add optional fields if they have values
    if (input.taskId) payload.taskID = input.taskId; // Map taskId to database taskID
    if (input.color) payload.color = input.color;
    
    const d: any = await databases.createDocument(dbId, badgesCol, ID.unique(), payload);
    return {
      id: d.$id,
      userId: d.userID, // Map database userID to code userId
      taskId: d.taskID ?? undefined, // Map database taskID to code taskId
      label: d.label,
      color: d.color ?? undefined,
      awardedAt: d.awardedAt ?? d.$createdAt
    } as Badge;
  });
}

// PROD: Move analytics to a dedicated analytics service
// PROD: Implement proper data aggregation and caching
// PROD: Add real-time analytics dashboards
export async function getBadgeAnalytics(): Promise<{
  totalBadgesAwarded: number;
  totalVolunteersEngaged: number;
  averageTasksPerVolunteer: number;
  topBadgeTypes: Array<{ type: string; count: number; percentage: number }>;
  engagementTrend: Array<{ month: string; badges: number; volunteers: number }>;
  recentAwards: Array<{ volunteer: string; badge: string; task: string; date: string }>;
}> {
  if (!useAppwrite) {
    // Return empty analytics for in-memory fallback
    return {
      totalBadgesAwarded: 0,
      totalVolunteersEngaged: 0,
      averageTasksPerVolunteer: 0,
      topBadgeTypes: [],
      engagementTrend: [],
      recentAwards: []
    };
  }

  return withAppwrite(async ({ databases, dbId, badgesCol, Query }) => {
    try {
      // Get all badges for analytics (limit to reasonable amount for performance)
      const res = await databases.listDocuments(dbId, badgesCol, [
        Query.limit(2000), // Increased limit for better analytics
        Query.orderDesc('$createdAt')
      ]);

      if (res.documents.length === 0) {
        return {
          totalBadgesAwarded: 0,
          totalVolunteersEngaged: 0,
          averageTasksPerVolunteer: 0,
          topBadgeTypes: [],
          engagementTrend: [],
          recentAwards: []
        };
      }

      const badges = res.documents.map((d: any) => ({
        id: d.$id,
        userId: d.userID,
        taskId: d.taskID ?? undefined,
        label: d.label,
        color: d.color ?? undefined,
        awardedAt: d.awardedAt ?? d.$createdAt
      }));

      // Calculate total badges awarded
      const totalBadgesAwarded = badges.length;

      // Calculate unique volunteers (unique userIds)
      const uniqueVolunteers = new Set(badges.map(b => b.userId));
      const totalVolunteersEngaged = uniqueVolunteers.size;

      // Calculate average tasks per volunteer (using badges as proxy for engagement)
      const averageTasksPerVolunteer = totalVolunteersEngaged > 0
        ? Math.round((totalBadgesAwarded / totalVolunteersEngaged) * 10) / 10
        : 0;

      // Calculate top badge types with better distribution
      const badgeCounts = badges.reduce((acc, badge) => {
        const label = badge.label || 'Unnamed Badge';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topBadgeTypes = Object.entries(badgeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6) // Top 6 badge types
        .map(([type, count]) => ({
          type,
          count,
          percentage: totalBadgesAwarded > 0 ? Math.round((count / totalBadgesAwarded) * 100) : 0
        }));

      // Calculate engagement trend (last 12 months for better insights)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

      const monthlyData: Record<string, { badges: number; volunteers: Set<string> }> = {};

      badges.forEach(badge => {
        const badgeDate = new Date(badge.awardedAt);
        if (badgeDate >= twelveMonthsAgo) {
          const monthKey = badgeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { badges: 0, volunteers: new Set() };
          }
          monthlyData[monthKey].badges++;
          monthlyData[monthKey].volunteers.add(badge.userId);
        }
      });

      const engagementTrend = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          badges: data.badges,
          volunteers: data.volunteers.size
        }))
        .sort((a, b) => new Date(`01 ${a.month}`).getTime() - new Date(`01 ${b.month}`).getTime())
        .slice(-6); // Show only last 6 months for cleaner display

      // Get recent awards (last 10) with better formatting
      const recentAwards = badges.slice(0, Math.min(10, badges.length)).map(badge => ({
        volunteer: badge.userId || 'Unknown Volunteer', // TODO: Enhance with user names
        badge: badge.label || 'Unnamed Badge',
        task: badge.taskId || 'General Task',
        date: new Date(badge.awardedAt).toISOString().split('T')[0]
      }));

      return {
        totalBadgesAwarded,
        totalVolunteersEngaged,
        averageTasksPerVolunteer,
        topBadgeTypes,
        engagementTrend,
        recentAwards
      };

    } catch (error) {
      console.error('Error fetching badge analytics:', error);
      // Return empty analytics on error with error logging
      return {
        totalBadgesAwarded: 0,
        totalVolunteersEngaged: 0,
        averageTasksPerVolunteer: 0,
        topBadgeTypes: [],
        engagementTrend: [],
        recentAwards: []
      };
    }
  });
}

// PROD: Add audit logging for all status changes
// PROD: Implement notification system for status updates
// PROD: Add validation for status transitions
export async function updateTaskStatus(id: string, status: Task['status']): Promise<Task | undefined> {
  if (!useAppwrite) {
    const existing = inMemory.tasks.get(id);
    if (!existing) return undefined;
    const updated: Task = { ...existing, status: status || 'active' };
    inMemory.tasks.set(id, updated);
    return updated;
  }
  return withAppwrite(async ({ databases, dbId, tasksCol }) => {
    try {
      const d: any = await databases.updateDocument(dbId, tasksCol, id, {
        status: status || 'active',
        lastActivityAt: new Date().toISOString()
      });
      return {
        id: d.$id,
        orgId: d.orgID,
        title: d.title,
        shortDescription: d.shortDescription,
        description: d.description,
        language: d.language,
        tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []),
        estimatedMinutes: d.estimatedMinutes,
        createdAt: d.$createdAt,
        status: d.status || 'active',
        maxVolunteers: d.maxVolunteers,
        deadline: d.deadline,
        isVerified: d.isVerified ?? true,
        lastActivityAt: d.lastActivityAt
      };
    } catch {
      return undefined;
    }
  });
}

// PROD: Move this to a background job for better performance
// PROD: Add proper error handling and retry logic
export async function updateTaskLastActivity(id: string): Promise<void> {
  if (!useAppwrite) {
    const existing = inMemory.tasks.get(id);
    if (existing) {
      inMemory.tasks.set(id, { ...existing, lastActivityAt: new Date().toISOString() });
    }
    return;
  }
  await withAppwrite(async ({ databases, dbId, tasksCol }) => {
    try {
      await databases.updateDocument(dbId, tasksCol, id, {
        lastActivityAt: new Date().toISOString()
      });
    } catch {
      // Fail silently - this is not critical
    }
  });
}

// PROD: Move this to a scheduled background job (cron)
// PROD: Add batch processing for large datasets
// PROD: Implement proper error handling and retry logic
export async function expireTasks(): Promise<number> {
  const now = new Date().toISOString();
  let expiredCount = 0;
  
  if (!useAppwrite) {
    // In-memory fallback
    for (const [id, task] of inMemory.tasks) {
      if (task.deadline && new Date(task.deadline) <= new Date() && task.status === 'active') {
        inMemory.tasks.set(id, { ...task, status: 'expired' });
        expiredCount++;
      }
    }
    return expiredCount;
  }
  
  return withAppwrite(async ({ databases, dbId, tasksCol, Query }) => {
    try {
      // Find all active tasks past their deadline
      const expiredTasks = await databases.listDocuments(dbId, tasksCol, [
        Query.equal('status', 'active'),
        Query.lessThanEqual('deadline', now),
        Query.limit(100) // Process in batches
      ]);
      
      // Update each expired task
      for (const task of expiredTasks.documents) {
        try {
          await databases.updateDocument(dbId, tasksCol, task.$id, {
            status: 'expired',
            lastActivityAt: now
          });
          expiredCount++;
        } catch {
          // Continue with other tasks if one fails
        }
      }
      
      return expiredCount;
    } catch {
      return 0;
    }
  });
}

// PROD: Move this to a scheduled background job (cron)
// PROD: Add batch processing for large datasets
// PROD: Implement proper error handling and retry logic
export async function autoArchiveTasks(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  let archivedCount = 0;
  
  if (!useAppwrite) {
    // In-memory fallback
    for (const [id, task] of inMemory.tasks) {
      if (task.lastActivityAt && new Date(task.lastActivityAt) < thirtyDaysAgo && task.status === 'active') {
        inMemory.tasks.set(id, { ...task, status: 'expired' });
        archivedCount++;
      }
    }
    return archivedCount;
  }
  
  return withAppwrite(async ({ databases, dbId, tasksCol, Query }) => {
    try {
      // Find all active tasks with no activity in 30+ days
      const inactiveTasks = await databases.listDocuments(dbId, tasksCol, [
        Query.equal('status', 'active'),
        Query.lessThan('lastActivityAt', thirtyDaysAgo.toISOString()),
        Query.limit(100) // Process in batches
      ]);
      
      // Update each inactive task
      for (const task of inactiveTasks.documents) {
        try {
          await databases.updateDocument(dbId, tasksCol, task.$id, {
            status: 'expired',
            lastActivityAt: new Date().toISOString()
          });
          archivedCount++;
        } catch {
          // Continue with other tasks if one fails
        }
      }
      
      return archivedCount;
    } catch {
      return 0;
    }
  });
}

// PROD: Add soft delete instead of hard delete
// PROD: Implement proper audit logging
// PROD: Add cascade delete for related records
export async function deleteTask(id: string): Promise<void> {
  if (!useAppwrite) {
    inMemory.tasks.delete(id);
    return;
  }
  await withAppwrite(async ({ databases, dbId, tasksCol }) => {
    await databases.deleteDocument(dbId, tasksCol, id);
  });
}

// legacy in-memory versions removed (SDK + fallback already implemented above)