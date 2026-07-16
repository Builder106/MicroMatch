import { describe, it, expect, beforeEach, vi } from 'vitest';

// This module reads env once at import time to compute `useAppwrite`, so the
// Appwrite-backed branch needs its own file with truthy env set inside
// vi.hoisted (which runs before the hoisted vi.mock/import below it).
const { mocks } = vi.hoisted(() => ({
  mocks: {
    listRows: vi.fn(),
    getRow: vi.fn(),
    createRow: vi.fn(),
    updateRow: vi.fn(),
    deleteRow: vi.fn()
  }
}));

vi.mock('$env/dynamic/private', () => ({
  env: {
    APPWRITE_ENDPOINT: 'https://fake.appwrite.io/v1',
    APPWRITE_PROJECT_ID: 'proj',
    APPWRITE_API_KEY: 'key',
    APPWRITE_DB_ID: 'db',
    APPWRITE_TASKS_TABLE_ID: 'tasks',
    APPWRITE_CLAIMS_TABLE_ID: 'claims',
    APPWRITE_BADGES_TABLE_ID: 'badges'
  }
}));
vi.mock('node-appwrite', () => ({
  Client: class {
    setEndpoint() { return this; }
    setProject() { return this; }
    setKey() { return this; }
  },
  TablesDB: class {
    listRows = mocks.listRows;
    getRow = mocks.getRow;
    createRow = mocks.createRow;
    updateRow = mocks.updateRow;
    deleteRow = mocks.deleteRow;
  },
  ID: { unique: () => 'new-id' },
  Query: {
    equal: (k: string, v: unknown) => `equal(${k},${v})`,
    limit: (n: number) => `limit(${n})`,
    orderDesc: (k: string) => `orderDesc(${k})`,
    lessThanEqual: (k: string, v: unknown) => `lte(${k},${v})`,
    lessThan: (k: string, v: unknown) => `lt(${k},${v})`
  }
}));

import {
  getTasks,
  getTaskById,
  createTask,
  createClaim,
  getClaims,
  getClaimById,
  updateClaimStatus,
  listBadgesByUser,
  getBadges,
  awardBadge,
  getBadgeAnalytics,
  updateTaskStatus,
  updateTaskLastActivity,
  expireTasks,
  autoArchiveTasks,
  setTasksVerifiedForOrg,
  deleteTask
} from './appwrite';

const taskRow = {
  $id: 'row-1',
  orgID: 'org-1',
  title: 'Translate flyer',
  shortDescription: 'short',
  description: 'long',
  language: 'en',
  tags: ['i18n'],
  estimatedMinutes: 30,
  $createdAt: '2026-01-01T00:00:00.000Z',
  status: 'active',
  maxVolunteers: undefined,
  deadline: undefined,
  isVerified: true,
  lastActivityAt: '2026-01-01T00:00:00.000Z'
};

