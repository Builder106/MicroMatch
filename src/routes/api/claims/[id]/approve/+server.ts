import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getClaimById, getTaskById, updateClaimStatus } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';
import { onTaskApproved } from '$lib/server/badgeAwarder';

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });
  const { params } = event;
  const id = params.id;
  if (!id) return json({ error: 'Missing claim id' }, { status: 400 });

  const claim = await getClaimById(id);
  if (!claim) return json({ error: 'Claim not found' }, { status: 404 });

  const reviewerId = (event.locals as any)?.session?.user?.id ?? 'ngo-reviewer';
  const updated = await updateClaimStatus(id, 'approved', reviewerId);
  if (!updated) return json({ error: 'Failed to approve' }, { status: 500 });

  // Trigger badge awards based on this org's BadgeDefinitions.
  let awarded: string[] = [];
  if (updated.userId && updated.taskId) {
    try {
      const task = await getTaskById(updated.taskId);
      awarded = await onTaskApproved(updated.userId, updated.taskId, task?.estimatedMinutes ?? undefined);
    } catch (err) {
      console.error('Badge awarding failed:', err);
      // Don't fail the approval if badge awarding fails.
    }
  }

  return json({ ok: true, claim: updated, awardedBadgeIds: awarded });
};
