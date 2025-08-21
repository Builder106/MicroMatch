<script lang="ts">
  import Icon from '@iconify/svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import BadgeChip from '$lib/components/BadgeChip.svelte';
  import { page } from '$app/state';
  export let data: {
    userRole: 'anonymous' | 'user' | 'ngo' | 'volunteer';
    user: { id: string; email?: string } | null;
    tasks: Array<{ id: string; title: string; shortDescription: string; tags: string[]; estimatedMinutes?: number }>;
    analytics: {
      totalBadgesAwarded: number;
      totalVolunteersEngaged: number;
      averageTasksPerVolunteer: number;
      topBadgeTypes: Array<{ type: string; count: number; percentage: number }>;
      engagementTrend: Array<{ month: string; badges: number; volunteers: number }>;
      recentAwards: Array<{ volunteer: string; badge: string; task: string; date: string }>;
    };
  };

  const { analytics } = data;
</script>

<svelte:head>
  <title>Badge Analytics - MicroMatch</title>
</svelte:head>

<div class="animate-slide-up">
  <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-warning), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
        <Icon icon="mdi:chart-line" width="24" height="24" style="color: white;"/>
      </div>
      <div>
        <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Badge Analytics</h1>
        <p class="text-muted" style="font-size: var(--text-sm);">Track volunteer engagement and badge performance</p>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <a href="/badges/manage" class="btn-secondary" style="text-decoration: none; padding: var(--space-3) var(--space-6);">
        <Icon icon="mdi:shield-edit" width="16" height="16" style="margin-right: var(--space-2);"/>
        Manage Badges
      </a>
      <a href="/dashboard" class="btn-secondary" style="text-decoration: none; padding: var(--space-3) var(--space-6);">
        <Icon icon="mdi:arrow-left" width="16" height="16" style="margin-right: var(--space-2);"/>
        Back to Dashboard
      </a>
    </div>
  </div>

  <!-- Key Metrics -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-6);">
    <div class="card" style="padding: var(--space-5); text-align: center;">
      <div style="width: 60px; height: 60px; border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-success) 15%, transparent); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
        <Icon icon="mdi:trophy-outline" width="30" height="30" style="color: var(--color-success);"/>
      </div>
      <div style="font-size: var(--text-3xl); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-1);">{analytics.totalBadgesAwarded}</div>
      <div style="font-size: var(--text-sm); color: var(--color-text-secondary); font-weight: 500;">Badges Awarded</div>
    </div>

    <div class="card" style="padding: var(--space-5); text-align: center;">
      <div style="width: 60px; height: 60px; border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-primary) 15%, transparent); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
        <Icon icon="mdi:account-group" width="30" height="30" style="color: var(--color-primary);"/>
      </div>
      <div style="font-size: var(--text-3xl); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-1);">{analytics.totalVolunteersEngaged}</div>
      <div style="font-size: var(--text-sm); color: var(--color-text-secondary); font-weight: 500;">Volunteers Engaged</div>
    </div>

    <div class="card" style="padding: var(--space-5); text-align: center;">
      <div style="width: 60px; height: 60px; border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-warning) 15%, transparent); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
        <Icon icon="mdi:trending-up" width="30" height="30" style="color: var(--color-warning);"/>
      </div>
      <div style="font-size: var(--text-3xl); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-1);">{analytics.averageTasksPerVolunteer}</div>
      <div style="font-size: var(--text-sm); color: var(--color-text-secondary); font-weight: 500;">Avg Tasks/Volunteer</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); margin-bottom: var(--space-6);">
    <!-- Badge Distribution -->
    <section class="card" style="padding: var(--space-6);">
      <h2 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:chart-pie" width="20" height="20" style="color: var(--color-primary);"/>
        Badge Distribution
      </h2>
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        {#each analytics.topBadgeTypes as badgeType (badgeType.type)}
          <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); background: var(--color-surface-variant); border-radius: var(--radius-sm);">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <BadgeChip label={badgeType.type} color="#3b82f6" />
              <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">{badgeType.count} awards</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <div style="width: 100px; height: 8px; background: var(--color-outline-variant); border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: {badgeType.percentage}%; background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)); border-radius: var(--radius-full);"></div>
              </div>
              <span style="font-size: var(--text-sm); color: var(--color-text-secondary); min-width: 35px;">{badgeType.percentage}%</span>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Engagement Trend -->
    <section class="card" style="padding: var(--space-6);">
      <h2 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:trending-up" width="20" height="20" style="color: var(--color-success);"/>
        Engagement Trend
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: var(--space-3);">
        {#each analytics.engagementTrend as trend (trend.month)}
          <div style="text-align: center; padding: var(--space-3); background: var(--color-surface-variant); border-radius: var(--radius-sm);">
            <div style="font-size: var(--text-lg); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-2);">{trend.badges}</div>
            <div style="font-size: var(--text-xs); color: var(--color-text-secondary); margin-bottom: var(--space-1);">badges</div>
            <div style="font-size: var(--text-sm); font-weight: 500; color: var(--color-primary); margin-bottom: var(--space-1);">{trend.volunteers}</div>
            <div style="font-size: var(--text-xs); color: var(--color-text-secondary);">volunteers</div>
            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--color-text); margin-top: var(--space-2);">{trend.month}</div>
          </div>
        {/each}
      </div>
    </section>
  </div>

  <!-- Recent Awards -->
  <section class="card" style="padding: var(--space-6);">
    <h2 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
      <Icon icon="mdi:clock-outline" width="20" height="20" style="color: var(--color-warning);"/>
      Recent Awards
    </h2>
    <div style="display: grid; gap: var(--space-3);">
      {#each analytics.recentAwards as award, index (index)}
        <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); background: var(--color-surface-variant); border-radius: var(--radius-sm); border-left: 4px solid var(--color-success);">
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              <Icon icon="mdi:account" width="20" height="20" style="color: white;"/>
            </div>
            <div>
              <div style="font-weight: 500; color: var(--color-text); margin-bottom: var(--space-1);">{award?.volunteer || 'Unknown'}</div>
              <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">
                <BadgeChip label={award?.badge || 'Unknown'} color="#16a34a" /> for {award?.task || 'Unknown'}
              </div>
            </div>
          </div>
          <div style="text-align: right; font-size: var(--text-sm); color: var(--color-text-secondary);">
            <div style="font-weight: 500;">{award?.date ? new Date(award.date).toLocaleDateString() : 'Unknown'}</div>
            <div>{award?.date ? new Date(award.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
