<script>
    import { estimateDetails } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";
</script>

<CollapsibleCard title="Estimate Details">
    <div slot="summary">
        #{$estimateDetails.number} ({$estimateDetails.date})
    </div>

    <div class="form-group">
        <label for="estimateNumber">Estimate #</label>
        <input
            type="text"
            id="estimateNumber"
            bind:value={$estimateDetails.number}
            required
        />
    </div>
    <div class="form-group">
        <label for="estimateDate">Date</label>
        <input
            type="date"
            id="estimateDate"
            bind:value={$estimateDetails.date}
            required
        />
    </div>
    <div class="form-group">
        <label for="validUntil">Valid Until</label>
        <input
            type="date"
            id="validUntil"
            bind:value={$estimateDetails.validUntil}
        />
    </div>
</CollapsibleCard>
