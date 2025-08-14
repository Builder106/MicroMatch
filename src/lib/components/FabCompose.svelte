<script lang="ts">
  import Icon from "@iconify/svelte";
  export let href = "/org";
</script>

<a href={href} aria-label="Post task" style="position: fixed; right: var(--space-5); bottom: 88px; z-index: 5;">
  <div class="card-elevated" style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: var(--color-primary); display: flex; align-items: center; justify-content: center; box-shadow: var(--elev-3); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;" on:mouseenter={(e) => e.target.style.transform = 'scale(1.05)'} on:mouseleave={(e) => e.target.style.transform = 'scale(1)'}>
    <Icon icon="mdi:plus" width="24" height="24" style="color: var(--color-on-primary);"/>
  </div>
</a>