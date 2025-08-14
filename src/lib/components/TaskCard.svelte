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
</script>

<article class="card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;" on:click={() => window.location.href = href}>
  <a href={href} style="text-decoration:none; color:inherit;">
    <h3 style="margin: 0 0 var(--space-2) 0; font-size: var(--text-lg); line-height: var(--leading-tight); font-weight: 500; color: var(--color-text);">{title}</h3>
    <p style="margin: 0; color: var(--color-text-secondary); line-height: var(--leading-normal); font-size: var(--text-sm);">{shortDescription}</p>
  </a>

  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-2);">
    {#if typeof estimatedMinutes === 'number'}
      <span class="chip chip-primary">
        <Icon icon="mdi:clock-outline" width="12" height="12"/> {estimatedMinutes} min
      </span>
    {/if}
    {#if language}
      <span class="chip chip-secondary">
        <Icon icon="mdi:translate" width="12" height="12"/> {language}
      </span>
    {/if}
    {#each tags as tag}
      <span class="chip chip-secondary">#{tag}</span>
    {/each}
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-3);">
    <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-xs);">
      <Icon icon="mdi:account-heart-outline" width="14" height="14"/>
      <span>Help needed</span>
    </div>
    <Button variant="text" href={href} aria-label={`View ${title}`} style="color: var(--color-primary); font-weight: 500;">View</Button>
  </div>
</article>

