<script>
    export let activeView;
    export let onNavigate;

    const links = [
        { id: "new-estimate", label: "New Estimate", icon: "📝" },
        { id: "saved-estimates", label: "Saved Estimates", icon: "📂" },
        { id: "saved-invoices", label: "Saved Invoices", icon: "🧾" },
        { id: "profiles", label: "Saved Profiles", icon: "👥" },
        { id: "sync", label: "Sync Devices", icon: "🔄" },
    ];
</script>

<nav class="navigation">
    <div class="logo">
        <h1>Best Guess</h1>
    </div>
    <div class="nav-links">
        {#each links as link}
            <button
                class="nav-item"
                class:active={activeView === link.id}
                on:click={() => onNavigate(link.id)}
            >
                <span class="icon">{link.icon}</span>
                <span class="label">{link.label}</span>
            </button>
        {/each}
    </div>
</nav>

<style>
    .navigation {
        background: #1e293b;
        color: white;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
        width: 250px;
        flex-shrink: 0;
    }

    .logo {
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 1px solid #334155;
    }

    .logo h1 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .nav-item {
        background: transparent;
        border: none;
        color: #94a3b8;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1rem;
        transition: all 0.2s;
        text-align: left;
        width: 100%;
    }

    .nav-item:hover {
        background: #334155;
        color: white;
    }

    .nav-item.active {
        background: var(--primary-color, #2563eb);
        color: white;
    }

    .icon {
        font-size: 1.2rem;
    }

    /* Mobile / Tablet Styles */
    @media (max-width: 768px) {
        .navigation {
            width: 100%;
            height: auto;
            flex-direction: row;
            align-items: center;
            padding: 10px 15px;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
            margin-right: 20px;
        }

        .logo h1 {
            font-size: 1.2rem;
        }

        .nav-links {
            flex-direction: row;
            gap: 5px;
            overflow-x: auto;
            flex: 1;
            /* Hide scrollbar */
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .nav-links::-webkit-scrollbar {
            display: none;
        }

        .nav-item {
            padding: 8px 12px;
            font-size: 0.9rem;
            white-space: nowrap;
            width: auto;
        }

        .label {
            display: none; /* Hide labels on very small screens if needed, or keep for tablet */
        }
    }

    @media (min-width: 480px) and (max-width: 768px) {
        .label {
            display: inline;
        }
    }
</style>
