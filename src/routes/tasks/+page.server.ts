import type { PageServerLoad } from './$types';
import { getTasks } from '$lib/server/appwrite';

export const load: PageServerLoad = async () => {
  const tasks = await getTasks();
  return { tasks };
};

