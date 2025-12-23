<script>
    import { onDestroy } from "svelte";
    import QRCode from "qrcode";
    import { Html5QrcodeScanner } from "html5-qrcode";
    import { SyncHost, SyncClient } from "../lib/webrtc";
    import {
        businessInfo,
        customerInfo,
        savedBusinessProfiles,
        savedCustomerProfiles,
        savedEstimates,
    } from "../lib/stores";

    // WebRTC State
    let mode = "select"; // 'select', 'host', 'join'
    let status = "idle"; // 'idle', 'generating', 'scanning', 'connected', 'syncing', 'error'
    let qrCanvas;
    let qrCodeData = "";
    let peer;
    let scanner;

    // Data to sync
    $: syncData = {
        businessInfo: $businessInfo,
        customerInfo: $customerInfo,
        savedBusinessProfiles: $savedBusinessProfiles,
        savedCustomerProfiles: $savedCustomerProfiles,
        savedEstimates: $savedEstimates,
    };

    // --- WebRTC Logic ---
    function startHost() {
        mode = "host";
        status = "generating";
        peer = new SyncHost(
            (code) => {
                qrCodeData = code;
                status = "waiting_for_answer";
                generateQR(code);
            },
            () => {
                status = "connected";
                // Auto send data on connect? Or wait for user?
                // peer.sendData(syncData);
            },
            (data) => handleReceivedData(data),
        );
        peer.createOffer();
    }

    function startJoin() {
        mode = "join";
        status = "scanning_offer";
        startScanner((code) => {
            stopScanner();
            status = "generating_answer";
            peer = new SyncClient(
                (answerCode) => {
                    qrCodeData = answerCode;
                    status = "show_answer";
                    generateQR(answerCode);
                },
                () => {
                    status = "connected";
                },
                (data) => handleReceivedData(data),
            );
            peer.handleOffer(code);
        });
    }

    function hostScanAnswer() {
        status = "scanning_answer";
        startScanner((code) => {
            stopScanner();
            status = "connecting";
            peer.handleAnswer(code);
        });
    }

    function startScanner(onScan) {
        setTimeout(() => {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: 250 },
                /* verbose= */ false,
            );
            scanner.render(
                (decodedText) => {
                    onScan(decodedText);
                },
                (errorMessage) => {
                    // ignore errors
                },
            );
        }, 100);
    }

    function stopScanner() {
        if (scanner) {
            scanner.clear();
            scanner = null;
        }
    }

    async function generateQR(text) {
        // Wait a tick for canvas to render
        await new Promise((r) => setTimeout(r, 0));
        if (qrCanvas) {
            QRCode.toCanvas(
                qrCanvas,
                text,
                {
                    width: 300,
                    margin: 2,
                    errorCorrectionLevel: "L", // Lower error correction allows for more data density
                },
                (error) => {
                    if (error) console.error(error);
                },
            );
        }
    }

    function sendSyncData() {
        if (peer) {
            status = "syncing";
            peer.sendData(syncData);
            setTimeout(() => (status = "done"), 500);
        }
    }

    // --- Common ---
    function handleReceivedData(data) {
        console.log("Received Data:", data);
        if (
            confirm(
                `Received sync data with ${data.savedEstimates?.length || 0} estimates. Merge?`,
            )
        ) {
            // Simple merge: just replace or append?
            // For now, let's append unique items or just replace if simple.
            // Let's replace stores for simplicity in this V1

            // Actually, merging is safer for profiles/estimates.
            // But replacing businessInfo might be desired if syncing FROM master.

            if (data.businessInfo) $businessInfo = data.businessInfo;
            // if(data.customerInfo) $customerInfo = data.customerInfo;

            if (data.savedBusinessProfiles) {
                // Merge unique by name? Or just simple concat for now
                $savedBusinessProfiles = [
                    ...$savedBusinessProfiles,
                    ...data.savedBusinessProfiles,
                ];
            }
            if (data.savedCustomerProfiles) {
                $savedCustomerProfiles = [
                    ...$savedCustomerProfiles,
                    ...data.savedCustomerProfiles,
                ];
            }
            if (data.savedEstimates) {
                $savedEstimates = [...$savedEstimates, ...data.savedEstimates];
            }

            alert("Sync Complete!");
            status = "done";
        }
    }

    function reset() {
        if (scanner) stopScanner();
        mode = "select";
        status = "idle";
        qrCodeData = "";
        peer = null;
    }

    onDestroy(() => {
        if (scanner) stopScanner();
    });
