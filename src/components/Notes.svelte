<script>
    import { notes } from '../lib/stores';
</script>

<section class="card">
    <h2>Notes</h2>
    <div class="form-group">
        <label for="notes">Additional Notes / Terms</label>
        <textarea id="notes" rows="4" placeholder="Payment terms, warranty information, etc." bind:value={$notes}></textarea>
    </div>
</section>
