<script>
    import { businessInfo } from "../lib/stores";

    function clear() {
        if (confirm("Clear business info?")) {
            $businessInfo = { name: "", email: "", phone: "", address: "" };
        }
    }

    function save() {
        // Auto-save is active, but we can provide visual feedback
        alert("Business info saved!");
    }
</script>

<div class="card">
    <div class="section-header">
        <h2>Business Info</h2>
        <div class="actions-group">
            <button type="button" class="btn-icon" on:click={save} title="Save"
                >🔒</button
            >
            <button
                type="button"
                class="btn-icon"
                on:click={clear}
                title="Clear">🧹</button
            >
        </div>
    </div>

    <div class="form-group">
        <label for="biz-name">Business Name</label>
        <input
            id="biz-name"
            type="text"
            bind:value={$businessInfo.name}
            placeholder="Your Business Name"
        />
    </div>

    <div class="form-group">
        <label for="biz-address">Address</label>
        <textarea
            id="biz-address"
            bind:value={$businessInfo.address}
            placeholder="123 Main St..."
        ></textarea>
    </div>

    <div class="form-group">
        <label for="biz-phone">Phone</label>
        <input
            id="biz-phone"
            type="tel"
            bind:value={$businessInfo.phone}
            placeholder="(555) 123-4567"
        />
    </div>

    <div class="form-group">
        <label for="biz-email">Email</label>
        <input
            id="biz-email"
            type="email"
            bind:value={$businessInfo.email}
            placeholder="contact@example.com"
        />
    </div>
</div>

<style>
    .actions-group {
        display: flex;
        gap: 8px;
    }

    .btn-icon {
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 4px 8px;
        transition: all 0.2s;
    }

    .btn-icon:hover {
        background: var(--border-color);
    }
</style>
