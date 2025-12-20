<script>
    import { customerInfo, savedCustomerProfiles } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

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

    function loadProfile(event) {
        const profileName = event.target.value;
        if (!profileName) return;

        const profile = $savedCustomerProfiles.find(
            (p) => p.profileName === profileName,
        );
        if (profile) {
            const { profileName: _, ...data } = profile;
            $customerInfo = data;
        }
        event.target.value = "";
    }
</script>

<CollapsibleCard title="Customer Info">
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
            <select class="profile-select" on:change={loadProfile}>
                <option value="">Load Profile...</option>
                {#each $savedCustomerProfiles as profile}
                    <option value={profile.profileName}
                        >{profile.profileName}</option
                    >
                {/each}
            </select>
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
