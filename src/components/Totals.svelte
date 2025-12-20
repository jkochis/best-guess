<script>
    import { totals, taxRate, lineItems } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

    // Calculate group totals for display
    $: groups = $lineItems
        .filter((item) => item.type === "group")
        .map((group) => {
            const sum = (group.items || []).reduce(
                (acc, item) => acc + (item.amount || 0),
                0,
            );
            return {
                name: group.description || "(Untitled Group)",
                amount: sum,
            };
        });
</script>

<CollapsibleCard title="Totals" id="totals">
    <div slot="summary">
        Grand Total: ${$totals.total.toFixed(2)}
    </div>

    <div class="totals">
        <!-- Group Breakdown -->
        {#each groups as group}
            <div class="total-row group-row">
                <span class="group-name">{group.name}:</span>
                <span class="group-amount">${group.amount.toFixed(2)}</span>
            </div>
        {/each}

        {#if groups.length > 0}
            <hr class="separator" />
        {/if}

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

<style>
    .totals {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
    }

    .group-row {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .group-name {
        font-style: italic;
    }

    .separator {
        border: 0;
        border-top: 1px dashed var(--border-color);
        margin: 4px 0;
    }

    .grand-total {
        font-weight: 700;
        font-size: 1.2rem;
        margin-top: 8px;
        padding-top: 12px;
        border-top: 2px solid var(--border-color);
    }

    input[type="number"] {
        width: 80px;
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        text-align: right;
    }
</style>
