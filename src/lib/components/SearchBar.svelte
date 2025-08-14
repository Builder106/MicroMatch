<script lang="ts">
  import Icon from "@iconify/svelte";
  export let placeholder = "Search";
  export let value = "";
  export let onInput: ((v: string) => void) | undefined;
</script>

<div class="card" style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-radius: var(--radius-full); box-shadow: var(--elev-1); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
  <Icon icon="mdi:magnify" width="20" height="20" style="color: var(--color-text-secondary); flex-shrink: 0;"/>
  <input
    value={value}
    on:input={(e) => onInput?.((e.target as HTMLInputElement).value)}
    placeholder={`${placeholder} tasks, tags, or skills...`}
    style="border: none; outline: none; background: transparent; flex: 1; font-size: var(--text-base); color: var(--color-text); font-family: inherit;"
  />
</div>