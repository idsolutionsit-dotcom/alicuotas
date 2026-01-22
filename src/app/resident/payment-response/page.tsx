"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Home, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

function PaymentResponseContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addPayment } = useStore();
    const { user } = useAuth();

    // Use refs to prevent double execution if strict mode is on
    const processingRef = useRef(false);

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        // Prevent double execution
        if (processingRef.current) return;

        const id = searchParams.get('id');
        const clientTransactionId = searchParams.get('clientTransactionId');

        if (!id || !clientTransactionId) {
            setStatus('error');
            setMessage('Parámetros de transacción faltantes.');
            return;
        }

        const verifyTransaction = async () => {
            processingRef.current = true;
            try {
                const response = await fetch("https://pay.payphonetodoesposible.com/api/button/V2/Confirm", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PAYPHONE_TOKEN}`
                    },
                    body: JSON.stringify({
                        id: parseInt(id),
                        clientTxId: clientTransactionId
                    })
                });

                const data = await response.json();

                if (data.statusCode === 3) { // 3 = Approved
                    setStatus('success');
                    setDetails(data);

                    // Add payment to store if user is loaded
                    if (user) {
                        // We are adding the payment here. In a real app, the backend would handle this via webhook or after this check.
                        // Since we are simulating, we trust the client-side check for now (as per instructions to use current architecture).
                        const amountInDollars = data.amount / 100; // Amount comes in cents

                        addPayment({
                            amount: amountInDollars,
                            date: new Date().toISOString().split('T')[0],
                            reference: `PayPhone - ${data.transactionId}`,
                            userId: user.id,
                            complexId: user.complexId || 'unknown',
                            residentName: user.name,
                            houseNumber: user.houseNumber || 'N/A',
                        });
                    } else {
                        // If user session is lost, we might need to rely on localStorage persistence logic or ask them to login.
                        // For now we assume session persists.
                        console.warn("User not found in context, payment verified but might not be saved to local user list immediately if logic depends on it.");
                    }

                } else {
                    setStatus('error');
                    setMessage(`La transacción no fue aprobada. Estado: ${data.transactionStatus}`);
                }
            } catch (error) {
                console.error("Error verifying payment:", error);
                setStatus('error');
                setMessage('Ocurrió un error al verificar la transacción.');
            }
        };

        verifyTransaction();
    }, [searchParams, user, addPayment]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="glass card max-w-md w-full p-8 rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl text-center">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-sky-500 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verificando Pago...</h2>
                        <p className="text-slate-400">Por favor espera un momento.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="bg-green-500/20 p-4 rounded-full text-green-500 mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">¡Pago Exitoso!</h2>
                        <p className="text-slate-300 mb-6">
                            Su pago de <span className="font-bold text-white">${(details?.amount / 100).toFixed(2)}</span> ha sido procesado correctamente.
                        </p>

                        <div className="bg-slate-800 rounded-lg p-4 w-full mb-6 text-left text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Transacción:</span>
                                <span className="text-white font-mono">{details?.transactionId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Autorización:</span>
                                <span className="text-white font-mono">{details?.authorizationCode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Referencia:</span>
                                <span className="text-white">{details?.reference}</span>
                            </div>
                        </div>

                        <Link
                            href="/resident"
                            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Volver al Inicio
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="bg-red-500/20 p-4 rounded-full text-red-500 mb-6">
                            <XCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Error en el Pago</h2>
                        <p className="text-slate-300 mb-6">
                            {message || "No se pudo procesar su pago."}
                        </p>

                        <Link
                            href="/resident"
                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Intentar Nuevamente
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function PaymentResponsePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <Loader2 size={48} className="text-sky-500 animate-spin" />
            </div>
        }>
            <PaymentResponseContent />
        </Suspense>
    );
}

// Helper icon component for Error state 
function ArrowLeft({ size = 24, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}
