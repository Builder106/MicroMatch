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

<article class="card" style="padding:12px; display:flex; flex-direction:column; gap:8px;">
  <a href={href} style="text-decoration:none; color:inherit;">
    <h3 style="margin:0 0 4px 0; font-size:18px; line-height:1.3;">{title}</h3>
    <p style="margin:0; color:var(--color-muted); line-height:1.5;">{shortDescription}</p>
  </a>

  <div style="display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-top:4px;">
    {#if typeof estimatedMinutes === 'number'}
      <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:#eef2ff; color:#1d4ed8; font-size:12px;">
        <Icon icon="mdi:clock-outline" /> {estimatedMinutes} min
      </span>
    {/if}
    {#if language}
      <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:#f1f5f9; color:#0f172a; font-size:12px;">
        <Icon icon="mdi:translate" /> {language}
      </span>
    {/if}
    {#each tags as tag}
      <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:#f6f7fb; color:#334155; font-size:12px;">{tag}</span>
    {/each}
  </div>

  <div style="display:flex; justify-content:flex-end; margin-top:4px;">
    <Button variant="text" href={href} aria-label={`View ${title}`}>View</Button>
  </div>
</article>