</script>

<div class="sync-view">
    <header class="view-header">
        <h2>Sync Devices</h2>
        <p class="subtitle">
            Direct Peer-to-Peer Sync (Requires both devices online)
        </p>
    </header>

    {#if mode === "select"}
        <div class="select-container">
            <button class="btn-lg btn-host" on:click={startHost}>
                <div class="icon">💻</div>
                <div class="label">Host (Sender)</div>
                <div class="sub">Generate Code</div>
            </button>
            <button class="btn-lg btn-join" on:click={startJoin}>
                <div class="icon">📱</div>
                <div class="label">Join (Receiver)</div>
                <div class="sub">Scan Code</div>
            </button>
        </div>
    {/if}

    {#if mode === "host"}
        <div class="flow-container">
            <h3>Host Mode</h3>
            {#if status === "generating"}
                <p>Generating Offer...</p>
            {:else if status === "waiting_for_answer"}
                <div class="step-instruction">
                    <p>1. Scan this QR code with the other device.</p>
                </div>
                <canvas bind:this={qrCanvas}></canvas>
                <div class="step-action">
                    <p>2. After the other device generates an answer:</p>
                    <button class="btn btn-primary" on:click={hostScanAnswer}
                        >Scan Answer</button
                    >
                </div>
            {:else if status === "scanning_answer"}
                <div id="reader"></div>
                <p>Scanning Answer QR...</p>
                <button on:click={() => (status = "waiting_for_answer")}
                    >Cancel</button
                >
            {:else if status === "connected"}
                <p class="success">Connected!</p>
                <button class="btn btn-success" on:click={sendSyncData}
                    >Send My Data</button
                >
            {:else if status === "syncing"}
                <p>Sending data...</p>
            {:else if status === "done"}
                <p class="success">Sync Sent!</p>
                <button class="btn" on:click={reset}>Done</button>
            {/if}

            {#if status !== "done" && status !== "connected" && status !== "syncing"}
                <button class="btn-text" on:click={reset}>Cancel</button>
            {/if}
        </div>
    {/if}

    {#if mode === "join"}
        <div class="flow-container">
            <h3>Join Mode</h3>
            {#if status === "scanning_offer"}
                <div id="reader"></div>
                <p>Scan the Host's QR Code</p>
            {:else if status === "generating_answer"}
                <p>Generating Answer...</p>
            {:else if status === "show_answer"}
                <p>Show this QR code to the Host:</p>
                <canvas bind:this={qrCanvas}></canvas>
            {:else if status === "connected"}
                <p class="success">Connected! Waiting for data...</p>
            {:else if status === "done"}
                <p class="success">Sync Received!</p>
                <button class="btn" on:click={reset}>Done</button>
            {/if}

            {#if status !== "done" && status !== "connected"}
                <button class="btn-text" on:click={reset}>Cancel</button>
            {/if}
        </div>
    {/if}
</div>

<style>
    .sync-view {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        padding-bottom: 50px;
    }

    .view-header {
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .subtitle {
        color: #64748b;
        font-size: 0.9rem;
    }

    .select-container {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn-lg {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 160px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-lg:hover {
        border-color: #3b82f6;
        background: #eff6ff;
        transform: translateY(-2px);
    }

    .icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }

    .label {
        font-weight: bold;
        font-size: 1.1rem;
        color: #1e293b;
    }

    .sub {
        font-size: 0.85rem;
        color: #64748b;
    }

    .flow-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    canvas {
        margin: 20px 0;
        border: 1px solid #ddd;
        padding: 10px;
        background: white;
    }

    #reader {
        width: 300px;
        height: 300px;
        background: #000;
        margin: 0 auto;
    }

    .success {
        color: #16a34a;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .error {
        color: #ef4444;
        margin-top: 10px;
    }

    .btn {
        padding: 10px 20px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
    }

    .btn-primary {
        background: #3b82f6;
        color: white;
    }
    .btn-success {
        background: #22c55e;
        color: white;
    }
    .btn-text {
        background: transparent;
        color: #64748b;
        text-decoration: underline;
    }
</style>
