import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_NGO_TEAM_ID, APPWRITE_VOLUNTEER_TEAM_ID } from '$env/static/private';

export async function getTeamsClient() {
  const { Client, Teams, Query } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);
  return { teams: new Teams(client), Query } as const;
}

export async function isUserInTeam(userId: string, teamId?: string): Promise<boolean> {
  if (!teamId) return false;
  const { teams, Query } = await getTeamsClient();
  const list = await teams.listMemberships(teamId, [Query.equal('userId', userId), Query.limit(1)]);
  return (list.total ?? list.memberships?.length ?? list.members?.length ?? 0) > 0 || (list.memberships?.length ?? 0) > 0 || (list.members?.length ?? 0) > 0;
}

export async function removeUserFromTeam(userId: string, teamId?: string) {
  if (!teamId) return;
  const { teams, Query } = await getTeamsClient();
  const list = await teams.listMemberships(teamId, [Query.equal('userId', userId), Query.limit(5)]);
  const items: any[] = (list as any).memberships ?? (list as any).members ?? (list as any).data ?? [];
  for (const m of items) {
    const membershipId = m.$id ?? m.id;
    if (membershipId) {
      await teams.deleteMembership(teamId, membershipId);
    }
  }
}

export async function addUserToTeam(userId: string, teamId?: string, roles: string[] = []) {
  if (!teamId) return;
  const { teams } = await getTeamsClient();
  await teams.createMembership(teamId, roles, undefined, userId);
}

export const NGO_TEAM_ID = APPWRITE_NGO_TEAM_ID;
export const VOLUNTEER_TEAM_ID = APPWRITE_VOLUNTEER_TEAM_ID;

