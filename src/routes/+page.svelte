<script lang="ts">
  import SearchBar from "$lib/components/SearchBar.svelte";
  import TaskCard from "$lib/components/TaskCard.svelte";
  import FabCompose from "$lib/components/FabCompose.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import Icon from "@iconify/svelte";

  let q = "";
  const tasks = [
    { id: '1', title: 'Translate NGO landing blurb', shortDescription: 'Help local NGO by translating 120 words to Spanish.', tags: ['translation','spanish'], estimatedMinutes: 15, language: 'Auto-translated' },
    { id: '2', title: 'Design a simple flyer', shortDescription: 'Create an A5 flyer for community clean-up.', tags: ['design','canva'], estimatedMinutes: 30, language: 'English' },
    { id: '3', title: 'Data entry: Volunteer emails', shortDescription: 'Clean and dedupe 50 emails for newsletter.', tags: ['data','excel'], estimatedMinutes: 20, language: 'English' },
  ];

  // Quick filters
  let selectedTags: string[] = [];
  let maxMinutes: number | null = null; // e.g., 15, 20, 30
  let sortBy: 'recommended' | 'shortest' | 'az' = 'recommended';

  const toggleTag = (tag: string) => {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
  };

  const clearFilters = () => {
    selectedTags = [];
    maxMinutes = null;
    q = "";
    sortBy = 'recommended';
  };

  const quickTags = ['translation', 'design', 'data', 'excel', 'spanish'];
  const timeOptions = [15, 20, 30];

  // Filtering + sorting derived store
  $: filtered = tasks.filter((t) => {
    const qLower = q.toLowerCase();
    const matchesQuery =
      qLower === '' ||
      t.title.toLowerCase().includes(qLower) ||
      t.shortDescription.toLowerCase().includes(qLower) ||
      t.tags.some((tg) => tg.toLowerCase().includes(qLower));

    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tg) => t.tags.includes(tg));

    const matchesTime =
      maxMinutes === null ||
      (typeof t.estimatedMinutes === 'number' && t.estimatedMinutes <= maxMinutes);

    return matchesQuery && matchesTags && matchesTime;
  });

  $: sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'shortest') {
      const am = typeof a.estimatedMinutes === 'number' ? a.estimatedMinutes : Number.MAX_SAFE_INTEGER;
      const bm = typeof b.estimatedMinutes === 'number' ? b.estimatedMinutes : Number.MAX_SAFE_INTEGER;
      return am - bm;
    }
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    return 0; // recommended = original order
  });
</script>

<div style="padding:8px 8px 0 8px;">
  <h2 style="margin:0 0 8px 8px; font-size:20px; font-weight:700; color: var(--color-text);">Do a quick good deed</h2>
  <SearchBar value={q} onInput={(v) => (q = v)} />

  <!-- Quick filters -->
  <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:8px;">
    {#each timeOptions as m}
      <button
        class="card"
        aria-pressed={maxMinutes === m}
        on:click={() => (maxMinutes = maxMinutes === m ? null : m)}
        style="border:none; cursor:pointer; padding:6px 10px; border-radius:999px; font-size:12px; background:{maxMinutes === m ? '#eef2ff' : 'var(--color-surface)'}; color:{maxMinutes === m ? '#1d4ed8' : 'inherit'}">
        <Icon icon="mdi:clock-outline" /> ≤ {m} min
      </button>
    {/each}

    {#each quickTags as tag}
      <button
        class="card"
        aria-pressed={selectedTags.includes(tag)}
        on:click={() => toggleTag(tag)}
        style="border:none; cursor:pointer; padding:6px 10px; border-radius:999px; font-size:12px; background:{selectedTags.includes(tag) ? '#f1f5f9' : 'var(--color-surface)'};">
        #{tag}
      </button>
    {/each}

    <div style="margin-left:auto; display:flex; align-items:center; gap:8px;">
      <label for="sort" style="font-size:12px; color:var(--color-muted);">Sort</label>
      <select id="sort" bind:value={sortBy} style="padding:6px 10px; border-radius:999px; border:1px solid var(--color-outline); background:var(--color-surface);">
        <option value="recommended">Recommended</option>
        <option value="shortest">Shortest time</option>
        <option value="az">A–Z</option>
      </select>
      {#if q || selectedTags.length || maxMinutes !== null || sortBy !== 'recommended'}
        <button on:click={clearFilters} style="border:none; background:transparent; color:#2563eb; cursor:pointer; font-size:12px;">Clear</button>
      {/if}
    </div>
  </div>
</div>

<div style="margin-top:8px; padding:0 8px; color:var(--color-muted); font-size:12px;">{sorted.length} task{sorted.length === 1 ? '' : 's'}</div>

{#if sorted.length === 0}
  <div style="margin-top:12px;">
    <EmptyState title="No tasks found" description="Try a different keyword or clear filters." />
  </div>
{:else}
  <div style="margin-top:8px; display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">
    {#each sorted as t}
      <TaskCard id={t.id} title={t.title} shortDescription={t.shortDescription} tags={t.tags} estimatedMinutes={t.estimatedMinutes} language={t.language} href={`/task/${t.id}`} />
    {/each}
  </div>
{/if}

<FabCompose />