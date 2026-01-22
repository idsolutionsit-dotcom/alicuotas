import { useState, useEffect } from 'react';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'superadmin' | 'admin' | 'resident';

export interface Complex {
    id: string;
    name: string;
    address: string;
}

export interface User {
    id: string;
    username: string;
    password: string; // Plaintext for simulation
    name: string;
    role: UserRole;
    complexId?: string; // Null for superadmin
    houseNumber?: string; // Only for residents
}

export interface Payment {
    id: string;
    userId: string;
    complexId: string;
    residentName: string; // Snapshot at time of payment
    houseNumber: string; // Snapshot at time of payment
    amount: number;
    date: string;
    reference: string;
    status: PaymentStatus;
    notes?: string;
}

const STORAGE_KEY_PAYMENTS = 'alicuotas_payments';
const STORAGE_KEY_USERS = 'alicuotas_users';
const STORAGE_KEY_COMPLEXES = 'alicuotas_complexes';

const MOCK_COMPLEXES: Complex[] = [
    { id: 'c1', name: 'Conjunto Residencial Los Pinos', address: 'Av. Principal 123' },
    { id: 'c2', name: 'Edificio Torre Real', address: 'Calle 45 #10-20' },
];

const MOCK_USERS: User[] = [
    // Super Admin
    { id: 'u1', username: 'superadmin', password: '123', name: 'Super Admin', role: 'superadmin' },
    // Complex 1 Admin
    { id: 'u2', username: 'admin_pinos', password: '123', name: 'Admin Pinos', role: 'admin', complexId: 'c1' },
    // Complex 2 Admin
    { id: 'u3', username: 'admin_real', password: '123', name: 'Admin Real', role: 'admin', complexId: 'c2' },
    // Residents
    { id: 'u4', username: 'res_pinos_101', password: '123', name: 'Juan Pérez', role: 'resident', complexId: 'c1', houseNumber: '101' },
    { id: 'u5', username: 'res_real_5A', password: '123', name: 'Maria Gomez', role: 'resident', complexId: 'c2', houseNumber: '5A' },
];

const MOCK_PAYMENTS: Payment[] = [
    {
        id: '1',
        userId: 'u4',
        complexId: 'c1',
        residentName: 'Juan Pérez',
        houseNumber: '101',
        amount: 150.00,
        date: '2023-10-01',
        reference: 'REF-123456',
        status: 'approved',
    },
];

export function useStore() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [complexes, setComplexes] = useState<Complex[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedPayments = localStorage.getItem(STORAGE_KEY_PAYMENTS);
        const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
        const storedComplexes = localStorage.getItem(STORAGE_KEY_COMPLEXES);

        if (storedPayments) setPayments(JSON.parse(storedPayments));
        else {
            setPayments(MOCK_PAYMENTS);
            localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(MOCK_PAYMENTS));
        }

        if (storedUsers) setUsers(JSON.parse(storedUsers));
        else {
            setUsers(MOCK_USERS);
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS));
        }

        if (storedComplexes) setComplexes(JSON.parse(storedComplexes));
        else {
            setComplexes(MOCK_COMPLEXES);
            localStorage.setItem(STORAGE_KEY_COMPLEXES, JSON.stringify(MOCK_COMPLEXES));
        }

        setLoading(false);
    }, []);

    // --- Complex Management ---
    const addComplex = (complex: Omit<Complex, 'id'>) => {
        const newComplex = { ...complex, id: crypto.randomUUID() };
        const updated = [...complexes, newComplex];
        setComplexes(updated);
        localStorage.setItem(STORAGE_KEY_COMPLEXES, JSON.stringify(updated));
        return newComplex;
    };

    // --- User Management ---
    const addUser = (user: Omit<User, 'id'>) => {
        const newUser = { ...user, id: crypto.randomUUID() };
        const updated = [...users, newUser];
        setUsers(updated);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));
        return newUser;
    };

    // --- Payment Management ---
    const addPayment = (payment: Omit<Payment, 'id' | 'status'>) => {
        const newPayment: Payment = {
            ...payment,
            id: crypto.randomUUID(),
            status: 'pending',
        };
        const updated = [newPayment, ...payments];
        setPayments(updated);
        localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(updated));
    };

    const updatePaymentStatus = (id: string, status: PaymentStatus) => {
        const updated = payments.map(p =>
            p.id === id ? { ...p, status } : p
        );
        setPayments(updated);
        localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(updated));
    };

    const getComplexUsers = (complexId: string) => users.filter(u => u.complexId === complexId);

    return {
        // Data
        payments,
        users,
        complexes,
        loading,
        // Actions
        addComplex,
        addUser,
        addPayment,
        updatePaymentStatus,
        getComplexUsers,
    };
}
