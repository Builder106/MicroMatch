<script lang="ts">
  export let title: string;
  export let lede: string | undefined = undefined;
</script>

<svelte:head>
  <title>{title} · MicroMatch</title>
</svelte:head>

<article class="static-article card" style="max-width: 720px; margin: 0 auto; padding: var(--space-8);">
  <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-4);">{title}</h1>
  {#if lede}
    <p class="text-muted" style="font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-8);">{lede}</p>
  {/if}
  <div class="static-body">
    <slot />
  </div>
</article>

<style>
  .static-body :global(p) {
    margin-bottom: var(--space-4);
    color: var(--color-text);
    line-height: var(--leading-relaxed);
  }
  .static-body :global(p:last-child) {
    margin-bottom: 0;
  }
  .static-body :global(ul) {
    margin: 0 0 var(--space-4) 0;
    padding-left: 1.25rem;
    color: var(--color-text);
    line-height: var(--leading-relaxed);
  }
  .static-body :global(li) {
    margin-bottom: var(--space-2);
  }
  .static-body :global(a) {
    color: var(--color-primary);
    font-weight: var(--font-medium);
  }
</style>
