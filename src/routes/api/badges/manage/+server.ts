import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getUserRole } from '$lib/server/auth';
import { awardBadge } from '$lib/server/appwrite';
import type { Badge } from '$lib/types';

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await event.request.json();
    const { label, color, criteria, taskId, description } = body;

    if (!label) return json({ error: 'Badge label is required' }, { status: 400 });

    // For now, create a demo badge structure
    // In a real implementation, you'd save this to your database
    const badge: Omit<Badge, 'id' | 'awardedAt'> = {
      userId: 'demo-user', // This would be set when awarding to actual users
      taskId,
      label,
      color: color || '#16a34a'
    };

    console.log('Creating badge:', badge);
    // TODO: Save badge configuration to database
    // For demo, we'll just return success

    return json({ success: true, badge }, { status: 201 });
  } catch (err) {
    console.error('Badge creation error:', err);
    return json({ error: 'Failed to create badge' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });

  try {
    const url = new URL(event.request.url);
    const badgeId = url.searchParams.get('id');

    if (!badgeId) return json({ error: 'Badge ID is required' }, { status: 400 });

    console.log('Deleting badge:', badgeId);
    // TODO: Delete badge from database

    return json({ success: true });
  } catch (err) {
    console.error('Badge deletion error:', err);
    return json({ error: 'Failed to delete badge' }, { status: 500 });
  }
};
