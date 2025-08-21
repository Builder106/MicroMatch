<script lang="ts">
  import Icon from '@iconify/svelte';
  import Button from '@smui/button';
  import BadgeChip from '$lib/components/BadgeChip.svelte';
  import { page } from '$app/state';
  export let data: {
    userRole: 'anonymous' | 'user' | 'ngo' | 'volunteer';
    user: { id: string; email?: string } | null;
    tasks: Array<{ id: string; title: string; shortDescription: string; tags: string[]; estimatedMinutes?: number }>;
    badges: Array<{ id: string; label: string; color?: string; awardedAt: string }>;
  };

  let showCreateModal = false;
  let editingBadge: any = null;

  // Badge templates inspired by PatronBadge and Orgo
  const badgeTemplates = [
    { id: 'task-completion', label: 'Task Completed', color: '#16a34a', icon: 'mdi:check-circle', description: 'Awarded for completing any task' },
    { id: 'quick-responder', label: 'Quick Responder', color: '#3b82f6', icon: 'mdi:lightning-bolt', description: 'Awarded for completing tasks under 15 minutes' },
    { id: 'dedicated-volunteer', label: 'Dedicated Volunteer', color: '#f59e0b', icon: 'mdi:heart', description: 'Awarded for completing 5+ tasks' },
    { id: 'translation-expert', label: 'Translation Expert', color: '#8b5cf6', icon: 'mdi:translate', description: 'Awarded for completing translation tasks' },
    { id: 'data-champion', label: 'Data Champion', color: '#ef4444', icon: 'mdi:database', description: 'Awarded for completing data entry tasks' },
    { id: 'first-contribution', label: 'First Contribution', color: '#10b981', icon: 'mdi:star', description: 'Awarded for first task completion' }
  ];

  let newBadge = {
    template: '',
    customLabel: '',
    customColor: '#16a34a',
    criteria: 'task-completion',
    taskId: '',
    description: ''
  };

  function openCreateModal() {
    showCreateModal = true;
    editingBadge = null;
    newBadge = {
      template: '',
      customLabel: '',
      customColor: '#16a34a',
      criteria: 'task-completion',
      taskId: '',
      description: ''
    };
    // Focus the first input when modal opens
    setTimeout(() => {
      const firstInput = document.querySelector('#modal-title')?.nextElementSibling?.querySelector('input');
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    }, 100);
  }

  function closeModal() {
    showCreateModal = false;
    editingBadge = null;
  }

  function selectTemplate(template: typeof badgeTemplates[0]) {
    newBadge.template = template.id;
    newBadge.customLabel = template.label;
    newBadge.customColor = template.color;
    newBadge.description = template.description;
  }

  async function saveBadge() {
    const badgeData = {
      label: newBadge.customLabel,
      color: newBadge.customColor,
      criteria: newBadge.criteria,
      taskId: newBadge.taskId || undefined,
      description: newBadge.description
    };

    console.log('Saving badge:', badgeData);
    // TODO: Implement actual save logic
    closeModal();
  }

  function getBadgeIcon(badge: any) {
    const template = badgeTemplates.find(t => t.id === badge.template);
    return template?.icon || 'mdi:shield';
  }
</script>

<svelte:head>
  <title>Manage Badges - MicroMatch</title>
</svelte:head>

