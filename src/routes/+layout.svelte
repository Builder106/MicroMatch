<script lang="ts">
   import '@smui/top-app-bar';
   import '@smui/button';
   import '../app.css';
 
   import TopAppBar from '@smui/top-app-bar';
   import Button from '@smui/button';
   import Icon from '@iconify/svelte';
   
   // Add Google Fonts
   import { onMount } from 'svelte';
   
   onMount(() => {
     const link = document.createElement('link');
     link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
     link.rel = 'stylesheet';
     document.head.appendChild(link);
   });
 </script>
 
 <TopAppBar style="background: var(--color-surface); box-shadow: var(--elev-1); z-index: 10;">
   <svelte:fragment slot="navigation">
     <Button variant="text" href="/" aria-label="Home" style="color: var(--color-primary);">
       <Icon icon="mdi:home" width="24" height="24"/>
     </Button>
   </svelte:fragment>
   <svelte:fragment slot="title">
     <span style="font-weight: 500; font-size: var(--text-xl); color: var(--color-text);">MicroMatch</span>
   </svelte:fragment>
   <svelte:fragment slot="actions">
     <Button variant="text" href="/org" aria-label="Post task" style="color: var(--color-primary);">
       <Icon icon="mdi:plus-circle-outline" width="24" height="24"/>
     </Button>
   </svelte:fragment>
 </TopAppBar>
 
 <div class="container" style="padding: var(--space-4) var(--space-4) 88px var(--space-4);">
   <slot />
 </div>
 
 <nav class="bottom-nav">
   <div style="display: flex; gap: var(--space-6); justify-content: space-around; padding: var(--space-2) 0;">
     <a href="/" style="text-align:center;text-decoration:none;color:inherit">
       <div class="card-elevated" style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 36px; border-radius: var(--radius-full); background: var(--color-primary); color: var(--color-on-primary); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
         <Icon icon="mdi:view-dashboard-outline" width="20" height="20"/>
       </div>
       <small style="display: block; color: var(--color-primary); margin-top: var(--space-1); font-weight: 500;">Feed</small>
     </a>
     <a href="/dashboard" style="text-align:center;text-decoration:none;color:inherit">
       <div style="width: 56px; height: 36px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
         <Icon icon="mdi:seal-variant" width="20" height="20" style="color: var(--color-text-secondary);"/>
       </div>
       <small style="display: block; color: var(--color-text-secondary); margin-top: var(--space-1);">Badges</small>
     </a>
     <a href="/org" style="text-align:center;text-decoration:none;color:inherit">
       <div style="width: 56px; height: 36px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
         <Icon icon="mdi:plus-circle-outline" width="20" height="20" style="color: var(--color-text-secondary);"/>
       </div>
       <small style="display: block; color: var(--color-text-secondary); margin-top: var(--space-1);">Post</small>
     </a>
   </div>
 </nav>