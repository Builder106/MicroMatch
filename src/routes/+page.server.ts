import type { PageServerLoad } from './$types';
import { getTasks } from '$lib/server/appwrite';

export const load: PageServerLoad = async () => {
  const allTasks = await getTasks();
  const tasks = allTasks.slice(0, 3);
  return { tasks };
};