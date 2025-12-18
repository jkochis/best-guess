<script>
    import { customerInfo } from '../lib/stores';
</script>

<section class="card">
    <h2>Customer Information</h2>
    <div class="form-group">
        <label for="customerName">Customer Name</label>
        <input type="text" id="customerName" bind:value={$customerInfo.name} required>
    </div>
    <div class="form-group">
        <label for="customerEmail">Customer Email</label>
        <input type="email" id="customerEmail" bind:value={$customerInfo.email} required>
    </div>
    <div class="form-group">
        <label for="customerPhone">Customer Phone</label>
        <input type="tel" id="customerPhone" bind:value={$customerInfo.phone}>
    </div>
    <div class="form-group">
        <label for="projectAddress">Project Address</label>
        <textarea id="projectAddress" rows="2" bind:value={$customerInfo.address} required></textarea>
    </div>
</section>
