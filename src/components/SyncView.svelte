<script>
    import { onMount, onDestroy } from "svelte";
    import QRCode from "qrcode";
    import { Html5QrcodeScanner } from "html5-qrcode";
    import { SyncHost, SyncClient } from "../lib/webrtc";
    import { uploadToIPFS, downloadFromIPFS, getPeerCount } from "../lib/ipfs";
    import {
        businessInfo,
        customerInfo,
        savedBusinessProfiles,
        savedCustomerProfiles,
        savedEstimates,
    } from "../lib/stores";

    let syncMethod = "direct"; // 'direct' (WebRTC) | 'cloud' (IPFS)

    // WebRTC State
    let mode = "select"; // 'select', 'host', 'join'
    let status = "idle"; // 'idle', 'generating', 'scanning', 'connected', 'syncing', 'error'
    let qrCanvas;
    let qrCodeData = "";
    let peer;
    let scanner;

    // IPFS State
    let ipfsStatus = "idle"; // idle, uploading, u_success, downloading, d_success, error
    let ipfsPassword = "";
    let ipfsCid = "";
    let ipfsError = "";
    let ipfsPeers = 0;
    let peerInterval;

    // Data to sync
    $: syncData = {
        businessInfo: $businessInfo,
        customerInfo: $customerInfo,
        savedBusinessProfiles: $savedBusinessProfiles,
        savedCustomerProfiles: $savedCustomerProfiles,
        savedEstimates: $savedEstimates,
    };

    // Watch syncMethod to start/stop peer polling
    $: if (syncMethod === "cloud") {
        startPeerPolling();
    } else {
        stopPeerPolling();
    }

    function startPeerPolling() {
        if (peerInterval) return;
        // Poll immediately once
        checkPeers();
        peerInterval = setInterval(checkPeers, 3000);
    }

    function stopPeerPolling() {
        if (peerInterval) {
            clearInterval(peerInterval);
            peerInterval = null;
        }
    }

    async function checkPeers() {
        ipfsPeers = await getPeerCount();
    }

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

    // --- IPFS Logic ---
    async function handleIpfsUpload() {
        if (!ipfsPassword) {
            alert("Please enter a password to encrypt your data.");
            return;
        }
        ipfsStatus = "uploading";
        ipfsError = "";
        try {
            const cid = await uploadToIPFS(syncData, ipfsPassword);
            ipfsCid = cid;
            ipfsStatus = "u_success";
            generateQR(cid);
        } catch (err) {
            console.error(err);
            ipfsError = "Upload failed: " + err.message;
            ipfsStatus = "error";
        }
    }

    async function handleIpfsDownload() {
        if (!ipfsCid || !ipfsPassword) {
            alert("Please enter the CID and password.");
            return;
        }
        ipfsStatus = "downloading";
        ipfsError = "";
        try {
            const data = await downloadFromIPFS(ipfsCid, ipfsPassword);
            handleReceivedData(data);
            ipfsStatus = "d_success";
        } catch (err) {
            console.error(err);
            ipfsError = "Download failed: " + err.message;
            ipfsStatus = "error";
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
            if (syncMethod === "direct") status = "done";
        }
    }

    function reset() {
        if (scanner) stopScanner();
        mode = "select";
        status = "idle";
        qrCodeData = "";
        peer = null;

        ipfsStatus = "idle";
        ipfsCid = "";
        ipfsPassword = "";
        ipfsError = "";
    }

    onDestroy(() => {
        if (scanner) stopScanner();
        stopPeerPolling();
    });
</script>

