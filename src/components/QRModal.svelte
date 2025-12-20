<script>
    import { qrState } from "../lib/stores";
    import QRCode from "qrcode";
    import { shortenUrl } from "../lib/share";

    let canvas;
    let useShortLink = false;
    let shortUrl = null;
    let currentUrl = "";

    // 1. React to modal open: reset state
    $: if ($qrState.isOpen) {
        if (!currentUrl) {
            // Initial load
            currentUrl = $qrState.url;
        }
    } else {
        // Reset when closed
        useShortLink = false;
        shortUrl = null;
        currentUrl = "";
    }

    // 2. React to toggle change
    $: updateUrlMode(useShortLink);

    async function updateUrlMode(shorten) {
        if (!$qrState.isOpen) return;

        if (shorten) {
            if (!shortUrl) {
                // Fetch if not already cached
                shortUrl = await shortenUrl($qrState.url);
            }
            currentUrl = shortUrl;
        } else {
            currentUrl = $qrState.url;
        }
    }

    // 3. Generate QR when currentUrl changes
    $: if (canvas && currentUrl) {
        generateQR(currentUrl);
    }

    async function generateQR(url) {
        try {
            await QRCode.toCanvas(canvas, url, {
                width: 256,
                margin: 2,
            });
        } catch (err) {
            console.error(err);
        }
    }

    function close() {
        $qrState.isOpen = false;
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            close();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $qrState.isOpen}
    <div class="modal-backdrop" on:click={close}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h2>Share Estimate</h2>
                <button class="btn-close" on:click={close}>×</button>
            </div>

            <div class="qr-container">
                <canvas bind:this={canvas}></canvas>

                <div class="toggle-container">
                    <label class="shorten-toggle">
                        <input type="checkbox" bind:checked={useShortLink} />
                        <span>Shorten URL?</span>
                    </label>
                </div>

                <p class="helper-text">
                    Scan with your phone camera to load this estimate.
                </p>

                <div class="url-copy">
                    <input
                        type="text"
                        readonly
                        value={currentUrl}
                        on:click={(e) => e.target.select()}
                    />
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" on:click={close}>Close</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .modal-content {
        background: white;
        width: 90%;
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .modal-header {
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-secondary);
    }

    .btn-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        line-height: 1;
        padding: 0 8px;
    }

    .btn-close:hover {
        color: var(--danger-color);
    }

    .qr-container {
        padding: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .toggle-container {
        margin-top: 16px;
    }

    .shorten-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        color: var(--text-secondary);
        user-select: none;
    }

    .helper-text {
        margin-top: 16px;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .url-copy {
        margin-top: 20px;
        width: 100%;
    }

    .url-copy input {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.85rem;
        color: var(--text-secondary);
        background: #f8fafc;
    }

    .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
    }
</style>
