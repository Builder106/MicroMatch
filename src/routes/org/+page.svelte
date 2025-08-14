<script lang="ts">
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  import Icon from "@iconify/svelte";
  let title = "";
  let shortDescription = "";
  let description = "";
  let tags = "";
  let minutes: number | undefined = undefined;
  let language = "English";
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
      <Textfield bind:value={title} label="Task Title" style="--mdc-theme-primary: var(--color-primary);" />
      <Textfield bind:value={shortDescription} label="Short Description" helper="Brief summary for the task feed" style="--mdc-theme-primary: var(--color-primary);" />
      <Textfield bind:value={description} label="Detailed Description" textarea rows={5} helper="Include specific requirements and deliverables" style="--mdc-theme-primary: var(--color-primary);" />
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <Textfield bind:value={tags} label="Tags" placeholder="translation, spanish" helper="Comma-separated skills/topics" style="--mdc-theme-primary: var(--color-primary);" />
        <Textfield bind:value={minutes} type="number" label="Estimated Minutes" helper="Realistic time estimate" style="--mdc-theme-primary: var(--color-primary);" />
      </div>
      
      <Textfield bind:value={language} label="Language" helper="Primary language for this task" style="--mdc-theme-primary: var(--color-primary);" />
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); border-top: 1px solid var(--color-outline-variant);">
      <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-sm);">
        <Icon icon="mdi:information-outline" width="16" height="16"/>
        <span>Tasks are reviewed before going live</span>
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <Button variant="outlined" href="/" style="border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6);">Cancel</Button>
        <Button disabled={!title || !shortDescription || !description} style="background: var(--color-primary); color: var(--color-on-primary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); font-weight: 500;">
          <Icon icon="mdi:send" width="16" height="16" style="margin-right: var(--space-2);"/>
          Create Task
        </Button>
      </div>
    </div>
  </section>
</div>
