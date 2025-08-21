import { env } from '$env/dynamic/private';

export async function getTeamsClient() {
  const { Client, Teams, Query } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT!)
    .setProject(env.APPWRITE_PROJECT_ID!)
    .setKey(env.APPWRITE_API_KEY!);
  return { teams: new Teams(client), Query } as const;
}

export async function isUserInTeam(userId: string, teamId?: string): Promise<boolean> {
  if (!teamId) return false;
  try {
    const { teams, Query } = await getTeamsClient();
    const list = await teams.listMemberships(teamId, [Query.equal('userId', userId), Query.limit(1)]);
    return (list.total ?? list.memberships?.length ?? list.members?.length ?? 0) > 0 || (list.memberships?.length ?? 0) > 0 || (list.members?.length ?? 0) > 0;
  } catch (err) {
    // If teams API is not available or missing permissions, fallback to false
    console.warn('Teams API unavailable, falling back to preferences-based roles');
    return false;
  }
}

export async function removeUserFromTeam(userId: string, teamId?: string) {
  if (!teamId) return;
  try {
    const { teams, Query } = await getTeamsClient();
    const list = await teams.listMemberships(teamId, [Query.equal('userId', userId), Query.limit(5)]);
    const items: any[] = (list as any).memberships ?? (list as any).members ?? (list as any).data ?? [];
    for (const m of items) {
      const membershipId = m.$id ?? m.id;
      if (membershipId) {
        await teams.deleteMembership(teamId, membershipId);
      }
    }
  } catch (err) {
    console.warn('Could not remove user from team:', err);
  }
}

export async function addUserToTeam(userId: string, teamId?: string, roles: string[] = []) {
  if (!teamId) return;
  try {
    const { teams } = await getTeamsClient();
    await teams.createMembership(teamId, roles, undefined, userId);
  } catch (err) {
    console.warn('Could not add user to team:', err);
  }
}

export const NGO_TEAM_ID = env.APPWRITE_NGO_TEAM_ID;
export const VOLUNTEER_TEAM_ID = env.APPWRITE_VOLUNTEER_TEAM_ID;

