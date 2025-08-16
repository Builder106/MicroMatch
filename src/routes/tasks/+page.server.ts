import type { PageServerLoad } from './$types';
import { listTasks } from '$lib/server/appwrite';

export const load: PageServerLoad = async () => {
  const tasks = await listTasks();
  return { tasks };
};

