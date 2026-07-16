import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mocks } = vi.hoisted(() => ({ mocks: { getTasks: vi.fn() } }));
vi.mock('$lib/server/appwrite', () => ({ getTasks: mocks.getTasks }));

import { load } from '../../routes/+page.server';

describe('/ (home feed) load', () => {
  beforeEach(() => mocks.getTasks.mockReset());

  it('slices the task list down to the first 3', async () => {
    mocks.getTasks.mockResolvedValue([
      { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
    ]);

    const result: any = await load({} as any);

    expect(result.tasks).toHaveLength(3);
    expect(result.tasks.map((t: any) => t.id)).toEqual(['1', '2', '3']);
  });

  it('returns an empty array when there are no tasks', async () => {
    mocks.getTasks.mockResolvedValue([]);
    const result: any = await load({} as any);
    expect(result.tasks).toEqual([]);
  });
});
