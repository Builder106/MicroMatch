<script lang="ts">
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  let proofUrl = "";
  let notes = "";
</script>

<section class="card" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
  <h2 style="margin:0;">Submit proof</h2>
  <Textfield bind:value={proofUrl} label="Proof URL" placeholder="https://..." />
  <Textfield bind:value={notes} label="Notes" textarea rows={4} placeholder="Add any context for reviewers" />
  <div style="display:flex; justify-content:flex-end; gap:8px;">
    <Button variant="text" href="/">Cancel</Button>
    <Button disabled={!proofUrl}>Submit</Button>
  </div>
</section>

