<script lang="ts">
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import BadgeChip from "$lib/components/BadgeChip.svelte";
  import Icon from "@iconify/svelte";
  const xp = 0.45; // 45%
  const badges = [
    { label: "Translator I", color: "#2563eb" },
    { label: "Helper", color: "#16a34a" },
    { label: "Quick Start", color: "#f59e0b" },
  ];
  
  const stats = [
    { label: "Tasks completed", value: "12", icon: "mdi:check-circle-outline" },
    { label: "Hours contributed", value: "4.2", icon: "mdi:clock-outline" },
    { label: "Impact score", value: "89", icon: "mdi:heart-outline" },
  ];
</script>

<div class="animate-slide-up">
  <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
    <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
      <Icon icon="mdi:account-circle-outline" width="24" height="24" style="color: white;"/>
    </div>
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Your Impact</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Track your volunteering journey</p>
    </div>
  </div>

  <section class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4);">
      <h2 style="font-size: var(--text-xl); font-weight: 500;">Progress to next level</h2>
      <span style="color: var(--color-primary); font-weight: 500; font-size: var(--text-sm);">Level 2</span>
    </div>
    <div style="display: flex; align-items: center; gap: var(--space-4);">
      <div style="flex: 1;">
        <ProgressBar value={xp} />
      </div>
      <span style="color: var(--color-text-secondary); font-weight: 500; min-width: 48px; text-align: right; font-size: var(--text-sm);">{Math.round(xp*100)}%</span>
    </div>
    <p style="margin-top: var(--space-3); color: var(--color-text-secondary); font-size: var(--text-sm);">
      Complete 3 more tasks to reach Level 3 and unlock new opportunities!
    </p>
  </section>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
    {#each stats as stat}
      <div class="card" style="padding: var(--space-4); text-align: center;">
        <div style="width: 40px; height: 40px; margin: 0 auto var(--space-3); border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-primary) 12%, transparent); display: flex; align-items: center; justify-content: center;">
          <Icon icon={stat.icon} width="20" height="20" style="color: var(--color-primary);"/>
        </div>
        <div style="font-size: var(--text-2xl); font-weight: 500; color: var(--color-text); margin-bottom: var(--space-1);">{stat.value}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-secondary); font-weight: 500;">{stat.label}</div>
      </div>
    {/each}
  </div>

  <section class="card" style="padding: var(--space-6);">
    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
      <Icon icon="mdi:trophy-outline" width="24" height="24" style="color: var(--color-warning);"/>
      <h3 style="font-size: var(--text-xl); font-weight: 500;">Your Badges</h3>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: var(--space-3);">
      {#each badges as b}
        <BadgeChip label={b.label} color={b.color} />
      {/each}
    </div>
    {#if badges.length === 0}
      <div style="text-align: center; padding: var(--space-8); color: var(--color-text-secondary);">
        <Icon icon="mdi:trophy-outline" width="48" height="48" style="opacity: 0.3; margin-bottom: var(--space-4);"/>
        <p>Complete your first task to earn your first badge!</p>
      </div>
    {/if}
  </section>
</div>
    <ProgressBar value={xp} />
    <span style="color:var(--color-muted); width:46px; text-align:right;">{Math.round(xp*100)}%</span>
  </div>
</section>

<section class="card" style="padding:16px; margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">
  <h3 style="margin:0 0 8px 0; width:100%;">Badges</h3>
  {#each badges as b}
    <BadgeChip label={b.label} color={b.color} />
  {/each}
</section>

