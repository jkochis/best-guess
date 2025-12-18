// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// State
let lineItems = [];
let lineItemCounter = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('estimateDate').value = today;

    // Set valid until to 30 days from now
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    document.getElementById('validUntil').value = validUntil.toISOString().split('T')[0];

    // Load saved business info from localStorage
    loadBusinessInfo();

    // Add initial line item
    addLineItem();

    // Event listeners
    document.getElementById('addLineItem').addEventListener('click', addLineItem);
    document.getElementById('generatePDF').addEventListener('click', generatePDF);
    document.getElementById('emailPDF').addEventListener('click', emailPDF);
    document.getElementById('clearForm').addEventListener('click', clearForm);
    document.getElementById('taxRate').addEventListener('input', calculateTotals);

    // Save business info on change
    ['businessName', 'businessEmail', 'businessPhone', 'businessAddress'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveBusinessInfo);
    });
});

function loadBusinessInfo() {
    const saved = localStorage.getItem('businessInfo');
    if (saved) {
        const info = JSON.parse(saved);
        document.getElementById('businessName').value = info.name || '';
        document.getElementById('businessEmail').value = info.email || '';
        document.getElementById('businessPhone').value = info.phone || '';
        document.getElementById('businessAddress').value = info.address || '';
    }
}

function saveBusinessInfo() {
    const info = {
        name: document.getElementById('businessName').value,
        email: document.getElementById('businessEmail').value,
        phone: document.getElementById('businessPhone').value,
        address: document.getElementById('businessAddress').value
    };
    localStorage.setItem('businessInfo', JSON.stringify(info));
}

function addLineItem() {
    const id = lineItemCounter++;
    const item = {
        id,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
    };
    lineItems.push(item);
    renderLineItems();
}

function removeLineItem(id) {
    lineItems = lineItems.filter(item => item.id !== id);
    renderLineItems();
    calculateTotals();
}

function updateLineItem(id, field, value) {
    const item = lineItems.find(item => item.id === id);
    if (item) {
        item[field] = value;
        if (field === 'quantity' || field === 'rate') {
            item.amount = parseFloat(item.quantity || 0) * parseFloat(item.rate || 0);
        }
        calculateTotals();
    }
}

function renderLineItems() {
    const container = document.getElementById('lineItems');
    container.innerHTML = '';

    lineItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'line-item';
        div.innerHTML = `
            <div class="line-item-row">
                <input type="text"
                       placeholder="Description"
                       value="${item.description}"
                       class="line-item-description"
                       data-id="${item.id}"
                       data-field="description">
                <input type="number"
                       placeholder="Qty"
                       value="${item.quantity}"
                       min="0"
                       step="0.01"
                       class="line-item-quantity"
                       data-id="${item.id}"
                       data-field="quantity">
                <input type="number"
                       placeholder="Rate"
                       value="${item.rate}"
                       min="0"
                       step="0.01"
                       class="line-item-rate"
                       data-id="${item.id}"
                       data-field="rate">
                <div class="line-item-amount">$${item.amount.toFixed(2)}</div>
                <button type="button" class="btn-remove" data-id="${item.id}">×</button>
            </div>
        `;
        container.appendChild(div);
    });

    // Add event listeners
    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const field = e.target.dataset.field;
            updateLineItem(id, field, e.target.value);
            renderLineItems();
        });
    });

    container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeLineItem(id);
        });
    });
}

function calculateTotals() {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value || 0) / 100;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `$${total.toFixed(2)}`;
}

