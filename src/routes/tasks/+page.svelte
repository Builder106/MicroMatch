<script lang="ts">
  import SearchBar from "$lib/components/SearchBar.svelte";
  import TaskCard from "$lib/components/TaskCard.svelte";
  import FabCompose from "$lib/components/FabCompose.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import Icon from "@iconify/svelte";

  export let data: { tasks: Array<{ id: string; title: string; shortDescription: string; tags: string[]; estimatedMinutes?: number; language?: string }>};
  let q = "";
  const tasks = data.tasks;

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

<div class="animate-slide-up" style="padding: var(--space-4) var(--space-2) 0 var(--space-2);">
  <div class="card glass" style="padding: var(--space-6); margin-bottom: var(--space-6); border-radius: var(--radius-xl);">
    <div style="display: flex; align-items: center; gap: var(--space-4);">
      <div style="width: 56px; height: 56px; border-radius: var(--radius-2xl); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center; box-shadow: var(--elev-2);">
        <Icon icon="mdi:heart-outline" width="28" height="28" style="color: white;"/>
      </div>
      <div style="flex: 1;">
        <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); color: var(--color-text); margin-bottom: var(--space-2); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Do a quick good deed</h1>
        <p class="text-muted" style="font-size: var(--text-lg); font-weight: var(--font-medium);">Find micro-volunteering tasks that match your skills and make a difference in minutes</p>
      </div>
    </div>
  </div>
  
  <SearchBar value={q} onInput={(v) => (q = v)} />

  <!-- Quick filters -->
  <div class="card" style="display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; margin-top: var(--space-4); padding: var(--space-4); border-radius: var(--radius-xl);">
    {#each timeOptions as m (m)}
      <button
        class="chip chip-primary animate-scale-in"
        aria-pressed={maxMinutes === m}
        on:click={() => (maxMinutes = maxMinutes === m ? null : m)}
        style="border: none;">
        <Icon icon="mdi:clock-outline" width="14" height="14"/> ≤ {m} min
      </button>
    {/each}

    {#each quickTags as tag (tag)}
      <button
        class="chip chip-secondary animate-scale-in"
        aria-pressed={selectedTags.includes(tag)}
        on:click={() => toggleTag(tag)}
        style="border: none;">
        #{tag}
      </button>
    {/each}

    <div style="margin-left: auto; display: flex; align-items: center; gap: var(--space-3);">
      <label for="sort" style="font-size: var(--text-sm); color: var(--color-text-secondary); font-weight: var(--font-medium);">Sort by</label>
      <select id="sort" bind:value={sortBy} style="padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); border: 2px solid var(--color-outline-variant); background: var(--color-surface); font-size: var(--text-sm); font-weight: var(--font-medium);">
        <option value="recommended">Recommended</option>
        <option value="shortest">Shortest time</option>
        <option value="az">A–Z</option>
      </select>
      {#if q || selectedTags.length || maxMinutes !== null || sortBy !== 'recommended'}
        <button on:click={clearFilters} class="btn-secondary" style="padding: var(--space-2) var(--space-4); font-size: var(--text-sm);">Clear filters</button>
      {/if}
    </div>
  </div>
</div>

{#if sorted.length === 0}
  <div style="margin-top: var(--space-6);" class="animate-slide-up">
    <EmptyState title="No tasks found" description="Try a different keyword or clear filters." />
  </div>
{:else}
  <div style="margin-top: var(--space-6); display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-6); padding: 0 var(--space-2);" class="animate-slide-up">
    {#each sorted as t (t.id)}
      <TaskCard id={t.id} title={t.title} shortDescription={t.shortDescription} tags={t.tags} estimatedMinutes={t.estimatedMinutes} language={t.language} href={`/task/${t.id}`} />
    {/each}
  </div>
{/if}

<FabCompose />