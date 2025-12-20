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

export const savedBusinessProfiles = createPersistentStore('savedBusinessProfiles', []);

// Customer Info (Now persisted)
export const customerInfo = createPersistentStore('customerInfo', {
    name: '',
    email: '',
    phone: '',
    address: ''
});

export const savedCustomerProfiles = createPersistentStore('savedCustomerProfiles', []);

// Estimate Details
export const estimateDetails = createPersistentStore('estimateDetails', {
    number: 'EST-001',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

// Line Items
// Item structure: { id, description, quantity, rate, amount }
export const lineItems = createPersistentStore('lineItems', [
    { id: 0, description: '', quantity: 1, rate: 0, amount: 0 }
]);

export const taxRate = createPersistentStore('taxRate', 0);

// Derived Totals
export const totals = derived(
    [lineItems, taxRate],
    ([$lineItems, $taxRate]) => {
        const calculateSubtotal = (items) => {
            return items.reduce((sum, item) => {
                if (item.type === 'group' && item.items) {
                    return sum + calculateSubtotal(item.items);
                }
                return sum + (item.amount || 0);
            }, 0);
        };

        const subtotal = calculateSubtotal($lineItems);
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
export const notes = createPersistentStore('notes', '');

// PDF Preview Store
export const previewState = writable({
    isOpen: false,
    pdfUrl: null
});

// Link/QR Sharing Store
export const qrState = writable({
    isOpen: false,
    url: ''
});
