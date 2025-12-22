<script>
  import Navigation from "./components/Navigation.svelte";
  import EstimateForm from "./components/EstimateForm.svelte";
  import SavedEstimatesView from "./components/SavedEstimatesView.svelte";
  import SavedInvoicesView from "./components/SavedInvoicesView.svelte";
  import ProfilesView from "./components/ProfilesView.svelte";
  import SyncView from "./components/SyncView.svelte";
  import HelpView from "./components/HelpView.svelte";

  import PreviewModal from "./components/PreviewModal.svelte";
  import QRModal from "./components/QRModal.svelte";
  import InvoiceView from "./components/InvoiceView.svelte";

  import { onMount } from "svelte";
  import { loadFromUrl } from "./lib/share";
  import {
    businessInfo,
    customerInfo,
    estimateDetails,
    lineItems,
    notes,
    taxRate,
    invoiceState,
  } from "./lib/stores";

  // State for current view
  let currentView = "new-estimate";

  function handleNavigate(viewId) {
    currentView = viewId;
  }

  onMount(() => {
    const data = loadFromUrl();
    if (data) {
      if (data.business) $businessInfo = data.business;
      if (data.customer) $customerInfo = data.customer;
      if (data.estimate) $estimateDetails = data.estimate;
      if (data.lineItems) $lineItems = data.lineItems;
      if (data.notes) $notes = data.notes;
      if (data.totals && data.totals.taxRate) $taxRate = data.totals.taxRate;
    }
  });

  // Automatically switch back to invoice view handling if needed?
  // Invoice view is an overlay, so it can exist on top of any view, but usually trigged from creating a new one.
</script>

<div class="app-layout" class:print-invoice-mode={$invoiceState.isOpen}>
  <aside class="sidebar-area">
    <Navigation activeView={currentView} onNavigate={handleNavigate} />
  </aside>

  <main class="main-content">
    {#if currentView === "new-estimate"}
      <EstimateForm />
    {:else if currentView === "saved-estimates"}
      <SavedEstimatesView onNavigate={handleNavigate} />
    {:else if currentView === "saved-invoices"}
      <SavedInvoicesView onNavigate={handleNavigate} />
    {:else if currentView === "profiles"}
      <ProfilesView />
    {:else if currentView === "sync"}
      <SyncView />
    {:else if currentView === "help"}
      <HelpView />
    {/if}
  </main>

  <!-- Modals / Overlays -->
  <PreviewModal />
  <QRModal />

  <div class="invoice-wrapper">
    <InvoiceView
      contentVisible={$invoiceState.isOpen}
      onClose={() => ($invoiceState.isOpen = false)}
    />
  </div>
</div>