function getFormData() {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value || 0) / 100;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
        business: {
            name: document.getElementById('businessName').value,
            email: document.getElementById('businessEmail').value,
            phone: document.getElementById('businessPhone').value,
            address: document.getElementById('businessAddress').value
        },
        customer: {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('projectAddress').value
        },
        estimate: {
            number: document.getElementById('estimateNumber').value,
            date: document.getElementById('estimateDate').value,
            validUntil: document.getElementById('validUntil').value
        },
        lineItems: lineItems.filter(item => item.description),
        notes: document.getElementById('notes').value,
        totals: {
            subtotal,
            taxRate: taxRate * 100,
            tax,
            total
        }
    };
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = getFormData();

    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text(data.business.name || 'Your Business', 20, y);

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (data.business.address) doc.text(data.business.address, 20, y);
    y += 5;
    if (data.business.phone) doc.text(`Phone: ${data.business.phone}`, 20, y);
    y += 5;
    if (data.business.email) doc.text(`Email: ${data.business.email}`, 20, y);

    // Estimate title
    y += 15;
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('ESTIMATE', 20, y);

    // Estimate details
    y += 10;
    doc.setFontSize(10);
    doc.text(`Estimate #: ${data.estimate.number}`, 20, y);
    y += 5;
    doc.text(`Date: ${data.estimate.date}`, 20, y);
    y += 5;
    if (data.estimate.validUntil) {
        doc.text(`Valid Until: ${data.estimate.validUntil}`, 20, y);
        y += 5;
    }

    // Customer info
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Bill To:', 20, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(data.customer.name, 20, y);
    y += 5;
    if (data.customer.address) {
        const addressLines = doc.splitTextToSize(data.customer.address, 80);
        doc.text(addressLines, 20, y);
        y += addressLines.length * 5;
    }
    if (data.customer.phone) {
        doc.text(`Phone: ${data.customer.phone}`, 20, y);
        y += 5;
    }
    if (data.customer.email) {
        doc.text(`Email: ${data.customer.email}`, 20, y);
        y += 5;
    }

    // Line items table
    y += 10;
    doc.setFontSize(10);
    doc.setFillColor(37, 99, 235);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y - 5, 170, 8, 'F');
    doc.text('Description', 22, y);
    doc.text('Qty', 120, y);
    doc.text('Rate', 140, y);
    doc.text('Amount', 170, y);

    y += 8;
    doc.setTextColor(0, 0, 0);

    data.lineItems.forEach(item => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        const description = doc.splitTextToSize(item.description, 90);
        doc.text(description, 22, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`$${item.rate.toFixed(2)}`, 140, y);
        doc.text(`$${item.amount.toFixed(2)}`, 170, y);
        y += Math.max(description.length * 5, 7);
    });

    // Totals
    y += 5;
    doc.line(130, y, 190, y);
    y += 7;

    doc.text('Subtotal:', 140, y);
    doc.text(`$${data.totals.subtotal.toFixed(2)}`, 170, y);
    y += 6;

    doc.text(`Tax (${data.totals.taxRate.toFixed(1)}%):`, 140, y);
    doc.text(`$${data.totals.tax.toFixed(2)}`, 170, y);
    y += 6;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 140, y);
    doc.text(`$${data.totals.total.toFixed(2)}`, 170, y);

    // Notes
    if (data.notes) {
        y += 15;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Notes:', 20, y);
        y += 6;
        doc.setFont(undefined, 'normal');
        const notesLines = doc.splitTextToSize(data.notes, 170);
        doc.text(notesLines, 20, y);
    }

    // Save PDF
    const filename = `estimate-${data.estimate.number}-${data.customer.name.replace(/\s+/g, '-')}.pdf`;
    doc.save(filename);
}

