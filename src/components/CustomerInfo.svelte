<script>
    import { customerInfo, savedCustomerProfiles } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

    let selectedProfileId = "";

    function clear() {
        if (confirm("Clear customer info?")) {
            $customerInfo = { name: "", email: "", phone: "", address: "" };
        }
    }

    function save() {
        const name = prompt(
            "Enter a name for this customer profile:",
            $customerInfo.name,
        );
        if (name) {
            const profile = { ...$customerInfo, profileName: name };
            const others = $savedCustomerProfiles.filter(
                (p) => p.profileName !== name,
            );
            $savedCustomerProfiles = [...others, profile];
            alert(`Customer profile "${name}" saved!`);
        }
    }

    function loadProfile() {
        if (!selectedProfileId) return;

        const profile = $savedCustomerProfiles.find(
            (p) => p.profileName === selectedProfileId,
        );
        if (profile) {
            const { profileName: _, ...data } = profile;
            $customerInfo = data;
        }
    }

    function deleteProfile() {
        if (!selectedProfileId) return;

        if (confirm(`Delete profile "${selectedProfileId}"?`)) {
            $savedCustomerProfiles = $savedCustomerProfiles.filter(
                (p) => p.profileName !== selectedProfileId,
            );
            selectedProfileId = "";
            alert("Profile deleted.");
        }
    }
</script>

<CollapsibleCard title="Customer Info" id="customer-info">
    <!-- Summary View -->
    <div slot="summary">
        {$customerInfo.name || "No Customer Name"}
        {#if $customerInfo.address}
            • {$customerInfo.address.split("\n")[0]}
        {/if}
    </div>

    <!-- Header Actions -->
    <div slot="header-actions" class="actions-group">
        {#if $savedCustomerProfiles.length > 0}
            <div class="profile-controls">
                <select
                    class="profile-select"
                    bind:value={selectedProfileId}
                    on:change={loadProfile}
                >
                    <option value="">Load Profile...</option>
                    {#each $savedCustomerProfiles as profile}
                        <option value={profile.profileName}
                            >{profile.profileName}</option
                        >
                    {/each}
                </select>
                {#if selectedProfileId}
                    <button
                        type="button"
                        class="btn-icon danger"
                        on:click={deleteProfile}
                        title="Delete Profile">🗑️</button
                    >
                {/if}
            </div>
        {/if}

        <button
            type="button"
            class="btn-icon"
            on:click={save}
            title="Save Profile">🔒</button
        >
        <button type="button" class="btn-icon" on:click={clear} title="Clear"
            >🧹</button
        >
    </div>

    <div class="form-content">
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
</CollapsibleCard>

<style>
    .actions-group {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .btn-icon {
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 4px 8px;
        transition: all 0.2s;
        line-height: 1;
    }

    .btn-icon:hover {
        background: var(--border-color);
    }

    .btn-icon.danger:hover {
        background: #fee2e2;
        border-color: #ef4444;
    }

    .profile-controls {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .profile-select {
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.9rem;
        max-width: 120px;
    }

    .form-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
</style>
