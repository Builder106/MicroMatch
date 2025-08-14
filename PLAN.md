# MicroMatch — Project Plan (Syrotech MVP Hackathon 2025)

A micro-volunteering marketplace that pairs NGOs and community projects with bite-sized tasks and gives volunteers just-in-time learning to complete them. Built with SvelteKit. Integrates sponsor tools authentically without bloat.

## Objectives
- Deliver a deployed, functional MVP that demonstrates social impact value in 1 day.
- Clean repo + README + brief write-up + optional demo video.
- Integrate sponsors where they add real utility.

## Problem → Solution
- Problem: NGOs struggle to mobilize micro-actions; volunteers lack quick, guided ways to help.
- Solution: Browse → pick → learn → complete → badge. Small, verified tasks with skill primers and lightweight proof-of-work.

## Core MVP Scope (must-have)
- Volunteer: browse tasks, view details, claim, submit proof, earn a badge.
- NGO: post a task, review submissions, approve/reject.
- Auto-translate task titles/descriptions on view (server-side, cache result).
- Basic gamification: badge chip on completion, XP progress bar on dashboard.
- Public read-only API for tasks (for Bump.sh demo).

Non-goals (for now)
- Payment, messaging, complex moderation, multi-org admin, mobile apps.

## Tech Stack
- Frontend/SSR: SvelteKit (TypeScript, Vite)
- UI: Svelte Material UI (Material baseline + light gamification), Iconify
- Backend: Appwrite (Auth, DB, Storage, Functions)
- i18n: Microsoft Azure Translator (server-side fetch)
- Deploy: Heroku (SvelteKit server), DigitalOcean for Appwrite
- Observability: New Relic (Browser + Node agent)
- Secrets: 1Password (local and CI)
- Domain: Namecheap .TECH (e.g., micromatch.tech)
- API docs: Bump.sh (OpenAPI hosted)
- Dev tools: JetBrains IDEs
- Learning cards: DataCamp & Educative links

## Architecture Overview
```txt
SvelteKit (SSR) ──(Appwrite SDK)── Appwrite (DB/Auth/Storage)
        │
        ├── Azure Translator (HTTP) for server-side translation
        ├── New Relic Browser/Node APM
        └── Public API routes (+server.ts) documented on Bump.sh
```

### SvelteKit routes
- `+layout.svelte`: shell, theme, NR browser init
- `+page.svelte` + `+page.server.ts`: task feed
- `task/[id]/+page.svelte`: task details
- `task/[id]/claim/+page.svelte`: claim + submit proof
- `dashboard/+page.svelte`: XP + badges
- `org/+page.svelte`: NGO task creation (basic form)
- `api/tasks/+server.ts`: list/create tasks
- `api/tasks/[id]/claim/+server.ts`: claim/submit

### Server libs
- `src/lib/server/appwrite.ts`: Appwrite server client
- `src/lib/server/azure.ts`: Translator helper with caching

## Data Model (Appwrite)
- `organizations`: name, contactEmail, verified:boolean
- `tasks`: orgId, title, shortDescription, description, language, tags[], estimatedMinutes:number, createdAt
- `claims`: taskId, userId, notes, proofUrl, status:enum(pending|approved|rejected), reviewedBy, reviewedAt
- `badges`: userId, taskId, label, awardedAt

## Sponsor Integrations (pragmatic)
- Appwrite: Auth (email), DB for tasks/claims/badges, Storage for proof files, Functions for post-approval badge issuance.
- DigitalOcean: Host Appwrite (Docker on Droplet/App Platform). Optional Spaces for asset offload.
- Heroku: Deploy SvelteKit SSR; optional Scheduler for nightly cleanup.
- Microsoft Azure: Translator (server-side) for task text; chip showing “Auto-translated”.
- New Relic: Browser + Node agents for UX and API telemetry; Synthetics uptime.
- 1Password: Manage secrets locally and in CI via 1Password CLI/Connect.
- Namecheap .TECH: Public domain and subdomains.
- Bump.sh: Host OpenAPI for `/api/tasks` public read-only endpoints.
- JetBrains IDEs: WebStorm/IntelliJ + Svelte plugin for dev speed.
- DataCamp & Educative: Curated links as “learning cards” attached to tasks.

## Design System
- Base: Material Design (consistent, accessible)
- Style: minimalist cards, subtle elevation, friendly illustrations for empty states
- Gamification: badge chips, XP bar, optional confetti modal on completion
- Typography: Inter/Roboto; iconography via Iconify

