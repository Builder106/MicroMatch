<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from 'svelte';
  import { fireConfettiBurst } from '$lib/utils/confetti';

  export let data: {
    signedIn: boolean;
    userData: any;
  };

  let badges: Array<{ label: string; color?: string }> = [];
  const approvedClaimsCount = data.userData?.approvedClaimsCount || 0;
  const totalHours = data.userData?.totalHours || 0;
  const level = Math.floor(approvedClaimsCount / 3) + 1;
  const xpToNextLevel = Math.max(0, 3 - (approvedClaimsCount % 3));
  const progress = approvedClaimsCount % 3 === 0 && approvedClaimsCount !== 0 ? 100 : Math.round(((approvedClaimsCount % 3) / 3) * 100);
  const impactScore = approvedClaimsCount * 200 + 50;
  const peopleHelped = approvedClaimsCount * 3;
  let recentClaims = data.userData?.myClaims?.slice(0, 3) || [];

  onMount(async () => {
    try {
      if (data.signedIn) {
        const res = await fetch('/api/badges', { credentials: 'include' });
        if (res.ok) {
          const payload = await res.json();
          badges = payload.map((b: any) => ({ label: b.label, color: b.color }));
        }
      }
    } catch {}

    const url = new URL(window.location.href);
    const shouldCelebrate = url.searchParams.get('celebrate') === '1' || localStorage.getItem('celebrate') === '1';
    const toast = localStorage.getItem('toast');
    if (shouldCelebrate) {
      fireConfettiBurst();
      try { localStorage.removeItem('celebrate'); } catch {}
    }
    if (toast) {
      const el = document.getElementById('toast');
      if (el) {
        el.textContent = toast;
        el.style.display = 'block';
        setTimeout(() => (el.style.display = 'none'), 3000);
      }
      try { localStorage.removeItem('toast'); } catch {}
    }
  });
</script>

