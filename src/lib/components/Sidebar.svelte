<script lang="ts">
  import Icon from '@iconify/svelte';
  import { page } from '$app/stores';
</script>

<aside class="sidebar">
  <div style="margin-bottom: var(--space-8);">
    <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4) 0;">
      <div style="width: 40px; height: 40px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--color-primary), var(--color-primary-variant)); display: flex; align-items: center; justify-content: center;">
        <Icon icon="mdi:heart-outline" width="20" height="20" style="color: white;"/>
      </div>
      <span style="font-weight: var(--font-bold); font-size: var(--text-lg); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">MicroMatch</span>
    </div>
  </div>
  
  <nav style="display:flex; flex-direction:column; gap: var(--space-3); width: 100%;">
    <a href="/" class="nav-link" class:active={$page.url.pathname === '/'} >
      <Icon icon="mdi:view-dashboard-outline" width="22" height="22"/>
      <span style="font-weight: var(--font-semibold);">Feed</span>
    </a>
    <a href="/dashboard" class="nav-link" class:active={$page.url.pathname === '/dashboard'}>
      <Icon icon="mdi:seal-variant" width="22" height="22"/>
      <span style="font-weight: var(--font-medium);">Badges</span>
    </a>
    <a href="/login" class="nav-link" class:active={$page.url.pathname === '/login'}>
      <Icon icon="mdi:login-variant" width="22" height="22"/>
      <span style="font-weight: var(--font-medium);">Sign in</span>
    </a>
  </nav>
  
  <div style="margin-top: var(--space-12); padding: var(--space-4); background: var(--color-accent-blue-50); border-radius: var(--radius-lg); border: 1px solid var(--color-accent-blue-200);">
    <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
      <Icon icon="mdi:lightbulb-outline" width="16" height="16" style="color: var(--color-primary);"/>
      <span style="font-weight: var(--font-semibold); color: var(--color-primary); font-size: var(--text-sm);">Quick Tip</span>
    </div>
    <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--text-sm); line-height: var(--leading-normal);">Complete tasks in 15-30 minutes to maximize your impact and earn badges faster!</p>
  </div>
</aside>

<style>
  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    text-decoration: none;
    color: var(--color-text-tertiary);
    padding: var(--space-4) var(--space-4);
    border-radius: var(--radius-lg);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-link:hover {
    transform: translateY(-2px);
    box-shadow: var(--elev-2);
  }
  .nav-link.active {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-variant));
    color: white;
    box-shadow: var(--elev-1);
  }
</style>

