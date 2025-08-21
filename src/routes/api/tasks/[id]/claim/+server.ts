import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { createClaim, getTaskById } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';
import { moderateText } from '$lib/server/contentsafety';
import { onTaskCompleted } from '$lib/server/badgeAwarder';

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role === 'anonymous') return json({ error: 'Unauthorized' }, { status: 401 });
  const { params, request } = event;
  const { id } = params;
  const task = await getTaskById(id);
  if (!task) return json({ error: 'Task not found' }, { status: 404 });

  const body = (await request.json()) as { proofUrl?: string; notes?: string };
  // Content Safety: check notes text only (proofUrl left as-is)
  if (body?.notes) {
    const moderation = await moderateText(body.notes);
    if (moderation.blocked) {
      return json({ error: 'Content failed safety checks', reasons: moderation.reasons }, { status: 400 });
    }
  }
  const sessionUserId = (event.locals as any)?.session?.user?.id as string | undefined;
  const claim = await createClaim({ taskId: id, proofUrl: body?.proofUrl, notes: body?.notes, userId: sessionUserId ?? undefined });

  // Trigger badge awarding for task completion
  // Note: In a real implementation, this would be called when the task is approved, not when claimed
  if (sessionUserId) {
    try {
      const task = await getTaskById(id);
      const completionTime = task?.estimatedMinutes || 30; // Default to 30 minutes if not specified
      await onTaskCompleted(sessionUserId, id, completionTime);
    } catch (error) {
      console.error('Failed to process badge awards:', error);
      // Don't fail the claim if badge awarding fails
    }
  }

  return json(claim, { status: 201 });
};

