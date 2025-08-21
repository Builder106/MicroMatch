<script lang="ts">
  
  
  import Icon from "@iconify/svelte";
  import { page } from "$app/state";
  import { authHeader } from "$lib/appwrite.client";
  let proofUrl = "";
  let notes = "";
  let submitting = false;
  let errorMsg: string | null = null;

  async function submitClaim() {
    if (!proofUrl) return;
    submitting = true;
    errorMsg = null;
    try {
      const id = page.params.id;
      const headers = { 'Content-Type': 'application/json', ...(await authHeader()) } as Record<string, string>;
      const res = await fetch(`/api/tasks/${id}/claim`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ proofUrl, notes })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        errorMsg = body?.error || 'Failed to submit';
        return;
      }
      try { localStorage.setItem('toast', 'Submission sent for review'); localStorage.setItem('celebrate', '1'); } catch {}
      window.location.href = '/dashboard?celebrate=1';
    } catch (e) {
      console.error(e);
      errorMsg = (e as any)?.message || 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }
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
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Proof URL</span>
        <input bind:value={proofUrl} placeholder="https://docs.google.com/..." style="padding: 10px 12px; border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
        <small style="color: var(--color-text-secondary);">Link to your completed work</small>
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Additional Notes</span>
        <textarea bind:value={notes} rows={4} placeholder="Describe your approach, challenges faced, or anything reviewers should know..." style="padding: 10px 12px; border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"></textarea>
        <small style="color: var(--color-text-secondary);">Optional context for reviewers</small>
      </label>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--color-outline-variant);">
      <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-sm);">
        <Icon icon="mdi:clock-outline" width="16" height="16"/>
        <span>Review typically takes 24-48 hours</span>
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <a href="/" style="display:inline-flex; align-items:center; justify-content:center; border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); text-decoration:none; background:transparent;">Cancel</a>
        <button disabled={!proofUrl || submitting} on:click={() => submitClaim()} style="display:inline-flex; align-items:center; background: var(--color-success); color: white; padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); font-weight: 500; border:none; cursor: pointer;">
          <Icon icon="mdi:check-circle-outline" width="16" height="16" style="margin-right: var(--space-2);"/>
          <span>Submit for Review</span>
        </button>
      </div>
    </div>
    {#if errorMsg}
      <div style="margin-top: var(--space-3); color: var(--color-error);">{errorMsg}</div>
    {/if}
  </section>
</div>