describe('appwrite (Appwrite-backed mode) — tasks', () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockReset());
  });

  it('getTasks maps rows from tables.listRows into Task objects', async () => {
    mocks.listRows.mockResolvedValue({ rows: [taskRow] });

    const tasks = await getTasks({ includeInactive: true });

    expect(tasks).toEqual([
      expect.objectContaining({ id: 'row-1', orgId: 'org-1', title: 'Translate flyer' })
    ]);
  });

  it('getTasks applies the active-status query when not including inactive tasks', async () => {
    mocks.listRows.mockResolvedValue({ rows: [] });
    await getTasks();
    expect(mocks.listRows).toHaveBeenCalledWith('db', 'tasks', expect.arrayContaining(['equal(status,active)']));
  });

  it('getTaskById maps a single row and returns undefined on error', async () => {
    mocks.getRow.mockResolvedValueOnce(taskRow);
    expect(await getTaskById('row-1')).toEqual(expect.objectContaining({ id: 'row-1' }));

    mocks.getRow.mockRejectedValueOnce(new Error('not found'));
    expect(await getTaskById('ghost')).toBeUndefined();
  });

  it('createTask sends orgID (not orgId) to the table and maps the response back', async () => {
    mocks.createRow.mockResolvedValue(taskRow);

    const created = await createTask({ title: 'x', shortDescription: 's', tags: [], orgId: 'org-1' });

    expect(mocks.createRow).toHaveBeenCalledWith('db', 'tasks', 'new-id', expect.objectContaining({ orgID: 'org-1' }));
    expect(created.orgId).toBe('org-1');
  });

  it('updateTaskStatus maps the updated row and returns undefined on error', async () => {
    mocks.updateRow.mockResolvedValueOnce({ ...taskRow, status: 'completed' });
    const updated = await updateTaskStatus('row-1', 'completed');
    expect(updated?.status).toBe('completed');

    mocks.updateRow.mockRejectedValueOnce(new Error('nope'));
    expect(await updateTaskStatus('row-1', 'completed')).toBeUndefined();
  });

  it('updateTaskLastActivity calls updateRow and swallows errors', async () => {
    mocks.updateRow.mockResolvedValueOnce({});
    await expect(updateTaskLastActivity('row-1')).resolves.toBeUndefined();

    mocks.updateRow.mockRejectedValueOnce(new Error('nope'));
    await expect(updateTaskLastActivity('row-1')).resolves.toBeUndefined();
  });

  it('expireTasks updates each row past its deadline and counts successes, tolerating per-row failures', async () => {
    mocks.listRows.mockResolvedValueOnce({ rows: [{ $id: 'a' }, { $id: 'b' }] });
    mocks.updateRow.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('row b failed'));

    const count = await expireTasks();
    expect(count).toBe(1);
  });

  it('expireTasks returns 0 when the query itself fails', async () => {
    mocks.listRows.mockRejectedValueOnce(new Error('down'));
    expect(await expireTasks()).toBe(0);
  });

  it('autoArchiveTasks updates each stale row and counts successes', async () => {
    mocks.listRows.mockResolvedValueOnce({ rows: [{ $id: 'a' }] });
    mocks.updateRow.mockResolvedValueOnce({});

    expect(await autoArchiveTasks()).toBe(1);
  });

  it('autoArchiveTasks returns 0 when the query itself fails', async () => {
    mocks.listRows.mockRejectedValueOnce(new Error('down'));
    expect(await autoArchiveTasks()).toBe(0);
  });

  it('setTasksVerifiedForOrg updates every row for the org and counts successes', async () => {
    mocks.listRows.mockResolvedValueOnce({ rows: [{ $id: 'a' }, { $id: 'b' }] });
    mocks.updateRow.mockResolvedValue({});

    const count = await setTasksVerifiedForOrg('org-1', false);

    expect(count).toBe(2);
    expect(mocks.updateRow).toHaveBeenCalledWith('db', 'tasks', 'a', { isVerified: false });
  });

  it('setTasksVerifiedForOrg returns 0 when the query itself fails', async () => {
    mocks.listRows.mockRejectedValueOnce(new Error('down'));
    expect(await setTasksVerifiedForOrg('org-1', true)).toBe(0);
  });

  it('deleteTask calls tables.deleteRow', async () => {
    mocks.deleteRow.mockResolvedValue(undefined);
    await deleteTask('row-1');
    expect(mocks.deleteRow).toHaveBeenCalledWith('db', 'tasks', 'row-1');
  });
});

describe('appwrite (Appwrite-backed mode) — claims', () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockReset());
  });

  const claimRow = {
    $id: 'claim-1',
    taskID: 'task-1',
    userID: 'user-1',
    notes: 'done',
    proofURL: 'https://proof',
    status: 'pending',
    reviewedBy: undefined,
    reviewedAt: undefined,
    $createdAt: '2026-01-01T00:00:00.000Z'
  };

  it('createClaim maps taskId/userId/proofUrl to the database column names', async () => {
    mocks.createRow.mockResolvedValue(claimRow);

    const claim = await createClaim({ taskId: 'task-1', userId: 'user-1', notes: 'done', proofUrl: 'https://proof' });

    expect(mocks.createRow).toHaveBeenCalledWith('db', 'claims', 'new-id', expect.objectContaining({
      taskID: 'task-1', userID: 'user-1', notes: 'done', proofURL: 'https://proof'
    }));
    expect(claim).toEqual(expect.objectContaining({ id: 'claim-1', taskId: 'task-1', userId: 'user-1' }));
  });

  it('getClaims maps rows and applies the userID filter', async () => {
    mocks.listRows.mockResolvedValue({ rows: [claimRow] });
    const claims = await getClaims({ userId: 'user-1' });

    expect(mocks.listRows).toHaveBeenCalledWith('db', 'claims', expect.arrayContaining(['equal(userID,user-1)']));
    expect(claims[0]).toEqual(expect.objectContaining({ id: 'claim-1', taskId: 'task-1' }));
  });

  it('getClaimById maps a row and returns undefined on error', async () => {
    mocks.getRow.mockResolvedValueOnce(claimRow);
    expect(await getClaimById('claim-1')).toEqual(expect.objectContaining({ id: 'claim-1' }));

    mocks.getRow.mockRejectedValueOnce(new Error('nope'));
    expect(await getClaimById('ghost')).toBeUndefined();
  });

  it('updateClaimStatus maps the updated row and returns undefined on error', async () => {
    mocks.updateRow.mockResolvedValueOnce({ ...claimRow, status: 'approved', reviewedBy: 'reviewer-1' });
    const updated = await updateClaimStatus('claim-1', 'approved', 'reviewer-1');
    expect(updated?.status).toBe('approved');
    expect(updated?.reviewedBy).toBe('reviewer-1');

    mocks.updateRow.mockRejectedValueOnce(new Error('nope'));
    expect(await updateClaimStatus('claim-1', 'approved')).toBeUndefined();
  });
});

