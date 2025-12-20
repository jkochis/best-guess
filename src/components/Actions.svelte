<script>
    import { generatePDF, getPDFUrl } from "../lib/pdf";
    import { getShareUrl } from "../lib/share";
    import {
        businessInfo,
        customerInfo,
        estimateDetails,
        lineItems,
        totals,
        notes,
        taxRate,
        previewState,
        qrState,
        invoiceState,
        historyState,
        savedEstimates,
    } from "../lib/stores";
    import { get } from "svelte/store";

    import { exportData } from "../lib/export";

    function handlePreviewPDF() {
        const data = {
            business: $businessInfo,
            customer: $customerInfo,
            estimate: $estimateDetails,
            lineItems: $lineItems.filter((item) => item.description),
            notes: $notes,
            totals: {
                ...$totals,
                taxRate: $taxRate,
            },
        };

        const url = getPDFUrl(data);
        $previewState = { isOpen: true, pdfUrl: url };
    }

    function shareQR() {
        const data = {
            business: $businessInfo,
            customer: $customerInfo,
            estimate: $estimateDetails,
            lineItems: $lineItems.filter((item) => item.description),
            notes: $notes,
            totals: {
                ...$totals,
                taxRate: $taxRate,
            },
        };
        const url = getShareUrl(data);
        $qrState = { isOpen: true, url };
    }

    function saveToHistory() {
        const data = {
            id: crypto.randomUUID(),
            type: "estimate",
            savedAt: new Date().toISOString(),
            business: $businessInfo,
            customer: $customerInfo,
            estimate: $estimateDetails,
            items: $lineItems, // Save raw items including PERT data
            notes: $notes,
            totals: {
                ...$totals,
                taxRate: $taxRate,
            },
        };

        $savedEstimates = [...$savedEstimates, data];
        alert("Estimate saved to History!");
    }

    function saveExport() {
        const data = {
            business: $businessInfo,
            customer: $customerInfo,
            estimate: $estimateDetails,
            lineItems: $lineItems.filter((item) => item.description),
            notes: $notes,
            totals: {
                ...$totals,
                taxRate: $taxRate,
            },
        };

        exportData(data);
        alert("Data exported to file!");
    }

    function openInvoice() {
        $invoiceState.isOpen = true;
    }

    function openHistory() {
        $historyState.isOpen = true;
    }

    function clearForm() {
        if (
            !confirm(
                "Are you sure you want to clear the form? This will not clear your saved business information.",
            )
        ) {
            return;
        }

        // Reset logic - keep business info, reset others
        $customerInfo = { name: "", email: "", phone: "", address: "" };
        $notes = "";
        $taxRate = 0;

        // Increment estimate number logic
        const currentNum =
            parseInt($estimateDetails.number.replace(/\D/g, "")) || 1;
        const nextNum = `EST-${String(currentNum + 1).padStart(3, "0")}`;

        const today = new Date().toISOString().split("T")[0];
        const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        $estimateDetails = {
            number: nextNum,
            date: today,
            validUntil: validUntil,
        };

        $lineItems = [
            {
                id: 0,
                description: "",
                quantity: 1,
                rate: 0,
                amount: 0,
            },
        ];
    }
</script>

<div class="actions">
    <div class="row">
        <button
            type="button"
            class="btn btn-primary"
            on:click={handlePreviewPDF}>Preview PDF</button
        >
        <button type="button" class="btn btn-primary" on:click={openInvoice}
            >Create Invoice</button
        >
        <button type="button" class="btn btn-secondary" on:click={saveToHistory}
            >Save</button
        >
    </div>

    <div class="row secondary">
        <button type="button" class="btn btn-text" on:click={openHistory}
            >History</button
        >
        <button type="button" class="btn btn-text" on:click={shareQR}
            >Share QR</button
        >
        <button type="button" class="btn btn-text" on:click={saveExport}
            >Export File</button
        >
        <button type="button" class="btn btn-text danger" on:click={clearForm}
            >Clear</button
        >
    </div>
</div>

<style>
    .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
    }

    .row {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .secondary {
        border-top: 1px solid #eee;
        padding-top: 12px;
    }

    .btn {
        padding: 10px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.95rem;
    }

    .btn-primary {
        background-color: var(--primary-color);
        color: white;
    }

    .btn-secondary {
        background-color: #eee;
        color: #333;
    }

    .btn-text {
        background: none;
        color: #666;
        padding: 6px 12px;
        font-size: 0.85rem;
    }

    .btn-text:hover {
        color: var(--primary-color);
        background: #f5f5f5;
    }

    .danger {
        color: #ef4444;
    }

    .danger:hover {
        color: #dc2626;
        background: #fee2e2;
    }
</style>
