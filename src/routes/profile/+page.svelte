<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { account, uploadAvatar, getAvatarUrl } from '$lib/appwrite.client';
  import { refreshSessionCookie, assignTeamForCurrentRole } from '$lib/appwrite.client';
  export let data: { userRole: 'anonymous' | 'user' | 'ngo' | 'volunteer'; user: { id: string; email?: string } | null };

  let displayName = '';
  let bio = '';
  let orgName = '';
  let role: 'volunteer' | 'ngo' = (data.userRole === 'ngo' || data.userRole === 'volunteer') ? data.userRole : 'volunteer';
  let initialRole: 'volunteer' | 'ngo' | null = null;
  let saving = false;
  let saved = false;
  let error: string | null = null;
  let loading = true;
  const bioMax = 280;
  $: bioCount = (bio ?? '').length;
  $: avatarLetter = ((displayName || data.user?.email || '?').trim().charAt(0) || '?').toUpperCase();
  let avatarFileId: string | null = null;
  let avatarUrl: string = '';
  let avatarUploading = false;
  let avatarError: string | null = null;

  const AVATAR_TARGET_DIMENSION = 512; // px
  const AVATAR_TARGET_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
  const AVATAR_MAX_ORIGINAL_BYTES = 8 * 1024 * 1024; // 8 MB hard cap

  async function cropToSquareAndResizeJPEG(file: File, targetDim = AVATAR_TARGET_DIMENSION): Promise<Blob> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Invalid image data'));
      image.src = dataUrl;
    });
    const minSide = Math.min(img.width, img.height);
    const sx = Math.floor((img.width - minSide) / 2);
    const sy = Math.floor((img.height - minSide) / 2);
    const canvas = document.createElement('canvas');
    canvas.width = targetDim;
    canvas.height = targetDim;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetDim, targetDim);

    const toBlob = (quality: number) => new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob conversion failed'))), 'image/jpeg', quality);
    });
    // Try a couple qualities to stay under target bytes
    let quality = 0.85;
    let blob = await toBlob(quality);
    if (blob.size > AVATAR_TARGET_MAX_BYTES) {
      quality = 0.75;
      blob = await toBlob(quality);
    }
    if (blob.size > AVATAR_TARGET_MAX_BYTES) {
      quality = 0.65;
      blob = await toBlob(quality);
    }
    return blob;
  }

  onMount(async () => {
    // Ensure server has session right after OAuth return
    await refreshSessionCookie();
    try {
      const me = await account.get();
      displayName = me.name ?? '';
      const prefs = (me?.prefs ?? {}) as Record<string, unknown>;
      if (typeof prefs.bio === 'string') bio = prefs.bio;
      if (typeof prefs.orgName === 'string') orgName = prefs.orgName;
      if (typeof (prefs as any).avatarFileId === 'string') {
        avatarFileId = (prefs as any).avatarFileId;
        avatarUrl = avatarFileId ? getAvatarUrl(avatarFileId, 128) : '';
      }
      const prefRole = typeof (prefs as any).role === 'string' ? (prefs as any).role : '';
      if (prefRole === 'ngo' || prefRole === 'volunteer') {
        role = prefRole;
        initialRole = prefRole;
      } else if (data.userRole === 'ngo' || data.userRole === 'volunteer') {
        // If server already knows a fixed role from team membership, lock it
        role = data.userRole;
        initialRole = data.userRole;
      }
    } catch {}
    loading = false;
  });

  async function submitProfile(e: Event) {
    e.preventDefault();
    error = null;
    saving = true;
    saved = false;
    try {
      // Update via Appwrite JS SDK
      try { if (displayName) await account.updateName(displayName); } catch {}
      const finalRole = initialRole ?? role;
      await account.updatePrefs({ bio, orgName, role: finalRole, avatarFileId });
      await refreshSessionCookie();
      if (!initialRole) {
        await assignTeamForCurrentRole();
        initialRole = finalRole;
      }
      saved = true;
    } catch (err) {
      error = 'Could not save profile. Please try again.';
      console.error(err);
    } finally {
      saving = false;
    }
  }
</script>

