<script lang="ts">
  import Icon from "@iconify/svelte";

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
        window.location.reload();
      } else {
        alert('Failed to process the claim. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  }
</script>

<div class="dash-shell">
  <section class="hero">
    <div>
      <h1>NGO Mission Console</h1>
      <p>Track task volume, review submissions, and keep volunteer momentum high.</p>
      <div class="hero-actions">
        <a href="/org">Create Task</a>
        <a href="/badges/manage">Manage Badges</a>
      </div>
    </div>
    <div class="hero-chip">
      <span>{pendingReviews.length}</span>
      <small>Pending Reviews</small>
    </div>
  </section>

  <section class="metrics">
    {#each stats as stat (stat.label)}
      <article>
        <Icon icon={stat.icon} width="22" height="22" />
        <h3>{stat.value}</h3>
        <p>{stat.label}</p>
      </article>
    {/each}
  </section>

  <section class="panel">
    <div class="title-row">
      <h2>Pending Reviews</h2>
      <span>{pendingReviews.length}</span>
    </div>
    {#if data.signedIn && pendingReviews.length > 0}
      <div class="review-list">
        {#each pendingReviews as claim}
          <article>
            <div>
              <strong>{claim.task?.title || 'Task'}</strong>
              <p>{claim.notes || 'No notes provided'}</p>
              <small>{new Date(claim.createdAt).toLocaleDateString()}</small>
            </div>
            <div class="actions">
              {#if claim.proofUrl}
                <a href={claim.proofUrl} target="_blank">Proof</a>
              {/if}
              <button class="reject" on:click={() => handleClaimAction(claim.id, 'reject')}>Reject</button>
              <button class="approve" on:click={() => handleClaimAction(claim.id, 'approve')}>Approve</button>
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <div class="empty">No pending claim reviews right now.</div>
    {/if}
  </section>

  <section class="panel">
    <div class="title-row">
      <h2>Your Tasks</h2>
      <a href="/org">Create new</a>
    </div>
    {#if data.signedIn && tasks.length > 0}
      <div class="task-list">
        {#each tasks as task}
          <article>
            <div>
              <strong>{task.title}</strong>
              <p>{task.shortDescription}</p>
              <small>{task.estimatedMinutes ? `~${task.estimatedMinutes} min` : 'Quick mission'}</small>
            </div>
            <a href="/task/{task.id}">
              Open
              <Icon icon="mdi:chevron-right" width="16" height="16"/>
            </a>
          </article>
        {/each}
      </div>
    {:else if data.signedIn}
      <div class="empty">No tasks yet. Start by creating your first one.</div>
    {:else}
      <div class="empty">Sign in to manage your NGO workspace.</div>
    {/if}
  </section>
</div>

<style>
  .dash-shell { display: grid; gap: 18px; max-width: 1200px; margin: 0 auto; }
  .hero, .panel, .metrics article { background: #fff; border: 1px solid #eceff3; box-shadow: 0 16px 40px rgba(0,0,0,.06); border-radius: 24px; }
  .hero { padding: 24px; display: flex; justify-content: space-between; gap: 14px; align-items: center; }
  h1 { margin: 0; font-size: 32px; font-weight: 800; color: #1e293b; }
  .hero p { margin: 8px 0 0; color: rgba(30,41,59,.64); }
  .hero-actions { margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap; }
  .hero-actions a { text-decoration: none; border-radius: 12px; padding: 10px 14px; font-weight: 700; }
  .hero-actions a:first-child { background: #1e293b; color: #fff; }
  .hero-actions a:last-child { background: #fdfcf8; color: #1e293b; border: 1px solid #eceff3; }
  .hero-chip { width: 128px; height: 128px; border-radius: 20px; background: #fdfcf8; border: 1px solid #eceff3; display: grid; place-items: center; }
  .hero-chip span { font-size: 34px; font-weight: 800; color: #1e293b; }
  .hero-chip small { color: rgba(30,41,59,.6); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .metrics { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0,1fr)); }
  .metrics article { padding: 18px; }
  .metrics h3 { margin: 8px 0 2px; font-size: 28px; color: #1e293b; }
  .metrics p { margin: 0; color: rgba(30,41,59,.58); font-size: 13px; }
  .panel { padding: 22px; }
  .title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  h2 { margin: 0; font-size: 22px; color: #1e293b; }
  .title-row span { background: #fdfcf8; border: 1px solid #eceff3; color: #1e293b; border-radius: 999px; font-size: 12px; font-weight: 800; padding: 4px 9px; }
  .title-row a { text-decoration: none; color: #ff6b6b; font-size: 13px; font-weight: 800; }
  .review-list, .task-list { display: grid; gap: 10px; }
  .review-list article, .task-list article { border: 1px solid #eceff3; border-radius: 14px; padding: 12px; display: flex; justify-content: space-between; gap: 10px; align-items: center; }
  strong { color: #1e293b; font-size: 15px; }
  p { margin: 6px 0 0; color: rgba(30,41,59,.62); font-size: 13px; max-width: 760px; line-height: 1.4; }
  small { display: block; margin-top: 6px; color: rgba(30,41,59,.5); font-size: 12px; }
  .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
  .actions a, .actions button, .task-list a { border: 0; border-radius: 10px; padding: 8px 11px; text-decoration: none; font-weight: 700; cursor: pointer; font-size: 12px; }
  .actions a { background: #eef2ff; color: #1e293b; }
  .reject { background: #fef2f2; color: #b91c1c; }
  .approve { background: #ecfdf5; color: #047857; }
  .task-list a { background: #1e293b; color: #fff; display: inline-flex; align-items: center; gap: 4px; }
  .empty { border: 1px dashed #e2e8f0; border-radius: 14px; padding: 18px; text-align: center; color: rgba(30,41,59,.55); font-weight: 600; }
  @media (max-width: 900px) { .hero { flex-direction: column; align-items: flex-start; } .metrics { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .metrics { grid-template-columns: 1fr; } .review-list article, .task-list article { flex-direction: column; align-items: flex-start; } .actions { justify-content: flex-start; } }
</style>
