'use client';

import { useState } from 'react';
import { addTask } from '@/app/actions';
import { ClipboardList, Loader2, Plus } from 'lucide-react';

export default function TaskForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        await addTask(formData);
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
                    <Plus className="w-4 h-4" /> Create Task
                </button>
            ) : (
                <form action={handleSubmit} className="bg-town-900/40 backdrop-blur-sm p-4 rounded-xl border border-town-800 shadow-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-town-100 font-serif font-semibold flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-purple-500" />
                            Create Task
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
                            <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="e.g. Build road to oil rig"
                                className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-town-700"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Description (Optional)</label>
                            <textarea
                                name="description"
                                rows={2}
                                placeholder="Details about dimensions, materials needed, etc."
                                className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none placeholder:text-town-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center mt-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
