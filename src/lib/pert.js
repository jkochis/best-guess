/**
 * Calculate the Weighted Average Program Evaluation and Review Technique (PERT) estimate.
 * Formula: (Optimistic + 4 * Nominal + Pessimistic) / 6
 * 
 * @param {number} optimistic - The best case estimate
 * @param {number} nominal - The most likely estimate
 * @param {number} pessimistic - The worst case estimate
 * @returns {number} The weighted average
 */
export function calculatePertWeightedAverage(optimistic, nominal, pessimistic) {
    const o = Number(optimistic) || 0;
    const n = Number(nominal) || 0;
    const p = Number(pessimistic) || 0;

    // If only nominal is provided, treat it as a standard rate
    if (!o && !p && n) return n;

    // If all are zero, return 0
    if (!o && !n && !p) return 0;

    // Standard PERT formula
    // If any are missing, we should probably treat them as the Nominal value if Nominal exists, 
    // or 0. But for a valid PERT, usually you need all 3. 
    // For this app, let's fallback to available values to be safe.
    // Actually, let's implement the standard formula rigidly but being safe on NaNs.

    // Better fallback logic: 
    // If P or O are missing, default them to N? No, that might imply certainty.
    // Let's stick to strict formula but defaulting to 0 if undefined.

    return (o + (4 * n) + p) / 6;
}
