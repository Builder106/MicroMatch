// Removed: Azure Bot Service Direct Line token endpoint.
// Returning 410 Gone for any caller that still hits this route while the
// folder lingers — safe to `git rm -r src/routes/api/bot` to clean up.
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const gone: RequestHandler = () => json({ error: 'HelpBot has been removed.' }, { status: 410 });

export const GET: RequestHandler = gone;
export const POST: RequestHandler = gone;
