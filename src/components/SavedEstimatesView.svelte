<script>
    import {
        savedEstimates,
        businessInfo,
        customerInfo,
        estimateDetails,
        lineItems,
        notes,
        taxRate,
    } from "../lib/stores";

    export let onNavigate; // Optional: to navigate back to form after loading

    function loadEstimate(est) {
        if (
            !confirm(
                "Load this estimate? Current unsaved changes will be lost.",
            )
        )
            return;

        if (est.business) $businessInfo = est.business;
        if (est.customer) $customerInfo = est.customer;
        if (est.estimate) $estimateDetails = est.estimate;
        if (est.items) $lineItems = est.items;
        if (est.notes) $notes = est.notes;

        if (est.taxRate !== undefined) $taxRate = est.taxRate;
        else if (est.totals && est.totals.taxRate !== undefined)
            $taxRate = est.totals.taxRate;

        // Navigate to form after loading
        if (onNavigate) onNavigate("new-estimate");
    }

    function deleteEstimate(index) {
        if (!confirm("Delete this saved estimate?")) return;
        // The index passed here is relative to the filtered list logic in the template,
        // but we need to delete from the main store.
        // It's safer to delete by ID if we had one, or pass the actual object reference?
        // Let's filter by matching object reference or ID.
        // est.id should exist.
        const itemToDelete = estimates[index];
        if (itemToDelete) {
            $savedEstimates = $savedEstimates.filter((e) => e !== itemToDelete);
        }
    }

    function formatDate(isoString) {
        if (!isoString) return "";
        return new Date(isoString).toLocaleString();
    }

    $: estimates = $savedEstimates.filter((est) => est.type !== "invoice");
</script>

<div class="saved-view">
    <header class="view-header">
        <h2>Saved Estimates</h2>
    </header>

    {#if estimates.length === 0}
        <div class="empty-state">
            <p>No saved estimates found.</p>
        </div>
    {:else}
        <div class="cards-grid">
            {#each estimates as est, i}
                <div class="saved-card">
                    <div class="card-header">
                        <span class="estimate-number"
                            >{est.number || "---"}</span
                        >
                        <span class="date">{formatDate(est.savedAt)}</span>
                    </div>
                    <div class="card-body">
                        <h3>{est.customer?.name || "Unknown Client"}</h3>
                        <div class="amount">
                            ${est.totals?.total?.toFixed(2) || "0.00"}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button
                            class="btn btn-primary"
                            on:click={() => loadEstimate(est)}>Load</button
                        >
                        <button
                            class="btn btn-danger"
                            on:click={() => deleteEstimate(i)}>Delete</button
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .saved-view {
        max-width: 1000px;
        margin: 0 auto;
    }

    .view-header {
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .empty-state {
        text-align: center;
        padding: 40px;
        color: #64748b;
        background: #f8fafc;
        border-radius: 8px;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }

    .saved-card {
        background: white;
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #64748b;
        margin-bottom: 12px;
    }

    .card-body h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        color: var(--text-primary, #0f172a);
    }

    .amount {
        font-weight: bold;
        font-size: 1.25rem;
        color: var(--primary-color, #2563eb);
        margin-bottom: 16px;
    }

    .card-actions {
        margin-top: auto;
        display: flex;
        gap: 10px;
    }

    .btn {
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: opacity 0.2s;
    }

    .btn:hover {
        opacity: 0.9;
    }

    .btn-primary {
        background: var(--primary-color, #2563eb);
        color: white;
    }

    .btn-danger {
        background: #fee2e2;
        color: #dc2626;
    }
</style>
