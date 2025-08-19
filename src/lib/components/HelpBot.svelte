<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  let open = false;
  let webchatContainer: HTMLDivElement | null = null;
  let webchatReady = false;
  let errorMsg: string | null = null;

  async function ensureWebChatLoaded() {
    if ((window as any).WebChat) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function openChat() {
    open = true;
    errorMsg = null;
    const loaded = await ensureWebChatLoaded();
    if (!loaded) {
      errorMsg = 'Unable to load chat client';
      return;
    }
    try {
      const res = await fetch('/api/bot/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      if (!res.ok) {
        errorMsg = 'Unable to get chat token';
        return;
      }
      const { token } = await res.json();
      if (!token) {
        errorMsg = 'Chat token missing';
        return;
      }
      const directLine = (window as any).WebChat.createDirectLine({ token });
      (window as any).WebChat.renderWebChat({ directLine }, webchatContainer);
      webchatReady = true;
    } catch (e) {
      errorMsg = 'Failed to initialize chat';
    }
  }

  function closeChat() {
    open = false;
  }

  onMount(() => {
    // no-op, lazy initialization in openChat
  });
</script>

<style>
  .helpbot-button {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 50;
  }
  .helpbot-panel {
    position: fixed;
    right: 24px;
    bottom: 88px;
    width: min(420px, 92vw);
    height: min(560px, 80vh);
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-outline-variant, #e0e0e0);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .helpbot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-outline-variant, #eee);
    background: var(--color-surface-container, #fafafa);
  }
  .webchat-container {
    flex: 1 1 auto;
  }
</style>

<div class="helpbot-button">
  {#if !open}
    <button on:click={openChat} style="display:flex;align-items:center;gap:8px;padding:10px 14px;border:none;border-radius:999px;background:var(--color-primary);color:var(--color-on-primary);cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
      <Icon icon="mdi:robot-happy" width="20" height="20" />
      <span>Help</span>
    </button>
  {:else}
    <button on:click={closeChat} style="display:flex;align-items:center;gap:8px;padding:10px 14px;border:none;border-radius:999px;background:var(--color-secondary,#6c63ff);color:#fff;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
      <Icon icon="mdi:close" width="20" height="20" />
      <span>Close</span>
    </button>
  {/if}
  {#if open}
    <div class="helpbot-panel" role="dialog" aria-label="Help chat">
      <div class="helpbot-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <Icon icon="mdi:robot-happy" width="20" height="20" />
          <strong>HelpBot</strong>
        </div>
        <button on:click={closeChat} style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:8px;">
          <Icon icon="mdi:close" width="20" height="20" />
        </button>
      </div>
      {#if errorMsg}
        <div style="padding:12px;color:var(--color-error,#b00020)">{errorMsg}</div>
      {/if}
      <div bind:this={webchatContainer} class="webchat-container"></div>
    </div>
  {/if}
</div>

