<script lang="ts">
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  import Icon from "@iconify/svelte";
  let proofUrl = "";
  let notes = "";
</script>

<div class="animate-slide-up">
  <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
    <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-success), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
      <Icon icon="mdi:upload-outline" width="24" height="24" style="color: white;"/>
    </div>
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Submit Your Work</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Share your completed task for review</p>
    </div>
  </div>

  <section class="card" style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-5);">
    <div style="padding: var(--space-4); background: color-mix(in srgb, var(--color-primary) 8%, transparent); border-radius: var(--radius-sm); border-left: 4px solid var(--color-primary);">
      <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
        <Icon icon="mdi:lightbulb-outline" width="16" height="16" style="color: var(--color-primary);"/>
        <span style="font-weight: 500; color: var(--color-primary); font-size: var(--text-sm);">Submission Tips</span>
      </div>
      <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--text-sm); line-height: var(--leading-normal);">
        Provide a clear link to your work (Google Doc, GitHub, etc.) and add context to help reviewers understand your contribution.
      </p>
    </div>
    
    <div style="display: grid; gap: var(--space-4);">
      <Textfield bind:value={proofUrl} label="Proof URL" placeholder="https://docs.google.com/..." helper="Link to your completed work" style="--mdc-theme-primary: var(--color-primary);" />
      <Textfield bind:value={notes} label="Additional Notes" textarea rows={4} placeholder="Describe your approach, challenges faced, or anything reviewers should know..." helper="Optional context for reviewers" style="--mdc-theme-primary: var(--color-primary);" />
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--color-outline-variant);">
      <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-sm);">
        <Icon icon="mdi:clock-outline" width="16" height="16"/>
        <span>Review typically takes 24-48 hours</span>
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <Button variant="outlined" href="/" style="border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6);">Cancel</Button>
        <Button disabled={!proofUrl} style="background: var(--color-success); color: white; padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); font-weight: 500;">
          <Icon icon="mdi:check-circle-outline" width="16" height="16" style="margin-right: var(--space-2);"/>
          Submit for Review
        </Button>
      </div>
    </div>
  </section>
</div>
