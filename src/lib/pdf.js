import { jsPDF } from 'jspdf';


function createPDFDoc(data) {
    const doc = new jsPDF();

    // Helper to print text and return new Y position
    function printText(text, x, y, size = 10, maxWidth = 100) {
        if (!text) return y;
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * 5); // 5 is line height approximation
    }

    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text(data.business.name || 'Your Business', 20, y);

    y += 10;
    doc.setTextColor(100, 100, 100);

    y = printText(data.business.address, 20, y, 10, 80);
    if (data.business.phone) y = printText(`Phone: ${data.business.phone}`, 20, y, 10, 80);
    if (data.business.email) y = printText(`Email: ${data.business.email}`, 20, y, 10, 80);

    // Reset Y for next column if needed, or just ensure enough spacing
    // For this layout, we want EITHER the business info to push down everything OR have fixed sections.
    // The original layout had Estimate Title at fixed Y relative to top if business info was short.
    // Let's ensure we are at least at Y=60 for the title
    y = Math.max(y + 10, 60);

    // Estimate title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('ESTIMATE', 20, y);

    // Estimate details
    y += 10;
    y = printText(`Estimate #: ${data.estimate.number}`, 20, y, 10, 80);
    y = printText(`Date: ${data.estimate.date}`, 20, y, 10, 80);
    if (data.estimate.validUntil) {
        y = printText(`Valid Until: ${data.estimate.validUntil}`, 20, y, 10, 80);
    }

    // Customer info
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Bill To:', 20, y);
    y += 6;

    y = printText(data.customer.name, 20, y, 10, 80);
    y = printText(data.customer.address, 20, y, 10, 80);

    if (data.customer.phone) y = printText(`Phone: ${data.customer.phone}`, 20, y, 10, 80);
    if (data.customer.email) y = printText(`Email: ${data.customer.email}`, 20, y, 10, 80);

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

    return doc;
}

export function getPDFUrl(data) {
    const doc = createPDFDoc(data);
    return doc.output('bloburl');
}

export function savePDF(data) {
    const doc = createPDFDoc(data);
    const filename = `estimate-${data.estimate.number}-${data.customer.name.replace(/\s+/g, '-')}.pdf`;
    doc.save(filename);
}

// Backward compatibility (if needed) or simple wrapper
export function generatePDF(data) {
    savePDF(data);
}
