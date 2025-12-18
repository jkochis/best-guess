<script>
    import { businessInfo } from '../lib/stores';
</script>

<section class="card">
    <h2>Business Information</h2>
    <div class="form-group">
        <label for="businessName">Business Name</label>
        <input type="text" id="businessName" bind:value={$businessInfo.name} required>
    </div>
    <div class="form-group">
        <label for="businessEmail">Email</label>
        <input type="email" id="businessEmail" bind:value={$businessInfo.email} required>
    </div>
    <div class="form-group">
        <label for="businessPhone">Phone</label>
        <input type="tel" id="businessPhone" bind:value={$businessInfo.phone} required>
    </div>
    <div class="form-group">
        <label for="businessAddress">Address</label>
        <textarea id="businessAddress" rows="2" bind:value={$businessInfo.address}></textarea>
    </div>
</section>
