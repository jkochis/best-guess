<script>
    import { totals, taxRate, lineItems } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

    // Calculate group totals for display
    // Flatten all items for display
    $: breakdown = $lineItems.reduce((acc, item) => {
        if (item.type === "group") {
            if (item.items && item.items.length > 0) {
                // Add all sub-items
                acc.push(
                    ...item.items.map((subItem) => ({
                        name: subItem.description || "(Untitled Item)",
                        amount: Number(subItem.amount) || 0,
                    })),
                );
            }
        } else {
            // Add top-level item
            acc.push({
                name: item.description || "(Untitled Item)",
                amount: Number(item.amount) || 0,
            });
        }
        return acc;
    }, []);
</script>

<CollapsibleCard title="Totals" id="totals">
    <div slot="summary">
        Grand Total: ${$totals.total.toFixed(2)}
    </div>

    <div class="totals">
        <!-- Group Breakdown -->
        <!-- Group Breakdown -->
        {#each breakdown as item}
            <div class="total-row item-row">
                <span>{item.name}:</span>
                <span>${item.amount.toFixed(2)}</span>
            </div>
        {/each}

        {#if breakdown.length > 0}
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

    .item-row {
        font-size: 0.9rem;
        color: var(--text-secondary);
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
