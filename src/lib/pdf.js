import { jsPDF } from 'jspdf';

export function generatePDF(data) {
    const doc = new jsPDF();

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
        doc.text(`$${Number(item.rate).toFixed(2)}`, 140, y);
        doc.text(`$${Number(item.amount).toFixed(2)}`, 170, y);
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
