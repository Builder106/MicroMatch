<script lang="ts">
  import Icon from '@iconify/svelte';
  import { signInWithGoogle, signInEmail, refreshSessionCookie } from '$lib/appwrite.client';
  import { goto } from '$app/navigation';
  import AuthBrandPanel from '$lib/components/AuthBrandPanel.svelte';

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
    } catch {
      error = 'Invalid email or password.';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="auth-shell">
  <div class="left-panel">
    <AuthBrandPanel animation="/animations/collaboration.lottie" />
  </div>

  <section class="right-panel">
    <div class="mobile-stage">
      <AuthBrandPanel compact animation="/animations/collaboration.lottie" />
    </div>

    <div class="auth-card">
      <div class="auth-head">
        <h1>Welcome back</h1>
        <p>Ready to jump into your next mission?</p>
      </div>

      <form on:submit={oauthGoogle}>
        <button type="submit" class="google-btn">
          <Icon icon="logos:google-icon" />
          Continue with Google
        </button>
      </form>

      <div class="divider">
        <span></span>
        <small>Or log in with email</small>
        <span></span>
      </div>

      <form class="auth-form" on:submit={handleEmailSignIn}>
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <label>
          <span>Email Address</span>
          <div class="field-wrap">
            <Icon icon="lucide:mail" width="18" height="18" />
            <input class="with-icon" bind:value={email} name="email" type="email" placeholder="jane@example.com" required autocomplete="email" />
          </div>
        </label>
        <label>
          <span>Password</span>
          <div class="field-wrap">
            <Icon icon="lucide:lock" width="18" height="18" />
            <input class="with-icon" bind:value={password} name="password" type="password" placeholder="••••••••" required autocomplete="current-password" />
          </div>
        </label>
        <div class="forgot-link">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button type="submit" class="submit-btn" disabled={submitting}>
          {#if submitting}
            <Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
          {:else}
            Sign In <Icon icon="lucide:arrow-right" width="20" height="20" />
          {/if}
        </button>
      </form>

      <p class="foot">
        Don't have an account?
        <a href="/signup">Create one</a>
      </p>
    </div>
  </section>
</div>

<style>
  .auth-shell {
    height: 100vh;
    width: 100%;
    display: flex;
    background: #faf9f6;
    overflow: hidden;
  }
  .left-panel {
    width: 55%;
    height: 100vh;
    display: none;
  }
  .right-panel {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
  }
  .mobile-stage {
    display: block;
    width: 100%;
    margin-bottom: 8px;
  }
  .auth-card {
    width: min(440px, calc(100% - 2rem));
    padding: 28px 18px 30px;
  }
  .auth-head {
    margin-bottom: 20px;
  }
  h1 {
    font-size: clamp(2.35rem, 3.5vw, 3.4rem);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  p {
    color: #475569;
    margin: 0;
    font-size: 1.08rem;
    font-weight: 500;
  }
  .google-btn {
    width: 100%;
    height: 52px;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: 700;
    color: #0f172a;
    cursor: pointer;
    transition: border-color 120ms ease, background-color 120ms ease;
  }
  .google-btn:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
  .divider {
    margin: 22px 0 18px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 12px;
    align-items: center;
  }
  .divider span {
    height: 1px;
    background: #e2e8f0;
  }
  .divider small {
    font-weight: 700;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #64748b;
  }
  .auth-form {
    display: grid;
    gap: 14px;
  }
  label {
    display: grid;
    gap: 8px;
  }
  label span {
    font-size: 0.875rem;
    font-weight: 700;
    color: #0f172a;
  }
  .field-wrap {
    position: relative;
  }
  .field-wrap :global(svg) {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }
  .with-icon {
    padding-left: 42px;
  }
  input {
    height: 52px;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 0 14px;
    background: #fff;
    color: #0f172a;
    font-weight: 600;
    font-size: 0.98rem;
  }
  input:focus {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.12);
    outline: none;
  }
  .forgot-link {
    display: flex;
    justify-content: flex-end;
    margin-top: -4px;
  }
  .forgot-link a {
    font-size: 0.875rem;
    color: #ff6b6b;
    text-decoration: none;
    font-weight: 700;
  }
  .submit-btn {
    margin-top: 6px;
    height: 54px;
    border: 0;
    border-radius: 14px;
    background: #0f172a;
    color: #fff;
    font-size: 1.05rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.24);
  }
  .submit-btn:hover {
    background: #1e293b;
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.28);
  }
  .submit-btn:active {
    transform: scale(0.99);
  }
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .error {
    margin: 0;
    color: #dc2626;
    font-size: 0.95rem;
    font-weight: 600;
  }
  .foot {
    margin-top: 20px;
    text-align: center;
    font-size: 0.95rem;
  }
  .foot a {
    color: #1e293b;
    text-decoration: underline;
    text-decoration-color: #cbd5e1;
    text-decoration-thickness: 2px;
    text-underline-offset: 5px;
    font-weight: 800;
    margin-left: 4px;
  }
  @media (min-width: 1024px) {
    .left-panel {
      display: block;
    }
    .right-panel {
      width: 45%;
      padding: 36px 16px;
    }
    .mobile-stage {
      display: none;
    }
    .auth-card {
      width: min(440px, 100%);
      padding: 8px 4px;
    }
    h1 {
      font-size: clamp(2.25rem, 2.4vw, 2.6rem);
    }
    p {
      font-size: 1.125rem;
    }
    label span {
      font-size: 0.9rem;
    }
    .submit-btn {
      font-size: 1.06rem;
    }
    .foot {
      font-size: 0.95rem;
    }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

