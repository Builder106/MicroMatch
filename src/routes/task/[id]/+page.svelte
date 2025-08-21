<script lang="ts">
  import { page } from "$app/state";
  import Button from "@smui/button";
  import Icon from "@iconify/svelte";
  export let data: { task: { id: string; title: string; description?: string; tags: string[]; estimatedMinutes?: number; language?: string; org?: string }, isOwner: boolean };
  $: id = page.params.id;
  const task = data.task;
  
  let deleting = false;

  async function deleteTask() {
    if (!confirm('Are you sure you want to delete this task? This cannot be undone.')) {
      return;
    }
    deleting = true;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/tasks';
      } else {
        alert('Failed to delete task.');
      }
    } finally {
      deleting = false;
    }
  }

  const learningResources = [
    { title: "Spanish Translation Basics", provider: "DataCamp", url: "#", icon: "mdi:school-outline" },
    { title: "Google Translate Best Practices", provider: "Educative", url: "#", icon: "mdi:book-open-outline" }
  ];
</script>

<div class="animate-slide-up">
  <header class="card" style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4);">
    <div style="display: flex; align-items: flex-start; gap: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <Icon icon="mdi:translate" width="24" height="24" style="color: white;"/>
      </div>
      <div style="flex: 1;">
        <h1 style="margin: 0 0 var(--space-2) 0; font-size: var(--text-2xl); font-weight: 500; line-height: var(--leading-tight);">{task.title}</h1>
        {#if task.org}
          <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); margin-bottom: var(--space-3);">
            <Icon icon="mdi:domain" width="16" height="16"/> 
            <span style="font-weight: 500;">{task.org}</span>
            <span style="color: var(--color-outline);">•</span>
            <span style="color: var(--color-success); font-weight: 500;">Verified NGO</span>
          </div>
        {/if}
      </div>
    </div>
    
    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2);">
      <span class="chip chip-primary">
        <Icon icon="mdi:clock-outline" width="12" height="12"/> {task.estimatedMinutes} min
      </span>
      <span class="chip chip-secondary">
        <Icon icon="mdi:translate" width="12" height="12"/> {task.language ?? 'Original'}
      </span>
      
      {#each task.tags as tag (tag)}
        <span class="chip chip-secondary">#{tag}</span>
      {/each}
    </div>
  </header>

  <section class="card" style="padding: var(--space-6); margin-top: var(--space-4);">
    <h2 style="margin: 0 0 var(--space-4) 0; font-size: var(--text-xl); font-weight: 500; display: flex; align-items: center; gap: var(--space-2);">
      <Icon icon="mdi:text-box-outline" width="20" height="20" style="color: var(--color-primary);"/>
      Task Description
    </h2>
    <p style="margin: 0; color: var(--color-text); line-height: var(--leading-relaxed); font-size: var(--text-base);">{task.description}</p>
  </section>

  {#if learningResources.length > 0}
    <section class="card" style="padding: var(--space-6); margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4) 0; font-size: var(--text-lg); font-weight: 500; display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:lightbulb-outline" width="20" height="20" style="color: var(--color-warning);"/>
        Quick Learning Resources
      </h3>
      <div style="display: grid; gap: var(--space-3);">
        {#each learningResources as resource (resource.title)}
          <a href={resource.url} style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border-radius: var(--radius-sm); background: var(--color-surface-variant); text-decoration: none; color: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" class="card">
            <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              <Icon icon={resource.icon} width="16" height="16" style="color: white;"/>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 500; margin-bottom: var(--space-1);">{resource.title}</div>
              <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">by {resource.provider}</div>
            </div>
            <Icon icon="mdi:arrow-right" width="16" height="16" style="color: var(--color-text-secondary);"/>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <div style="display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-6); padding: 0 var(--space-2);">
    <Button variant="outlined" href="/" style="border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6);">
      Back to Feed
    </Button>
    {#if data.isOwner}
      <button on:click={deleteTask} disabled={deleting} class="btn-danger" style="padding: var(--space-3) var(--space-6);">
        <Icon icon="mdi:delete-outline" width="16" height="16" style="margin-right: var(--space-2);"/>
        {deleting ? 'Deleting...' : 'Delete Task'}
      </button>
    {/if}
    <Button href={`/task/${id}/claim`} style="background: var(--color-primary); color: var(--color-on-primary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-sm); font-weight: 500; box-shadow: var(--elev-1);">
      <Icon icon="mdi:hand-heart" width="16" height="16" style="margin-right: var(--space-2);"/>
      Claim Task
    </Button>
  </div>
</div>

<style>
  .btn-danger {
    border: 1px solid var(--color-error);
    color: var(--color-error);
    background-color: transparent;
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn-danger:hover {
    background-color: var(--color-error);
    color: white;
  }
  .btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>