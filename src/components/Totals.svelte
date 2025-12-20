<script>
    import { totals, taxRate } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";
</script>

<CollapsibleCard title="Totals">
    <div slot="summary">
        Grand Total: ${$totals.total.toFixed(2)}
    </div>

    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span id="subtotal">${$totals.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
            <label for="taxRate">Tax Rate (%):</label>
            <input
                type="number"
                id="taxRate"
                min="0"
                max="100"
                step="0.1"
                bind:value={$taxRate}
            />
        </div>
        <div class="total-row">
            <span>Tax:</span>
            <span id="taxAmount">${$totals.tax.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
            <span>Total:</span>
            <span id="grandTotal">${$totals.total.toFixed(2)}</span>
        </div>
    </div>
</CollapsibleCard>
