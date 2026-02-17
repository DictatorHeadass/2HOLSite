'use client';

import { useState } from 'react';
import { createProject } from '@/app/actions';
import { X, Hammer } from 'lucide-react';

interface ProjectFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProjectForm({ onClose, onSuccess }: ProjectFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await createProject(name, description);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-town-900 border border-town-700 rounded-xl p-6 max-w-lg w-full shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Hammer className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-serif font-bold text-emerald-400">New Project</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-town-500 hover:text-town-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-town-300 mb-2">
                            Project Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-town-950 border border-town-700 rounded-lg text-town-200 placeholder-town-600 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="e.g., Build Town Wall"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-town-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-town-950 border border-town-700 rounded-lg text-town-200 placeholder-town-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                            placeholder="Project details and goals..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 bg-town-800 hover:bg-town-700 text-town-300 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
