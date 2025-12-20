<script>
  import Header from "./components/Header.svelte";
  import BusinessInfo from "./components/BusinessInfo.svelte";
  import CustomerInfo from "./components/CustomerInfo.svelte";
  import EstimateDetails from "./components/EstimateDetails.svelte";
  import LineItems from "./components/LineItems.svelte";
  import Totals from "./components/Totals.svelte";
  import Notes from "./components/Notes.svelte";
  import Actions from "./components/Actions.svelte";
  import PreviewModal from "./components/PreviewModal.svelte";
  import QRModal from "./components/QRModal.svelte";
  import InvoiceView from "./components/InvoiceView.svelte";
  import HistoryModal from "./components/HistoryModal.svelte";
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
    historyState,
  } from "./lib/stores";

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
</script>

<div class="container" class:print-invoice-mode={$invoiceState.isOpen}>
  <Header />

  <main>
    <form id="estimateForm" on:submit|preventDefault>
      <BusinessInfo />
      <CustomerInfo />
      <EstimateDetails />
      <LineItems />
      <Totals />
      <Notes />
      <Actions />
    </form>
  </main>

  <PreviewModal />
  <QRModal />
  <div class="invoice-wrapper">
    <InvoiceView
      contentVisible={$invoiceState.isOpen}
      onClose={() => ($invoiceState.isOpen = false)}
    />
  </div>
  <HistoryModal
    contentVisible={$historyState.isOpen}
    onClose={() => ($historyState.isOpen = false)}
  />
</div>
