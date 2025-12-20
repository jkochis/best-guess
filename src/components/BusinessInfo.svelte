<script>
    import { businessInfo, savedBusinessProfiles } from "../lib/stores";
    import CollapsibleCard from "./CollapsibleCard.svelte";

    let selectedProfileId = "";

    function clear() {
        if (confirm("Clear business info?")) {
            $businessInfo = { name: "", email: "", phone: "", address: "" };
        }
    }

    function save() {
        const name = prompt(
            "Enter a name for this business profile:",
            $businessInfo.name,
        );
        if (name) {
            const profile = { ...$businessInfo, profileName: name };
            // Remove existing with same name if exists, then add new
            const others = $savedBusinessProfiles.filter(
                (p) => p.profileName !== name,
            );
            $savedBusinessProfiles = [...others, profile];
            alert(`Business profile "${name}" saved!`);
        }
    }

    function loadProfile() {
        if (!selectedProfileId) return;

        const profile = $savedBusinessProfiles.find(
            (p) => p.profileName === selectedProfileId,
        );
        if (profile) {
            const { profileName: _, ...data } = profile; // Exclude meta prop
            $businessInfo = data;
        }
    }

    function deleteProfile() {
        if (!selectedProfileId) return;

        if (confirm(`Delete profile "${selectedProfileId}"?`)) {
            $savedBusinessProfiles = $savedBusinessProfiles.filter(
                (p) => p.profileName !== selectedProfileId,
            );
            selectedProfileId = "";
            alert("Profile deleted.");
        }
    }
</script>

<CollapsibleCard title="Business Info">
    <!-- Summary View -->
    <div slot="summary">
        {$businessInfo.name || "No Business Name"}
        {#if $businessInfo.address}
            • {$businessInfo.address.split("\n")[0]}
        {/if}
    </div>

    <!-- Header Actions -->
    <div slot="header-actions" class="actions-group">
        {#if $savedBusinessProfiles.length > 0}
            <div class="profile-controls">
                <select
                    class="profile-select"
                    bind:value={selectedProfileId}
                    on:change={loadProfile}
                >
                    <option value="">Load Profile...</option>
                    {#each $savedBusinessProfiles as profile}
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

    <!-- Main Content -->
    <div class="form-content">
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
