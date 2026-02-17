'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createIssue } from '@/app/actions';
import { IssueSeverity } from '@/types';
import { X, AlertTriangle } from 'lucide-react';

interface IssueFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function IssueForm({ onClose, onSuccess }: IssueFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<IssueSeverity>('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            await createIssue(title, description, severity);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create issue:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-town-900 border border-town-700 rounded-xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rust-400" />
                        <h2 className="text-xl font-serif font-bold text-rust-400">New Issue</h2>
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
                        <label htmlFor="title" className="block text-sm font-medium text-town-300 mb-2">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-town-950 border border-town-700 rounded-lg text-town-200 placeholder-town-600 focus:outline-none focus:border-rust-500 transition-colors"
                            placeholder="Brief description of the issue"
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
                            className="w-full px-4 py-2 bg-town-950 border border-town-700 rounded-lg text-town-200 placeholder-town-600 focus:outline-none focus:border-rust-500 transition-colors resize-none"
                            placeholder="Additional details..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label htmlFor="severity" className="block text-sm font-medium text-town-300 mb-2">
                            Severity
                        </label>
                        <select
                            id="severity"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                            className="w-full px-4 py-2 bg-town-950 border border-town-700 rounded-lg text-town-200 focus:outline-none focus:border-rust-500 transition-colors"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
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
                            disabled={isSubmitting || !title.trim()}
                            className="flex-1 py-2 bg-rust-600 hover:bg-rust-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
}
