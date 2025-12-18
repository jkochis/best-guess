import { writable, derived } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

// Helper for localStorage persistence
function createPersistentStore(key, startValue) {
    const initialValue = isBrowser && localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : startValue;

    const store = writable(initialValue);

    if (isBrowser) {
        store.subscribe(value => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    return store;
}

// Business Info (Persisted)
export const businessInfo = createPersistentStore('businessInfo', {
    name: '',
    email: '',
    phone: '',
    address: ''
});

// Customer Info (Not persisted between reloads usually, but we can if we want. App did clear it.)
// Legacy app cleared it on "Clear Form".
export const customerInfo = writable({
    name: '',
    email: '',
    phone: '',
    address: ''
});

// Estimate Details
export const estimateDetails = writable({
    number: 'EST-001',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

// Line Items
// Item structure: { id, description, quantity, rate, amount }
export const lineItems = writable([
    { id: 0, description: '', quantity: 1, rate: 0, amount: 0 }
]);

export const taxRate = writable(0);

// Derived Totals
export const totals = derived(
    [lineItems, taxRate],
    ([$lineItems, $taxRate]) => {
        const subtotal = $lineItems.reduce((sum, item) => sum + item.amount, 0);
        const tax = subtotal * ($taxRate / 100);
        const total = subtotal + tax;
        return {
            subtotal,
            tax,
            total
        };
    }
);


// Notes
export const notes = writable('');

// PDF Preview Store
export const previewState = writable({
    isOpen: false,
    pdfUrl: null
});
