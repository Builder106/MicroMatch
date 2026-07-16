import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mocks } = vi.hoisted(() => ({ mocks: { getTaskById: vi.fn() } }));
vi.mock('$lib/server/appwrite', () => ({ getTaskById: mocks.getTaskById }));

import { load } from '../../routes/task/[id]/claim/+page.server';

function makeEvent(opts: { userRole?: string; taskId?: string } = {}) {
  return {
    params: { id: opts.taskId ?? 'task-1' },
    locals: { userRole: opts.userRole ?? 'anonymous' }
  } as any;
}

describe('/task/[id]/claim load', () => {
  beforeEach(() => mocks.getTaskById.mockReset());

  it('redirects anonymous users to login with a next= back to the claim page', async () => {
    try {
      await load(makeEvent({ taskId: 'task-1' }));
      throw new Error('expected redirect');
    } catch (err: any) {
      expect(err.status).toBe(303);
      expect(err.location).toBe('/login?next=/task/task-1/claim');
    }
    expect(mocks.getTaskById).not.toHaveBeenCalled();
  });

  it('404s when the task does not exist', async () => {
    mocks.getTaskById.mockResolvedValue(undefined);
    try {
      await load(makeEvent({ userRole: 'volunteer' }));
      throw new Error('expected 404');
    } catch (err: any) {
      expect(err.status).toBe(404);
    }
  });

  it('returns a trimmed-down task projection for a signed-in role', async () => {
    mocks.getTaskById.mockResolvedValue({
      id: 'task-1', orgId: 'org-1', title: 'T', shortDescription: 'S', description: 'long',
      estimatedMinutes: 20, tags: ['a'], isVerified: true
    });

    const result: any = await load(makeEvent({ userRole: 'volunteer' }));

    expect(result.task).toEqual({
      id: 'task-1', title: 'T', shortDescription: 'S', estimatedMinutes: 20, tags: ['a'], isVerified: true
    });
    expect(result.task.orgId).toBeUndefined();
    expect(result.task.description).toBeUndefined();
  });
});