<div class="dash-shell">
  <section class="hero">
    <div class="hero-copy">
      <h1>{data.signedIn ? "You're crushing it!" : 'Welcome to Impact HQ'}</h1>
      <p>{data.signedIn ? `Level ${level} volunteer with ${approvedClaimsCount} completed tasks.` : 'Claim your first mission and start building momentum.'}</p>
      <div class="progress-wrap">
        <div class="progress-head">
          <strong>{data.signedIn ? `${xpToNextLevel} task${xpToNextLevel === 1 ? '' : 's'} to Level ${level + 1}` : '3 tasks to Level 2'}</strong>
          <span>{data.signedIn ? `${progress}%` : '0%'}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style:width={data.signedIn ? `${progress}%` : '0%'}></div>
        </div>
      </div>
      <div class="hero-actions">
        <a href="/tasks">Browse Tasks</a>
        <a href="/profile">Update Profile</a>
      </div>
    </div>
    <div class="hero-badge">
      <span>🔥</span>
      <small>{data.signedIn ? `${Math.max(1, Math.floor(approvedClaimsCount / 2))} day streak` : 'Start streak'}</small>
    </div>
  </section>

  <section class="metrics">
    <article>
      <Icon icon="mdi:check-circle-outline" width="22" height="22" />
      <h3>{approvedClaimsCount}</h3>
      <p>Tasks Completed</p>
    </article>
    <article>
      <Icon icon="mdi:clock-outline" width="22" height="22" />
      <h3>{totalHours.toFixed(1)}</h3>
      <p>Hours Contributed</p>
    </article>
    <article>
      <Icon icon="mdi:lightning-bolt-outline" width="22" height="22" />
      <h3>{impactScore}</h3>
      <p>Impact Score</p>
    </article>
    <article>
      <Icon icon="mdi:earth" width="22" height="22" />
      <h3>{peopleHelped}</h3>
      <p>People Helped</p>
    </article>
  </section>

  <section class="missions">
    <div class="title-row">
      <h2>Recommended Missions</h2>
      <a href="/tasks">View all</a>
    </div>
    <div class="mission-grid">
      <article>
        <span>10 mins</span>
        <h4>Proofread shelter profiles</h4>
        <p>Help an NGO clean up adoption profile copy before publishing.</p>
        <a href="/tasks">Accept</a>
      </article>
      <article>
        <span>25 mins</span>
        <h4>Tag climate photos</h4>
        <p>Categorize cleanup photos to improve environmental datasets.</p>
        <a href="/tasks">Accept</a>
      </article>
      <article>
        <span>5 mins</span>
        <h4>Quick translation check</h4>
        <p>Review short multilingual snippets for accuracy and tone.</p>
        <a href="/tasks">Accept</a>
      </article>
    </div>
  </section>

  <section class="activity">
    <div class="title-row">
      <h2>Recent Activity</h2>
    </div>
    {#if data.signedIn && recentClaims.length > 0}
      <div class="activity-list">
        {#each recentClaims as claim}
          <article>
            <div>
              <strong>{claim.task?.title || 'Task'}</strong>
              <p>{claim.status === 'approved' ? 'Completed' : claim.status === 'pending' ? 'Under review' : 'Needs revision'}</p>
            </div>
            <Icon icon={claim.status === 'approved' ? 'mdi:check-circle' : claim.status === 'pending' ? 'mdi:clock-outline' : 'mdi:alert-circle-outline'} width="20" height="20" />
          </article>
        {/each}
      </div>
    {:else}
      <div class="empty">
        <Icon icon="mdi:trophy-outline" width="44" height="44" />
        <p>Complete your first task to start filling this dashboard.</p>
      </div>
    {/if}
  </section>

  <section class="vault">
    <div class="title-row">
      <h2>Badge Vault</h2>
      <a href="/badges/manage">Manage</a>
    </div>
    <div class="badge-grid">
      {#if badges.length > 0}
        {#each badges.slice(0, 6) as badge}
          <div class="badge-cell">
            <span>🏆</span>
            <small>{badge.label}</small>
          </div>
        {/each}
      {:else}
        <div class="badge-cell locked"><span>🔒</span><small>First Mission</small></div>
        <div class="badge-cell locked"><span>🔒</span><small>Global Citizen</small></div>
        <div class="badge-cell locked"><span>🔒</span><small>Perfect Week</small></div>
      {/if}
    </div>
    {#if data.signedIn}
      <button class="claim" on:click={fireConfettiBurst}>Claim Reward</button>
    {:else}
      <a href="/login" class="claim login">Sign in to unlock</a>
    {/if}
  </section>
</div>

<div id="toast" class="toast"></div>

<style>
  .dash-shell { display: grid; gap: 18px; max-width: 1200px; margin: 0 auto; }
  .hero, .missions, .activity, .vault, .metrics article { background: #fff; border: 1px solid #eceff3; box-shadow: 0 16px 40px rgba(0,0,0,.06); border-radius: 24px; }
  .hero { padding: 26px; display: flex; justify-content: space-between; gap: 14px; }
  .hero-copy h1 { margin: 0; font-size: 34px; font-weight: 800; color: #1e293b; }
  .hero-copy p { margin: 10px 0 0; color: rgba(30,41,59,.66); }
  .hero-badge { display: grid; align-content: center; justify-items: center; min-width: 130px; background: #fdfcf8; border: 1px solid #eceff3; border-radius: 18px; padding: 10px; }
  .hero-badge span { font-size: 26px; }
  .hero-badge small { color: #1e293b; font-weight: 700; font-size: 12px; }
  .progress-wrap { margin-top: 18px; max-width: 560px; }
  .progress-head { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
  .progress-head strong { color: #1e293b; }
  .progress-head span { color: rgba(30,41,59,.5); font-weight: 700; }
  .progress-track { height: 10px; border-radius: 999px; background: #edf0f5; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg,#ff6b6b,#f59e0b); border-radius: 999px; transition: width .3s ease; }
  .hero-actions { margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap; }
  .hero-actions a { text-decoration: none; border-radius: 12px; padding: 10px 14px; font-weight: 700; }
  .hero-actions a:first-child { background: #1e293b; color: #fff; }
  .hero-actions a:last-child { background: #fdfcf8; color: #1e293b; border: 1px solid #eceff3; }
  .metrics { display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0,1fr)); }
  .metrics article { padding: 18px; }
  .metrics h3 { margin: 8px 0 2px; font-size: 28px; color: #1e293b; }
  .metrics p { margin: 0; color: rgba(30,41,59,.58); font-size: 13px; }
  .missions, .activity, .vault { padding: 22px; }
  .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .title-row h2 { margin: 0; font-size: 22px; color: #1e293b; }
  .title-row a { text-decoration: none; color: #ff6b6b; font-weight: 800; font-size: 13px; }
  .mission-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0,1fr)); }
  .mission-grid article { background: #fff; border: 1px solid #eceff3; border-radius: 18px; padding: 14px; display: grid; gap: 8px; }
  .mission-grid span { display: inline-block; width: fit-content; border-radius: 999px; background: #fdfcf8; border: 1px solid #eceff3; color: #1e293b; font-size: 11px; font-weight: 700; padding: 4px 8px; }
  .mission-grid h4 { margin: 0; color: #1e293b; font-size: 17px; }
  .mission-grid p { margin: 0; color: rgba(30,41,59,.64); font-size: 13px; line-height: 1.4; min-height: 38px; }
  .mission-grid a { text-decoration: none; text-align: center; border-radius: 12px; padding: 9px 10px; background: #1e293b; color: #fff; font-weight: 700; font-size: 13px; }
  .activity-list { display: grid; gap: 10px; }
  .activity-list article { border: 1px solid #eceff3; border-radius: 14px; padding: 12px; display: flex; justify-content: space-between; align-items: center; }
  .activity-list strong { color: #1e293b; }
  .activity-list p { margin: 4px 0 0; color: rgba(30,41,59,.58); font-size: 13px; }
  .empty { text-align: center; color: rgba(30,41,59,.55); padding: 18px 0; }
  .badge-grid { display: grid; gap: 10px; grid-template-columns: repeat(3, minmax(0,1fr)); margin-bottom: 14px; }
  .badge-cell { border: 1px solid #eceff3; background: #fdfcf8; border-radius: 16px; padding: 10px; text-align: center; display: grid; gap: 6px; }
  .badge-cell span { font-size: 24px; }
  .badge-cell small { color: rgba(30,41,59,.64); font-size: 12px; font-weight: 700; }
  .badge-cell.locked { opacity: .7; }
  .claim { width: 100%; border: 0; border-radius: 14px; height: 46px; background: #ff6b6b; color: #fff; font-weight: 800; cursor: pointer; text-decoration: none; display: grid; place-items: center; }
  .claim.login { background: #1e293b; }
  .toast { display:none; position: fixed; bottom: 86px; left: 50%; transform: translateX(-50%); padding: 10px 14px; background: #fff; border: 1px solid #eceff3; box-shadow: 0 16px 40px rgba(0,0,0,.08); border-radius: 10px; font-weight: 700; color: #1e293b; }
  @media (max-width: 1024px) {
    .metrics { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .mission-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 700px) {
    .hero { flex-direction: column; }
    .hero-badge { justify-self: start; }
    .mission-grid, .badge-grid { grid-template-columns: 1fr; }
  }
</style>
