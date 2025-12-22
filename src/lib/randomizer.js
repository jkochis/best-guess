import {
    businessInfo,
    customerInfo,
    lineItems,
    taxRate,
    notes
} from "./stores";

const BUSINESS_NAMES = [
    "Acme Corp", "Globex Corporation", "Soylent Corp", "Initech", "Umbrella Corp",
    "Stark Industries", "Wayne Enterprises", "Cyberdyne Systems"
];

const CUSTOMER_NAMES = [
    "John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson", "Charlie Brown",
    "Diana Prince", "Bruce Wayne", "Tony Stark", "Peter Parker"
];

const ADDRESSES = [
    "123 Main St, Anytown, USA", "456 Elm St, Othertown, USA", "789 Oak Ave, Smallville, USA",
    "1000 Fifth Avenue, New York, NY", "1600 Pennsylvania Ave NW, Washington, DC"
];

const DESCRIPTIONS = [
    "Web Development", "UI/UX Design", "SEO Optimization", "Content Writing",
    "Mobile App Development", "Database Migration", "Cloud Hosting Setup",
    "Consulting Services", "Maintenance", "Support"
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function populateRandomData() {
    // Populate Business Info
    businessInfo.set({
        name: getRandom(BUSINESS_NAMES),
        email: `contact@${Math.random().toString(36).substring(7)}.com`,
        phone: `${getRandomInt(100, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
        address: getRandom(ADDRESSES)
    });

    // Populate Customer Info
    customerInfo.set({
        name: getRandom(CUSTOMER_NAMES),
        email: `customer@${Math.random().toString(36).substring(7)}.com`,
        phone: `${getRandomInt(100, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
        address: getRandom(ADDRESSES)
    });

    // Populate Tax Rate
    taxRate.set(getRandomInt(0, 15));

    // Populate Notes
    notes.set("These are some random notes generated for testing purposes. Payment is due within 30 days.");

    // Populate Line Items
    const items = [];
    const numItems = getRandomInt(3, 8);

    for (let i = 0; i < numItems; i++) {
        // Randomly decide if it's a simple item or a group (PERT often uses groups, but simple items test basic flow)
        // Let's mix standard items and PERT-style items if we had PERT logic handy, 
        // but for now we'll match the standard structure: description, quantity, rate.

        items.push({
            id: crypto.randomUUID(),
            description: getRandom(DESCRIPTIONS),
            quantity: getRandomInt(1, 10),
            rate: getRandomInt(50, 500),
            amount: 0 // Will be calculated or we can calc here: quantity * rate
        });

        // Let's calc amount to be safe, though stores/components might recalc
        items[items.length - 1].amount = items[items.length - 1].quantity * items[items.length - 1].rate;
    }

    lineItems.set(items);
}
