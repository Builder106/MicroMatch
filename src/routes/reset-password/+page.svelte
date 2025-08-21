<script lang="ts">
	import Icon from '@iconify/svelte';
	import { account } from '$lib/appwrite.client';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let password = '';
	let passwordConfirm = '';
	let error: string | null = null;
	let submitting = false;
	let success = false;
	let userId = '';
	let secret = '';

	onMount(() => {
		const params = $page.url.searchParams;
		userId = params.get('userId') ?? '';
		secret = params.get('secret') ?? '';
		if (!userId || !secret) {
			error = 'Invalid password reset link. Please try again.';
		}
	});

	async function handleResetPassword(e: Event) {
		e.preventDefault();
		if (password !== passwordConfirm) {
			error = 'Passwords do not match.';
			return;
		}
		error = null;
		submitting = true;
		success = false;
		try {
			await account.updateRecovery(userId, secret, password, passwordConfirm);
			success = true;
		} catch (err) {
			error = 'Failed to reset password. The link may have expired.';
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
				Reset Password
			</h1>
			<p class="text-muted" style="font-size: var(--text-sm);">
				Enter a new password for your account.
			</p>
		</div>

		{#if success}
			<div
				style="background: color-mix(in srgb, var(--color-success) 10%, transparent); color: var(--color-success); padding: var(--space-3); border-radius: var(--radius-sm);"
			>
				Password reset successfully! You can now
				<a href="/login" style="color: var(--color-success); font-weight: 500;">sign in</a>.
			</div>
		{:else}
			<form on:submit={handleResetPassword} style="display:flex; flex-direction:column; gap:10px;">
				{#if error}
					<div style="color: var(--color-error); font-size: var(--text-sm);">{error}</div>
				{/if}
				<label style="display:flex; flex-direction:column; gap:6px;">
					<span class="text-muted" style="font-size: var(--text-xs); font-weight:500;"
						>New Password</span
					>
					<input
						bind:value={password}
						name="password"
						type="password"
						placeholder="••••••••"
						required
						minlength="8"
						style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
					/>
				</label>
				<label style="display:flex; flex-direction:column; gap:6px;">
					<span class="text-muted" style="font-size: var(--text-xs); font-weight:500;"
						>Confirm New Password</span
					>
					<input
						bind:value={passwordConfirm}
						name="passwordConfirm"
						type="password"
						placeholder="••••••••"
						required
						minlength="8"
						style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
					/>
				</label>
				<button type="submit" class="btn-primary" style="width:100%;" disabled={submitting}>
					{#if submitting}
						<Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
					{:else}
						Set New Password
					{/if}
				</button>
			</form>
		{/if}
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