function emailPDF() {
    const data = getFormData();

    if (!data.customer.email) {
        alert('Please enter customer email address');
        return;
    }

    // Generate PDF as blob
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Same PDF generation code as above
    let y = 20;
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text(data.business.name || 'Your Business', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (data.business.address) doc.text(data.business.address, 20, y);
    y += 5;
    if (data.business.phone) doc.text(`Phone: ${data.business.phone}`, 20, y);
    y += 5;
    if (data.business.email) doc.text(`Email: ${data.business.email}`, 20, y);
    y += 15;
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('ESTIMATE', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Estimate #: ${data.estimate.number}`, 20, y);
    y += 5;
    doc.text(`Date: ${data.estimate.date}`, 20, y);
    y += 5;
    if (data.estimate.validUntil) {
        doc.text(`Valid Until: ${data.estimate.validUntil}`, 20, y);
        y += 5;
    }
    y += 10;
    doc.setFontSize(12);
    doc.text('Bill To:', 20, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(data.customer.name, 20, y);
    y += 5;
    if (data.customer.address) {
        const addressLines = doc.splitTextToSize(data.customer.address, 80);
        doc.text(addressLines, 20, y);
        y += addressLines.length * 5;
    }
    if (data.customer.phone) {
        doc.text(`Phone: ${data.customer.phone}`, 20, y);
        y += 5;
    }
    if (data.customer.email) {
        doc.text(`Email: ${data.customer.email}`, 20, y);
        y += 5;
    }
    y += 10;
    doc.setFillColor(37, 99, 235);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y - 5, 170, 8, 'F');
    doc.text('Description', 22, y);
    doc.text('Qty', 120, y);
    doc.text('Rate', 140, y);
    doc.text('Amount', 170, y);
    y += 8;
    doc.setTextColor(0, 0, 0);

    data.lineItems.forEach(item => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const description = doc.splitTextToSize(item.description, 90);
        doc.text(description, 22, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`$${item.rate.toFixed(2)}`, 140, y);
        doc.text(`$${item.amount.toFixed(2)}`, 170, y);
        y += Math.max(description.length * 5, 7);
    });

    y += 5;
    doc.line(130, y, 190, y);
    y += 7;
    doc.text('Subtotal:', 140, y);
    doc.text(`$${data.totals.subtotal.toFixed(2)}`, 170, y);
    y += 6;
    doc.text(`Tax (${data.totals.taxRate.toFixed(1)}%):`, 140, y);
    doc.text(`$${data.totals.tax.toFixed(2)}`, 170, y);
    y += 6;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 140, y);
    doc.text(`$${data.totals.total.toFixed(2)}`, 170, y);

    if (data.notes) {
        y += 15;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Notes:', 20, y);
        y += 6;
        doc.setFont(undefined, 'normal');
        const notesLines = doc.splitTextToSize(data.notes, 170);
        doc.text(notesLines, 20, y);
    }

    // Get PDF as base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    const filename = `estimate-${data.estimate.number}-${data.customer.name.replace(/\s+/g, '-')}.pdf`;

    // Create mailto link with PDF
    const subject = encodeURIComponent(`Estimate ${data.estimate.number} from ${data.business.name || 'Best Guess'}`);
    const body = encodeURIComponent(
        `Dear ${data.customer.name},\n\n` +
        `Please find attached the estimate for your home repair project.\n\n` +
        `Estimate #: ${data.estimate.number}\n` +
        `Total: $${data.totals.total.toFixed(2)}\n\n` +
        `If you have any questions, please don't hesitate to contact us.\n\n` +
        `Best regards,\n${data.business.name || 'Your Business'}`
    );

    // Note: Browsers don't support attachments in mailto links
    // Opening mailto and downloading PDF separately
    window.open(`mailto:${data.customer.email}?subject=${subject}&body=${body}`);

    // Also download the PDF
    doc.save(filename);

    alert(`Email client opened with pre-filled message to ${data.customer.email}. The PDF has been downloaded - please attach it to your email.`);
}

function clearForm() {
    if (!confirm('Are you sure you want to clear the form? This will not clear your saved business information.')) {
        return;
    }

    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('projectAddress').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('taxRate').value = '0';

    // Reset estimate number
    const currentNum = parseInt(document.getElementById('estimateNumber').value.replace(/\D/g, '')) || 1;
    document.getElementById('estimateNumber').value = `EST-${String(currentNum + 1).padStart(3, '0')}`;

    // Reset dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('estimateDate').value = today;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    document.getElementById('validUntil').value = validUntil.toISOString().split('T')[0];

    // Reset line items
    lineItems = [];
    lineItemCounter = 0;
    addLineItem();
}
