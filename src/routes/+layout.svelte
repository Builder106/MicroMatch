<script lang="ts">
   import '@smui/top-app-bar';
   import '@smui/button';
   import '../app.css';
 
   import TopAppBar from '@smui/top-app-bar';
   import Button from '@smui/button';
   import Icon from '@iconify/svelte';
   import { ModeWatcher, toggleMode } from 'mode-watcher';
   import Sidebar from '$lib/components/Sidebar.svelte';
   import { onMount } from 'svelte';
   import { page } from '$app/stores';
 
  // Add Google Fonts
   
   onMount(() => {
     const links = [
       'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
       'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap'
     ];
     links.forEach(href => {
       const link = document.createElement('link');
       link.href = href;
       link.rel = 'stylesheet';
       document.head.appendChild(link);
     });
   });
 </script>
 
 <TopAppBar style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(16px); box-shadow: var(--elev-1); z-index: 10; border-bottom: 1px solid var(--color-outline-variant);">
   <svelte:fragment slot="navigation">
     <Button variant="text" href="/" aria-label="Home" style="color: var(--color-primary); font-weight: var(--font-medium);">
       <Icon icon="mdi:home" width="24" height="24"/>
     </Button>
   </svelte:fragment>
   <svelte:fragment slot="title">
     <div style="display: flex; align-items: center; gap: var(--space-2);">
       <div style="width: 32px; height: 32px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-primary), var(--color-primary-variant)); display: flex; align-items: center; justify-content: center;">
         <Icon icon="mdi:heart-outline" width="18" height="18" style="color: white;"/>
       </div>
       <span style="font-weight: var(--font-bold); font-size: var(--text-xl); color: var(--color-text); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">MicroMatch</span>
     </div>
   </svelte:fragment>
   <svelte:fragment slot="actions">
    <div 
      on:click={toggleMode} 
      on:keydown={(e) => e.key === 'Enter' && toggleMode()}
      role="button" 
      tabindex="0"
      aria-label="Toggle theme" 
      style="margin-right: var(--space-2); cursor: pointer; border-radius: var(--radius-sm); padding: var(--space-2);"
    >
      <Button
        variant="unelevated"
        style="
          background-color: var(--color-surface-container);
          color: var(--color-text-secondary);
          --mdc-theme-primary: var(--color-surface-container);
        "
      >
        <Icon icon="mdi:theme-light-dark" width="20" height="20" />
        <span style="margin-left: var(--space-2);">Theme</span>
      </Button>
    </div>
     <Button variant="text" href="/org" aria-label="Post task" class="btn-primary" style="padding: var(--space-2) var(--space-4); font-size: var(--text-sm);">
       <Icon icon="mdi:plus-circle-outline" width="24" height="24"/>
       <span style="margin-left: var(--space-1);">Post</span>
     </Button>
   </svelte:fragment>
 </TopAppBar>
 
 <ModeWatcher />
 <div class="page-shell">
   {#if $page.route.id !== '/'}
     <Sidebar />
   {/if}
   <div class="container" style="padding: var(--space-6) var(--space-4); flex: 1 1 auto; max-width: 1200px;">
     <slot />
   </div>
 
   <nav class="bottom-nav">
   <div style="display: flex; gap: var(--space-6); justify-content: space-around; padding: var(--space-4) 0;">
     <a href="/" style="text-align:center;text-decoration:none;color:inherit">
       <div class="card-elevated animate-scale-in" style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 40px; border-radius: var(--radius-xl); background: linear-gradient(135deg, var(--color-primary), var(--color-primary-variant)); color: var(--color-on-primary); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
         <Icon icon="mdi:view-dashboard-outline" width="20" height="20"/>
       </div>
       <small style="display: block; color: var(--color-primary); margin-top: var(--space-2); font-weight: var(--font-medium); font-size: var(--text-xs);">Feed</small>
     </a>
     <a href="/dashboard" style="text-align:center;text-decoration:none;color:inherit">
       <div class="hover-lift" style="width: 56px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius-xl); background: var(--color-surface-variant); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
         <Icon icon="mdi:seal-variant" width="20" height="20" style="color: var(--color-text-secondary);"/>
       </div>
       <small style="display: block; color: var(--color-text-secondary); margin-top: var(--space-2); font-weight: var(--font-medium); font-size: var(--text-xs);">Badges</small>
     </a>
     <a href="/org" style="text-align:center;text-decoration:none;color:inherit">
       <div class="hover-lift" style="width: 56px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius-xl); background: var(--color-surface-variant); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
         <Icon icon="mdi:plus-circle-outline" width="20" height="20" style="color: var(--color-text-secondary);"/>
       </div>
       <small style="display: block; color: var(--color-text-secondary); margin-top: var(--space-2); font-weight: var(--font-medium); font-size: var(--text-xs);">Post</small>
     </a>
   </div>
   </nav>
 </div>