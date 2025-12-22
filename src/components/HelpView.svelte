<script>
</script>

<div class="help-view">
    <header class="view-header">
        <h2>Help & Documentation</h2>
    </header>

    <div class="content">
        <section>
            <h3>Syncing your Devices</h3>
            <p>
                Best Guess allows you to synchronize your estimates, invoices,
                and profiles between devices (e.g., this computer and your
                phone) without creating an account. We use two methods:
            </p>
        </section>

        <section>
            <h3>Method 1: Direct (P2P)</h3>
            <p>
                <strong>Best for:</strong> Devices in the same room (e.g. PC and
                Phone).
            </p>
            <p>
                This method connects your devices directly using WebRTC. No data
                touches a server.
            </p>
            <ol>
                <li>Open <strong>Sync Devices</strong> on both devices.</li>
                <li>On the sender (e.g. PC), click <strong>Host</strong>.</li>
                <li>
                    On the receiver (e.g. Phone), click <strong>Join</strong>.
                </li>
                <li>Scan the Host's QR code with the Joiner.</li>
                <li>
                    The Joiner will generate a response QR code. Scan that with
                    the Host.
                </li>
                <li>
                    Once connected, click <strong>Send My Data</strong> to sync.
                </li>
            </ol>
            <div class="note">
                <strong>Note:</strong> Both devices often need to be on the same
                Wi-Fi network, or the site must be served over HTTPS for the camera
                to work.
            </div>
        </section>

        <section>
            <h3>Method 2: Cloud (IPFS)</h3>
            <p>
                <strong>Best for:</strong> Syncing when devices aren't together,
                or if P2P fails.
            </p>
            <p>
                This method saves an encrypted snapshot of your data to the
                decentralized web (IPFS).
            </p>
            <ol>
                <li>
                    Go to <strong>Sync Devices</strong> and switch to
                    <strong>Cloud (IPFS)</strong>.
                </li>
                <li>
                    <strong>Sender:</strong> Enter a secret password and click
                    <strong>Encrypt & Upload</strong>.
                </li>
                <li>
                    Wait for the upload to finish. You will get a <strong
                        >CID</strong
                    > (a long string of characters) and a QR code.
                </li>
                <li>
                    <strong>Receiver:</strong> Go to the IPFS tab on the other device.
                </li>
                <li>Enter the <strong>same password</strong>.</li>
                <li>Enter the CID (or scan the QR code).</li>
                <li>Click <strong>Download & Decrypt</strong>.</li>
            </ol>
            <div class="note">
                <strong>Security:</strong> Your data is encrypted with your password
                before it leaves your device. Without the password, the data on IPFS
                is unreadable junk.
            </div>
        </section>

        <section>
            <h3>Troubleshooting</h3>
            <ul>
                <li>
                    <strong>Camera not opening?</strong> Check your browser permissions.
                    Also, modern browsers block camera access on non-secure (HTTP)
                    sites unless it's localhost.
                </li>
                <li>
                    <strong>IPFS stuck?</strong> IPFS runs in your browser. It might
                    take a moment to find peers.
                </li>
            </ul>
        </section>
    </div>
</div>

<style>
    .help-view {
        max-width: 800px;
        margin: 0 auto;
        padding-bottom: 60px;
    }

    .view-header {
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    h3 {
        margin-top: 30px;
        margin-bottom: 15px;
        color: #1e293b;
    }

    p,
    li {
        color: #334155;
        line-height: 1.6;
        margin-bottom: 10px;
    }

    ol {
        padding-left: 20px;
    }

    li {
        margin-bottom: 8px;
    }

    .note {
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
        padding: 12px;
        border-radius: 4px;
        margin: 15px 0;
        font-size: 0.95rem;
        color: #78350f;
    }
</style>
