<script>
    import BusinessInfo from "./BusinessInfo.svelte";
    import CustomerInfo from "./CustomerInfo.svelte";
    import EstimateDetails from "./EstimateDetails.svelte";
    import LineItems from "./LineItems.svelte";
    import Totals from "./Totals.svelte";
    import Notes from "./Notes.svelte";
    import Actions from "./Actions.svelte";
</script>

<div class="estimate-form-view">
    <header class="view-header">
        <h2>Estimate Details</h2>
    </header>

    <form id="estimateForm" on:submit|preventDefault>
        <BusinessInfo />
        <CustomerInfo />
        <EstimateDetails />
        <LineItems />
        <Totals />
        <Notes />
        <Actions />
    </form>
</div>

<style>
    .estimate-form-view {
        max-width: 900px;
        margin: 0 auto;
    }

    .view-header {
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .view-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary, #0f172a);
    }
</style>
