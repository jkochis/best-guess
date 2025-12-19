import LZString from 'lz-string';

export function getShareUrl(data) {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const url = new URL(window.location.href);
    url.searchParams.set('data', compressed);
    return url.toString();
}

export function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get('data');

    if (!compressed) return null;

    try {
        const json = LZString.decompressFromEncodedURIComponent(compressed);
        if (!json) return null;
        return JSON.parse(json);
    } catch (e) {
        console.error('Failed to parse share data', e);
        return null;
    }
}
