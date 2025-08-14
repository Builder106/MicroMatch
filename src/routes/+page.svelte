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

<div class="animate-slide-up" style="padding: var(--space-2) var(--space-2) 0 var(--space-2);">
  <div style="display: flex; align-items: center; gap: var(--space-3); margin: 0 0 var(--space-4) var(--space-2);">
    <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
      <Icon icon="mdi:heart-outline" width="20" height="20" style="color: white;"/>
    </div>
    <div>
      <h2 style="font-size: var(--text-2xl); font-weight: 500; color: var(--color-text); margin-bottom: var(--space-1);">Do a quick good deed</h2>
      <p class="text-muted" style="font-size: var(--text-sm);">Find micro-volunteering tasks that match your skills</p>
    </div>
    <div style="margin-left:auto;">
      <a href="/login" class="btn-primary" style="text-decoration:none; padding: 8px 12px;">Sign in</a>
    </div>
  </div>
  <SearchBar value={q} onInput={(v) => (q = v)} />

  <!-- Quick filters -->
  <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; margin-top: var(--space-4);">
    {#each timeOptions as m (m)}
      <button
        class="chip chip-primary"
        aria-pressed={maxMinutes === m}
        on:click={() => (maxMinutes = maxMinutes === m ? null : m)}
        style="border: none;">
        <Icon icon="mdi:clock-outline" width="14" height="14"/> ≤ {m} min
      </button>
    {/each}

    {#each quickTags as tag (tag)}
      <button
        class="chip chip-secondary"
        aria-pressed={selectedTags.includes(tag)}
        on:click={() => toggleTag(tag)}
        style="border: none;">
        #{tag}
      </button>
    {/each}

    <div style="margin-left: auto; display: flex; align-items: center; gap: var(--space-2);">
      <label for="sort" style="font-size: var(--text-xs); color: var(--color-text-secondary); font-weight: 500;">Sort</label>
      <select id="sort" bind:value={sortBy} style="padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--color-outline-variant); background: var(--color-surface); font-size: var(--text-sm);">
        <option value="recommended">Recommended</option>
        <option value="shortest">Shortest time</option>
        <option value="az">A–Z</option>
      </select>
      {#if q || selectedTags.length || maxMinutes !== null || sortBy !== 'recommended'}
        <button on:click={clearFilters} style="border: none; background: transparent; color: var(--color-primary); cursor: pointer; font-size: var(--text-xs); font-weight: 500; padding: var(--space-2);">Clear</button>
      {/if}
    </div>
  </div>
</div>

<div style="margin-top: var(--space-4); padding: 0 var(--space-4); color: var(--color-text-secondary); font-size: var(--text-sm); font-weight: 500;">
  {sorted.length} task{sorted.length === 1 ? '' : 's'} available
</div>

{#if sorted.length === 0}
  <div style="margin-top: var(--space-6);" class="animate-slide-up">
    <EmptyState title="No tasks found" description="Try a different keyword or clear filters." />
  </div>
{:else}
  <div style="margin-top: var(--space-4); display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4); padding: 0 var(--space-2);" class="animate-slide-up">
    {#each sorted as t (t.id)}
      <TaskCard id={t.id} title={t.title} shortDescription={t.shortDescription} tags={t.tags} estimatedMinutes={t.estimatedMinutes} language={t.language} href={`/task/${t.id}`} />
    {/each}
  </div>
{/if}

<FabCompose />