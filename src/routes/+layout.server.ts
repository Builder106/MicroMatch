import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const userRole = (locals as any).userRole ?? 'anonymous';
  return { userRole };
};

