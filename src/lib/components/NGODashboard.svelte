<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from 'svelte';

  export let data: {
    signedIn: boolean;
    userData: any;
  };

  let tasks = data.userData?.myTasks || [];
  let pendingReviews = data.userData?.pendingReviews || [];
  let stats = data.signedIn
    ? [
        { label: "Active tasks", value: String(data.userData?.totalTasks || 0), icon: "mdi:clipboard-list-outline" },
        { label: "Pending reviews", value: String(data.userData?.pendingReviewsCount || 0), icon: "mdi:clipboard-check-outline" },
        { label: "Completions", value: String(data.userData?.approvedClaimsCount || 0), icon: "mdi:check-circle-outline" },
      ]
    : [
        { label: "Active tasks", value: "0", icon: "mdi:clipboard-list-outline" },
        { label: "Pending reviews", value: "0", icon: "mdi:clipboard-check-outline" },
        { label: "Completions", value: "0", icon: "mdi:check-circle-outline" },
      ];

  async function handleClaimAction(claimId: string, action: 'approve' | 'reject') {
    try {
      const response = await fetch(`/api/claims/${claimId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        // Reload the page to get updated data
        window.location.reload();
      } else {
        alert('Failed to process the claim. Please try again.');
      }
    } catch (error) {
      console.error('Error processing claim:', error);
      alert('An error occurred. Please try again.');
    }
  }
</script>

<div class="animate-slide-up">
  <!-- Header -->
  <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
    <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-secondary), var(--color-primary)); display: flex; align-items: center; justify-content: center;">
      <Icon icon="mdi:office-building" width="24" height="24" style="color: white;"/>
    </div>
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">NGO Dashboard</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Manage your organization's tasks and volunteer contributions</p>
    </div>
  </div>

  <!-- Quick Actions -->
  <section class="card" style="padding: var(--space-4); margin-bottom: var(--space-6);">
    <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
      <a href="/org" class="btn-primary" style="text-decoration: none; display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:plus" width="18" height="18"/>
        Create Task
      </a>
      <a href="/badges/manage" class="btn-secondary" style="text-decoration: none; display: flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:cog" width="18" height="18"/>
        Manage Badges
      </a>
    </div>
  </section>

  <!-- Stats Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
    {#each stats as stat (stat.label)}
      <div class="card" style="padding: var(--space-4); text-align: center;">
        <div style="width: 40px; height: 40px; margin: 0 auto var(--space-3); border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-secondary) 12%, transparent); display: flex; align-items: center; justify-content: center;">
          <Icon icon={stat.icon} width="20" height="20" style="color: var(--color-secondary);"/>
        </div>
        <div style="font-size: var(--text-2xl); font-weight: 500; color: var(--color-text); margin-bottom: var(--space-1);">{stat.value}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-secondary); font-weight: 500;">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- Pending Reviews Section -->
  {#if data.signedIn && pendingReviews.length > 0}
    <section class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
      <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
        <Icon icon="mdi:clipboard-check" width="24" height="24" style="color: var(--color-warning);"/>
        <h3 style="font-size: var(--text-xl); font-weight: 500;">Pending Reviews</h3>
        <span style="background: var(--color-warning); color: white; padding: 2px 8px; border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 500;">
          {pendingReviews.length}
        </span>
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-4);">
        {#each pendingReviews as claim}
          <div style="border: 1px solid var(--color-outline-variant); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3);">
              <div style="flex: 1;">
                <h4 style="font-weight: 500; margin-bottom: var(--space-1);">{claim.task?.title || 'Task'}</h4>
                <p style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-2);">
                  {claim.notes || 'No notes provided'}
                </p>
                {#if claim.proofUrl}
                  <a href={claim.proofUrl} target="_blank" style="color: var(--color-primary); text-decoration: none; font-size: var(--text-sm); display: inline-flex; align-items: center; gap: var(--space-1);">
                    <Icon icon="mdi:external-link" width="14" height="14"/>
                    View proof
                  </a>
                {/if}
              </div>
              <div style="font-size: var(--text-xs); color: var(--color-text-secondary); text-align: right;">
                {new Date(claim.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
              <button
                class="btn-secondary"
                style="font-size: var(--text-sm); padding: var(--space-2) var(--space-3);"
                on:click={() => handleClaimAction(claim.id, 'reject')}
              >
                <Icon icon="mdi:close" width="16" height="16" style="margin-right: var(--space-1);"/>
                Reject
              </button>
              <button
                class="btn-primary"
                style="font-size: var(--text-sm); padding: var(--space-2) var(--space-3);"
                on:click={() => handleClaimAction(claim.id, 'approve')}
              >
                <Icon icon="mdi:check" width="16" height="16" style="margin-right: var(--space-1);"/>
                Approve
              </button>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Active Tasks Section -->
  {#if data.signedIn && tasks.length > 0}
    <section class="card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
      <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
        <Icon icon="mdi:clipboard-list" width="24" height="24" style="color: var(--color-primary);"/>
        <h3 style="font-size: var(--text-xl); font-weight: 500;">Your Active Tasks</h3>
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        {#each tasks as task}
          <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: color-mix(in srgb, var(--color-outline) 8%, transparent); border-radius: var(--radius-sm);">
            <div style="width: 8px; height: 8px; border-radius: var(--radius-full); background: var(--color-primary); flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <p style="font-weight: 500; margin-bottom: var(--space-1);">{task.title}</p>
              <p style="font-size: var(--text-sm); color: var(--color-text-secondary);">
                {task.shortDescription}
                {task.estimatedMinutes ? ` • ~${task.estimatedMinutes} min` : ''}
                {task.createdAt ? ` • Created ${new Date(task.createdAt).toLocaleDateString()}` : ''}
              </p>
            </div>
            <a href="/task/{task.id}" style="color: var(--color-primary); text-decoration: none; display: flex; align-items: center; gap: var(--space-1);">
              <span style="font-size: var(--text-sm);">View</span>
              <Icon icon="mdi:chevron-right" width="16" height="16"/>
            </a>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Empty State -->
  {#if data.signedIn && tasks.length === 0}
    <section class="card" style="padding: var(--space-8); text-align: center;">
      <Icon icon="mdi:clipboard-list" width="48" height="48" style="color: var(--color-text-secondary); opacity: 0.3; margin-bottom: var(--space-4);"/>
      <h3 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-2);">No tasks yet</h3>
      <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
        Create your first task to start receiving volunteer contributions.
      </p>
      <a href="/org" class="btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:plus" width="18" height="18"/>
        Create Your First Task
      </a>
    </section>
  {/if}

  <!-- Not Signed In State -->
  {#if !data.signedIn}
    <section class="card" style="padding: var(--space-8); text-align: center;">
      <Icon icon="mdi:account-circle-outline" width="48" height="48" style="color: var(--color-text-secondary); opacity: 0.3; margin-bottom: var(--space-4);"/>
      <h3 style="font-size: var(--text-xl); font-weight: 500; margin-bottom: var(--space-2);">Sign in to manage your NGO</h3>
      <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
        Create tasks, review volunteer submissions, and track your organization's impact.
      </p>
      <a href="/login" class="btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: var(--space-2);">
        <Icon icon="mdi:login" width="18" height="18"/>
        Sign In
      </a>
    </section>
  {/if}
</div>
