<script lang="ts">
  import Button from "@smui/button";
  import Icon from "@iconify/svelte";
  export let id: string;
  export let title: string;
  export let shortDescription: string;
  export let tags: string[] = [];
  export let estimatedMinutes: number | undefined = undefined;
  export let language: string | undefined = undefined;
  export let href: string = "/task/" + id;
  export let status: string | undefined = undefined;
  export let deadline: string | undefined = undefined;
  export let maxVolunteers: number | undefined = undefined;
  export let isVerified: boolean | undefined = undefined;

  // Helper function to get status color and icon
  function getStatusInfo(status: string | undefined) {
    switch (status) {
      case 'active':
        return { color: '#16a34a', icon: 'mdi:check-circle', label: 'Active' };
      case 'completed':
        return { color: '#3b82f6', icon: 'mdi:flag-checkered', label: 'Completed' };
      case 'expired':
        return { color: '#dc2626', icon: 'mdi:clock-alert', label: 'Expired' };
      case 'moderated':
        return { color: '#dc2626', icon: 'mdi:shield-alert', label: 'Under Review' };
      default:
        return { color: '#16a34a', icon: 'mdi:check-circle', label: 'Active' };
    }
  }

  // Helper function to format deadline
  function formatDeadline(deadline: string | undefined) {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', color: '#dc2626' };
    if (diffDays === 0) return { text: 'Due today', color: '#f59e0b' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: '#f59e0b' };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: '#f59e0b' };
    return { text: `Due ${date.toLocaleDateString()}`, color: '#6b7280' };
  }

  const statusInfo = getStatusInfo(status);
  const deadlineInfo = formatDeadline(deadline);
</script>

<article class="card hover-lift animate-fade-in" style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-radius: var(--radius-xl); position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, var(--color-accent-blue-50), transparent); border-radius: 0 0 0 100px; opacity: 0.5;"></div>
  
  <!-- Status Badge -->
  {#if status && status !== 'active'}
    <div style="position: absolute; top: var(--space-3); left: var(--space-3); z-index: 2;">
      <span class="chip" style="background: color-mix(in srgb, {statusInfo.color} 15%, transparent); color: {statusInfo.color}; border: 1px solid color-mix(in srgb, {statusInfo.color} 25%, transparent); font-size: var(--text-xs); font-weight: var(--font-medium);">
        <Icon icon={statusInfo.icon} width="12" height="12"/>
        {statusInfo.label}
      </span>
    </div>
  {/if}

  <!-- Verification Badge -->
  {#if isVerified === false}
    <div style="position: absolute; top: var(--space-3); right: var(--space-3); z-index: 2;">
      <span class="chip" style="background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; border: 1px solid color-mix(in srgb, #dc2626 25%, transparent); font-size: var(--text-xs); font-weight: var(--font-medium);">
        <Icon icon="mdi:shield-alert" width="12" height="12"/>
        Unverified
      </span>
    </div>
  {/if}
  
  <a href={href} style="text-decoration:none; color:inherit; display:block;">
    <h3 style="margin: 0 0 var(--space-3) 0; font-size: var(--text-xl); line-height: var(--leading-tight); font-weight: var(--font-semibold); color: var(--color-text); position: relative; z-index: 1;">{title}</h3>
    <p style="margin: 0; color: var(--color-text-secondary); line-height: var(--leading-relaxed); font-size: var(--text-base); position: relative; z-index: 1;">{shortDescription}</p>
  </a>

  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-3); position: relative; z-index: 1;">
    {#if typeof estimatedMinutes === 'number'}
      <span class="chip chip-primary" style="font-weight: var(--font-medium);">
        <Icon icon="mdi:clock-outline" width="14" height="14"/> {estimatedMinutes} min
      </span>
    {/if}
    {#if language}
      <span class="chip chip-secondary" style="font-weight: var(--font-medium);">
        <Icon icon="mdi:translate" width="14" height="14"/> {language}
      </span>
    {/if}
    {#if maxVolunteers}
      <span class="chip chip-secondary" style="font-weight: var(--font-medium);">
        <Icon icon="mdi:account-group" width="14" height="14"/> Max {maxVolunteers}
      </span>
    {/if}
    {#if deadlineInfo}
      <span class="chip" style="background: color-mix(in srgb, {deadlineInfo.color} 15%, transparent); color: {deadlineInfo.color}; border: 1px solid color-mix(in srgb, {deadlineInfo.color} 25%, transparent); font-weight: var(--font-medium);">
        <Icon icon="mdi:calendar-clock" width="14" height="14"/> {deadlineInfo.text}
      </span>
    {/if}
    {#each tags as tag (tag)}
      <span class="chip chip-secondary" style="font-weight: var(--font-medium);">#{tag}</span>
    {/each}
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4); position: relative; z-index: 1;">
    <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-sm);">
      <Icon icon="mdi:account-heart-outline" width="16" height="16"/>
      <span style="font-weight: var(--font-medium);">Help needed</span>
    </div>
    <Button variant="text" href={href} aria-label={`View ${title}`} class="btn-primary" style="padding: var(--space-2) var(--space-4); font-size: var(--text-sm); border-radius: var(--radius-lg);">
      <Icon icon="mdi:arrow-right" width="16" height="16" style="margin-left: var(--space-1);"/>
      View Task
    </Button>
  </div>
</article>

