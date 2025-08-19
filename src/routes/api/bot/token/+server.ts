import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { createDirectLineToken } from '$lib/server/bot';

export const POST: RequestHandler = async (event) => {
  const sessionUserId = (event.locals as any)?.session?.user?.id as string | undefined;
  const { token, error } = await createDirectLineToken(sessionUserId);
  if (error) return json({ error }, { status: 400 });
  return json({ token });
};

