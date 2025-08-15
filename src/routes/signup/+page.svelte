<script lang="ts">
  import { signInWithGoogle, signUpEmail } from '$lib/appwrite.client';
  let email = '';
  let password = '';
  let name = '';
  let role: 'volunteer' | 'ngo' = 'volunteer';
  let error: string | null = null;
  async function handleSignup(e: Event) {
    e.preventDefault();
    error = null;
    try {
      await signUpEmail(email, password, name || undefined, role);
      window.location.href = '/dashboard';
    } catch (err) {
      error = 'Sign up failed. Please check your details or try Google.';
      console.error(err);
    }
  }
</script>

<div style="min-height: calc(100vh - 140px); display:flex; align-items:center; justify-content:center; padding: var(--space-6);">
  <div class="card" style="width:100%; max-width: 480px; padding: var(--space-6); border-radius: var(--radius-lg); display:flex; flex-direction:column; gap: var(--space-4);">
    <div>
      <h1 style="font-size: var(--text-2xl); font-weight: 500; margin:0 0 var(--space-1) 0;">Create your account</h1>
      <p class="text-muted" style="font-size: var(--text-sm);">Start tracking badges and progress</p>
    </div>

    <form on:submit|preventDefault={() => signInWithGoogle()}>
      <button type="submit" style="width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: #fff; cursor:pointer; font-weight:500;">
        <span style="width:18px; height:18px; background:#fff; border-radius:2px; display:inline-block; box-shadow: inset 0 0 0 1px #e5e7eb;"></span>
        Continue with Google
      </button>
    </form>

    <div style="display:flex; align-items:center; gap:12px;">
      <div style="flex:1; height:1px; background: var(--color-outline-variant);"></div>
      <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">OR</span>
      <div style="flex:1; height:1px; background: var(--color-outline-variant);"></div>
    </div>

    <div style="display: flex; gap: var(--space-4); justify-content: center; margin-bottom: var(--space-2);">
      <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
        <input type="radio" bind:group={role} name="role" value="volunteer" style="accent-color: var(--color-primary);" />
        <span>I'm a Volunteer</span>
      </label>
      <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
        <input type="radio" bind:group={role} name="role" value="ngo" style="accent-color: var(--color-primary);" />
        <span>I'm an NGO</span>
      </label>
    </div>

    {#if error}
      <div style="color: var(--color-error); font-size: var(--text-sm);">{error}</div>
    {/if}

    <form on:submit={handleSignup} style="display:flex; flex-direction:column; gap:10px;">
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Name</span>
        <input bind:value={name} type="text" placeholder="Your name" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Email</span>
        <input bind:value={email} type="email" placeholder="you@example.com" required style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Password</span>
        <input bind:value={password} type="password" placeholder="••••••••" minlength="8" required style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <button type="submit" class="btn-primary" style="width:100%;">Create account</button>
    </form>

    <div style="text-align:center; font-size: var(--text-xs); color: var(--color-text-secondary);">
      Already have an account? <a href="/login" style="color: var(--color-primary); text-decoration:none;">Sign in</a>
    </div>
  </div>
</div>

