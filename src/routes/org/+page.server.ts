import type { Actions } from './$types';
import { createTask } from '$lib/server/appwrite';
import { getUserRole } from '$lib/server/auth';

export const actions: Actions = {
  default: async (event) => {
    const role = await getUserRole(event);
    if (role !== 'ngo') {
      return { success: false, error: 'Forbidden' };
    }
    const { request } = event;
    const form = await request.formData();
    const title = String(form.get('title') ?? '');
    const shortDescription = String(form.get('shortDescription') ?? '');
    const description = String(form.get('description') ?? '');
    const language = String(form.get('language') ?? 'English');
    const tagsRaw = String(form.get('tags') ?? '');
    const estimatedMinutesRaw = String(form.get('minutes') ?? '');
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const estimatedMinutes = Number.isFinite(Number(estimatedMinutesRaw)) ? Number(estimatedMinutesRaw) : undefined;

    if (!title || !shortDescription || !description) {
      return { success: false, error: 'Missing required fields' };
    }

    const created = await createTask({ title, shortDescription, description, language, tags, estimatedMinutes });
    return { success: true, taskId: created.id };
  }
};

