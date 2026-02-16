import { POIType } from "@/types";

export const POI_TYPES: POIType[] = [
    // Critical Resources
    'Iron Vein', 'Tarry Spot', 'Oil Rig', 'Natural Spring', 'Pond', 'Clay Deposit',
    // Food - Wild Plants
    'Wild Gooseberry Bush', 'Wild Carrot', 'Burdock', 'Wild Grape', 'Banana Tree',
    'Wild Mango Tree', 'Barrel Cactus', 'Coconut Tree', 'Wild Potato', 'Wild Cabbage',
    // Animals
    'Rabbit', 'Mouflon', 'Bison', 'Wild Sheep', 'Wild Turkey', 'Snake', 'Wolf', 'Bear', 'Polar Bear',
    // Structures
    'Bell Tower', 'Newcomen Pump', 'Diesel Water Pump', 'Fractional Distiller', 'Deep Well', 'Sheep Pen', 'Smithy/Forge',
    // Other
    'Other'
];

export const POI_CATEGORIES = {
    'Critical Resources': ['Iron Vein', 'Tarry Spot', 'Oil Rig', 'Natural Spring', 'Pond', 'Clay Deposit'],
    'Food': ['Wild Gooseberry Bush', 'Wild Carrot', 'Burdock', 'Wild Grape', 'Banana Tree', 'Wild Mango Tree', 'Barrel Cactus', 'Coconut Tree', 'Wild Potato', 'Wild Cabbage'],
    'Animals': ['Rabbit', 'Mouflon', 'Bison', 'Wild Sheep', 'Wild Turkey', 'Snake', 'Wolf', 'Bear', 'Polar Bear'],
    'Structures': ['Bell Tower', 'Newcomen Pump', 'Diesel Water Pump', 'Fractional Distiller', 'Deep Well', 'Sheep Pen', 'Smithy/Forge']
};
