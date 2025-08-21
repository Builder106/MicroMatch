<script lang="ts">
	import Icon from '@iconify/svelte';
	import { account } from '$lib/appwrite.client';
	import { goto } from '$app/navigation';

	let email = '';
	let error: string | null = null;
	let submitting = false;
	let success = false;

	async function handleForgotPassword(e: Event) {
		e.preventDefault();
		error = null;
		submitting = true;
		success = false;
		try {
			const resetUrl = `${window.location.origin}/reset-password`;
			await account.createRecovery(email, resetUrl);
			success = true;
		} catch (err) {
			error = 'Failed to send password reset email. Please check the email address and try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<div
	style="min-height: calc(100vh - 140px); display:flex; align-items:center; justify-content:center; padding: var(--space-6);"
>
	<div
		class="card"
		style="width:100%; max-width: 440px; padding: var(--space-6); border-radius: var(--radius-lg); display:flex; flex-direction:column; gap: var(--space-4);"
	>
		<div>
			<h1 style="font-size: var(--text-2xl); font-weight: 500; margin:0 0 var(--space-1) 0;">
				Forgot Password
			</h1>
			<p class="text-muted" style="font-size: var(--text-sm);">
				Enter your email to receive a password reset link.
			</p>
		</div>

		{#if success}
			<div
				style="background: color-mix(in srgb, var(--color-success) 10%, transparent); color: var(--color-success); padding: var(--space-3); border-radius: var(--radius-sm);"
			>
				Password reset email sent! Please check your inbox.
			</div>
		{:else}
			<form on:submit={handleForgotPassword} style="display:flex; flex-direction:column; gap:10px;">
				{#if error}
					<div style="color: var(--color-error); font-size: var(--text-sm);">{error}</div>
				{/if}
				<label style="display:flex; flex-direction:column; gap:6px;">
					<span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Email</span>
					<input
						bind:value={email}
						name="email"
						type="email"
						placeholder="you@example.com"
						required
						autocomplete="email"
						style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
					/>
				</label>
				<button type="submit" class="btn-primary" style="width:100%;" disabled={submitting}>
					{#if submitting}
						<Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
					{:else}
						Send Reset Link
					{/if}
				</button>
			</form>
		{/if}

		<div
			style="display:flex; justify-content:space-between; font-size: var(--text-xs); color: var(--color-text-secondary);"
		>
			<span>Remembered your password?
				<a href="/login" style="color: var(--color-primary); text-decoration:none;">Sign in</a></span
			>
		</div>
	</div>
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
