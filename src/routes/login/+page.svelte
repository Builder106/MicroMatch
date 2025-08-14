<script lang="ts">
  import { signInWithGoogle } from '$lib/appwrite.client';
  function oauthGoogle(e: Event) {
    e.preventDefault();
    signInWithGoogle();
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
        <span style="width:18px; height:18px; background:#fff; border-radius:2px; display:inline-block; box-shadow: inset 0 0 0 1px #e5e7eb;"></span>
        Continue with Google
      </button>
    </form>

    <div style="display:flex; align-items:center; gap:12px;">
      <div style="flex:1; height:1px; background: var(--color-outline-variant);"></div>
      <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">OR</span>
      <div style="flex:1; height:1px; background: var(--color-outline-variant);"></div>
    </div>

    <form on:submit|preventDefault={async (e) => {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      const email = String(form.get('email') ?? '');
      const password = String(form.get('password') ?? '');
      if (!email || !password) return;
      // For demo, Appwrite email session is done via OAuth button above.
      // You can extend this to signUpEmail/signInEmail if you enable email/password in Appwrite project.
      alert('For this demo, please use Google sign-in.');
    }} style="display:flex; flex-direction:column; gap:10px;">
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Email</span>
        <input name="email" type="email" placeholder="you@example.com" required style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <label style="display:flex; flex-direction:column; gap:6px;">
        <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Password</span>
        <input name="password" type="password" placeholder="••••••••" required style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"/>
      </label>
      <button type="submit" class="btn-primary" style="width:100%;">Sign in with Email</button>
    </form>

    <div style="display:flex; justify-content:space-between; font-size: var(--text-xs); color: var(--color-text-secondary);">
      <span>Having trouble? <a href="/" style="color: var(--color-primary); text-decoration:none;">Back to home</a></span>
      <a href="/signup" style="color: var(--color-primary); text-decoration:none; font-weight:500;">Create account</a>
    </div>
  </div>
</div>

