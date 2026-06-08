'use client';

import { Coordinate } from '@/types';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS, POI_CATEGORY_LIST, POICategory, getPOICategory } from '@/lib/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';

interface CoordMapProps {
    coords: Coordinate[];
}

const MIN_SCALE = 0.02;   // pixels per world unit (zoomed way out)
const MAX_SCALE = 8;      // zoomed way in

// Compass description from origin, e.g. "E 120 · N 45".
function describeDirection(x: number, y: number): string {
    if (x === 0 && y === 0) return 'Town Center';
    const ew = x === 0 ? '' : `${x > 0 ? 'E' : 'W'} ${Math.abs(x)}`;
    const ns = y === 0 ? '' : `${y > 0 ? 'N' : 'S'} ${Math.abs(y)}`;
    return [ew, ns].filter(Boolean).join(' · ');
}

function distanceFromCenter(x: number, y: number): number {
    return Math.round(Math.sqrt(x * x + y * y));
}

// Choose a "nice" grid step (1, 2, 5 × 10ⁿ) so a cell is ~100px on screen.
function niceStep(scale: number): number {
    const target = 100 / scale; // world units per ~100px
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    const norm = target / pow;
    const mult = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
    return mult * pow;
}

export default function CoordMap({ coords }: CoordMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    // View state: which world coordinate sits at viewport center, and zoom.
    const [center, setCenter] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [hiddenCats, setHiddenCats] = useState<Set<POICategory>>(new Set());

    const dragRef = useRef<{ startX: number; startY: number; cx: number; cy: number; moved: boolean } | null>(null);
    const didAutoFit = useRef(false);

    const visibleCoords = coords.filter(c => !hiddenCats.has(getPOICategory(c.type)));

    // Fit all points (plus origin) into view with padding.
    const fitToCoords = useCallback(() => {
        const { w, h } = size;
        if (!w || !h) return;
        const xs = [0, ...coords.map(c => c.x)];
        const ys = [0, ...coords.map(c => c.y)];
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const spanX = Math.max(maxX - minX, 100);
        const spanY = Math.max(maxY - minY, 100);
        const fit = Math.min(w / (spanX * 1.3), h / (spanY * 1.3));
        setCenter({ x: cx, y: cy });
        setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, fit)));
    }, [coords, size]);

    // Measure the container and keep it in sync on resize.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            setSize({ w: el.clientWidth, h: el.clientHeight });
        });
        ro.observe(el);
        setSize({ w: el.clientWidth, h: el.clientHeight });
        return () => ro.disconnect();
    }, []);

    // Auto-fit once we have a real size.
    useEffect(() => {
        if (!didAutoFit.current && size.w > 0) {
            didAutoFit.current = true;
            fitToCoords();
        }
    }, [size, fitToCoords]);

    const worldToScreen = useCallback((wx: number, wy: number) => ({
        x: size.w / 2 + (wx - center.x) * scale,
        y: size.h / 2 - (wy - center.y) * scale, // invert Y so north is up
    }), [size, center, scale]);

    // --- Pan ---
    const onPointerDown = (e: React.PointerEvent) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        dragRef.current = { startX: e.clientX, startY: e.clientY, cx: center.x, cy: center.y, moved: false };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        const d = dragRef.current;
        if (!d) return;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
        setCenter({ x: d.cx - dx / scale, y: d.cy + dy / scale });
    };
    const onPointerUp = () => {
        const d = dragRef.current;
        dragRef.current = null;
        if (d && !d.moved) setSelectedId(null); // background click clears selection
    };

    // --- Zoom to cursor ---
    const onWheel = (e: React.WheelEvent) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const wx = center.x + (px - size.w / 2) / scale;
        const wy = center.y - (py - size.h / 2) / scale;
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor));
        setScale(newScale);
        setCenter({
            x: wx - (px - size.w / 2) / newScale,
            y: wy + (py - size.h / 2) / newScale,
        });
    };

    const zoomButton = (factor: number) => {
        setScale(s => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s * factor)));
    };

    const toggleCat = (cat: POICategory) => {
        setHiddenCats(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat); else next.add(cat);
            return next;
        });
    };

    // Build grid lines within the current viewport.
    const step = niceStep(scale);
    const gridLines: { vertical: boolean; pos: number; label: number }[] = [];
    if (size.w && size.h) {
        const leftWorld = center.x - (size.w / 2) / scale;
        const rightWorld = center.x + (size.w / 2) / scale;
        const topWorld = center.y + (size.h / 2) / scale;
        const botWorld = center.y - (size.h / 2) / scale;
        for (let x = Math.ceil(leftWorld / step) * step; x <= rightWorld; x += step) {
            gridLines.push({ vertical: true, pos: worldToScreen(x, 0).x, label: Math.round(x) });
        }
        for (let y = Math.floor(topWorld / step) * step; y >= botWorld; y -= step) {
            gridLines.push({ vertical: false, pos: worldToScreen(0, y).y, label: Math.round(y) });
        }
    }

    const origin = worldToScreen(0, 0);
    const activeCoord = coords.find(c => c.id === (hoveredId ?? selectedId)) ?? null;

    return (
        <div className="w-full max-w-[600px] mx-auto">
            {/* Category filter chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
                {POI_CATEGORY_LIST.map(cat => {
                    const off = hiddenCats.has(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => toggleCat(cat)}
                            className={cn(
                                'flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all',
                                off
                                    ? 'border-town-800 text-town-600 bg-town-950/30'
                                    : 'border-town-700 text-town-300 bg-town-900/50'
                            )}
                        >
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: off ? '#463b32' : CATEGORY_COLORS[cat] }}
                            />
                            {cat === 'Critical Resources' ? 'Resources' : cat}
                        </button>
                    );
                })}
            </div>

            <div
                ref={containerRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onWheel={onWheel}
                className="w-full aspect-square bg-town-950 border border-town-800 rounded-xl relative overflow-hidden shadow-inner touch-none cursor-grab active:cursor-grabbing select-none"
            >
                {/* Grid lines + labels */}
                {gridLines.map((g, i) => g.vertical ? (
                    <div key={`v${i}`} className="absolute top-0 h-full pointer-events-none" style={{ left: g.pos }}>
                        <div className={cn('h-full w-px', g.label === 0 ? 'bg-town-600/60' : 'bg-town-800/40')} />
                        <span className="absolute top-1 left-1 text-[9px] font-mono text-town-600">{g.label}</span>
                    </div>
                ) : (
                    <div key={`h${i}`} className="absolute left-0 w-full pointer-events-none" style={{ top: g.pos }}>
                        <div className={cn('w-full h-px', g.label === 0 ? 'bg-town-600/60' : 'bg-town-800/40')} />
                        <span className="absolute left-1 top-0.5 text-[9px] font-mono text-town-600">{g.label}</span>
                    </div>
                ))}

                {/* Town center (0,0) */}
                {origin.x > -20 && origin.x < size.w + 20 && origin.y > -20 && origin.y < size.h + 20 && (
                    <div
                        className="absolute w-4 h-4 bg-gold-500 rounded-full border-2 border-town-900 shadow-gold-500/50 shadow-lg z-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ left: origin.x, top: origin.y }}
                    >
                        <div className="w-1 h-1 bg-town-900 rounded-full" />
                    </div>
                )}

                {/* Points */}
                {visibleCoords.map(coord => {
                    const p = worldToScreen(coord.x, coord.y);
                    if (p.x < -10 || p.x > size.w + 10 || p.y < -10 || p.y > size.h + 10) return null;
                    const color = CATEGORY_COLORS[getPOICategory(coord.type)];
                    const depleted = coord.status === 'Depleted';
                    const selected = coord.id === selectedId;
                    return (
                        <button
                            key={coord.id}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); setSelectedId(coord.id); }}
                            onMouseEnter={() => setHoveredId(coord.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={cn(
                                'absolute rounded-full border z-20 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150',
                                selected ? 'w-3.5 h-3.5 ring-2 ring-white/70 scale-125' : 'w-2.5 h-2.5',
                                depleted && 'opacity-40'
                            )}
                            style={{
                                left: p.x,
                                top: p.y,
                                backgroundColor: color,
                                borderColor: 'rgba(26,24,22,0.9)',
                            }}
                            title={`${coord.type} (${coord.x}, ${coord.y})`}
                        />
                    );
                })}

                {/* Zoom + reset controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-30">
                    <button onClick={() => zoomButton(1.4)} className="w-8 h-8 bg-town-900/80 backdrop-blur border border-town-700 rounded-lg flex items-center justify-center text-town-300 hover:text-gold-400 hover:border-gold-600/50 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={() => zoomButton(1 / 1.4)} className="w-8 h-8 bg-town-900/80 backdrop-blur border border-town-700 rounded-lg flex items-center justify-center text-town-300 hover:text-gold-400 hover:border-gold-600/50 transition-colors">
                        <Minus className="w-4 h-4" />
                    </button>
                    <button onClick={fitToCoords} title="Fit all locations" className="w-8 h-8 bg-town-900/80 backdrop-blur border border-town-700 rounded-lg flex items-center justify-center text-town-300 hover:text-gold-400 hover:border-gold-600/50 transition-colors">
                        <Crosshair className="w-4 h-4" />
                    </button>
                </div>

                {/* Scale readout */}
                <div className="absolute top-2 left-2 bg-town-950/80 backdrop-blur px-2 py-1 rounded border border-town-800 text-[10px] text-town-400 font-mono pointer-events-none">
                    grid: {step} tiles
                </div>

                {/* Detail panel for hovered/selected point */}
                {activeCoord && (
                    <div className="absolute bottom-2 left-2 right-2 bg-town-900/90 backdrop-blur-md border border-town-700 p-3 rounded-lg shadow-xl z-30 pointer-events-none">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[getPOICategory(activeCoord.type)] }} />
                                    <span className="text-sm font-bold text-town-100">{activeCoord.type}</span>
                                </div>
                                <div className="text-xs text-town-400 font-mono mt-1">
                                    ({activeCoord.x}, {activeCoord.y}) · {distanceFromCenter(activeCoord.x, activeCoord.y)}m
                                </div>
                                <div className="text-xs text-gold-300/90 font-mono mt-0.5">
                                    From center: {describeDirection(activeCoord.x, activeCoord.y)}
                                </div>
                                {activeCoord.notes && (
                                    <div className="text-xs text-town-500 mt-1 italic">{activeCoord.notes}</div>
                                )}
                            </div>
                            <div className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0',
                                activeCoord.status === 'Active' ? 'bg-emerald-950 text-emerald-500' :
                                    activeCoord.status === 'Depleted' ? 'bg-red-950 text-red-500' :
                                        'bg-town-800 text-town-400'
                            )}>
                                {activeCoord.status}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-[10px] text-town-600 text-center mt-1.5 font-mono">
                drag to pan · scroll to zoom · click a point for details
            </p>
        </div>
    );
}
