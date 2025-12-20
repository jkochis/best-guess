<script>
    import { notes } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";
</script>

<CollapsibleCard title="Notes">
    <div slot="summary">
        {$notes
            ? $notes.substring(0, 40) + ($notes.length > 40 ? "..." : "")
            : "No notes"}
    </div>

    <div class="form-group">
        <label for="notes">Additional Notes / Terms</label>
        <textarea
            id="notes"
            rows="4"
            placeholder="Payment terms, warranty information, etc."
            bind:value={$notes}
        ></textarea>
    </div>
</CollapsibleCard>