describe('appwrite (Appwrite-backed mode) — badges', () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockReset());
  });

  const badgeRow = {
    $id: 'badge-1', userID: 'user-1', taskID: 'task-1', label: 'Helper', color: '#FF6B6B',
    awardedAt: '2026-01-01T00:00:00.000Z', $createdAt: '2026-01-01T00:00:00.000Z'
  };

  it('awardBadge maps userId to userID and maps the response back', async () => {
    mocks.createRow.mockResolvedValue(badgeRow);
    const badge = await awardBadge({ userId: 'user-1', label: 'Helper', taskId: 'task-1', color: '#FF6B6B' });

    expect(mocks.createRow).toHaveBeenCalledWith('db', 'badges', 'new-id', expect.objectContaining({ userID: 'user-1' }));
    expect(badge).toEqual(expect.objectContaining({ id: 'badge-1', userId: 'user-1' }));
  });

  it('listBadgesByUser maps rows and returns [] when the query fails', async () => {
    mocks.listRows.mockResolvedValueOnce({ rows: [badgeRow] });
    expect(await listBadgesByUser('user-1')).toEqual([expect.objectContaining({ id: 'badge-1' })]);

    mocks.listRows.mockRejectedValueOnce(new Error('schema missing userID'));
    expect(await listBadgesByUser('user-1')).toEqual([]);
  });

  it('getBadges maps rows and returns [] when the query fails', async () => {
    mocks.listRows.mockResolvedValueOnce({ rows: [badgeRow] });
    expect(await getBadges()).toEqual([expect.objectContaining({ id: 'badge-1' })]);

    mocks.listRows.mockRejectedValueOnce(new Error('down'));
    expect(await getBadges()).toEqual([]);
  });

  it('getBadgeAnalytics returns the empty shape when there are no badges', async () => {
    mocks.listRows.mockResolvedValueOnce({ rows: [] });
    const analytics = await getBadgeAnalytics();
    expect(analytics.totalBadgesAwarded).toBe(0);
  });

  it('getBadgeAnalytics aggregates totals, top badge types, and recent awards', async () => {
    mocks.listRows.mockResolvedValueOnce({
      rows: [
        { ...badgeRow, $id: 'b1', userID: 'user-1', label: 'Helper' },
        { ...badgeRow, $id: 'b2', userID: 'user-1', label: 'Helper' },
        { ...badgeRow, $id: 'b3', userID: 'user-2', label: 'Speedy' }
      ]
    });

    const analytics = await getBadgeAnalytics();

    expect(analytics.totalBadgesAwarded).toBe(3);
    expect(analytics.totalVolunteersEngaged).toBe(2);
    expect(analytics.topBadgeTypes[0]).toEqual(expect.objectContaining({ type: 'Helper', count: 2 }));
    expect(analytics.recentAwards).toHaveLength(3);
  });

  it('getBadgeAnalytics fails safe (empty shape) when the query throws', async () => {
    mocks.listRows.mockRejectedValueOnce(new Error('down'));
    const analytics = await getBadgeAnalytics();
    expect(analytics.totalBadgesAwarded).toBe(0);
  });
});
