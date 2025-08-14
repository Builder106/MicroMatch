<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@iconify/svelte";
  export let placeholder = "Search";
  export let value = "";
  export let onInput: ((v: string) => void) | undefined;
</script>

<div class="card" style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:999px;">
  <Icon icon="mdi:magnify" style="color:var(--color-muted)" />
  <input
    value={value}
    on:input={(e) => onInput?.((e.target as HTMLInputElement).value)}
    placeholder={`${placeholder} tasks or tags`}
    style="border:none;outline:none;background:transparent;flex:1;font-size:16px;color:var(--color-text)"
  />
</div>