<div class="sync-view">
    <header class="view-header">
        <h2>Sync Devices</h2>
        <div class="method-toggle">
            <button
                class:active={syncMethod === "direct"}
                on:click={() => {
                    syncMethod = "direct";
                    reset();
                }}>Direct (P2P)</button
            >
            <button
                class:active={syncMethod === "cloud"}
                on:click={() => {
                    syncMethod = "cloud";
                    reset();
                }}>Cloud (IPFS)</button
            >
        </div>
    </header>

    {#if syncMethod === "direct"}
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
                        <button
                            class="btn btn-primary"
                            on:click={hostScanAnswer}>Scan Answer</button
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
    {:else if syncMethod === "cloud"}
        <div class="ipfs-container">
            <p class="info-text">
                Upload encrypted data to IPFS and share the CID.
            </p>

            <div class="peer-status" class:connected={ipfsPeers > 0}>
                <span class="status-dot"></span>
                <span>{ipfsPeers} Peers Connected</span>
            </div>
            {#if ipfsPeers === 0}
                <p class="warning-text">
                    Wait for peers before uploading/downloading...
                </p>
            {/if}

            <div class="form-group">
                <label>Encryption Password:</label>
                <input
                    type="password"
                    bind:value={ipfsPassword}
                    placeholder="Enter a secure password"
                />
            </div>

            <div class="ipfs-actions">
                <div class="ipfs-box">
                    <h4>Upload (Sender)</h4>
                    <button
                        class="btn btn-primary"
                        disabled={ipfsStatus === "uploading"}
                        on:click={handleIpfsUpload}
                    >
                        {ipfsStatus === "uploading"
                            ? "Uploading..."
                            : "Encrypt & Upload"}
                    </button>

                    {#if ipfsStatus === "u_success"}
                        <div class="result">
                            <p class="success">Uploaded!</p>
                            <label>Share this CID:</label>
                            <input
                                class="cid-input"
                                readonly
                                value={ipfsCid}
                                on:click={(e) => e.target.select()}
                            />
                            <canvas bind:this={qrCanvas}></canvas>
                        </div>
                    {/if}
                </div>

                <div class="divider">OR</div>

                <div class="ipfs-box">
                    <h4>Download (Receiver)</h4>
                    <label>CID:</label>
                    <input
                        type="text"
                        bind:value={ipfsCid}
                        placeholder="Enter CID"
                    />
                    <!-- Scan QR for CID? -->
                    <button
                        class="btn-sm"
                        on:click={() => {
                            mode = "scan_cid"; // Reuse scanner somewhat hacks
                            startScanner((code) => {
                                ipfsCid = code;
                                stopScanner();
                                mode = "select"; // reset webRTC mode var used for scanner visibility
                            });
                        }}>Scan QR</button
                    >

                    {#if mode === "scan_cid"}
                        <div id="reader"></div>
                        <button
                            on:click={() => {
                                stopScanner();
                                mode = "select";
                            }}>Cancel Scan</button
                        >
                    {/if}

                    <button
                        class="btn btn-success"
                        style="margin-top: 10px;"
                        disabled={ipfsStatus === "downloading"}
                        on:click={handleIpfsDownload}
                    >
                        {ipfsStatus === "downloading"
                            ? "Downloading..."
                            : "Download & Decrypt"}
                    </button>
                </div>
            </div>

            {#if ipfsError}
                <p class="error">{ipfsError}</p>
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

    .method-toggle {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }

    .method-toggle button {
        background: white;
        border: 1px solid #cbd5e1;
        padding: 6px 12px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .method-toggle button.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
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

    /* IPFS Styles */
    .ipfs-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .peer-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #64748b;
        font-size: 0.9rem;
        background: #f1f5f9;
        padding: 6px 12px;
        border-radius: 20px;
        width: fit-content;
        margin: 0 auto;
    }

    .peer-status.connected .status-dot {
        background: #22c55e;
        box-shadow: 0 0 5px #22c55e;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
        transition: all 0.3s;
    }

    .warning-text {
        font-size: 0.85rem;
        color: #eab308;
        margin-top: -10px;
    }

    .info-text {
        color: #64748b;
        font-size: 0.95rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 300px;
        margin: 0 auto;
    }

    .form-group input {
        padding: 8px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
    }

    .ipfs-actions {
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin-top: 20px;
    }

    .ipfs-box {
        background: white;
        border: 1px solid #e2e8f0;
        padding: 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .ipfs-box h4 {
        margin: 0 0 10px 0;
        color: #1e293b;
    }

    .cid-input {
        width: 100%;
        padding: 8px;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        font-family: monospace;
        font-size: 0.9rem;
    }

    .divider {
        font-weight: bold;
        color: #94a3b8;
    }
</style>