<div style="display:flex; flex-direction:column; gap: var(--space-6);">
  <div class="card" style="display:flex; align-items:center; gap: var(--space-4); padding: var(--space-5);">
    <div style="width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: var(--color-primary-container); color: var(--color-on-primary-container); font-weight:600; font-size: 24px; border: 2px solid var(--color-outline-variant);">
      {avatarLetter}
    </div>
    <div style="flex:1;">
      <h1 style="font-size: var(--text-xl); font-weight:600; margin:0 0 var(--space-1) 0;">Your profile</h1>
      <p class="text-muted" style="margin:0;">Tell us a bit about you so we can match you better.</p>
    </div>
  </div>

  <div style="display:grid; grid-template-columns: 1fr; gap: var(--space-6);">
    <form method="post" on:submit|preventDefault={submitProfile} class="card" style="display:flex; flex-direction:column; gap: var(--space-4); padding: var(--space-6);">
      <div style="display:flex; flex-direction:column; gap: var(--space-2);">
        <h2 style="font-size: var(--text-lg); margin:0;">Account</h2>
        <p class="text-muted" style="margin:0; font-size: var(--text-sm);">Basic details visible to NGOs and volunteers.</p>
      </div>

      <div style="display:flex; gap: var(--space-4); align-items:center;">
        <div style="width:72px; height:72px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; background: var(--color-primary-container); color: var(--color-on-primary-container); font-weight:600; font-size: 28px; border: 2px solid var(--color-outline-variant);">
          {#if avatarUrl}
            <img src={avatarUrl} alt="Avatar" width="72" height="72" style="object-fit:cover; width:72px; height:72px;" />
          {:else}
            {avatarLetter}
          {/if}
        </div>
        <div style="display:flex; flex-direction:column; gap: var(--space-2);">
          <div style="display:flex; gap: var(--space-2); align-items:center;">
            <label for="avatar-input" class="btn-secondary" style="display:inline-flex; align-items:center; gap:8px; cursor:pointer;">
              {#if avatarUploading}
                <Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
              {:else}
                <Icon icon="mdi:image-plus" width="18" height="18" />
              {/if}
              {avatarUrl ? 'Change avatar' : 'Upload avatar'}
            </label>
            {#if avatarUrl}
              <button type="button" class="btn-text" on:click={() => { avatarUrl = ''; avatarFileId = null; }} style="color: var(--color-error);">Remove</button>
            {/if}
          </div>
          <input id="avatar-input" type="file" accept="image/*" on:change={async (e: Event) => {
            const input = e.currentTarget as HTMLInputElement;
            const file = input.files && input.files[0];
            if (!file) return;
            avatarError = null;
            if (!file.type.startsWith('image/')) { avatarError = 'Please select an image file.'; return; }
            if (file.size > AVATAR_MAX_ORIGINAL_BYTES) { avatarError = 'Image is too large. Please choose a file under 8MB.'; return; }
            avatarUploading = true;
            try {
              const processed = await cropToSquareAndResizeJPEG(file, AVATAR_TARGET_DIMENSION);
              if (processed.size > AVATAR_TARGET_MAX_BYTES) {
                avatarError = 'Processed image still too large. Try a smaller image.';
              } else {
                const processedFile = new File([processed], 'avatar.jpg', { type: 'image/jpeg' });
                // Include Authorization header as fallback for server route
                const jwt = await account.createJWT().then((j) => j?.jwt).catch(() => null);
                const uploaded = await (async () => {
                  if (!jwt) return uploadAvatar(processedFile);
                  // Use fetch directly to include bearer if available
                  const form = new FormData();
                  form.append('file', processedFile);
                  const res = await fetch('/api/profile/avatar', { method: 'POST', body: form, credentials: 'include', headers: { Authorization: `Bearer ${jwt}` } });
                  if (!res.ok) {
                    const { error } = await res.json().catch(() => ({ error: 'Upload failed' }));
                    throw new Error(error || 'Upload failed');
                  }
                  const data = await res.json();
                  return { fileId: data.fileId, url: data.url };
                })();
                avatarFileId = uploaded.fileId;
                avatarUrl = uploaded.url;
              }
            } catch (err) {
              console.error(err);
              const msg = (err as any)?.message ?? 'Upload failed. Please try again.';
              avatarError = String(msg);
            } finally {
              avatarUploading = false;
            }
          }} style="display:none;" />
          <span class="text-muted" style="font-size: var(--text-xs);">PNG or JPG up to 2MB (auto-cropped to square).</span>
          {#if avatarError}
            <span class="text-danger" style="font-size: var(--text-xs);">{avatarError}</span>
          {/if}
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr; gap: var(--space-4);">
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Display name</span>
          <input bind:value={displayName} placeholder="Your name" autocomplete="name" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
          <span class="text-muted" style="font-size: var(--text-xs);">Shown on tasks and badges.</span>
        </label>

        <fieldset style="margin:0; padding:0; border:0; display:flex; flex-direction:column; gap:6px;">
          <legend class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Account type</legend>
          {#if initialRole}
            <div style="display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border:1px dashed var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface-container);"><Icon icon={initialRole === 'ngo' ? 'mdi:domain' : 'mdi:hand-heart'} width="18" height="18" /> {initialRole === 'ngo' ? 'NGO' : 'Volunteer'} (locked)</div>
            <span class="text-muted" style="font-size: var(--text-xs);">Contact support to change your account type.</span>
          {:else}
            <div role="group" aria-label="Account type" style="display:flex; gap: var(--space-2);">
              <button type="button" aria-pressed={role === 'volunteer'} on:click={() => role = 'volunteer'} style="padding:8px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: {role === 'volunteer' ? 'var(--color-primary)' : 'var(--color-surface)'}; color: {role === 'volunteer' ? 'var(--color-on-primary)' : 'var(--color-text)'}; display:flex; align-items:center; gap:8px;">
                <Icon icon="mdi:hand-heart" width="18" height="18" /> Volunteer
              </button>
              <button type="button" aria-pressed={role === 'ngo'} on:click={() => role = 'ngo'} style="padding:8px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: {role === 'ngo' ? 'var(--color-primary)' : 'var(--color-surface)'}; color: {role === 'ngo' ? 'var(--color-on-primary)' : 'var(--color-text)'}; display:flex; align-items:center; gap:8px;">
                <Icon icon="mdi:domain" width="18" height="18" /> NGO
              </button>
            </div>
          {/if}
        </fieldset>

        {#if role === 'ngo'}
          <label style="display:flex; flex-direction:column; gap:6px;">
            <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Organization name</span>
            <input bind:value={orgName} placeholder="Your NGO" autocomplete="organization" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);" />
            <span class="text-muted" style="font-size: var(--text-xs);">Displayed on tasks you post.</span>
          </label>
        {/if}

        <label style="display:flex; flex-direction:column; gap:6px;">
          <span class="text-muted" style="font-size: var(--text-xs); font-weight:500;">Bio</span>
          <textarea bind:value={bio} rows="4" maxlength={bioMax} placeholder="Your skills, interests, or mission" style="padding:10px 12px; border:1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"></textarea>
          <div style="display:flex; justify-content:space-between; font-size: var(--text-xs);">
            <span class="text-muted">Share a short intro to help others get to know you.</span>
            <span class="text-muted">{bioCount}/{bioMax}</span>
          </div>
        </label>
      </div>

      {#if error}
        <div class="text-danger" style="font-size: var(--text-sm);">{error}</div>
      {/if}

      <div style="display:flex; gap: var(--space-3); align-items:center;">
        <button type="submit" class="btn-primary" disabled={saving || loading} style="display:flex; align-items:center; gap:8px;">
          {#if saving}
            <Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
          {/if}
          {#if loading && !saving}
            <Icon icon="mdi:loading" width="18" height="18" style="animation: spin 1s linear infinite;" />
          {/if}
          Save changes
        </button>
        {#if saved}
          <span aria-live="polite" class="text-success" style="font-size: var(--text-sm);">Saved!</span>
        {/if}
      </div>
    </form>

    <div class="card" style="padding: var(--space-6); display:flex; flex-direction:column; gap: var(--space-3);">
      <h2 style="font-size: var(--text-lg); margin:0;">Tips</h2>
      <ul style="margin:0; padding-left: 1.25rem; display:flex; flex-direction:column; gap: var(--space-2);">
        <li>Use your real name so NGOs can recognize your contributions.</li>
        {#if role === 'ngo'}
          <li>Include your organization name exactly as you want it to appear on tasks.</li>
        {:else}
          <li>List a couple of skills or interests in your bio to get better task matches.</li>
        {/if}
        <li>Your account type is fixed once selected.</li>
      </ul>
      <div style="height:1px; background: var(--color-outline-variant);"></div>
      <h3 style="font-size: var(--text-base); margin:0;">Next steps</h3>
      <ul style="margin:0; padding-left: 1.25rem; display:flex; flex-direction:column; gap: var(--space-1);">
        {#if role === 'ngo'}
          <li>Go to <a href="/org">Post a task</a> to create your first micro-task.</li>
        {:else}
          <li>Visit the <a href="/tasks">Feed</a> and claim your first task.</li>
        {/if}
        <li>Check your <a href="/dashboard">Badges</a> after you complete a task.</li>
      </ul>
    </div>
  </div>
</div>

<style>
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

