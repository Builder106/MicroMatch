<script lang="ts">
  import Icon from '@iconify/svelte';
  import { signInWithGoogle, signInEmail, refreshSessionCookie } from '$lib/appwrite.client';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error: string | null = null;
  let submitting = false;

  function oauthGoogle(e: Event) {
    e.preventDefault();
    signInWithGoogle();
  }

  async function handleEmailSignIn(e: Event) {
    e.preventDefault();
    error = null;
    submitting = true;
    try {
      await signInEmail(email, password);
      await refreshSessionCookie();
      goto('/dashboard');
    } catch (err) {
      error = 'Invalid email or password.';
    } finally {
      submitting = false;
    }
  }
</script>

<div style="min-height: calc(100vh - 140px); display:flex; align-items:center; justify-content:center; padding: var(--space-6);">
  <div class="card" style="width:100%; max-width: 440px; padding: var(--space-6); border-radius: var(--radius-lg); display:flex; flex-direction:column; gap: var(--space-4);">
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin:0 0 var(--space-1) 0;">Sign in</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Access your badges and track progress</p>
    </div>

    <form on:submit={oauthGoogle}>
      <button type="submit" style="width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: #fff; cursor:pointer; font-weight:500;">
        <Icon icon="logos:google-icon" />
        <span style="color: #000000;">Continue with Google</span>
      </button>
    </form>

    <div style="display:flex; align-items:center; gap:12px;">
      <div style="flex:1; height:1px; background: var(--color-outline-variant);"></div>
      <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">OR</span>
      <div style="flex:1; height:1px; background: var(--color-outline-variant);"></div>
    </div>

    <form on:submit={handleEmailSignIn} style="display:flex; flex-direction:column; gap:10px;">
      {#if error}
        <div style="color: var(--color-error); font-size: var(--text-sm);">{error}</div>
      {/if}
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Email</span>
        <input bind:value={email} name="email" type="email" placeholder="you@example.com" required autocomplete="email" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Password</span>
          <a href="/forgot-password" style="font-size: var(--text-xs); color: var(--color-primary); text-decoration:none;">Forgot password?</a>
        </div>
        <input bind:value={password} name="password" type="password" placeholder="••••••••" required autocomplete="current-password" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <button type="submit" class="btn-primary" style="width:100%;" disabled={submitting}>
        {#if submitting}
          <Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
        {:else}
          Sign in with Email
        {/if}
      </button>
    </form>

    <div style="display:flex; justify-content:space-between; font-size: var(--text-xs); color: var(--color-text-secondary);">
      <span>Having trouble? <a href="/" style="color: var(--color-primary); text-decoration:none;">Back to home</a></span>
      <a href="/signup" style="color: var(--color-primary); text-decoration:none; font-weight:500;">Create account</a>
    </div>
  </div>
</div>

<style>
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

