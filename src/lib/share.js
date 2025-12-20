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

export async function shortenUrl(longUrl) {
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (!response.ok) throw new Error('Shortening failed');
        return await response.text();
    } catch (e) {
        console.warn('URL shortening failed, using long URL', e);
        return longUrl;
    }
}
