import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { listBadgesByUser } from '$lib/server/appwrite';

// MVP: derive userId from query for demo; later from auth/session
export const GET: RequestHandler = async ({ url }) => {
  const userId = url.searchParams.get('userId') ?? 'demo-user';
  const badges = await listBadgesByUser(userId);
  return json(badges);
};

