<script>
    import {
        savedEstimates,
        historyState,
        businessInfo,
        customerInfo,
        estimateDetails,
        lineItems,
        notes,
        taxRate,
    } from "../lib/stores";

    export let contentVisible = false;
    export let onClose;

    function loadEstimate(est) {
        if (!confirm("Load this item? Current unsaved changes will be lost."))
            return;

        if (est.business) $businessInfo = est.business;
        if (est.customer) $customerInfo = est.customer;
        // If loading an invoice, we might want to be careful with numbers,
        // but for now we just reload the state.
        if (est.estimate) $estimateDetails = est.estimate;

        // Handle line items - if it was an invoice with flattened items, we might load them back.
        // If we saved the full structure, we're good.
        if (est.items) $lineItems = est.items;
        if (est.notes) $notes = est.notes;

        // Handle totals/tax
        if (est.taxRate !== undefined) $taxRate = est.taxRate;
        else if (est.totals && est.totals.taxRate !== undefined)
            $taxRate = est.totals.taxRate;

        onClose();
    }

    function deleteEstimate(item) {
        if (!confirm("Delete this saved item?")) return;
        $savedEstimates = $savedEstimates.filter((e) => {
            if (e.id && item.id) return e.id !== item.id;
            return e !== item;
        });
    }

    function formatDate(isoString) {
        if (!isoString) return "";
        return new Date(isoString).toLocaleString();
    }
</script>

{#if contentVisible}
    <div class="modal-backdrop" on:click={onClose}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h2>History</h2>
                <button class="close-btn" on:click={onClose}>&times;</button>
            </div>

            <div class="modal-body">
                {#if $savedEstimates.length === 0}
                    <p class="empty-state">
                        No saved estimates or invoices found.
                    </p>
                {:else}
                    <div class="list">
                        {#each $savedEstimates as est, i}
                            <div class="history-item">
                                <div
                                    class="item-details"
                                    on:click={() => loadEstimate(est)}
                                >
                                    <div class="item-main">
                                        <span
                                            class="type-badge {est.type ===
                                            'invoice'
                                                ? 'invoice'
                                                : 'estimate'}"
                                        >
                                            {est.type === "invoice"
                                                ? "INV"
                                                : "EST"}
                                        </span>
                                        <span class="customer-name"
                                            >{est.customer?.name ||
                                                "Unknown Client"}</span
                                        >
                                    </div>
                                    <div class="item-meta">
                                        <span>{est.number || "---"}</span>
                                        <span>{formatDate(est.savedAt)}</span>
                                        <span class="amount">
                                            ${est.totals?.total?.toFixed(2) ||
                                                "0.00"}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    class="delete-btn"
                                    on:click|preventDefault|stopPropagation={() =>
                                        deleteEstimate(est)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 24px;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .modal-body {
        overflow-y: auto;
        flex: 1;
    }

    .empty-state {
        text-align: center;
        color: #888;
        padding: 20px;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .history-item {
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 8px;
        transition: background 0.2s;
    }

    .history-item:hover {
        background: #f9f9f9;
    }

    .item-details {
        flex: 1;
        cursor: pointer;
    }

    .item-main {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        font-weight: 500;
    }

    .type-badge {
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: bold;
        color: white;
    }

    .type-badge.estimate {
        background-color: #fca5a5; /* Light Red/Orange */
        color: #7f1d1d;
    }

    .type-badge.invoice {
        background-color: #86efac; /* Light Green */
        color: #14532d;
    }

    .item-meta {
        display: flex;
        gap: 12px;
        font-size: 0.85rem;
        color: #666;
    }

    .amount {
        margin-left: auto;
        font-weight: 600;
        color: #333;
    }

    .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.5;
        padding: 8px;
    }

    .delete-btn:hover {
        opacity: 1;
    }
</style>
