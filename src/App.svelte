<script>
  import Header from './components/Header.svelte';
  import BusinessInfo from './components/BusinessInfo.svelte';
  import CustomerInfo from './components/CustomerInfo.svelte';
  import EstimateDetails from './components/EstimateDetails.svelte';
  import LineItems from './components/LineItems.svelte';
  import Totals from './components/Totals.svelte';
  import Notes from './components/Notes.svelte';
  import Actions from './components/Actions.svelte';
  import PreviewModal from './components/PreviewModal.svelte';
</script>

<div class="container">
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
</div>
