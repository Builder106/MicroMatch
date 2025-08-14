import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { createClaim, getTaskById } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role === 'anonymous') return json({ error: 'Unauthorized' }, { status: 401 });
  const { params, request } = event;
  const { id } = params;
  const task = await getTaskById(id);
  if (!task) return json({ error: 'Task not found' }, { status: 404 });

  const body = (await request.json()) as { proofUrl?: string; notes?: string };
  const claim = await createClaim({ taskId: id, proofUrl: body?.proofUrl, notes: body?.notes });
  return json(claim, { status: 201 });
};

