<script lang="ts">
  import Icon from '@iconify/svelte';
  import { signInWithGoogle, signUpEmail } from '$lib/appwrite.client';
  import { goto } from '$app/navigation';
  import AuthBrandPanel from '$lib/components/AuthBrandPanel.svelte';
  let email = '';
  let password = '';
  let firstName = '';
  let lastName = '';
  let role: 'volunteer' | 'ngo' = 'volunteer';
  let step: 1 | 2 = 1;
  let error: string | null = null;
  let submitting = false;
  async function handleSignup(e: Event) {
    e.preventDefault();
    error = null;
    submitting = true;
    try {
      const name = `${firstName} ${lastName}`.trim();
      await signUpEmail(email, password, name || undefined, role);
      goto('/dashboard');
    } catch {
      error = 'Sign up failed. Please check your details or try Google.';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="auth-shell">
  <div class="left-panel">
    <AuthBrandPanel />
  </div>

  <section class="right-panel">
    <div class="mobile-stage">
      <AuthBrandPanel compact />
    </div>

    <div class="auth-card">
      <div class="auth-head">
        {#if step === 2}
          <button class="back-btn" on:click={() => (step = 1)}>
            <Icon icon="mdi:arrow-left" width="16" height="16" />
            Back
          </button>
        {/if}
        <h1>{step === 1 ? 'Choose your path' : 'Create your account'}</h1>
        <p>{step === 1 ? "Tell us how you'd like to use MicroMatch." : 'Just a few details to set up your civic hub.'}</p>
      </div>

      {#if step === 1}
        <div class="roles">
          <button class="role-card volunteer" type="button" on:click={() => { role = 'volunteer'; step = 2; }}>
            <span class="role-icon">
              <Icon icon="mdi:account-group-outline" width="28" height="28" />
            </span>
            <span class="role-copy">
              <strong>I'm a Volunteer</strong>
              <span>Complete micro-tasks, build streaks, and unlock civic badges.</span>
            </span>
          </button>
          <button class="role-card ngo" type="button" on:click={() => { role = 'ngo'; step = 2; }}>
            <span class="role-icon">
              <Icon icon="mdi:office-building-outline" width="28" height="28" />
            </span>
            <span class="role-copy">
              <strong>I represent an NGO</strong>
              <span>Post modular needs, verify submissions, and mobilize volunteers.</span>
            </span>
          </button>
        </div>
        <p class="foot">
          Already have an account?
          <a href="/login">Sign in</a>
        </p>
      {:else}
        <form on:submit|preventDefault={() => signInWithGoogle()}>
          <button type="submit" class="google-btn">
            <Icon icon="logos:google-icon" />
            Sign up with Google
          </button>
        </form>

        <div class="divider">
          <span></span>
          <small>Or continue with email</small>
          <span></span>
        </div>

        <form class="auth-form" on:submit={handleSignup}>
          {#if error}
            <p class="error">{error}</p>
          {/if}
          <div class="name-grid">
            <label>
              <span>First Name</span>
              <input bind:value={firstName} type="text" placeholder="Jane" autocomplete="given-name" required />
            </label>
            <label>
              <span>Last Name</span>
              <input bind:value={lastName} type="text" placeholder="Doe" autocomplete="family-name" required />
            </label>
          </div>
          <label>
            <span>Email Address</span>
            <input bind:value={email} type="email" placeholder="jane@example.com" required autocomplete="email" />
          </label>
          <label>
            <span>Create Password</span>
            <input bind:value={password} type="password" placeholder="••••••••" minlength="8" required autocomplete="new-password" />
          </label>
          <button type="submit" class="submit-btn" disabled={submitting}>
            {#if submitting}
              <Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
            {:else}
              Join MicroMatch
            {/if}
          </button>
        </form>
      {/if}
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
    width: 100%;
    display: block;
    margin-bottom: 8px;
  }
  .auth-card {
    width: min(540px, calc(100% - 2rem));
    padding: 28px 18px 32px;
  }
  .auth-head {
    margin-bottom: 22px;
  }
  .back-btn {
    border: 0;
    background: transparent;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-weight: 700;
    margin-bottom: 14px;
    font-size: 0.95rem;
  }
  h1 {
    font-size: clamp(2.35rem, 3.5vw, 3.4rem);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    color: #475569;
    font-size: 1.08rem;
    font-weight: 500;
  }
  .roles {
    display: grid;
    gap: 16px;
  }
  .role-card {
    border: 2px solid #e2e8f0;
    border-radius: 24px;
    background: #fff;
    text-align: left;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    cursor: pointer;
    transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
  }
  .role-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  }
  .role-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    background: #f1f5f9;
    color: #64748b;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }
  .role-copy {
    display: grid;
    gap: 5px;
  }
  .role-copy strong {
    font-size: 1.38rem;
    line-height: 1.2;
    color: #0f172a;
  }
  .role-copy span {
    color: #475569;
    line-height: 1.5;
    font-size: 1rem;
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
  .name-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
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
  input {
    height: 52px;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 0 14px;
    background: #fff;
    color: #0f172a;
    font-size: 0.96rem;
    font-weight: 600;
  }
  input:focus {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.12);
    outline: none;
  }
  .submit-btn {
    margin-top: 6px;
    height: 54px;
    border: 0;
    border-radius: 14px;
    background: #0f172a;
    color: #fff;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
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
    margin-top: 22px;
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
  @media (min-width: 740px) {
    .name-grid {
      grid-template-columns: 1fr 1fr;
    }
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
      width: min(540px, 100%);
      padding: 8px 4px;
    }
    h1 {
      font-size: clamp(2.25rem, 2.4vw, 2.6rem);
    }
    p {
      font-size: 1.125rem;
    }
    .role-copy strong {
      font-size: 1.45rem;
    }
    .role-copy span {
      font-size: 1rem;
    }
    label span {
      font-size: 0.9rem;
    }
    .foot {
      font-size: 0.95rem;
    }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

