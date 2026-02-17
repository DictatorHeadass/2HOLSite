import { POIType } from "@/types";

export const POI_TYPES: POIType[] = [
    // Critical Resources
    'Ore Vein', 'Tarry Spot', 'Rich Ore Vein', 'Natural Spring', 'Pond', 'Gold Deposit',
    // Food - Wild Plants
    'Dead Animal', 'Wild Crops', 'Apple Tree', 'Orange Tree', 'Lemon Tree',
    'Wild Mango Tree', 'Barrel Cactus', 'Coconut Tree', 'Wild Potato', 'Wild Cabbage',
    // Structures
    'Bell Tower', 'Newcomen Pump', 'Farm', 'Kitchen', 'Deep Well', 'Animal Pen', 'Stable', 'Smithy/Forge',
    // Other
    'Other'
];

export const POI_CATEGORIES = {
    'Critical Resources': ['Ore Vein', 'Tarry Spot', 'Rich Ore Vein', 'Natural Spring', 'Pond', 'Gold Deposit'],
    'Food': ['Dead Animal', 'Wild Crops', 'Apple Tree', 'Orange Tree', 'Lemon Tree', 'Wild Mango Tree', 'Barrel Cactus', 'Coconut Tree', 'Wild Potato', 'Wild Cabbage'],
    'Structures': ['Bell Tower', 'Newcomen Pump', 'Farm', 'Kitchen', 'Deep Well', 'Animal Pen', 'Stable', 'Smithy/Forge']
};
