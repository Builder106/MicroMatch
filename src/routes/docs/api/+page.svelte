<script lang="ts">
  import StaticArticle from '$lib/components/StaticArticle.svelte';
</script>

<StaticArticle title="Public API" lede="No authentication required for read-only task listings.">
  <p><strong>GET /api/tasks</strong></p>
  <p>Returns an array of public tasks for listings. Example fields include <code style="background: var(--color-surface-variant); padding: 2px 6px; border-radius: var(--radius-xs);">id</code>, <code style="background: var(--color-surface-variant); padding: 2px 6px; border-radius: var(--radius-xs);">title</code>, <code style="background: var(--color-surface-variant); padding: 2px 6px; border-radius: var(--radius-xs);">shortDescription</code>, <code style="background: var(--color-surface-variant); padding: 2px 6px; border-radius: var(--radius-xs);">tags</code>, <code style="background: var(--color-surface-variant); padding: 2px 6px; border-radius: var(--radius-xs);">estimatedMinutes</code>, and <code style="background: var(--color-surface-variant); padding: 2px 6px; border-radius: var(--radius-xs);">language</code>.</p>
  <p>Response status is 200 on success. Pagination may be added later.</p>
  <p><a href="/docs">Back to documentation</a></p>
</StaticArticle>
