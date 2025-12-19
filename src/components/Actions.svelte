    import { generatePDF, getPDFUrl } from '../lib/pdf';
    import { getShareUrl } from '../lib/share';
    import { businessInfo, customerInfo, estimateDetails, lineItems, totals, notes, taxRate, previewState, qrState } from '../lib/stores';
    import { get } from 'svelte/store';

    function handlePreviewPDF() {
        const data = {
            business: $businessInfo,
            customer: $customerInfo,
            estimate: $estimateDetails,
            lineItems: $lineItems.filter(item => item.description),
            notes: $notes,
            totals: {
                ...$totals,
                taxRate: $taxRate
            }
        };
        
        const url = getPDFUrl(data);
        previewState.set({ isOpen: true, pdfUrl: url });
    }

    function emailPDF() {
        const data = {
            business: $businessInfo,
            customer: $customerInfo,
            estimate: $estimateDetails,
            lineItems: $lineItems.filter(item => item.description),
            notes: $notes,
            totals: {
                ...$totals,
                taxRate: $taxRate
            }
        };
        
        if (!data.customer.email) {
            alert('Please enter customer email address');
            return;
        }

        // Generate PDF download
        generatePDF(data);

        // Mailto
        const subject = encodeURIComponent(`Estimate ${data.estimate.number} from ${data.business.name || 'Best Guess'}`);
        const body = encodeURIComponent(
            `Dear ${data.customer.name},\n\n` +
            `Please find attached the estimate for your home repair project.\n\n` +
            `Estimate #: ${data.estimate.number}\n` +
            `Total: $${data.totals.total.toFixed(2)}\n\n` +
            `If you have any questions, please don't hesitate to contact us.\n\n` +
            `Best regards,\n${data.business.name || 'Your Business'}`
        );
        window.open(`mailto:${data.customer.email}?subject=${subject}&body=${body}`);
    }

    function clearForm() {
        if (!confirm('Are you sure you want to clear the form? This will not clear your saved business information.')) {
            return;
        }
        
        // Reset logic - keep business info, reset others
        customerInfo.set({ name: '', email: '', phone: '', address: '' });
        notes.set('');
        taxRate.set(0);
        
        // Increment estimate number logic
        const currentNum = parseInt($estimateDetails.number.replace(/\D/g, '')) || 1;
        const nextNum = `EST-${String(currentNum + 1).padStart(3, '0')}`;
        
        const today = new Date().toISOString().split('T')[0];
        const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        estimateDetails.set({
            number: nextNum,
            date: today,
            validUntil: validUntil
        });
        
        lineItems.set([{ id: 0, description: '', quantity: 1, rate: 0, amount: 0 }]);
    }
</script>

<div class="actions">
    <button type="button" class="btn btn-primary" on:click={handlePreviewPDF}>Preview PDF</button>
    <button type="button" class="btn btn-primary" on:click={shareQR}>Share with QR</button>
    <button type="button" class="btn btn-primary" on:click={emailPDF}>Email to Customer</button>
    <button type="button" class="btn btn-secondary" on:click={clearForm}>Clear Form</button>
</div>
