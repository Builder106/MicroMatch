<script lang="ts">
  // PROD: Add form validation library (e.g., Zod, Yup)
  // PROD: Add form state management (e.g., React Hook Form equivalent)
  // PROD: Add form auto-save functionality
  import Icon from "@iconify/svelte";
  import Button from "@smui/button";
  import { onMount } from 'svelte';

  // PROD: Add form validation and error handling
  // PROD: Add form field validation with real-time feedback
  // PROD: Add form submission progress tracking
  let title = "";
  let shortDescription = "";
  let description = "";
  let language = "English";
  let estimatedMinutes = 30;
  let tags = "";
  let status = "active";
  let maxVolunteers = "";
  let deadline = "";
  let isVerified = true;
  
  let isSubmitting = false;
  let submitMessage = "";
  let submitError = "";

  // PROD: Add form validation with proper error messages
  // PROD: Add form submission retry logic
  // PROD: Add form data persistence on page refresh
  async function handleSubmit() {
    if (!title.trim() || !shortDescription.trim()) {
      submitError = "Title and short description are required";
      return;
    }

    isSubmitting = true;
    submitError = "";
    submitMessage = "";

    try {
      // PROD: Add request timeout handling
      // PROD: Add request retry logic with exponential backoff
      // PROD: Add request cancellation support
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          shortDescription: shortDescription.trim(),
          description: description.trim() || undefined,
          language,
          estimatedMinutes: Number(estimatedMinutes) || undefined,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          status,
          maxVolunteers: maxVolunteers ? Number(maxVolunteers) : undefined,
          deadline: deadline || undefined,
          isVerified
        })
      });

      if (response.ok) {
        submitMessage = "Task created successfully!";
        // PROD: Add form reset confirmation
        // PROD: Add form data backup before reset
        // PROD: Add form submission analytics
        // Reset form
        title = "";
        shortDescription = "";
        description = "";
        language = "English";
        estimatedMinutes = 30;
        tags = "";
        status = "active";
        maxVolunteers = "";
        deadline = "";
        isVerified = true;
      } else {
        const error = await response.json();
        submitError = error.error || "Failed to create task";
      }
    } catch (error) {
      // PROD: Add proper error logging and monitoring
      // PROD: Add user-friendly error messages
      // PROD: Add error reporting to monitoring service
      submitError = "Network error. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Create Task - MicroMatch</title>
  <!-- PROD: Add proper meta tags for SEO -->
  <!-- PROD: Add structured data for rich snippets -->
</svelte:head>

<div class="animate-slide-up">
  <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
      <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center;">
        <Icon icon="mdi:plus-circle-outline" width="24" height="24" style="color: white;"/>
      </div>
      <div>
        <h1 style="font-size: var(--text-2xl); font-weight: 500; margin-bottom: var(--space-1);">Create New Task</h1>
        <p class="text-muted" style="font-size: var(--text-sm);">Post a micro-volunteering opportunity for your organization</p>
      </div>
    </div>

    <!-- PROD: Add form accessibility improvements (ARIA labels, keyboard navigation) -->
    <!-- PROD: Add form field validation with real-time feedback -->
    <!-- PROD: Add form auto-save functionality -->
    <form on:submit|preventDefault={handleSubmit} style="display: grid; gap: var(--space-6);">
      <!-- Basic Information -->
      <div style="display: grid; gap: var(--space-4);">
        <h3 style="font-size: var(--text-lg); font-weight: 500; color: var(--color-text);">Basic Information</h3>
        
        <!-- PROD: Add character count limits and validation -->
        <!-- PROD: Add content suggestions and auto-complete -->
        <label style="display: flex; flex-direction: column; gap: var(--space-2);">
          <span style="font-size: var(--text-sm); font-weight: 500;">Task Title *</span>
          <input
            bind:value={title}
            placeholder="e.g., Translate website content to Spanish"
            required
            maxlength="140"
            style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
          />
        </label>

        <!-- PROD: Add character count display -->
        <!-- PROD: Add content optimization suggestions -->
        <label style="display: flex; flex-direction: column; gap: var(--space-2);">
          <span style="font-size: var(--text-sm); font-weight: 500;">Short Description *</span>
          <input
            type="text"
            bind:value={shortDescription}
            placeholder="Brief summary of what needs to be done"
            required
            maxlength="280"
            style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
          />
        </label>

        <!-- PROD: Add rich text editor with formatting options -->
        <!-- PROD: Add image upload support -->
        <!-- PROD: Add content templates and examples -->
        <label style="display: flex; flex-direction: column; gap: var(--space-2);">
          <span style="font-size: var(--text-sm); font-weight: 500;">Detailed Description</span>
          <input
            type="text"
            bind:value={description}
            placeholder="Provide detailed instructions, requirements, and context"
            maxlength="4000"
            style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface); resize: vertical;"
          />
        </label>
      </div>

      <!-- Task Details -->
      <div style="display: grid; gap: var(--space-4);">
        <h3 style="font-size: var(--text-lg); font-weight: 500; color: var(--color-text);">Task Details</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
          <!-- PROD: Add language detection and suggestions -->
          <!-- PROD: Add language-specific templates -->
          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Language</span>
            <select 
              bind:value={language}
              style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Arabic">Arabic</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Russian">Russian</option>
            </select>
          </label>

          <!-- PROD: Add time estimation suggestions based on task type -->
          <!-- PROD: Add time estimation validation -->
          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Estimated Time (minutes)</span>
            <input
              type="number"
              bind:value={estimatedMinutes}
              min="5"
              max="480"
              style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
            />
          </label>
        </div>

        <!-- PROD: Add tag suggestions and auto-complete -->
        <!-- PROD: Add tag validation and moderation -->
        <!-- PROD: Add popular tags and trending tags -->
        <label style="display: flex; flex-direction: column; gap: var(--space-2);">
          <span style="font-size: var(--text-sm); font-weight: 500;">Tags (comma-separated)</span>
          <input
            bind:value={tags}
            placeholder="e.g., translation, design, data-entry, research"
            style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
          />
        </label>
      </div>

      <!-- Task Lifecycle -->
      <div style="display: grid; gap: var(--space-4);">
        <h3 style="font-size: var(--text-lg); font-weight: 500; color: var(--color-text);">Task Lifecycle</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
          <!-- PROD: Add status transition validation -->
          <!-- PROD: Add status change notifications -->
          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Status</span>
            <select 
              bind:value={status}
              style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="moderated">Under Review</option>
            </select>
          </label>

          <!-- PROD: Add volunteer limit suggestions based on task complexity -->
          <!-- PROD: Add volunteer limit validation -->
          <label style="display: flex; flex-direction: column; gap: var(--space-2);">
            <span style="font-size: var(--text-sm); font-weight: 500;">Max Volunteers</span>
            <input
              type="number"
              bind:value={maxVolunteers}
              placeholder="Leave empty for unlimited"
              min="1"
              style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
            />
          </label>
        </div>

        <!-- PROD: Add deadline suggestions based on task complexity -->
        <!-- PROD: Add deadline validation and warnings -->
        <!-- PROD: Add deadline reminders and notifications -->
        <label style="display: flex; flex-direction: column; gap: var(--space-2);">
          <span style="font-size: var(--text-sm); font-weight: 500;">Deadline</span>
          <input
            type="datetime-local"
            bind:value={deadline}
            style="padding: var(--space-3); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); background: var(--color-surface);"
          />
        </label>

        <!-- PROD: Add organization verification process -->
        <!-- PROD: Add verification status display -->
        <!-- PROD: Add verification requirements and guidelines -->
        <label style="display: flex; align-items: center; gap: var(--space-3);">
          <input
            type="checkbox"
            bind:checked={isVerified}
            style="width: 18px; height: 18px;"
          />
          <span style="font-size: var(--text-sm); font-weight: 500;">Verified Organization</span>
        </label>
      </div>

      <!-- Submit Section -->
      <div style="display: flex; gap: var(--space-4); align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: var(--space-3);">
          <!-- PROD: Add form submission confirmation dialog -->
          <!-- PROD: Add form submission progress indicator -->
          <!-- PROD: Add form submission analytics -->
          <Button
            type="submit"
            disabled={isSubmitting}
            style="background: var(--color-primary); color: var(--color-on-primary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-lg); font-weight: 500;"
          >
            {#if isSubmitting}
              <Icon icon="mdi:loading" width="18" height="18" style="margin-right: var(--space-2); animation: spin 1s linear infinite;"/>
              Creating...
            {:else}
              <Icon icon="mdi:plus" width="18" height="18" style="margin-right: var(--space-2);"/>
              Create Task
            {/if}
          </Button>
          
          <!-- PROD: Add form data backup before navigation -->
          <!-- PROD: Add unsaved changes warning -->
          <Button
            type="button"
            href="/dashboard"
            style="border: 1px solid var(--color-outline); color: var(--color-text-secondary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-lg); font-weight: 500;"
          >
            Cancel
          </Button>
        </div>

        <!-- PROD: Add toast notifications for better UX -->
        <!-- PROD: Add success/error analytics tracking -->
        {#if submitMessage}
          <div style="color: var(--color-success); font-size: var(--text-sm); font-weight: 500;">
            {submitMessage}
          </div>
        {/if}
        
        {#if submitError}
          <div style="color: var(--color-error); font-size: var(--text-sm); font-weight: 500;">
            {submitError}
          </div>
        {/if}
      </div>
    </form>
  </div>
</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
