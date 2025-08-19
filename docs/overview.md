# MicroMatch — Platform Overview

MicroMatch is a micro‑volunteering platform that pairs NGOs with bite‑sized tasks and helps volunteers complete them quickly with just‑in‑time learning.

## Key capabilities
- Browse and claim short, well‑scoped tasks
- Task detail with learning pointers and submission flow
- Auto‑translation on demand ("Auto‑translated" chip)
- Basic gamification: badges and XP progress
- Safety: Azure AI Content Safety checks on submissions
- Optional in‑app HelpBot via Azure Bot Service
- Public tasks API for read‑only integrations

## Roles
- Volunteer: discovers and completes tasks; earns badges
- NGO: posts tasks and reviews submissions
- Anonymous: can browse public tasks

## Core pages
- `/` or `/tasks`: Task feed
- `/task/[id]`: Task details (+ translation via `?lang=`)
- `/task/[id]/claim`: Submit proof and notes
- `/org`: Post a task (NGO only)
- `/dashboard`: Badges and XP

## How translation works
- Add `?lang=es` (for example) to task URLs to translate title and description server‑side.
- A chip “Auto‑translated” appears when translation is applied.

## Safety & moderation
- Text sent in task creation and claim notes is checked by Azure AI Content Safety.
- Unsafe content is blocked with a clear message.

## HelpBot
- Floating Help button opens web chat powered by Azure Bot Service (Direct Line).
- The bot can answer general help; it doesn’t automatically know your project context unless you add it to the bot.

## Public API
- `GET /api/tasks` → list public tasks (id, title, shortDescription, tags, estimatedMinutes, language)

