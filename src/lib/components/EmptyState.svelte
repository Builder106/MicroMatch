<script lang="ts">
  import Button from "@smui/button";
  export let title: string = "Nothing here yet";
  export let description: string = "Check back later or adjust your filters.";
  export let ctaText: string | undefined = undefined;
  export let ctaHref: string | undefined = undefined;
</script>

<section class="card" style="padding:24px; text-align:center;">
  <div style="font-size:40px; line-height:1;">✨</div>
  <h3 style="margin:8px 0 4px 0">{title}</h3>
  <p style="margin:0; color:var(--color-muted);">{description}</p>
  {#if ctaText && ctaHref}
    <div style="margin-top:12px;">
      <Button href={ctaHref}>{ctaText}</Button>
    </div>
  {/if}
</section>

