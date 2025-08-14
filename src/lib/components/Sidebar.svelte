<script lang="ts">
  import Icon from '@iconify/svelte';
</script>

<aside class="sidebar">
  <nav style="display:flex; flex-direction:column; gap: var(--space-2); width: 100%;">
    <a href="/" style="display:flex; align-items:center; gap: var(--space-2); text-decoration:none; color: inherit; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);">
      <Icon icon="mdi:view-dashboard-outline" width="20" height="20"/>
      <span style="font-weight:500;">Feed</span>
    </a>
    <a href="/dashboard" style="display:flex; align-items:center; gap: var(--space-2); text-decoration:none; color: inherit; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);">
      <Icon icon="mdi:seal-variant" width="20" height="20"/>
      <span style="font-weight:500;">Badges</span>
    </a>
    <a href="/org" style="display:flex; align-items:center; gap: var(--space-2); text-decoration:none; color: inherit; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);">
      <Icon icon="mdi:plus-circle-outline" width="20" height="20"/>
      <span style="font-weight:500;">Post</span>
    </a>
  </nav>
</aside>

