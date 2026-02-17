'use client';

import { useAuth } from '@/lib/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function UserInfo() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-town-900/50 border border-town-700 rounded-lg">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-town-950" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-town-200">{user}</span>
                    <span className="text-xs text-gold-400">Eve</span>
                </div>
            </div>
            <button
                onClick={logout}
                className="ml-2 p-2 text-town-500 hover:text-rust-400 hover:bg-town-800/50 rounded-lg transition-colors"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
    );
}
