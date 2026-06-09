import { POIType } from "@/types";

export const POI_TYPES: POIType[] = [
    // Critical Resources
    'Ore Vein', 'Tarry Spot', 'Rich Ore Vein', 'Natural Spring', 'Pond', 'Gold Deposit', 'Silver Deposit',
    // Food - Wild Plants
    'Dead Animal', 'Wild Crops', 'Apple Tree', 'Orange Tree', 'Lemon Tree', 'Barrel Cactus', 'Coconut Tree',
    // Structures
    'Bell Tower', 'Newcomen Pump', 'Farm', 'Kitchen', 'Deep Well', 'Animal Pen', 'Stable', 'Smithy/Forge',
    // Other
    'Other'
];

export const POI_CATEGORIES = {
    'Critical Resources': ['Ore Vein', 'Tarry Spot', 'Rich Ore Vein', 'Natural Spring', 'Pond', 'Gold Deposit', 'Silver Deposit'],
    'Food': ['Dead Animal', 'Wild Crops', 'Apple Tree', 'Orange Tree', 'Lemon Tree', 'Barrel Cactus', 'Coconut Tree'],
    'Structures': ['Bell Tower', 'Newcomen Pump', 'Farm', 'Kitchen', 'Deep Well', 'Animal Pen', 'Stable', 'Smithy/Forge']
};

export type POICategory = 'Critical Resources' | 'Food' | 'Structures' | 'Other';

export const POI_CATEGORY_LIST: POICategory[] = ['Critical Resources', 'Food', 'Structures', 'Other'];

// Resolve any POI type to its category.
export function getPOICategory(type: POIType): POICategory {
    for (const [category, types] of Object.entries(POI_CATEGORIES)) {
        if ((types as string[]).includes(type)) return category as POICategory;
    }
    return 'Other';
}

// Marker colors per category (hex so they work in inline styles / SVG, no Tailwind safelist needed).
export const CATEGORY_COLORS: Record<POICategory, string> = {
    'Critical Resources': '#22d3ee', // cyan
    'Food': '#34d399',               // emerald
    'Structures': '#fbbf24',         // gold
    'Other': '#d4c5a9',              // parchment
};

// === Wall of Fame donation tiers ===
// Ordered high → low so getDonationTier() can return the first match.
// Edit thresholds/colors here — the UI reads everything from this list.
export interface DonationTier {
    key: 'diamond' | 'gold' | 'silver' | 'bronze';
    name: string;
    min: number;        // inclusive lower bound (coins)
    max: number | null; // inclusive upper bound, null = no cap
    color: string;      // hex for inline styles (no Tailwind safelist needed)
    glow: string;       // rgba for card shadow
    blurb: string;      // shown under the tier header
}

export const DONATION_TIERS: DonationTier[] = [
    { key: 'diamond', name: 'Diamond Patrons', min: 1000, max: null, color: '#22d3ee', glow: 'rgba(34,211,238,0.35)', blurb: '1000+ coins — a building raised in their honor' },
    { key: 'gold', name: 'Gold Benefactors', min: 500, max: 999, color: '#fbbf24', glow: 'rgba(251,191,36,0.30)', blurb: '500 – 999 coins' },
    { key: 'silver', name: 'Silver Supporters', min: 100, max: 499, color: '#cbd5e1', glow: 'rgba(203,213,225,0.25)', blurb: '100 – 499 coins' },
    { key: 'bronze', name: 'Bronze Friends', min: 1, max: 99, color: '#d98c54', glow: 'rgba(217,140,84,0.25)', blurb: '1 – 99 coins' },
];

// Resolve a coin total to its tier (tiers are descending by `min`).
export function getDonationTier(coins: number): DonationTier {
    return DONATION_TIERS.find(t => coins >= t.min) ?? DONATION_TIERS[DONATION_TIERS.length - 1];
}
