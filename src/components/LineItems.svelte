<script>
    import { lineItems, totals } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

    function addLineItem() {
        // Calculate max ID to ensure uniqueness even after deletions
        const maxId = $lineItems.reduce(
            (max, item) => Math.max(max, item.id),
            -1,
        );
        $lineItems = [
            ...$lineItems,
            {
                id: maxId + 1,
                description: "",
                quantity: 1,
                rate: 0,
                amount: 0,
            },
        ];
    }

    function removeLineItem(id) {
        $lineItems = $lineItems.filter((item) => item.id !== id);
    }

    function updateAmount(item) {
        // Svelte store update to trigger reactivity
        lineItems.update((items) => {
            const index = items.findIndex((i) => i.id === item.id);
            if (index !== -1) {
                items[index].amount = items[index].quantity * items[index].rate;
            }
            return items;
        });
    }
</script>

<CollapsibleCard title="Line Items">
    <div slot="summary">
        {$lineItems.length} items • Subtotal: ${$totals.subtotal.toFixed(2)}
    </div>

    <div slot="header-actions">
        <button
            type="button"
            class="btn-icon add-btn"
            on:click={addLineItem}
            title="Add Item">＋</button
        >
    </div>

    <div id="lineItems">
        {#each $lineItems as item (item.id)}
            <div class="line-item">
                <div class="line-item-row">
                    <input
                        type="text"
                        placeholder="Description"
                        class="line-item-description"
                        bind:value={item.description}
                    />
                    <input
                        type="number"
                        placeholder="Qty"
                        min="0"
                        step="0.01"
                        class="line-item-quantity"
                        bind:value={item.quantity}
                        on:input={() => updateAmount(item)}
                    />
                    <input
                        type="number"
                        placeholder="Rate"
                        min="0"
                        step="0.01"
                        class="line-item-rate"
                        bind:value={item.rate}
                        on:input={() => updateAmount(item)}
                    />
                    <div class="line-item-amount">
                        ${item.amount.toFixed(2)}
                    </div>
                    <button
                        type="button"
                        class="btn-remove"
                        on:click={() => removeLineItem(item.id)}>×</button
                    >
                </div>
            </div>
        {/each}
    </div>
</CollapsibleCard>

<style>
    .add-btn {
        background: transparent;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        line-height: 1;
        transition: all 0.2s;
    }

    .add-btn:hover {
        background: var(--primary-color);
        color: white;
    }
</style>
