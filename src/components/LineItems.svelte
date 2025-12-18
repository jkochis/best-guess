<script>
    import { lineItems } from '../lib/stores';

    function addLineItem() {
        // Calculate max ID to ensure uniqueness even after deletions
        const maxId = $lineItems.reduce((max, item) => Math.max(max, item.id), -1);
        $lineItems = [...$lineItems, {
            id: maxId + 1,
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        }];
    }

    function removeLineItem(id) {
        $lineItems = $lineItems.filter(item => item.id !== id);
    }

    function updateAmount(item) {
        // Svelte store update to trigger reactivity
        // We need to re-assign to trigger the store change if we were just mutating locally.
        // But since we are binding, we might need to force an update or just update the specific item correctly.
        // Best way with stores:
        lineItems.update(items => {
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) {
                items[index].amount = items[index].quantity * items[index].rate;
            }
            return items;
        });
    }
</script>

<section class="card">
    <div class="section-header">
        <h2>Line Items</h2>
        <button type="button" class="btn btn-secondary" on:click={addLineItem}>+ Add Item</button>
    </div>
    
    <div id="lineItems">
        {#each $lineItems as item (item.id)}
            <div class="line-item">
                <div class="line-item-row">
                    <input type="text"
                           placeholder="Description"
                           class="line-item-description"
                           bind:value={item.description}>
                    <input type="number"
                           placeholder="Qty"
                           min="0"
                           step="0.01"
                           class="line-item-quantity"
                           bind:value={item.quantity}
                           on:input={() => updateAmount(item)}>
                    <input type="number"
                           placeholder="Rate"
                           min="0"
                           step="0.01"
                           class="line-item-rate"
                           bind:value={item.rate}
                           on:input={() => updateAmount(item)}>
                    <div class="line-item-amount">${item.amount.toFixed(2)}</div>
                    <button type="button" class="btn-remove" on:click={() => removeLineItem(item.id)}>×</button>
                </div>
            </div>
        {/each}
    </div>
</section>
