import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { awardBadge, getClaimById, updateClaimStatus } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });
  const { params } = event;
  const id = params.id;
  if (!id) return json({ error: 'Missing claim id' }, { status: 400 });

  const claim = await getClaimById(id);
  if (!claim) return json({ error: 'Claim not found' }, { status: 404 });

  const updated = await updateClaimStatus(id, 'approved', 'ngo-reviewer');
  if (!updated) return json({ error: 'Failed to approve' }, { status: 500 });

  if (updated.userId) {
    try {
      await awardBadge({ userId: updated.userId, taskId: updated.taskId, label: 'Helper', color: '#16a34a' });
    } catch {}
  }

  return json({ ok: true, claim: updated });
};

