// src/lib/server/appwrite.ts
import { env } from '$env/dynamic/private';
import type { Task, Claim, Badge } from '$lib/types';

const useAppwrite =
  !!env.APPWRITE_ENDPOINT &&
  !!env.APPWRITE_PROJECT_ID &&
  !!env.APPWRITE_API_KEY &&
  !!env.APPWRITE_DB_ID &&
  !!env.APPWRITE_TASKS_COL_ID &&
  !!env.APPWRITE_CLAIMS_COL_ID &&
  !!env.APPWRITE_BADGES_COL_ID;

// In-memory fallback (unchanged)
const inMemory = {
  tasks: new Map<string, Task>(),
  claims: new Map<string, Claim>(),
  badges: new Map<string, Badge>()
};

// Appwrite SDK impl
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

export async function listTasks(): Promise<Task[]> {
  if (!useAppwrite) return Array.from(inMemory.tasks.values());
  return withAppwrite(async ({ databases, dbId, tasksCol, Query }) => {
    const res = await databases.listDocuments(dbId, tasksCol, [Query.limit(100)]);
    return res.documents.map((d: any) => ({
      id: d.$id,
      orgId: d.orgId,
      title: d.title,
      shortDescription: d.shortDescription,
      description: d.description,
      language: d.language,
      tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []), // adjust if JSON
      estimatedMinutes: d.estimatedMinutes,
      createdAt: d.$createdAt
    }));
  });
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  if (!useAppwrite) return inMemory.tasks.get(id);
  return withAppwrite(async ({ databases, dbId, tasksCol }) => {
    try {
      const d: any = await databases.getDocument(dbId, tasksCol, id);
      return {
        id: d.$id,
        orgId: d.orgId,
        title: d.title,
        shortDescription: d.shortDescription,
        description: d.description,
        language: d.language,
        tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []),
        estimatedMinutes: d.estimatedMinutes,
        createdAt: d.$createdAt
      };
    } catch {
      return undefined;
    }
  });
}

export async function createTask(input: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  if (!useAppwrite) {
    const id = String(Date.now());
    const created: Task = { ...input, id, createdAt: new Date().toISOString() };
    inMemory.tasks.set(id, created);
    return created;
  }
  return withAppwrite(async ({ databases, dbId, tasksCol, ID }) => {
    const payload: any = {
      orgId: input.orgId ?? null,
      title: input.title,
      shortDescription: input.shortDescription,
      description: input.description ?? '',
      language: input.language ?? 'English',
      estimatedMinutes: input.estimatedMinutes ?? null,
      tags: Array.isArray(input.tags) ? input.tags : []
    };
    const d: any = await databases.createDocument(dbId, tasksCol, ID.unique(), payload);
    return {
      id: d.$id,
      orgId: d.orgId,
      title: d.title,
      shortDescription: d.shortDescription,
      description: d.description,
      language: d.language,
      tags: Array.isArray(d.tags) ? d.tags : (d.tags?.values ?? []),
      estimatedMinutes: d.estimatedMinutes,
      createdAt: d.$createdAt
    };
  });
}

export async function createClaim(input: Omit<Claim, 'id' | 'status' | 'createdAt'> & { status?: Claim['status'] }): Promise<Claim> {
  if (!useAppwrite) {
    const id = String(Date.now());
    const created: Claim = { id, status: input.status ?? 'pending', createdAt: new Date().toISOString(), ...input };
    inMemory.claims.set(id, created);
    return created;
  }
  return withAppwrite(async ({ databases, dbId, claimsCol, ID }) => {
    const payload: any = {
      taskId: input.taskId,
      userId: input.userId ?? null,
      notes: input.notes ?? '',
      proofUrl: input.proofUrl ?? '',
      status: input.status ?? 'pending',
      reviewedBy: null,
      reviewedAt: null
    };
    const d: any = await databases.createDocument(dbId, claimsCol, ID.unique(), payload);
    return {
      id: d.$id,
      taskId: d.taskId,
      userId: d.userId,
      notes: d.notes,
      proofUrl: d.proofUrl,
      status: d.status,
      reviewedBy: d.reviewedBy ?? undefined,
      reviewedAt: d.reviewedAt ?? undefined,
      createdAt: d.$createdAt
    };
  });
}

export async function getClaimById(id: string): Promise<Claim | undefined> {
  if (!useAppwrite) return inMemory.claims.get(id);
  return withAppwrite(async ({ databases, dbId, claimsCol }) => {
    try {
      const d: any = await databases.getDocument(dbId, claimsCol, id);
      return {
        id: d.$id,
        taskId: d.taskId,
        userId: d.userId ?? undefined,
        notes: d.notes ?? undefined,
        proofUrl: d.proofUrl ?? undefined,
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
        taskId: d.taskId,
        userId: d.userId ?? undefined,
        notes: d.notes ?? undefined,
        proofUrl: d.proofUrl ?? undefined,
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

export async function listBadgesByUser(userId: string): Promise<Badge[]> {
  if (!useAppwrite) {
    return Array.from(inMemory.badges.values()).filter((b) => b.userId === userId);
  }
  return withAppwrite(async ({ databases, dbId, badgesCol, Query }) => {
    const res = await databases.listDocuments(dbId, badgesCol, [Query.equal('userId', userId), Query.limit(100)]);
    return res.documents.map((d: any) => ({
      id: d.$id,
      userId: d.userId,
      taskId: d.taskId ?? undefined,
      label: d.label,
      color: d.color ?? undefined,
      awardedAt: d.awardedAt ?? d.$createdAt
    } as Badge));
  });
}

export async function awardBadge(input: Omit<Badge, 'id' | 'awardedAt'> & { awardedAt?: string }): Promise<Badge> {
  if (!useAppwrite) {
    const id = String(Date.now());
    const created: Badge = { id, awardedAt: input.awardedAt ?? new Date().toISOString(), ...input };
    inMemory.badges.set(id, created);
    return created;
  }
  return withAppwrite(async ({ databases, dbId, badgesCol, ID }) => {
    const payload: any = {
      userId: input.userId,
      taskId: input.taskId ?? null,
      label: input.label,
      color: input.color ?? null,
      awardedAt: input.awardedAt ?? new Date().toISOString()
    };
    const d: any = await databases.createDocument(dbId, badgesCol, ID.unique(), payload);
    return {
      id: d.$id,
      userId: d.userId,
      taskId: d.taskId ?? undefined,
      label: d.label,
      color: d.color ?? undefined,
      awardedAt: d.awardedAt ?? d.$createdAt
    } as Badge;
  });
}

// legacy in-memory versions removed (SDK + fallback already implemented above)