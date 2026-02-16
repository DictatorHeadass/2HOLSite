'use client';

import { Coordinate } from '@/types';
import { deleteCoord } from '@/app/actions';
import { Trash2, Navigation } from 'lucide-react';

interface CoordListProps {
    coords: Coordinate[];
}

export default function CoordList({ coords }: CoordListProps) {

    const getDistance = (x: number, y: number) => {
        return Math.round(Math.sqrt(x * x + y * y));
    };

    return (
        <div className="space-y-4">
            {coords.length === 0 && (
                <div className="text-center text-town-600 py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-town-900/50 rounded-full flex items-center justify-center mb-3">
                        <Navigation className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No locations mapped</p>
                    <p className="text-xs opacity-50 mt-1 max-w-[200px]">Add resource locations to help the town thrive.</p>
                </div>
            )}

            {coords.map((coord) => (
                <div key={coord.id} className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 shadow-sm relative group hover:border-town-700 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-serif font-semibold text-town-200 text-base">{coord.type}</h4>
                            <div className="flex items-center text-xs text-town-500 gap-1 mt-1 font-mono">
                                <Navigation className="w-3 h-3 text-gold-500/70" />
                                <span className="text-gold-200">{coord.x}, {coord.y}</span>
                                <span className="text-town-700 mx-1">|</span>
                                <span>{getDistance(coord.x, coord.y)}m away</span>
                            </div>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${coord.status === 'Active' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' :
                                coord.status === 'Depleted' ? 'bg-red-950/40 text-red-400 border-red-900/50' :
                                    coord.status === 'Road Built' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' :
                                        'bg-gold-950/40 text-gold-400 border-gold-900/50' // Needs Engine
                            }`}>
                            {coord.status}
                        </span>
                    </div>

                    {coord.notes && (
                        <div className="bg-town-950/30 rounded-lg p-2.5 mb-3 border border-town-800/30">
                            <p className="text-xs text-town-400 italic">
                                "{coord.notes}"
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 border-t border-town-800/30">
                        <button
                            onClick={() => deleteCoord(coord.id)}
                            className="text-town-600 hover:text-rust-500 text-xs flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-town-950/50"
                        >
                            <Trash2 className="w-3 h-3" /> <span className="font-medium">Remove</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
