/**
 * MicroMatch idempotent seed.
 *
 *   bun run seed
 *
 * Creates a "MicroMatch Demo" NGO user and a small set of polished tasks
 * under that org so the landing page's Featured Tasks and the /tasks feed
 * have something real to render. Re-running the script never duplicates
 * anything: the user is matched by email, tasks are matched by (orgId,
 * title), and prefs/team-membership writes are idempotent by construction
 * (set-to-known-value, ignore-if-already-member).
 *
 * Reads from process.env (loaded from .env via dotenv). Required:
 *   APPWRITE_ENDPOINT
 *   APPWRITE_PROJECT_ID
 *   APPWRITE_API_KEY
 *
 * Optional (defaulted from appwrite.config.json values):
 *   APPWRITE_DB_ID            → 'micromatch'
 *   APPWRITE_TASKS_TABLE_ID   → 'tasks'
 *   APPWRITE_NGO_TEAM_ID      → 'ngo'
 *   SEED_DEMO_EMAIL           → 'demo@micromatch.app'
 *   SEED_DEMO_NAME            → 'MicroMatch Demo'
 */

import 'dotenv/config';
import { Client, Users, Teams, TablesDB, Query, ID } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
if (!endpoint || !projectId || !apiKey) {
  console.error('Missing APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY in env.');
  process.exit(1);
}

const dbId = process.env.APPWRITE_DB_ID ?? 'micromatch';
const tasksTable = process.env.APPWRITE_TASKS_TABLE_ID ?? 'tasks';
const ngoTeamId = process.env.APPWRITE_NGO_TEAM_ID ?? 'ngo';
const demoEmail = process.env.SEED_DEMO_EMAIL ?? 'demo@micromatch.app';
const demoName = process.env.SEED_DEMO_NAME ?? 'MicroMatch Demo';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const users = new Users(client);
const teams = new Teams(client);
const tables = new TablesDB(client);

type DemoTask = {
  title: string;
  shortDescription: string;
  description: string;
  language: string;
  estimatedMinutes: number;
  tags: string[];
};

// Eight evergreen tasks — no relative deadlines, no time-sensitive copy,
// so they don't rot. Diverse hashtags so the feed's tag chips have
// something to filter on.
const demoTasks: DemoTask[] = [
  {
    title: 'Translate a medical flyer into Spanish',
    shortDescription: 'Help patients understand a one-page flyer about diabetes screenings.',
    description:
      'Translate a single-page patient flyer (~250 words) into clear, accessible Spanish. The original is a plain-language English version we use at clinic intake. Keep medical terms accurate and tone friendly.',
    language: 'English',
    estimatedMinutes: 15,
    tags: ['translation', 'spanish', 'health'],
  },
  {
    title: 'Tag historical photos for an archive',
    shortDescription: 'Add searchable tags (year, location, subject) to a small batch of photos.',
    description:
      'A community history archive needs tags on 20 scanned photos so they show up in search. We provide the photo set and a tag taxonomy; you fill in best-guess metadata.',
    language: 'English',
    estimatedMinutes: 5,
    tags: ['data', 'history'],
  },
  {
    title: 'Draft three social-post captions for an event',
    shortDescription: 'Write three short captions promoting a community clean-up day.',
    description:
      'Three captions, ~50 words each, suitable for Instagram, LinkedIn, and X. We provide the event details and tone notes; you write the variations.',
    language: 'English',
    estimatedMinutes: 10,
    tags: ['design'],
  },
  {
    title: 'Audit alt-text on a learning resource',
    shortDescription: 'Review alt-text for ~15 images on an open-access lesson page.',
    description:
      'Open the linked page, check each image, and either confirm the alt-text is accurate or suggest a better short description. Output is a simple table you fill in.',
    language: 'English',
    estimatedMinutes: 20,
    tags: ['design', 'data'],
  },
  {
    title: 'Categorize community Q&A entries',
    shortDescription: 'Sort 30 forum questions into 6 topic buckets.',
    description:
      'We have 30 community questions and a 6-topic taxonomy. For each question, pick the best topic. Edge cases get a short note explaining your choice.',
    language: 'English',
    estimatedMinutes: 15,
    tags: ['data'],
  },
  {
    title: 'Proofread a plain-language climate explainer',
    shortDescription: 'Catch typos and awkward phrasing in a 600-word explainer.',
    description:
      'A short explainer aimed at high-school readers. We need a careful proofread for grammar, clarity, and any jargon that should be replaced with plainer language.',
    language: 'English',
    estimatedMinutes: 25,
    tags: ['environment'],
  },
  {
    title: 'Build a beginner Excel formula reference',
    shortDescription: 'Write one-line explanations for 10 common Excel formulas.',
    description:
      'For a financial-literacy workshop. We give you the list of formulas; you write one short, plain-English explanation per formula. No screenshots needed.',
    language: 'English',
    estimatedMinutes: 20,
    tags: ['data', 'excel'],
  },
  {
    title: 'Translate a volunteer welcome email to Spanish',
    shortDescription: 'Translate a 150-word onboarding email into warm, casual Spanish.',
    description:
      'New-volunteer welcome email. Keep it warm, casual, and inclusive. We provide the English source and a glossary of names/places not to translate.',
    language: 'English',
    estimatedMinutes: 10,
    tags: ['translation', 'spanish'],
  },
];

