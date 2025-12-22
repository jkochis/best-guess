<script>
    import {
        savedBusinessProfiles,
        savedCustomerProfiles,
        businessInfo,
        customerInfo,
    } from "../lib/stores";

    let editingBusinessIndex = -1;
    let editingCustomerIndex = -1;
    let editFormData = {};

    function startEditBusiness(index, profile) {
        editingBusinessIndex = index;
        editingCustomerIndex = -1; // Close other
        editFormData = { ...profile };
    }

    function saveBusinessProfile(index) {
        const profiles = [...$savedBusinessProfiles];
        profiles[index] = { ...editFormData };
        $savedBusinessProfiles = profiles;
        cancelEdit();
    }

    function startEditCustomer(index, profile) {
        editingCustomerIndex = index;
        editingBusinessIndex = -1;
        editFormData = { ...profile };
    }

    function saveCustomerProfile(index) {
        const profiles = [...$savedCustomerProfiles];
        profiles[index] = { ...editFormData };
        $savedCustomerProfiles = profiles;
        cancelEdit();
    }

    function cancelEdit() {
        editingBusinessIndex = -1;
        editingCustomerIndex = -1;
        editFormData = {};
    }

    function loadBusinessProfile(profile) {
        if (!confirm("Load this business profile?")) return;
        $businessInfo = { ...profile };
    }

    function deleteBusinessProfile(index) {
        if (!confirm("Delete this profile?")) return;
        $savedBusinessProfiles = $savedBusinessProfiles.filter(
            (_, i) => i !== index,
        );
        if (editingBusinessIndex === index) cancelEdit();
    }

    function loadCustomerProfile(profile) {
        if (!confirm("Load this customer profile?")) return;
        $customerInfo = { ...profile };
    }

    function deleteCustomerProfile(index) {
        if (!confirm("Delete this profile?")) return;
        $savedCustomerProfiles = $savedCustomerProfiles.filter(
            (_, i) => i !== index,
        );
        if (editingCustomerIndex === index) cancelEdit();
    }
</script>

<div class="profiles-view">
    <header class="view-header">
        <h2>Saved Profiles</h2>
    </header>

    <div class="profiles-section">
        <h3>Business Profiles</h3>
        {#if $savedBusinessProfiles.length === 0}
            <p class="empty-text">No saved business profiles.</p>
        {:else}
            <div class="list">
                {#each $savedBusinessProfiles as profile, i}
                    {#if editingBusinessIndex === i}
                        <!-- Edit Mode -->
                        <div class="profile-item editing">
                            <div class="edit-form">
                                <label
                                    >Name: <input
                                        bind:value={editFormData.name}
                                    /></label
                                >
                                <label
                                    >Email: <input
                                        bind:value={editFormData.email}
                                    /></label
                                >
                                <label
                                    >Phone: <input
                                        bind:value={editFormData.phone}
                                    /></label
                                >
                                <label
                                    >Address: <textarea
                                        bind:value={editFormData.address}
                                    ></textarea></label
                                >
                            </div>
                            <div class="actions">
                                <button
                                    class="btn-sm btn-save"
                                    on:click={() => saveBusinessProfile(i)}
                                    >Save</button
                                >
                                <button
                                    class="btn-sm btn-cancel"
                                    on:click={cancelEdit}>Cancel</button
                                >
                                <button
                                    class="btn-sm btn-load"
                                    on:click={() =>
                                        loadBusinessProfile(profile)}
                                    >Use This</button
                                >
                            </div>
                        </div>
                    {:else}
                        <!-- View Mode -->
                        <div class="profile-item">
                            <div class="info">
                                <strong>{profile.name}</strong>
                                <span>{profile.email}</span>
                            </div>
                            <div class="actions">
                                <button
                                    class="btn-sm btn-edit"
                                    on:click={() =>
                                        startEditBusiness(i, profile)}
                                    >Edit</button
                                >
                                <button
                                    class="btn-sm btn-del"
                                    on:click={() => deleteBusinessProfile(i)}
                                    >Delete</button
                                >
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>

    <hr />

    <div class="profiles-section">
        <h3>Customer Profiles</h3>
        {#if $savedCustomerProfiles.length === 0}
            <p class="empty-text">No saved customer profiles.</p>
        {:else}
            <div class="list">
                {#each $savedCustomerProfiles as profile, i}
                    {#if editingCustomerIndex === i}
                        <div class="profile-item editing">
                            <div class="edit-form">
                                <label
                                    >Name: <input
                                        bind:value={editFormData.name}
                                    /></label
                                >
                                <label
                                    >Email: <input
                                        bind:value={editFormData.email}
                                    /></label
                                >
                                <label
                                    >Phone: <input
                                        bind:value={editFormData.phone}
                                    /></label
                                >
                                <label
                                    >Address: <textarea
                                        bind:value={editFormData.address}
                                    ></textarea></label
                                >
                            </div>
                            <div class="actions">
                                <button
                                    class="btn-sm btn-save"
                                    on:click={() => saveCustomerProfile(i)}
                                    >Save</button
                                >
                                <button
                                    class="btn-sm btn-cancel"
                                    on:click={cancelEdit}>Cancel</button
                                >
                                <button
                                    class="btn-sm btn-load"
                                    on:click={() =>
                                        loadCustomerProfile(profile)}
                                    >Use This</button
                                >
                            </div>
                        </div>
                    {:else}
                        <div class="profile-item">
                            <div class="info">
                                <strong>{profile.name}</strong>
                                <span>{profile.email}</span>
                            </div>
                            <div class="actions">
                                <button
                                    class="btn-sm btn-edit"
                                    on:click={() =>
                                        startEditCustomer(i, profile)}
                                    >Edit</button
                                >
                                <button
                                    class="btn-sm btn-del"
                                    on:click={() => deleteCustomerProfile(i)}
                                    >Delete</button
                                >
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .profiles-view {
        max-width: 800px;
        margin: 0 auto;
    }

    .view-header {
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .profiles-section {
        margin-bottom: 40px;
    }

    .profiles-section h3 {
        margin-bottom: 16px;
        font-size: 1.2rem;
    }

    .empty-text {
        color: #94a3b8;
        font-style: italic;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .profile-item {
        background: white;
        border: 1px solid #e2e8f0;
        padding: 12px;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .info {
        display: flex;
        flex-direction: column;
    }

    .info strong {
        font-size: 1rem;
    }

    .info span {
        font-size: 0.9rem;
        color: #64748b;
    }

    .actions {
        display: flex;
        gap: 8px;
    }

    .btn-sm {
        padding: 4px 10px;
        font-size: 0.85rem;
        border-radius: 4px;
        border: 1px solid transparent;
        cursor: pointer;
    }

    .btn-edit {
        background: #e0e7ff;
        color: #3730a3;
    }

    .btn-save {
        background: #dcfce7;
        color: #166534;
    }

    .btn-cancel {
        background: #f1f5f9;
        color: #475569;
    }

    .btn-del {
        background: #fee2e2;
        color: #b91c1c;
    }

    .profile-item.editing {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .edit-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .edit-form label {
        display: flex;
        flex-direction: column;
        font-size: 0.85rem;
        color: #64748b;
    }

    .edit-form input,
    .edit-form textarea {
        padding: 6px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        font-family: inherit;
    }

    hr {
        border: 0;
        border-top: 1px solid #e2e8f0;
        margin: 20px 0;
    }
</style>
