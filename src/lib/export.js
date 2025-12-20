export function exportData(data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create temporary link to download
    const link = document.createElement('a');
    link.href = url;

    // Filename: estimate-EST-00X.json
    const filename = `estimate-${data.estimate.number || 'draft'}.json`;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