async function findUserByEmail(email: string): Promise<{ $id: string } | null> {
  const res = await users.list([Query.equal('email', email), Query.limit(1)]);
  return (res.users[0] as any) ?? null;
}

async function ensureDemoUser(): Promise<string> {
  const existing = await findUserByEmail(demoEmail);
  if (existing) {
    console.log(`✓ Demo NGO user exists (${demoEmail}) → ${existing.$id}`);
    return existing.$id;
  }
  // Create with a long random password — no one signs in as this account;
  // we mutate via admin SDK only.
  const password = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const created = await users.create(ID.unique(), demoEmail, undefined, password, demoName);
  console.log(`+ Created demo NGO user ${demoEmail} → ${(created as any).$id}`);
  return (created as any).$id;
}

async function ensureUserPrefs(userId: string): Promise<void> {
  const me: any = await users.get(userId);
  const next = {
    ...(me?.prefs ?? {}),
    role: 'ngo',
    orgName: demoName,
    bio: 'Hand-picked demo tasks so first-time visitors have something to browse.',
    verificationStatus: 'verified',
  };
  await users.updatePrefs(userId, next);
  console.log(`✓ Prefs set on demo user (role=ngo, orgName=${demoName})`);
}

async function ensureNgoTeamMembership(userId: string): Promise<void> {
  if (!ngoTeamId) {
    console.log('· Skipping NGO team membership (APPWRITE_NGO_TEAM_ID not set)');
    return;
  }
  // teams.createMembership with a known userId is idempotent in practice:
  // Appwrite returns the existing membership rather than creating duplicates.
  // If a strict 409 is returned, swallow it.
  try {
    await teams.createMembership(ngoTeamId, ['ngo'], undefined, userId);
    console.log(`✓ Demo user is in '${ngoTeamId}' team`);
  } catch (err: any) {
    const status = err?.code ?? err?.response?.code;
    if (status === 409) {
      console.log(`✓ Demo user already in '${ngoTeamId}' team`);
    } else {
      console.warn(`! Could not add demo user to '${ngoTeamId}' team:`, err?.message ?? err);
    }
  }
}

async function listExistingTasks(orgId: string): Promise<Map<string, string>> {
  // Note: tasks DB column is `orgID` (uppercase D), per src/lib/server/appwrite.ts.
  const res: any = await tables.listRows(dbId, tasksTable, [
    Query.equal('orgID', orgId),
    Query.limit(100),
  ]);
  return new Map<string, string>(
    (res.rows ?? []).map((r: any) => [String(r.title ?? ''), String(r.$id)]),
  );
}

// getTasks() drops any row whose lastActivityAt is 30+ days stale (auto-archive,
// see filterTasksForFeed in src/lib/server/appwrite.ts). Demo tasks never get
// organic activity, so re-running this script must bump lastActivityAt on
// existing rows too — otherwise the feed silently goes empty ~30 days after
// the last seed run, with no error anywhere to point at why.
async function ensureTasks(orgId: string): Promise<{ created: number; refreshed: number }> {
  const existing = await listExistingTasks(orgId);
  let created = 0;
  let refreshed = 0;
  const now = new Date().toISOString();
  for (const t of demoTasks) {
    const existingId = existing.get(t.title);
    if (existingId) {
      await tables.updateRow(dbId, tasksTable, existingId, {
        status: 'active',
        lastActivityAt: now,
      });
      refreshed++;
      continue;
    }
    await tables.createRow(dbId, tasksTable, ID.unique(), {
      title: t.title,
      shortDescription: t.shortDescription,
      description: t.description,
      language: t.language,
      estimatedMinutes: t.estimatedMinutes,
      tags: t.tags,
      orgID: orgId,
      createdAt: now,
      status: 'active',
      maxVolunteers: null,
      deadline: null,
      isVerified: true,
      lastActivityAt: now,
    });
    created++;
  }
  console.log(`✓ Tasks: ${created} created, ${refreshed} refreshed (${demoTasks.length} total)`);
  return { created, refreshed };
}

async function main() {
  console.log(`Seeding ${endpoint} / ${projectId}\n`);
  const userId = await ensureDemoUser();
  await ensureUserPrefs(userId);
  await ensureNgoTeamMembership(userId);
  const stats = await ensureTasks(userId);
  console.log(
    `\nDone. Demo NGO userId: ${userId}. Tasks created: ${stats.created}, refreshed: ${stats.refreshed}.`,
  );
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
