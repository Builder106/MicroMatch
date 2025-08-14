<script lang="ts">
  import { page } from "$app/stores";
  import Button from "@smui/button";
  import Icon from "@iconify/svelte";
  $: id = $page.params.id;

  // Placeholder task content for design demo
  const task = {
    title: "Translate NGO landing blurb",
    org: "Local Aid Network",
    description: "Translate 120-word blurb from English to Spanish. Provide Google Doc link with translation.",
    tags: ["translation", "spanish"],
    estimatedMinutes: 15,
    lang: "Auto-translated"
  };
</script>

<header class="card" style="padding:16px; display:flex; flex-direction:column; gap:6px;">
  <h2 style="margin:0;">{task.title}</h2>
  <div style="display:flex; align-items:center; gap:8px; color:var(--color-muted);">
    <Icon icon="mdi:domain"/> {task.org}
  </div>
  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:4px;">
    <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:#eef2ff; color:#1d4ed8; font-size:12px;">
      <Icon icon="mdi:clock-outline" /> {task.estimatedMinutes} min
    </span>
    <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:#f1f5f9; color:#0f172a; font-size:12px;">
      <Icon icon="mdi:translate" /> {task.lang}
    </span>
    {#each task.tags as tag}
      <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:#f6f7fb; color:#334155; font-size:12px;">{tag}</span>
    {/each}
  </div>
</header>

<section class="card" style="padding:16px; margin-top:12px;">
  <h3 style="margin:0 0 6px 0;">Description</h3>
  <p style="margin:0; color:var(--color-muted);">{task.description}</p>
</section>

<div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
  <Button variant="text" href={`/task/${id}/claim`} aria-label="Claim task">Claim</Button>
  <Button href={`/task/${id}/claim`} aria-label="Submit proof">Submit proof</Button>
  
</div>