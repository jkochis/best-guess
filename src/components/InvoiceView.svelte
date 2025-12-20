<script>
    import {
        lineItems,
        businessInfo,
        customerInfo,
        estimateDetails,
        taxRate,
        savedEstimates,
        savedCustomerProfiles,
        savedBusinessProfiles,
    } from "../lib/stores";
    import { onMount } from "svelte";

    export let contentVisible = false;
    export let onClose;

    let invoiceItems = [];
    let invoiceNumber = "";
    let invoiceDate = "";
    let invoiceTaxRate = 0;

    // Initialize invoice data from stores when opened
    $: if (contentVisible) {
        invoiceNumber = $estimateDetails.number.replace("EST", "INV");
        invoiceDate = new Date().toISOString().split("T")[0];
        invoiceTaxRate = $taxRate;

        // Flatten items for invoice or keep structure?
        // Let's flatten for simplicity in this first version, or keep structure but just show description/qty/price.
        // Actually best to keep structure to match estimate.

        invoiceItems = JSON.parse(JSON.stringify($lineItems)); // Deep copy
    }

    $: subtotal = calculateSubtotal(invoiceItems);
    $: taxAmount = subtotal * (invoiceTaxRate / 100);
    $: total = subtotal + taxAmount;

    function calculateSubtotal(items) {
        if (!items) return 0;
        return items.reduce((sum, item) => {
            if (item.type === "group" && item.items) {
                return sum + calculateSubtotal(item.items);
            }
            // For invoice, we use the 'amount' which is qty * rate.
            // valid invoice items should have amount.
            return sum + (Number(item.amount) || 0);
        }, 0);
    }

    function updateItemAmount(item) {
        // Allow manual override of the total amount or rate?
        // Usually invoice has Qty * Rate = Amount.
        // If we change Rate, Amount updates.
        item.amount = item.quantity * item.rate;
        invoiceItems = invoiceItems; // trigger update
    }

    function saveInvoice() {
        const invoiceData = {
            id: crypto.randomUUID(),
            number: invoiceNumber,
            date: invoiceDate,
            customer: $customerInfo,
            business: $businessInfo,
            items: invoiceItems,
            taxRate: invoiceTaxRate,
            totals: { subtotal, tax: taxAmount, total },
        };

        // For now, let's just save it to savedEstimates store with a type flag or separate store?
        // User asked for "previous invoices and estimates".
        // Let's store in savedEstimates but mark as type='invoice'.

        $savedEstimates = [
            ...$savedEstimates,
            {
                ...invoiceData,
                type: "invoice",
                savedAt: new Date().toISOString(),
            },
        ];

        alert("Invoice Saved!");
    }

    function printInvoice() {
        window.print();
    }
</script>

