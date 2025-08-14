<script lang="ts">
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import BadgeChip from "$lib/components/BadgeChip.svelte";
  const xp = 0.45; // 45%
  const badges = [
    { label: "Translator I", color: "#2563eb" },
    { label: "Helper", color: "#16a34a" },
  ];
</script>

<section class="card" style="padding:16px;">
  <h2 style="margin:0 0 8px 0;">Your progress</h2>
  <div style="display:flex; align-items:center; gap:8px;">
    <ProgressBar value={xp} />
    <span style="color:var(--color-muted); width:46px; text-align:right;">{Math.round(xp*100)}%</span>
  </div>
</section>

<section class="card" style="padding:16px; margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">
  <h3 style="margin:0 0 8px 0; width:100%;">Badges</h3>
  {#each badges as b}
    <BadgeChip label={b.label} color={b.color} />
  {/each}
</section>

