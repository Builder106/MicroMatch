import { env } from '$env/dynamic/private';
import type { BadgeDefinition } from '$lib/types';

const useAppwrite =
  !!env.APPWRITE_ENDPOINT &&
  !!env.APPWRITE_PROJECT_ID &&
  !!env.APPWRITE_API_KEY &&
  !!env.APPWRITE_DB_ID &&
  !!env.APPWRITE_BADGE_DEFS_TABLE_ID;

const inMemory = new Map<string, BadgeDefinition>();

async function withAppwrite<T>(fn: (ctx: {
  tables: import('node-appwrite').TablesDB;
  dbId: string;
  table: string;
  ID: typeof import('node-appwrite').ID;
  Query: typeof import('node-appwrite').Query;
}) => Promise<T>): Promise<T> {
  const { Client, TablesDB, ID, Query } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT!)
    .setProject(env.APPWRITE_PROJECT_ID!)
    .setKey(env.APPWRITE_API_KEY!);
  return fn({
    tables: new TablesDB(client),
    dbId: env.APPWRITE_DB_ID!,
    table: env.APPWRITE_BADGE_DEFS_TABLE_ID!,
    ID,
    Query
  });
}

function fromRow(d: any): BadgeDefinition {
  return {
    id: d.$id,
    orgId: d.orgID,
    label: d.label,
    color: d.color,
    icon: d.icon ?? undefined,
    criteria: d.criteria,
    taskId: d.taskID ?? undefined,
    description: d.description ?? undefined,
    createdAt: d.$createdAt
  };
}

export async function listBadgeDefinitions(orgId: string): Promise<BadgeDefinition[]> {
  if (!useAppwrite) return Array.from(inMemory.values()).filter((b) => b.orgId === orgId);
  return withAppwrite(async ({ tables, dbId, table, Query }) => {
    try {
      const res = await tables.listRows(dbId, table, [
        Query.equal('orgID', orgId),
        Query.orderDesc('$createdAt'),
        Query.limit(200)
      ]);
      return res.rows.map(fromRow);
    } catch {
      return [];
    }
  });
}

export async function createBadgeDefinition(input: {
  orgId: string;
  label: string;
  color: string;
  icon?: string;
  criteria: BadgeDefinition['criteria'];
  taskId?: string;
  description?: string;
}): Promise<BadgeDefinition> {
  if (!useAppwrite) {
    const id = `mem-${Date.now()}`;
    const created: BadgeDefinition = { id, createdAt: new Date().toISOString(), ...input };
    inMemory.set(id, created);
    return created;
  }
  return withAppwrite(async ({ tables, dbId, table, ID }) => {
    const payload: Record<string, unknown> = {
      orgID: input.orgId,
      label: input.label,
      color: input.color,
      icon: input.icon ?? '',
      criteria: input.criteria,
      taskID: input.taskId ?? '',
      description: input.description ?? ''
    };
    const created = await tables.createRow(dbId, table, ID.unique(), payload);
    return fromRow(created);
  });
}

export async function deleteBadgeDefinition(id: string, orgId: string): Promise<boolean> {
  if (!useAppwrite) {
    const existing = inMemory.get(id);
    if (!existing || existing.orgId !== orgId) return false;
    inMemory.delete(id);
    return true;
  }
  return withAppwrite(async ({ tables, dbId, table }) => {
    try {
      // Confirm ownership before delete to prevent cross-org tampering.
      const row: any = await tables.getRow(dbId, table, id);
      if (row?.orgID !== orgId) return false;
      await tables.deleteRow(dbId, table, id);
      return true;
    } catch {
      return false;
    }
  });
}

export async function getBadgeDefinition(id: string): Promise<BadgeDefinition | undefined> {
  if (!useAppwrite) return inMemory.get(id);
  return withAppwrite(async ({ tables, dbId, table }) => {
    try {
      const row: any = await tables.getRow(dbId, table, id);
      return fromRow(row);
    } catch {
      return undefined;
    }
  });
}
