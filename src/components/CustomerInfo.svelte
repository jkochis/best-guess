<script>
    import { customerInfo } from "../lib/stores";

    function clear() {
        if (confirm("Clear customer info?")) {
            $customerInfo = { name: "", email: "", phone: "", address: "" };
        }
    }

    function save() {
        alert("Customer info saved!");
    }
</script>

<div class="card">
    <div class="section-header">
        <h2>Customer Info</h2>
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
        <label for="cust-name">Customer Name</label>
        <input
            id="cust-name"
            type="text"
            bind:value={$customerInfo.name}
            placeholder="Customer Name"
        />
    </div>

    <div class="form-group">
        <label for="cust-address">Address</label>
        <textarea
            id="cust-address"
            bind:value={$customerInfo.address}
            placeholder="456 Elm St..."
        ></textarea>
    </div>

    <div class="form-group">
        <label for="cust-phone">Phone</label>
        <input
            id="cust-phone"
            type="tel"
            bind:value={$customerInfo.phone}
            placeholder="(555) 987-6543"
        />
    </div>

    <div class="form-group">
        <label for="cust-email">Email</label>
        <input
            id="cust-email"
            type="email"
            bind:value={$customerInfo.email}
            placeholder="customer@example.com"
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
