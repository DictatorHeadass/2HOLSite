'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: string | null;
    isEve: boolean;
    login: (username: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of authorized Eve usernames
const EVES = [
    'Dirk',
    'NotCyan',
    '952723',
    '664272',
    // Add more Eve usernames here as needed
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<string | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('townhall_user');
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);

    const login = (username: string): boolean => {
        const trimmedUsername = username.trim();
        if (EVES.includes(trimmedUsername)) {
            setUser(trimmedUsername);
            localStorage.setItem('townhall_user', trimmedUsername);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('townhall_user');
    };

    const isEve = user !== null && EVES.includes(user);

    return (
        <AuthContext.Provider value={{ user, isEve, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
