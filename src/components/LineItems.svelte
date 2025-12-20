<script>
    import { lineItems, totals } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

    function getNextId() {
        let maxId = -1;
        const traverse = (items) => {
            items.forEach((item) => {
                if (item.id > maxId) maxId = item.id;
                if (item.type === "group" && item.items) {
                    traverse(item.items);
                }
            });
        };
        traverse($lineItems);
        return maxId + 1;
    }

    function addLineItem() {
        const newItem = {
            id: getNextId(),
            type: "item",
            description: "",
            quantity: 1,
            rate: 0,
            amount: 0,
        };
        $lineItems = [...$lineItems, newItem];
    }

    function addGroup() {
        const newGroup = {
            id: getNextId(),
            type: "group",
            description: "", // Group Title
            items: [],
        };
        $lineItems = [...$lineItems, newGroup];
    }

    function addSubItem(groupId) {
        const newItem = {
            id: getNextId(),
            type: "item",
            description: "",
            quantity: 1,
            rate: 0,
            amount: 0,
        };

        $lineItems = $lineItems.map((item) => {
            if (item.id === groupId) {
                return { ...item, items: [...item.items, newItem] };
            }
            return item;
        });
    }

    function removeLineItem(id) {
        // Filter from top level
        let newItems = $lineItems.filter((item) => item.id !== id);

        // Filter from groups
        newItems = newItems.map((item) => {
            if (item.type === "group") {
                return {
                    ...item,
                    items: item.items.filter((sub) => sub.id !== id),
                };
            }
            return item;
        });

        $lineItems = newItems;
    }

    function updateAmount(item) {
        item.amount = item.quantity * item.rate;
        $lineItems = $lineItems; // Trigger reactivity
    }
</script>

<CollapsibleCard title="Line Items" id="line-items">
    <div slot="summary">
        {$lineItems.length} items • Subtotal: ${$totals.subtotal.toFixed(2)}
    </div>

    <div slot="header-actions" class="actions-wrapper">
        <button
            type="button"
            class="btn-text"
            on:click={addGroup}
            title="Add Group">+ Group</button
        >
        <button
            type="button"
            class="btn-icon add-btn"
            on:click={addLineItem}
            title="Add Item">＋</button
        >
    </div>

    <div id="lineItems">
        {#each $lineItems as item (item.id)}
            {#if item.type === "group"}
                <!-- GROUP RENDER -->
                <div class="group-container">
                    <div class="group-header">
                        <input
                            type="text"
                            placeholder="Group Name (e.g. Living Room)"
                            class="group-title-input"
                            bind:value={item.description}
                        />
                        <div class="group-actions">
                            <button
                                type="button"
                                class="btn-sm"
                                on:click={() => addSubItem(item.id)}
                                >+ Item</button
                            >
                            <button
                                type="button"
                                class="btn-remove"
                                on:click={() => removeLineItem(item.id)}
                                >×</button
                            >
                        </div>
                    </div>

                    <div class="group-items">
                        {#each item.items as subItem (subItem.id)}
                            <div class="line-item sub-item">
                                <div class="line-item-row">
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        class="line-item-description"
                                        bind:value={subItem.description}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        min="0"
                                        step="0.01"
                                        class="line-item-quantity"
                                        bind:value={subItem.quantity}
                                        on:input={() => updateAmount(subItem)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Rate"
                                        min="0"
                                        step="0.01"
                                        class="line-item-rate"
                                        bind:value={subItem.rate}
                                        on:input={() => updateAmount(subItem)}
                                    />
                                    <div class="line-item-amount">
                                        ${subItem.amount.toFixed(2)}
                                    </div>
                                    <button
                                        type="button"
                                        class="btn-remove"
                                        on:click={() =>
                                            removeLineItem(subItem.id)}
                                        >×</button
                                    >
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {:else}
                <!-- STANDARD ITEM RENDER -->
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
                            ${(item.amount || 0).toFixed(2)}
                        </div>
                        <button
                            type="button"
                            class="btn-remove"
                            on:click={() => removeLineItem(item.id)}>×</button
                        >
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</CollapsibleCard>

<style>
    .actions-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;
    }

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

    .btn-text {
        font-size: 0.85rem;
        background: transparent;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-weight: 500;
    }

    .btn-text:hover {
        text-decoration: underline;
    }

    .group-container {
        border: 1px dashed var(--border-color);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        background: rgba(0, 0, 0, 0.01);
    }

    .group-header {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        align-items: center;
    }

    .group-title-input {
        flex: 1;
        font-weight: 600;
        border: none;
        border-bottom: 2px solid var(--border-color);
        border-radius: 0;
        padding: 4px 0;
        background: transparent;
        color: var(--text-secondary);
    }

    .group-title-input:focus {
        border-color: var(--primary-color);
        box-shadow: none;
    }

    .group-actions {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .btn-sm {
        font-size: 0.8rem;
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        background: white;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-sm:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
    }

    .sub-item {
        margin-left: 20px;
        border-left: 2px solid var(--border-color);
        padding-left: 12px;
    }

    .line-item-row {
        gap: 12px; /* Standardize gap */
    }

    .line-item-quantity {
        width: 80px; /* Standard width */
        flex: 0 0 auto;
    }

    .line-item-rate {
        width: 100px; /* Standard width */
        flex: 0 0 auto;
    }

    /* Adjust main description to not shrink too much */
    .line-item-description {
        flex: 1;
    }
</style>
