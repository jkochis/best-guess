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
        alert("Data saved to browser and exported to file!");
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
            { id: 0, description: "", quantity: 1, rate: 0, amount: 0 },
        ];
    }
</script>

<div class="actions">
    <button type="button" class="btn btn-primary" on:click={handlePreviewPDF}
        >Preview PDF</button
    >
    <button type="button" class="btn btn-primary" on:click={shareQR}
        >Share with QR</button
    >
    <button type="button" class="btn btn-primary" on:click={saveExport}
        >Save / Export</button
    >
    <button type="button" class="btn btn-secondary" on:click={clearForm}
        >Clear Form</button
    >
</div>
