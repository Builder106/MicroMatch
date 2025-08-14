<script lang="ts">
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  let title = "";
  let shortDescription = "";
  let description = "";
  let tags = "";
  let minutes: number | undefined = undefined;
  let language = "English";
</script>

<section class="card" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
  <h2 style="margin:0;">Post a task</h2>
  <Textfield bind:value={title} label="Title" />
  <Textfield bind:value={shortDescription} label="Short description" />
  <Textfield bind:value={description} label="Description" textarea rows={5} />
  <Textfield bind:value={tags} label="Tags (comma-separated)" placeholder="translation, spanish" />
  <Textfield bind:value={minutes} type="number" label="Estimated minutes" />
  <Textfield bind:value={language} label="Language" />
  <div style="display:flex; justify-content:flex-end; gap:8px;">
    <Button variant="text" href="/">Cancel</Button>
    <Button disabled={!title || !shortDescription || !description}>Create</Button>
  </div>
</section>

