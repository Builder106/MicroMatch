<script lang="ts">
  import Icon from "@iconify/svelte";
  let title = "";
  let shortDescription = "";
  let description = "";
  let tags = "";
  let minutes: number | undefined = undefined;
  let language = "English";
  let submitting = false;

  async function submit() {
    submitting = true;
    try {
      const res = await fetch('/api/tasks', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          shortDescription,
          description,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          estimatedMinutes: minutes,
          language
        })
      });
      if (!res.ok) throw new Error('Failed to create task');
      const data = await res.json();
      const id = data?.id;
      if (id) window.location.href = `/task/${id}`; else window.location.href = '/';
    } catch (e) {
      console.error(e);
    } finally {
      submitting = false;
    }
  }
</script>

<div class="animate-slide-up">
  <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
    <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
      <Icon icon="mdi:plus-circle-outline" width="24" height="24" style="color: white;"/>
    </div>
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Post a Task</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Create a micro-volunteering opportunity</p>
    </div>
  </div>

  <section class="card" style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-5);">
    <div style="display: grid; gap: var(--space-4);">
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Task Title</span>
        <input bind:value={title} style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Short Description</span>
        <input bind:value={shortDescription} style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
        <small style="color: var(--color-text-secondary);">Brief summary for the task feed</small>
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Detailed Description</span>
        <textarea bind:value={description} rows={5} style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"></textarea>
        <small style="color: var(--color-text-secondary);">Include specific requirements and deliverables</small>
      </label>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Tags</span>
          <input bind:value={tags} placeholder="translation, spanish" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
          <small style="color: var(--color-text-secondary);">Comma-separated skills/topics</small>
        </label>
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Estimated Minutes</span>
          <input bind:value={minutes} type="number" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
          <small style="color: var(--color-text-secondary);">Realistic time estimate</small>
        </label>
      </div>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span style="font-size: var(--text-sm); font-weight:500; color: var(--color-text);">Language</span>
        <input bind:value={language} style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
        <small style="color: var(--color-text-secondary);">Primary language for this task</small>
      </label>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--color-outline-variant);">
      <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-sm);">
        <Icon icon="mdi:information-outline" width="16" height="16"/>
        <span>Tasks are reviewed before going live</span>
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <a href="/" style="display:inline-flex; align-items:center; justify-content:center; border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); text-decoration:none; background:transparent;">Cancel</a>
        <button disabled={!title || !shortDescription || !description || submitting} on:click={() => submit()} style="display:inline-flex; align-items:center; background: var(--color-primary); color: var(--color-on-primary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); font-weight: 500; border:none; cursor: pointer;">
          <Icon icon="mdi:send" width="16" height="16" style="margin-right: var(--space-2);"/>
          <span>Create Task</span>
        </button>
      </div>
    </div>
  </section>
</div>
