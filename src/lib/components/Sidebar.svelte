<script lang="ts">
  import Icon from '@iconify/svelte';
  import { page } from '$app/state';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<aside class="sidebar">
  <div style="margin-bottom: var(--space-8);">
    <div class="micromatch-header-container">
      <div class="micromatch-logo-container">
        <img src="/logo.png" alt="MicroMatch Logo" width="24" height="24" />
      </div>
      <a href="/" class="micromatch-header-link">MicroMatch</a>
    </div>
  </div>
  
  <nav class="nav-container">
    <a href="/tasks" class="nav-link" class:active={page.url.pathname === '/tasks'} >
      <Icon icon="mdi:view-dashboard-outline" width="22" height="22"/>
      <span class="font-semibold">Feed</span>
    </a>
    <a href="/dashboard" class="nav-link" class:active={page.url.pathname === '/dashboard'}>
      <Icon icon="mdi:seal-variant" width="22" height="22"/>
      <span class="font-medium">Badges</span>
    </a>
    <a href="/login" class="nav-link" class:active={page.url.pathname === '/login' || page.url.pathname === '/signup'}>
      <Icon icon="mdi:login-variant" width="22" height="22"/>
      <span class="font-medium">Sign in</span>
    </a>
  </nav>
  
  <div class="quick-tip-container">
    <div class="quick-tip-header">
      <Icon icon="mdi:lightbulb-outline" width="16" height="16" class="quick-tip-icon"/>
      <span class="quick-tip-title">Quick Tip</span>
    </div>
    <p class="quick-tip-text">Complete tasks in 15-30 minutes to maximize your impact and earn badges faster!</p>
  </div>

  <div style="margin-top: var(--space-4);">
    <ThemeToggle compact={true} />
  </div>
</aside>

<style>
  .nav-container {
    display:flex; 
    flex-direction:column; 
    gap: var(--space-3); 
    width: 100%;
  }

  .font-semibold {
    font-weight: var(--font-semibold);
  }

  .font-medium {
    font-weight: var(--font-medium);
  }
  
  .quick-tip-container {
    margin-top: var(--space-12); 
    padding: var(--space-4); 
    background: var(--color-dark-gray); 
    border-radius: var(--radius-lg); 
    border: 1px solid var(--color-dark-gray-variant);
  }

  .quick-tip-header {
    display: flex; 
    align-items: center; 
    gap: var(--space-2); 
    margin-bottom: var(--space-2);
  }

  .quick-tip-title {
    font-weight: var(--font-semibold); 
    color: var(--color-primary); 
    font-size: var(--text-sm);
  }

  .quick-tip-text {
    margin: 0; 
    color: var(--color-text-secondary); 
    font-size: var(--text-sm); 
    line-height: var(--leading-normal);
  }

  .micromatch-header-container {
    display: flex; 
    align-items: center; 
    gap: var(--space-3); 
    padding: var(--space-4) 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: var(--radius-lg);
  }

  .micromatch-header-container:hover {
    transform: translateY(-2px);
    box-shadow: var(--elev-2);
    cursor: pointer;
  }

  .micromatch-logo-container {
    width: 40px; 
    height: 40px; 
    border-radius: var(--radius-lg); 
    display: flex; 
    align-items: center; 
    justify-content: center;
  }

  .micromatch-header-link {
    text-decoration: none; 
    font-weight: var(--font-bold); 
    font-size: var(--text-lg); 
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-variant)); 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
    background-clip: text;
  }

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