## Implementation Plan (next 24 hours)
1) Repo/init (1h)
- Initialize SvelteKit app, TypeScript, ESLint/Prettier.
- Add SMUI, Iconify, canvas-confetti.
- Commit CI config (Node LTS), 1Password secret fetch (if available), New Relic envs.

2) Appwrite setup (1.5h)
- Provision Appwrite on DigitalOcean (single Droplet OK for demo).
- Create DB + collections (organizations, tasks, claims, badges) and indexes.
- Service key for server-side; configure CORS.

3) Core pages (3h)
- Feed (`/`): list tasks with `TaskCard` and `EmptyState`.
- Task detail: show title, desc, tags, estimated time; server-side translate on load with cache.
- Claim/submit: proof URL or file, notes; POST to claim API.

4) NGO basics (1.5h)
- Simple form at `/org` to create task (title, shortDescription, description, tags, minutes, language).
- Server action creates document in Appwrite; success snackbar.

5) Gamification (1h)
- On approved claim, issue badge via Appwrite Function and store in `badges`.
- Dashboard: XP bar, badge chips.

6) Observability + polish (1h)
- Add New Relic agents; basic error boundaries.
- Accessibility pass (labels, aria, focus styles). Basic SEO.

7) Docs & submission (1h)
- README: setup, env vars, run, deploy, data model, sponsor notes.
- OpenAPI for `/api/tasks` GET; publish to Bump.sh; link in footer.
- Prepare Devpost write-up outline and 90s demo script.

Stretch (time-permitting)
- Azure Maps: geotag tasks; simple filter on location.
- Leaderboard (opt-in), streak counter, advanced filters.

## Directory Sketch
```txt
src/
  lib/
    components/ (TaskCard, EmptyState, ProgressBar, BadgeChip, AchievementModal)
    server/ (appwrite.ts, azure.ts)
    types.ts
  routes/
    +layout.svelte
    +page.svelte
    +page.server.ts
    task/[id]/+page.svelte
    task/[id]/claim/+page.svelte
    org/+page.svelte
    dashboard/+page.svelte
    api/tasks/+server.ts
    api/tasks/[id]/claim/+server.ts
app.css
```

## Environment Variables
```bash
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DB_ID=
APPWRITE_TASKS_COL_ID=
APPWRITE_CLAIMS_COL_ID=
APPWRITE_BADGES_COL_ID=
AZURE_TRANSLATOR_ENDPOINT=
AZURE_TRANSLATOR_KEY=
AZURE_TRANSLATOR_REGION=
NEW_RELIC_LICENSE_KEY=
NEW_RELIC_APP_NAME=micromatch-web
```

## API (for Bump.sh)
- `GET /api/tasks`: list public tasks (title, shortDescription, tags, estimatedMinutes, language)
- `POST /api/tasks`: create task (auth required, NGO role) — MVP acceptable
- `POST /api/tasks/{id}/claim`: create claim (auth required)

## Testing & Quality
- Unit: light tests for helpers (translate cache, mappers)
- E2E smoke: load feed, view task, submit claim (Playwright minimal)
- A11y: svelte-a11y lint, keyboard nav check

## Security
- Secrets via 1Password (dev + CI)
- Server-only usage of API keys; strict CORS on Appwrite
- Basic rate-limits on public API routes (per-IP)

## Performance
- SSR pages, cache translations by taskId+locale
- Lazy-load confetti; compress images/SVGs

## Risks & Mitigation
- Appwrite provisioning time → fallback to local Docker if needed
- Azure API quota → add simple cache + graceful fallback to original text
- Heroku free-tier constraints → ensure SSR within limits; enable logging

## Success Criteria
- End-to-end volunteer and NGO flows work reliably
- Judges can browse tasks, claim, and see a badge earned
- Clean README, OpenAPI on Bump.sh, live deployment with domain

## Submission Checklist
- Live URL + credentials for NGO test account
- GitHub repo (MIT or Apache-2.0)
- README with setup, env vars, sponsor mapping, screenshots
- OpenAPI link (Bump.sh) in README and footer
- Short write-up (problem, solution, impact, roadmap)
- Optional 60–90s demo video

## Demo Script (90s)
1) Open home, show localized tasks (Auto-translated chip)
2) Open a task, quick primer link (DataCamp/Educative)
3) Claim + submit proof URL, approve in NGO panel
4) Confetti + badge chip + XP progress
5) Show API docs link (Bump.sh) and New Relic dashboard

## Post-hackathon Roadmap
- Real-time chat for reviewers (Weavy or custom later)
- Reputation system and advanced moderation
- Mobile PWA, push notifications, richer i18n

