<script lang="ts">
  import Icon from "@iconify/svelte";
  export let href = "/org";
</script>

<a href={href} aria-label="Post task" style="position:fixed;right:20px;bottom:88px;">
  <div class="card" style="width:56px;height:56px;border-radius:16px;background:var(--color-primary);display:flex;align-items:center;justify-content:center;box-shadow:var(--elev-2);">
    <Icon icon="mdi:plus" style="color:var(--color-on-primary)" />
  </div>
</a>