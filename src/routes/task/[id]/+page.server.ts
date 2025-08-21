import type { PageServerLoad } from './$types';
import { getTaskById } from '$lib/server/appwrite';
import { translateText } from '$lib/server/azure';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const { id } = params;
  const task = await getTaskById(id);
  if (!task) throw error(404, 'Task not found');

  const session = (locals as any)?.session as { user?: { id?: string } } | undefined;
  const currentUserId = session?.user?.id;
  const isOwner = !!currentUserId && currentUserId === task.orgId;

  // Auto-translate title/description when `lang` param provided, fallback to original
  const to = url.searchParams.get('lang');
  if (to) {
    const [title, description] = await Promise.all([
      translateText({ text: task.title, to }),
      translateText({ text: task.description ?? '', to })
    ]);
    return { task: { ...task, title, description, language: 'Auto-translated' }, isOwner };
  }

  return { task, isOwner };
};

