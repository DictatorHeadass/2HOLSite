import { Coordinate } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CoordMapProps {
    coords: Coordinate[];
}

export default function CoordMap({ coords }: CoordMapProps) {
    const [hoveredCoord, setHoveredCoord] = useState<Coordinate | null>(null);

    // Map configuration
    const MAP_SIZE = 1000; // Map represents -500 to +500
    const OFFSET = 500;    // Offset to shift 0,0 to center (500,500)

    // Helper to percentages
    const toPercent = (val: number, isY: boolean = false) => {
        // Clamp values to -500 to 500
        const clamped = Math.max(-500, Math.min(500, val));
        // Shift range to 0-1000
        const shifted = clamped + OFFSET;
        // Invert Y axis because CSS top=0 is top, but cartesian y=500 is top
        const finalObj = isY ? (MAP_SIZE - shifted) : shifted;
        return (finalObj / MAP_SIZE) * 100;
    };

    return (
        <div className="w-full aspect-square max-w-[600px] mx-auto bg-town-950 border border-town-800 rounded-xl relative overflow-hidden shadow-inner group">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
                <div className="border-r border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-r border-b border-town-700"></div>
                <div className="border-b border-town-700"></div>
                <div className="border-r border-town-700"></div>
                <div className="border-r border-town-700"></div>
                <div className="border-r border-town-700"></div>
                <div></div>
            </div>

            {/* Center Axes */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-town-600/50 pointer-events-none" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-town-600/50 pointer-events-none" />

            {/* Town Center Marker */}
            <div
                className="absolute w-4 h-4 bg-gold-500 rounded-full border-2 border-town-900 shadow-gold-500/50 shadow-lg z-10 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '50%' }}
                title="Town Center (0,0)"
            >
                <div className="w-1 h-1 bg-town-900 rounded-full" />
            </div>

            {/* Points */}
            {coords.map(coord => (
                <div
                    key={coord.id}
                    className={cn(
                        "absolute w-2 h-2 rounded-full border border-town-900 shadow-sm cursor-pointer transition-transform hover:scale-150 transform -translate-x-1/2 -translate-y-1/2",
                        coord.status === 'Depleted' ? "bg-red-500/50 border-red-900/50" : "bg-emerald-400 border-emerald-900 hover:bg-emerald-300"
                    )}
                    style={{
                        left: `${toPercent(coord.x)}%`,
                        top: `${toPercent(coord.y, true)}%`
                    }}
                    onMouseEnter={() => setHoveredCoord(coord)}
                    onMouseLeave={() => setHoveredCoord(null)}
                />
            ))}

            {/* Tooltip */}
            {hoveredCoord && (
                <div className="absolute bottom-4 left-4 right-4 bg-town-900/90 backdrop-blur-md border border-town-700 p-3 rounded-lg shadow-xl z-20 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="text-sm font-bold text-town-100">{hoveredCoord.type}</div>
                            <div className="text-xs text-town-400 font-mono">
                                ({hoveredCoord.x}, {hoveredCoord.y})
                            </div>
                            {hoveredCoord.notes && (
                                <div className="text-xs text-town-500 mt-1 italic">{hoveredCoord.notes}</div>
                            )}
                        </div>
                        <div className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            hoveredCoord.status === 'Active' ? "bg-emerald-950 text-emerald-500" :
                                hoveredCoord.status === 'Depleted' ? "bg-red-950 text-red-500" :
                                    "bg-town-800 text-town-400"
                        )}>
                            {hoveredCoord.status}
                        </div>
                    </div>
                </div>
            )}

            {/* Legend / Info */}
            <div className="absolute top-2 right-2 flex gap-2">
                <div className="bg-town-950/80 backdrop-blur px-2 py-1 rounded border border-town-800 text-[10px] text-town-400">
                    Map Range: ±500
                </div>
            </div>
        </div>
    );
}
