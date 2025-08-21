import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { expireTasks, autoArchiveTasks } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });

  try {
    // Run both maintenance operations
    const [expiredCount, archivedCount] = await Promise.all([
      expireTasks(),
      autoArchiveTasks()
    ]);

    return json({
      success: true,
      expiredCount,
      archivedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Task maintenance error:', error);
    return json({ error: 'Failed to perform maintenance' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await event.request.json();
    const { action } = body;

    let result: { expiredCount?: number; archivedCount?: number };

    switch (action) {
      case 'expire':
        const expiredCount = await expireTasks();
        result = { expiredCount };
        break;
      case 'archive':
        const archivedCount = await autoArchiveTasks();
        result = { archivedCount };
        break;
      case 'both':
        const [expired, archived] = await Promise.all([
          expireTasks(),
          autoArchiveTasks()
        ]);
        result = { expiredCount: expired, archivedCount: archived };
        break;
      default:
        return json({ error: 'Invalid action. Use "expire", "archive", or "both"' }, { status: 400 });
    }

    return json({ success: true, ...result });
  } catch (error) {
    console.error('Task maintenance error:', error);
    return json({ error: 'Failed to perform maintenance' }, { status: 500 });
  }
};
