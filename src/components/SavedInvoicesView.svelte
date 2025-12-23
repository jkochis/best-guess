<script>
    import {
        savedEstimates,
        businessInfo,
        customerInfo,
        estimateDetails,
        lineItems,
        notes,
        taxRate,
        invoiceState,
    } from "../lib/stores";

    export let onNavigate;

    function loadInvoice(est) {
        if (
            !confirm("Load this invoice? Current unsaved changes will be lost.")
        )
            return;

        if (est.business) $businessInfo = est.business;
        if (est.customer) $customerInfo = est.customer;
        // Adjust estimate details to match invoice number if relevant,
        // or just load the data.
        if (est.number) $estimateDetails.number = est.number;
        // if (est.estimate) $estimateDetails = est.estimate;

        if (est.items) $lineItems = est.items;
        if (est.notes) $notes = est.notes;

        if (est.taxRate !== undefined) $taxRate = est.taxRate;
        else if (est.totals && est.totals.taxRate !== undefined)
            $taxRate = est.totals.taxRate;

        // Open the invoice view immediately?
        // Or navigate to form to edit?
        // Let's navigate to form for now, user can then open invoice view.
        if (onNavigate) onNavigate("new-estimate");

        // Optionally open the invoice overlay automatically:
        // $invoiceState.isOpen = true;
    }

    function deleteInvoice(invoice) {
        if (!confirm("Delete this saved invoice?")) return;

        console.log("Deleting invoice:", invoice);

        $savedEstimates = $savedEstimates.filter((e) => {
            // If both have IDs, compare IDs
            if (e.id && invoice.id) {
                return String(e.id) !== String(invoice.id);
            }
            // Fallback to reference equality
            return e !== invoice;
        });
    }

    function formatDate(isoString) {
        if (!isoString) return "";
        return new Date(isoString).toLocaleString();
    }

    $: invoices = $savedEstimates.filter((est) => est.type === "invoice");
</script>

<div class="saved-view">
    <header class="view-header">
        <h2>Saved Invoices</h2>
    </header>

    {#if invoices.length === 0}
        <div class="empty-state">
            <p>No saved invoices found.</p>
        </div>
    {:else}
        <div class="cards-grid">
            {#each invoices as inv, i}
                <div class="saved-card invoice-card">
                    <div class="card-header">
                        <span class="invoice-number">{inv.number || "---"}</span
                        >
                        <span class="date">{formatDate(inv.savedAt)}</span>
                    </div>
                    <div class="card-body">
                        <h3>{inv.customer?.name || "Unknown Client"}</h3>
                        <div class="amount">
                            ${inv.totals?.total?.toFixed(2) || "0.00"}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button
                            class="btn btn-primary"
                            on:click={() => loadInvoice(inv)}>Load</button
                        >
                        <button
                            class="btn btn-danger"
                            on:click|preventDefault|stopPropagation={() =>
                                deleteInvoice(inv)}>Delete</button
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

    .invoice-card {
        border-left: 4px solid #16a34a; /* Green for invoice */
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
        color: #16a34a;
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
