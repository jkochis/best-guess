<script>
    import { slide } from "svelte/transition";
    export let title = "";
    export let isOpen = true;

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="card collapsible-card" class:closed={!isOpen}>
    <div class="card-header" on:click={toggle}>
        <div class="title-section">
            <span class="chevron">{isOpen ? "▼" : "▶"}</span>
            <h2>{title}</h2>
        </div>

        {#if !isOpen}
            <div class="summary" transition:slide>
                <slot name="summary"></slot>
            </div>
        {/if}

        <div class="actions" on:click|stopPropagation>
            <slot name="header-actions"></slot>
        </div>
    </div>

    {#if isOpen}
        <div class="card-content" transition:slide>
            <slot></slot>
        </div>
    {/if}
</div>

<style>
    .collapsible-card {
        padding: 0;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .card-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background: var(--bg-secondary);
        border-bottom: 1px solid transparent;
        user-select: none;
    }

    .collapsible-card.closed .card-header {
        background: white;
    }

    .collapsible-card:not(.closed) .card-header {
        border-bottom: 1px solid var(--border-color);
    }

    .title-section {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .chevron {
        font-size: 0.8rem;
        color: var(--text-secondary);
        width: 1rem;
        text-align: center;
    }

    h2 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
    }

    .summary {
        flex: 1;
        margin: 0 16px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.9rem;
    }

    .actions {
        display: flex;
        gap: 8px;
    }

    .card-content {
        padding: 16px;
    }
</style>
