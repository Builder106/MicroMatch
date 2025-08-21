<script lang="ts">
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import BadgeChip from "$lib/components/BadgeChip.svelte";
  import Icon from "@iconify/svelte";
  import { onMount } from 'svelte';
  import { fireConfettiBurst } from '$lib/utils/confetti';

  export let data: {
    signedIn: boolean;
    userData: any;
  };

  let xp = data.signedIn ? Math.min((data.userData?.approvedClaimsCount || 0) / 10, 1) : 0;
  let badges: Array<{ label: string; color?: string }> = [];

  let stats = data.signedIn
    ? [
        { label: "Tasks completed", value: String(data.userData?.approvedClaimsCount || 0), icon: "mdi:check-circle-outline" },
        { label: "Hours contributed", value: (data.userData?.totalHours || 0).toFixed(1), icon: "mdi:clock-outline" },
        { label: "Impact score", value: String(Math.min((data.userData?.approvedClaimsCount || 0) * 8 + 10, 100)), icon: "mdi:heart-outline" },
      ]
    : [
        { label: "Tasks completed", value: "0", icon: "mdi:check-circle-outline" },
        { label: "Hours contributed", value: "0.0", icon: "mdi:clock-outline" },
        { label: "Impact score", value: "0", icon: "mdi:heart-outline" },
      ];

  let recentClaims = data.userData?.myClaims?.slice(0, 3) || [];

  onMount(async () => {
    // Load badges for the signed-in user
    try {
      if (data.signedIn) {
        const res = await fetch('/api/badges', { credentials: 'include' });
        if (res.ok) {
          const payload = await res.json();
          badges = payload.map((b: any) => ({ label: b.label, color: b.color }));
        }
        if (badges.length === 0) {
          xp = 0;
          stats = [
            { label: "Tasks completed", value: "0", icon: "mdi:check-circle-outline" },
            { label: "Hours contributed", value: "0.0", icon: "mdi:clock-outline" },
            { label: "Impact score", value: "0", icon: "mdi:heart-outline" },
          ];
        }
      }
    } catch {}

    // Handle celebration and toast
    const url = new URL(window.location.href);
    const shouldCelebrate = url.searchParams.get('celebrate') === '1' || localStorage.getItem('celebrate') === '1';
    const toast = localStorage.getItem('toast');
    if (shouldCelebrate) {
      fireConfettiBurst();
      try { localStorage.removeItem('celebrate'); } catch {}
    }
    if (toast) {
      const el = document.getElementById('toast');
      if (el) {
        el.textContent = toast;
        el.style.display = 'block';
        setTimeout(() => (el.style.display = 'none'), 3000);
      }
      try { localStorage.removeItem('toast'); } catch {}
    }
  });
</script>

