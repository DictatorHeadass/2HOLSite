'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LogIn, X } from 'lucide-react';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username);
        if (success) {
            setIsOpen(false);
            setUsername('');
            setError('');
        } else {
            setError('Invalid username. Only Eves can access admin features.');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-town-950 rounded-lg font-medium transition-colors"
            >
                <LogIn className="w-4 h-4" />
                <span>Eve Login</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-town-900 border border-town-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif font-bold text-gold-400">Eve Login</h2>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setError('');
                            setUsername('');
                        }}
                        className="text-town-500 hover:text-town-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-town-300 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-town-950 border border-town-700 rounded-lg text-town-200 placeholder-town-600 focus:outline-none focus:border-gold-500 transition-colors"
                            placeholder="Enter your Eve username"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-rust-400 text-sm bg-rust-950/30 border border-rust-900/50 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 bg-gold-600 hover:bg-gold-500 text-town-950 rounded-lg font-medium transition-colors"
                    >
                        Login
                    </button>
                </form>

                <p className="text-xs text-town-600 mt-4 text-center">
                    Only authorized Eves can access admin features
                </p>
            </div>
        </div>
    );
}
