<script lang="ts">
  import Icon from "@iconify/svelte";
  export let label: string;
  export let color: string = "#16a34a";
</script>

<span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background: color-mix(in oklab, {color} 18%, white); color:{color}; font-size:12px;">
  <Icon icon="mdi:badge-account-outline" /> {label}
  <slot />
</span>

