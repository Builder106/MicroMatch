import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { createTask, listTasks } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';
import type { Task } from '$lib/types';

export const GET: RequestHandler = async () => {
  const tasks = await listTasks();
  // public read-only projection for MVP
  const result = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    shortDescription: t.shortDescription,
    tags: t.tags,
    estimatedMinutes: t.estimatedMinutes,
    language: t.language
  } satisfies Partial<Task> & { id: string }));
  return json(result);
};

export const POST: RequestHandler = async (event) => {
  const role = await getUserRole(event);
  if (role !== 'ngo') return json({ error: 'Forbidden' }, { status: 403 });
  const { request } = event;
  const body = (await request.json()) as Partial<Task>;
  if (!body?.title || !body?.shortDescription) {
    return json({ error: 'title and shortDescription are required' }, { status: 400 });
  }
  const created = await createTask({
    title: body.title,
    shortDescription: body.shortDescription,
    description: body.description ?? '',
    language: body.language ?? 'English',
    tags: Array.isArray(body.tags) ? body.tags : [],
    estimatedMinutes: typeof body.estimatedMinutes === 'number' ? body.estimatedMinutes : undefined
  });
  return json(created, { status: 201 });
};