<div class="animate-slide-up">
  <!-- Header -->
  <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
    <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
      <Icon icon="mdi:hand-heart" width="24" height="24" style="color: white;"/>
    </div>
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Your Impact</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Track your volunteering journey and contributions</p>
    </div>
  </div>

  <!-- Quick Actions -->
  <section class="card" style="padding: var(--space-4); margin-bottom: var(--space-6);">
    <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
      <a href="/" class="btn-secondary" style="text-decoration: none; display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:magnify" width="18" height="18"/>
        Browse Tasks
      </a>
      <a href="/profile" class="btn-secondary" style="text-decoration: none; display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:account-edit" width="18" height="18"/>
        Update Profile
      </a>
    </div>
  </section>

  <!-- Progress Section -->
  <section class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4);">
      <h2 style="font-size: var(--text-xl); font-weight: 500;">Progress to next level</h2>
      <span style="color: var(--color-primary); font-weight: 500; font-size: var(--text-sm);">Level {Math.floor((data.userData?.approvedClaimsCount || 0) / 3) + 1}</span>
    </div>
    <div style="display: flex; align-items: center; gap: var(--space-4);">
      <div style="flex: 1;">
        <ProgressBar value={xp} />
      </div>
      <span style="color: var(--color-text-secondary); font-weight: 500; min-width: 48px; text-align: right; font-size: var(--text-sm);">{Math.round(xp*100)}%</span>
    </div>
    <p style="margin-top: var(--space-3); color: var(--color-text-secondary); font-size: var(--text-sm);">
      {#if !data.signedIn}
        Sign in and complete your first task to start earning progress!
      {:else if Number(stats[0].value) === 0}
        Browse available tasks and complete your first one to start earning progress!
      {:else}
        Complete {Math.max(0, 3 - (data.userData?.approvedClaimsCount || 0) % 3)} more tasks to reach Level {Math.floor((data.userData?.approvedClaimsCount || 0) / 3) + 2}!
      {/if}
    </p>
  </section>

  <!-- Stats Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
    {#each stats as stat (stat.label)}
      <div class="card" style="padding: var(--space-4); text-align: center;">
        <div style="width: 40px; height: 40px; margin: 0 auto var(--space-3); border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-primary) 12%, transparent); display: flex; align-items: center; justify-content: center;">
          <Icon icon={stat.icon} width="20" height="20" style="color: var(--color-primary);"/>
        </div>
        <div style="font-size: var(--text-2xl); font-weight: 500; color: var(--color-text); margin-bottom: var(--space-1);">{stat.value}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-secondary); font-weight: 500;">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- Recent Activity -->
  {#if data.signedIn && recentClaims.length > 0}
    <section class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
      <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
        <Icon icon="mdi:clock-outline" width="24" height="24" style="color: var(--color-primary);"/>
        <h3 style="font-size: var(--text-xl); font-weight: 500;">Recent Activity</h3>
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        {#each recentClaims as claim}
          <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: color-mix(in srgb, var(--color-outline) 8%, transparent); border-radius: var(--radius-sm);">
            <div style="width: 8px; height: 8px; border-radius: var(--radius-full); background: {claim.status === 'approved' ? 'var(--color-success)' : claim.status === 'pending' ? 'var(--color-warning)' : 'var(--color-error)'}; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <p style="font-weight: 500; margin-bottom: var(--space-1);">{claim.task?.title || 'Task'}</p>
              <p style="font-size: var(--text-sm); color: var(--color-text-secondary);">
                {claim.status === 'approved' ? 'Completed' : claim.status === 'pending' ? 'Under review' : 'Needs revision'}
                {claim.reviewedAt ? ` • ${new Date(claim.reviewedAt).toLocaleDateString()}` : ` • ${new Date(claim.createdAt || '').toLocaleDateString()}`}
              </p>
            </div>
            {#if claim.status === 'approved'}
              <Icon icon="mdi:check-circle" width="20" height="20" style="color: var(--color-success);"/>
            {:else if claim.status === 'pending'}
              <Icon icon="mdi:clock-outline" width="20" height="20" style="color: var(--color-warning);"/>
            {:else}
              <Icon icon="mdi:alert-circle" width="20" height="20" style="color: var(--color-error);"/>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Badges Section -->
  <section class="card" style="padding: var(--space-6);">
    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); color: {data.signedIn ? 'inherit' : 'var(--color-text-secondary)'};">
      <Icon icon={data.signedIn ? 'mdi:trophy-outline' : 'mdi:lock'} width="24" height="24" style="color: {data.signedIn ? 'var(--color-warning)' : 'var(--color-text-secondary)'};"/>
      <h3 style="font-size: var(--text-xl); font-weight: 500;">Your Badges</h3>
    </div>
    <div style="position: relative; min-height: 120px;">
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-3); opacity: {data.signedIn ? 1 : 0.4}; filter: {data.signedIn ? 'none' : 'grayscale(100%)'};">
      {#each badges as b (b.label)}
        <BadgeChip label={b.label} color={b.color} />
      {/each}
    </div>
      {#if !data.signedIn}
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
          <div style="text-align:center;">
            <p style="margin-bottom: var(--space-3); color: var(--color-text-secondary);">Sign in to see your badges</p>
            <a href="/login" class="btn-primary" style="text-decoration:none;">Sign in</a>
          </div>
        </div>
      {:else if badges.length === 0}
        <div style="text-align: center; padding: var(--space-8); color: var(--color-text-secondary);">
          <Icon icon="mdi:trophy-outline" width="48" height="48" style="opacity: 0.3; margin-bottom: var(--space-4);"/>
          <p>Complete your first task to earn your first badge!</p>
        </div>
      {/if}
    </div>
  </section>

  <div id="toast" class="card" style="display:none; position: fixed; bottom: 86px; left: 50%; transform: translateX(-50%); padding: var(--space-3) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-outline-variant); box-shadow: var(--elev-2); border-radius: var(--radius-sm); font-weight: 500;"></div>
</div>
