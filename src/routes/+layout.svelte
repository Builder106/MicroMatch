<script lang="ts">
   import '@smui/top-app-bar';
   import '@smui/button';
   import '../app.css';
 
   import TopAppBar from '@smui/top-app-bar';
   import Button from '@smui/button';
   import Icon from '@iconify/svelte';
 </script>
 
 <TopAppBar style="background: var(--color-surface);">
   <svelte:fragment slot="navigation">
     <Button variant="text" href="/" aria-label="Home"><Icon icon="mdi:home"/></Button>
   </svelte:fragment>
   <svelte:fragment slot="title">
     <span style="font-weight:700">MicroMatch</span>
   </svelte:fragment>
   <svelte:fragment slot="actions">
     <Button variant="text" href="/org" aria-label="Post task"><Icon icon="mdi:plus-circle-outline"/></Button>
   </svelte:fragment>
 </TopAppBar>
 
 <div class="container" style="padding: 16px 16px 88px 16px;">
   <slot />
 </div>
 
 <nav class="bottom-nav">
   <div style="display:flex;gap:24px;justify-content:space-around;padding:8px 0;">
     <a href="/" style="text-align:center;text-decoration:none;color:inherit">
       <div class="card" style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:36px;border-radius:999px;background:#eef2ff;color:#1d4ed8;">
         <Icon icon="mdi:view-dashboard-outline"/>
       </div>
       <small style="display:block;color:var(--color-muted);margin-top:4px;">Feed</small>
     </a>
     <a href="/dashboard" style="text-align:center;text-decoration:none;color:inherit">
       <div style="width:56px;height:36px;display:inline-flex;align-items:center;justify-content:center;">
         <Icon icon="mdi:seal-variant"/>
       </div>
       <small style="display:block;color:var(--color-muted);margin-top:4px;">Badges</small>
     </a>
     <a href="/org" style="text-align:center;text-decoration:none;color:inherit">
       <div style="width:56px;height:36px;display:inline-flex;align-items:center;justify-content:center;">
         <Icon icon="mdi:plus-circle-outline"/>
       </div>
       <small style="display:block;color:var(--color-muted);margin-top:4px;">Post</small>
     </a>
   </div>
 </nav>