<div class="animate-slide-up">
  <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-warning), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
        <Icon icon="mdi:shield-star-outline" width="24" height="24" style="color: white;"/>
      </div>
      <div>
        <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Badge Management</h1>
        <p class="text-muted" style="font-size: var(--text-sm);">Create and manage achievement badges for your volunteers</p>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <button on:click={openCreateModal} style="background: var(--color-primary); color: var(--color-on-primary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-lg); font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:plus" width="16" height="16"/>
        Create Badge
      </button>
      <Button variant="outlined" href="/badges/analytics" style="border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-lg);">
        <Icon icon="mdi:chart-line" width="16" height="16" style="margin-right: var(--space-2);"/>
        View Analytics
      </Button>
    </div>
  </div>

  <!-- Badge Templates Section -->
  <section class="card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
    <h2 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
      <Icon icon="mdi:palette-outline" width="20" height="20" style="color: var(--color-primary);"/>
      Badge Templates
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4);">
      {#each badgeTemplates as template (template.id)}
        <div class="card hover-lift" style="padding: var(--space-4); border: 2px solid var(--color-outline-variant); cursor: pointer;" role="button" tabindex="0" on:click={() => selectTemplate(template)} on:keydown={(e) => e.key === 'Enter' && selectTemplate(template)}>
          <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: {template.color}15; display: flex; align-items: center; justify-content: center;">
              <Icon icon={template.icon} width="24" height="24" style="color: {template.color};"/>
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: var(--text-lg); font-weight: 500; margin: 0 0 var(--space-1) 0;">{template.label}</h3>
              <BadgeChip label="Template" color={template.color} />
            </div>
          </div>
          <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0;">{template.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Active Badges Section -->
  <section class="card" style="padding: var(--space-6);">
    <h2 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
      <Icon icon="mdi:trophy-outline" width="20" height="20" style="color: var(--color-warning);"/>
      Active Badges ({data.badges.length})
    </h2>

    {#if data.badges.length === 0}
      <div style="text-align: center; padding: var(--space-8); color: var(--color-text-secondary);">
        <Icon icon="mdi:shield-off" width="48" height="48" style="opacity: 0.3; margin-bottom: var(--space-4);"/>
        <h3>No badges created yet</h3>
        <p>Create your first badge using one of the templates above</p>
      </div>
    {:else}
      <div style="display: grid; gap: var(--space-4);">
        {#each data.badges as badge (badge.id)}
          <div class="card" style="padding: var(--space-4); border: 1px solid var(--color-outline-variant);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <BadgeChip label={badge.label} color={badge.color} />
                <div>
                  <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0;">Created {new Date(badge.awardedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div style="display: flex; gap: var(--space-2);">
                <button class="btn-secondary" style="padding: var(--space-2) var(--space-3); font-size: var(--text-xs);">
                  <Icon icon="mdi:pencil" width="14" height="14"/>
                </button>
                <button class="btn-danger" style="padding: var(--space-2) var(--space-3); font-size: var(--text-xs);">
                  <Icon icon="mdi:delete" width="14" height="14"/>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<!-- Create/Edit Badge Modal -->
{#if showCreateModal}
  <div class="modal-overlay" role="presentation" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()}>
    <div class="modal-content animate-scale-in" on:click|stopPropagation role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1" on:keydown={(e) => e.key === 'Escape' && closeModal()}>
      <div class="modal-header">
        <h2 id="modal-title" style="font-size: var(--text-xl); font-weight: 500; margin: 0;">
          {editingBadge ? 'Edit Badge' : 'Create New Badge'}
        </h2>
        <button on:click={closeModal} style="border: none; background: transparent; cursor: pointer; padding: var(--space-2); border-radius: var(--radius-sm);">
          <Icon icon="mdi:close" width="20" height="20"/>
        </button>
      </div>

      <div class="modal-body" style="display: grid; gap: var(--space-4);">
        <!-- Badge Preview -->
        <div class="card" style="padding: var(--space-4); text-align: center;">
          <div style="width: 80px; height: 80px; border-radius: var(--radius-full); background: {newBadge.customColor}15; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
            <Icon icon="mdi:shield" width="40" height="40" style="color: {newBadge.customColor};"/>
          </div>
          <h3 style="margin: 0 0 var(--space-2) 0;">{newBadge.customLabel || 'Badge Name'}</h3>
          <BadgeChip label="Preview" color={newBadge.customColor} />
        </div>

        <!-- Badge Details -->
        <div style="display: grid; gap: var(--space-4);">
          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Badge Name</span>
            <input bind:value={newBadge.customLabel} placeholder="Enter badge name" style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm);"/>
          </label>

          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Badge Color</span>
            <div style="display: flex; gap: var(--space-2); align-items: center;">
              <input type="color" bind:value={newBadge.customColor} style="width: 50px; height: 50px; border: none; border-radius: var(--radius-sm); cursor: pointer;"/>
              <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">{newBadge.customColor}</span>
            </div>
          </label>

          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Award Criteria</span>
            <select bind:value={newBadge.criteria} style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm);">
              <option value="task-completion">Task Completion</option>
              <option value="task-specific">Specific Task</option>
              <option value="time-based">Time-based Achievement</option>
              <option value="custom">Custom Rule</option>
            </select>
          </label>

          {#if newBadge.criteria === 'task-specific'}
            <label style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span style="font-size: var(--text-sm); font-weight: 500;">Specific Task</span>
              <select bind:value={newBadge.taskId} style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm);">
                <option value="">Select a task...</option>
                {#each data.tasks as task (task.id)}
                  <option value={task.id}>{task.title}</option>
                {/each}
              </select>
            </label>
          {/if}

          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Description (Optional)</span>
            <textarea bind:value={newBadge.description} placeholder="Describe how this badge is earned..." rows="3" style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm);"></textarea>
          </label>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--color-outline-variant);">
        <button on:click={closeModal} class="btn-secondary" style="padding: var(--space-3) var(--space-6);">
          Cancel
        </button>
        <button on:click={saveBadge} class="btn-primary" style="padding: var(--space-3) var(--space-6);">
          {editingBadge ? 'Update Badge' : 'Create Badge'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-4);
  }

  .modal-content {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--elev-5);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5);
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .modal-body {
    padding: var(--space-5);
  }

  .modal-footer {
    padding: var(--space-5);
  }



  .btn-danger {
    border: 1px solid var(--color-error);
    background: transparent;
    color: var(--color-error);
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
  }

  .btn-danger:hover {
    background: var(--color-error);
    color: white;
  }

  .btn-primary {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    background: color-mix(in srgb, var(--color-primary) 90%, black);
    transform: translateY(-1px);
  }

  .btn-secondary {
    border: 1px solid var(--color-outline);
    background: transparent;
    color: var(--color-text);
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover {
    background: var(--color-outline-variant);
  }

  /* Focus styles for accessibility */
  .card[role="button"]:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .modal-content:focus-within {
    outline: none;
  }
</style>
