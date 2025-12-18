<script>
    import { previewState } from '../lib/stores';

    function close() {
        if ($previewState.pdfUrl) {
            URL.revokeObjectURL($previewState.pdfUrl);
        }
        $previewState = { isOpen: false, pdfUrl: null };
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            close();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if $previewState.isOpen}
    <div class="modal-backdrop" on:click={close}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h2>PDF Preview</h2>
                <button class="btn-close" on:click={close}>×</button>
            </div>
            
            <div class="pdf-container">
                <iframe src={$previewState.pdfUrl} title="PDF Preview" width="100%" height="100%"></iframe>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" on:click={close}>Close</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .modal-content {
        background: white;
        width: 90%;
        max-width: 900px;
        height: 90vh;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .modal-header {
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
    }

    .btn-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        line-height: 1;
        padding: 0 8px;
    }
    
    .btn-close:hover {
        color: var(--danger-color);
    }

    .pdf-container {
        flex: 1;
        background: #525659; /* PDF viewer background color */
        padding: 0;
    }
    
    iframe {
        border: none;
        display: block;
    }

    .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
    }
</style>
