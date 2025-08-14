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

<article class="card hover-lift animate-fade-in" style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-radius: var(--radius-xl); position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, var(--color-accent-blue-50), transparent); border-radius: 0 0 0 100px; opacity: 0.5;"></div>
  
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

