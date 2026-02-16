'use client';

import { useState } from 'react';
import { addCoord } from '@/app/actions';
import { POI_CATEGORIES } from '@/lib/constants';
import { MapPin, Loader2, Plus } from 'lucide-react';


export default function CoordForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        await addCoord(formData);
        setIsSubmitting(false);
        setIsExpanded(false);
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) form.reset();
    }

    return (
        <div className="mb-6">
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full bg-town-900/50 hover:bg-town-800/50 border border-town-800/50 dashed border-2 text-town-400 p-3 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Location
                </button>
            ) : (
                <form action={handleSubmit} className="bg-town-900/40 backdrop-blur-sm p-4 rounded-xl border border-town-800 shadow-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-town-100 font-serif font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold-500" />
                            New Location
                        </h3>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="text-town-500 hover:text-town-300 text-xs"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">POI Type</label>
                            <select
                                name="type"
                                required
                                className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all appearance-none"
                            >
                                <option value="" className="bg-town-900">Select Type...</option>
                                {Object.entries(POI_CATEGORIES).map(([category, types]) => (
                                    <optgroup key={category} label={category} className="bg-town-900 text-town-400">
                                        {types.map(type => (
                                            <option key={type} value={type} className="text-town-200">{type}</option>
                                        ))}
                                    </optgroup>
                                ))}
                                <option value="Other" className="bg-town-900">Other</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">X Coord</label>
                                <input
                                    type="number"
                                    name="x"
                                    required
                                    placeholder="0"
                                    className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all placeholder:text-town-700 font-mono"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Y Coord</label>
                                <input
                                    type="number"
                                    name="y"
                                    required
                                    placeholder="0"
                                    className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all placeholder:text-town-700 font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-2 font-bold">Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Active', 'Depleted', 'Road Built', 'Needs Engine'].map((status) => (
                                    <label key={status} className="group relative flex items-center justify-center gap-2 cursor-pointer">
                                        <input type="radio" name="status" value={status} defaultChecked={status === 'Active'} className="peer sr-only" />
                                        <div className="w-full text-center py-2 rounded-md border border-town-800 bg-town-950/30 text-xs text-town-400 peer-checked:bg-gold-500/10 peer-checked:border-gold-500/30 peer-checked:text-gold-400 transition-all">
                                            {status}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Notes</label>
                            <input
                                type="text"
                                name="notes"
                                placeholder="e.g. Near big rock"
                                className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all placeholder:text-town-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-town-950 font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-gold-400 transition-all flex justify-center items-center mt-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Location'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