{#if contentVisible}
    <div class="invoice-overlay">
        <div class="invoice-container">
            <div class="no-print header-bar">
                <button class="btn-text" on:click={onClose}
                    >← Back to Estimate</button
                >
                <div class="actions">
                    <button class="btn-primary" on:click={saveInvoice}
                        >Save Invoice</button
                    >
                    <button class="btn-secondary" on:click={printInvoice}
                        >Print / PDF</button
                    >
                </div>
            </div>

            <div class="invoice-paper">
                <header>
                    <div class="business-details">
                        <h1>{$businessInfo.name || "Business Name"}</h1>
                        <p>{$businessInfo.address}</p>
                        <p>{$businessInfo.email}</p>
                        <p>{$businessInfo.phone}</p>
                    </div>
                    <div class="invoice-meta">
                        <h2>INVOICE</h2>
                        <div class="meta-row">
                            <label>Number:</label>
                            <input type="text" bind:value={invoiceNumber} />
                        </div>
                        <div class="meta-row">
                            <label>Date:</label>
                            <input type="date" bind:value={invoiceDate} />
                        </div>
                    </div>
                </header>

                <section class="customer-details">
                    <h3>Bill To:</h3>
                    <p>{$customerInfo.name}</p>
                    <p>{$customerInfo.address}</p>
                </section>

                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th class="col-desc">Description</th>
                            <th class="col-qty">Qty</th>
                            <th class="col-rate">Rate</th>
                            <th class="col-amount">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each invoiceItems as item}
                            {#if item.type === "group"}
                                <tr class="group-row">
                                    <td colspan="4"
                                        ><strong>{item.description}</strong></td
                                    >
                                </tr>
                                {#each item.items as subItem}
                                    <tr class="sub-row">
                                        <td class="col-desc"
                                            >{subItem.description}</td
                                        >
                                        <td class="col-qty"
                                            >{subItem.quantity}</td
                                        >
                                        <td class="col-rate">
                                            <input
                                                type="number"
                                                step="0.01"
                                                bind:value={subItem.rate}
                                                on:input={() =>
                                                    updateItemAmount(subItem)}
                                            />
                                        </td>
                                        <td class="col-amount"
                                            >${subItem.amount.toFixed(2)}</td
                                        >
                                    </tr>
                                {/each}
                            {:else}
                                <tr>
                                    <td class="col-desc">{item.description}</td>
                                    <td class="col-qty">{item.quantity}</td>
                                    <td class="col-rate">
                                        <input
                                            type="number"
                                            step="0.01"
                                            bind:value={item.rate}
                                            on:input={() =>
                                                updateItemAmount(item)}
                                        />
                                    </td>
                                    <td class="col-amount"
                                        >${item.amount.toFixed(2)}</td
                                    >
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>

                <div class="totals-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (%):</span>
                        <input
                            type="number"
                            class="tax-input"
                            bind:value={invoiceTaxRate}
                        />
                    </div>
                    <div class="total-row">
                        <span>Tax Amount:</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .invoice-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f5f5f5;
        z-index: 1000;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        padding: 20px;
    }

    .invoice-container {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .invoice-paper {
        background: white;
        padding: 40px;
        min-height: 1000px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        color: #333;
    }

    .actions {
        display: flex;
        gap: 10px;
    }

    .btn-primary {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-secondary {
        background: #eee;
        border: 1px solid #ccc;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-text {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-weight: 500;
    }

    header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
    }

    .business-details h1 {
        margin: 0 0 10px 0;
        font-size: 1.5rem;
    }

    .invoice-meta {
        text-align: right;
    }

    .meta-row {
        margin-bottom: 5px;
    }

    .meta-row input {
        text-align: right;
        border: 1px solid #ddd;
        padding: 4px;
        border-radius: 4px;
    }

    .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    .invoice-table th {
        text-align: left;
        border-bottom: 2px solid #333;
        padding: 10px 5px;
    }

    .invoice-table td {
        padding: 10px 5px;
        border-bottom: 1px solid #eee;
    }

    .col-qty,
    .col-rate,
    .col-amount {
        text-align: right;
        width: 100px;
    }

    .col-rate input {
        width: 80px;
        text-align: right;
        padding: 4px;
        border: 1px solid transparent;
    }

    .col-rate input:hover,
    .col-rate input:focus {
        border-color: #ccc;
    }

    .sub-row td:first-child {
        padding-left: 20px;
    }

    .totals-section {
        margin-top: 40px;
        margin-left: auto;
        width: 300px;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
    }

    .grand-total {
        font-weight: bold;
        font-size: 1.2rem;
        border-top: 2px solid #333;
        margin-top: 10px;
        padding-top: 10px;
    }

    .tax-input {
        width: 60px;
        text-align: right;
    }

    /* Print Styles */
    @media print {
        .no-print,
        .invoice-overlay::-webkit-scrollbar {
            display: none !important;
        }

        .invoice-overlay {
            position: static;
            background: white;
            padding: 0;
            overflow: visible;
        }

        .invoice-container {
            max-width: none;
            width: 100%;
        }

        .invoice-paper {
            box-shadow: none;
            padding: 0;
        }

        .col-rate input {
            border: none;
            background: transparent;
        }

        .meta-row input {
            border: none;
            text-align: right;
        }
    }
</style>
