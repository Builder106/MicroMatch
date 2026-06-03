# JOURNAL — MicroMatch

> Dated log of decisions, pivots, incidents, and quotes. Add entries as
> things happen — retrospectives need this raw material to land.
> Reverse-chronological; one paragraph max per entry.

## 2026-05-12 — Wrote a positioning doc instead of pretending we're Idealist #decision

Added `docs/positioning.md` to pin down what MicroMatch actually is, because the README kept drifting toward generic "volunteer platform" language. The honest framing: Idealist is a directory you leave to email an org; MicroMatch is a marketplace where the work happens on-platform — claim → submit → approve → badge is one closed loop. The doc names the tradeoff out loud rather than hiding it: Idealist's moat is two decades of supply density and SEO, and our proof-review loop is real NGO friction (posting on Idealist costs an email address; posting here costs grading time). The bet is that bite-sized + verified + badge-bearing is a different enough product that the supply-side friction is worth it. Same day, deleted the stale `PLAN.md` — it was describing a project that no longer existed.

## 2026-05-09 — The Safari ITP OAuth loop that took five commits to kill #incident

Google sign-in was sending Safari users into an infinite loop: OAuth → /profile → save → /login → OAuth, forever. The root cause was Intelligent Tracking Prevention stripping the session cookie set by `cloud.appwrite.io` as third-party, so every `account.*` call returned 401. We thrashed through it — first bounced to /login on a load-time 401 (broke Google OAuth entirely, since the cookie hadn't propagated by onMount), then moved it to save-time, then gave up auto-redirecting and showed an amber "try another browser" banner. The actual fix was architectural: switch from `createOAuth2Session` to `createOAuth2Token` (RFC 6749 code exchange), add a server endpoint that validates `userId`+`secret` with the admin SDK and mints a first-party `mm_session` cookie, and move profile saves server-side too. Lesson: a cross-origin session cookie was never going to survive ITP — the client SDK had to stop being the auth boundary.

## 2026-05-09 — Seeded tasks weren't showing on prod because two env vars were undocumented #incident

The deployed feed was empty even though eight demo tasks lived in Appwrite Cloud. Turned out `APPWRITE_DB_ID` and `APPWRITE_TASKS_TABLE_ID` were never in `.env.example`, so `getTasks()` silently fell through to the in-memory task store — which is empty after every cold start on Vercel. Documented them (`micromatch` / `tasks` from `appwrite.config.json`) and wrote `scripts/seed.ts` to be idempotent by construction: users matched by email, prefs read-modify-write so other keys survive, membership swallows 409, tasks skipped if the title already exists for the org. The seed tasks deliberately carry no deadlines and no relative copy ("this Friday") so the landing page never goes stale.

## 2026-05-08 — Vitest bootstrap broke Vercel deploys via a codepath local builds never hit #incident

Adding Vitest perturbed the dependency graph just enough that `adapter-auto`'s lazy detect-and-import for Vercel resolved a stale `estree-walker` with no `"."` export, failing every deploy with `No "exports" main defined`. Local `bun run build` stayed green the whole time because it skips Vercel detection entirely — so the break was invisible until it hit CI. Fix: drop `adapter-auto` for `adapter-vercel` directly (resolution at install time, not build time) and pin `nodejs22.x` in `svelte.config.js`, because Bun's compat layer reports Node v25.x and adapter-vercel rejects that without an explicit runtime. The takeaway: "works locally" means nothing when the failing codepath only fires under the host's environment detection.

## 2026-05-08 — Test suite caught a real millisecond-collision bug in the dev fallback #milestone #incident

Bootstrapped Vitest and wrote coverage for everything shipped over the prior weeks — tagColors, propublica, email, verifications, badgeDefs, badgeCriteria, badgeAwarder. The suite immediately earned its keep: the in-memory IDs in `verifications.ts` and `badgeDefs.ts` were generated as `mem-${Date.now()}` and collided when two rows were created in the same millisecond, silently overwriting each other. Only affects the Appwrite-less dev fallback, but it was a genuine correctness bug a human would never have noticed by clicking around. Replaced with a counter-suffixed generator. Later the component tests forced migrating to Vitest's `projects` config — `@testing-library/svelte` kept resolving Svelte 5's SSR entry instead of the client one, throwing `lifecycle_function_unavailable`, until each project got the module resolution it needed (node for server, jsdom + `browser` conditions for components). Landed at 123 tests, svelte-check at 0 errors.

## 2026-05-08 — Verification is a soft gate, and clients can't claim it anymore #decision

Built the NGO verification flow as a *soft* gate: NGOs submit org name, country, tax ID, and an optional doc; admins (gated by Appwrite Teams membership) review a queue enriched with ProPublica 501(c)(3) lookups so they can eyeball the EIN against the claimed org name. The non-obvious call: tasks now derive `isVerified` server-side from the verification record, so a client can no longer mark its own tasks verified. Approval back-fills the Verified chip onto every existing task the NGO owns; rejection clears it; both email the NGO via Mailgun's HTTP API (no SDK dependency). Same batch moved badge definitions out of a hardcoded array into an org-owned Appwrite table, and shifted badge awarding from claim *creation* to claim *approval* — because that's when the work is actually verified done — deduped by label so the same badge can't be minted twice.

## 2026-05-08 — Ripped out the Azure HelpBot; it was scaffolding that never earned its slot #pivot

Removed the Azure Direct Line HelpBot widget entirely. `/api/bot/token` now returns 410 Gone for any straggler caller, and the auth pages stopped defaulting to the bot's `help.lottie` mascot. Same cleanup killed an unconditional `account.get()` in the layout's onMount that was firing a 401 in the console for every signed-out visitor — now gated behind a session hint (the `mm_role` cookie or `mm_has_session` flag). A few days earlier we'd also dropped `@auth/core` and `@auth/sveltekit`: they were scaffolded in but never wired up — the real auth flow runs through Appwrite directly. Pattern across this stretch: delete the half-integrated dependencies rather than carry them as dead weight.

## 2026-05-04 — Migrated Databases → TablesDB and renamed every collection constant #decision

Bumped `node-appwrite` to v24 and migrated the whole server layer from Appwrite's Databases API to the newer TablesDB API, renaming every `*_COL_ID` env var to `*_TABLE_ID`. Not a feature, but a foundational call that touched all the data-access code — worth doing before piling verification, badges, and roles on top of it. Around the same time the brand redesign carried the warm landing-page language through to every authenticated screen (dashboards, feed, TaskCard, auth pages), with a Plus Jakarta Sans + coral system in `app.css` and a new logo that doubles as the favicon.

## 2026-04-08 — Revived the project after ~8 months, swapped the sterile blue SaaS look for a warm consumer aesthetic #pivot

Picked MicroMatch back up after roughly eight dormant months and immediately rebuilt the homepage from a Figma design — out went the blue SaaS landing page, in came cream backgrounds, coral CTAs, Plus Jakarta Sans headings, floating hero mockup cards, and a gamification showcase with a progress ring. The Layout TopAppBar is now hidden on the home route so the landing page renders its own sticky header with anchor nav. This also marked the tooling pivot: npm → Bun, with a Tailwind toolchain and a Lottie player added. The redesign set the visual direction that everything else in the May sprint had to live up to.

## 2025-08-14 — MVP in a week: browse → pick → learn → complete → earn #milestone

Shipped the first working MVP three days after the initial commit, framed around a five-verb loop: Browse → Pick → Learn → Complete → Earn. The original pitch leaned hard on just-in-time learning — each task was meant to carry DataCamp and Educative "learning cards" so a volunteer new to a skill could still contribute — plus auto-translation of task copy to the viewer's language and a gamified XP-bar-plus-badges dashboard. The planned deployment was Heroku for the SvelteKit SSR app and DigitalOcean for Appwrite. Most of that early scope (Heroku, DigitalOcean, the learning cards) didn't survive the 2026 revival; the closed claim/approve/badge loop and Appwrite backend did.
