<script lang="ts">
  export let value: number = 0; // 0..1
  const clamped = Math.max(0, Math.min(1, value));
</script>

<div style="width:100%; height:8px; background: var(--color-outline); border-radius:999px; overflow:hidden;">
  <div style="height:100%; width:{clamped * 100}%; background:var(--color-primary); border-radius:999px; transition:width 180ms ease;" />
  <slot />
</div>

