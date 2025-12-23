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
                phone) without creating an account.
            </p>
        </section>

        <section>
            <h3>Direct Peer-to-Peer Sync</h3>
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
            <h3>Troubleshooting</h3>
            <ul>
                <li>
                    <strong>Camera not opening?</strong> Check your browser permissions.
                    Also, modern browsers block camera access on non-secure (HTTP)
                    sites unless it's localhost.
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
