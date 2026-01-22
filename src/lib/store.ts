import { useState, useEffect } from 'react';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Payment {
    id: string;
    residentName: string;
    houseNumber: string;
    amount: number;
    date: string;
    reference: string;
    status: PaymentStatus;
    notes?: string;
}

const STORAGE_KEY = 'alicuotas_app_payments';

const MOCK_INITIAL_DATA: Payment[] = [
    {
        id: '1',
        residentName: 'Juan Pérez',
        houseNumber: 'A-101',
        amount: 150.00,
        date: '2023-10-01',
        reference: 'REF-123456',
        status: 'approved',
    },
    {
        id: '2',
        residentName: 'Juan Pérez',
        houseNumber: 'A-101',
        amount: 150.00,
        date: '2023-11-01',
        reference: 'REF-789012',
        status: 'pending',
    }
];

export function usePayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setPayments(JSON.parse(stored));
        } else {
            setPayments(MOCK_INITIAL_DATA);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_DATA));
        }
        setLoading(false);
    }, []);

    const addPayment = (payment: Omit<Payment, 'id' | 'status'>) => {
        const newPayment: Payment = {
            ...payment,
            id: crypto.randomUUID(),
            status: 'pending',
        };
        const updated = [newPayment, ...payments]; // Newest first
        setPayments(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const updateStatus = (id: string, status: PaymentStatus) => {
        const updated = payments.map(p =>
            p.id === id ? { ...p, status } : p
        );
        setPayments(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return { payments, addPayment, updateStatus, loading };
}
