"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, useStore } from './store';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { users, loading: storeLoading } = useStore();

    useEffect(() => {
        // Check for persisted session
        const storedUser = localStorage.getItem('alicuotas_session');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        // This relies on the store being loaded. In a real app we'd query an API.
        // For this simulation, we'll wait a tick if store is loading, or just check 'users'
        // If users is empty (store loading), we might fail.
        // However, 'useStore' initializes from localStorage synchronously-ish in useEffect.
        // We'll trust 'users' is populated or wait.

        const foundUser = users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('alicuotas_session', JSON.stringify(foundUser));

            // Redirect based on role
            if (foundUser.role === 'superadmin') router.push('/superadmin');
            else if (foundUser.role === 'admin') router.push('/admin');
            else router.push('/resident');

            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('alicuotas_session');
        router.push('/');
    };

    return (
        <AuthContext.Provider value= {{ user, login, logout, isLoading: isLoading || storeLoading }
}>
    { children }
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
