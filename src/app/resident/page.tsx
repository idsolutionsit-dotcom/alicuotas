"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Upload, DollarSign, Calendar, FileText, Home as HomeIcon, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { useRouter } from "next/navigation";

import PayPhoneButton from "@/components/PayPhoneButton";

export default function ResidentDashboard() {
    const { payments, addPayment, loading: storeLoading } = useStore();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'manual' | 'online'>('manual');
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        amount: "",
        date: new Date().toISOString().split('T')[0],
        reference: "",
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'resident')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    if (authLoading || storeLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Cargando...</div>;
    }

    const myPayments = payments.filter(p => p.userId === user.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.reference) return;

        addPayment({
            amount: parseFloat(formData.amount),
            date: formData.date,
            reference: formData.reference,
            userId: user.id,
            complexId: user.complexId!,
            residentName: user.name,
            houseNumber: user.houseNumber || "N/A",
        });

        setShowForm(false);
        setFormData({ amount: "", date: new Date().toISOString().split('T')[0], reference: "" });
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6 pb-20">
            <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-sky-500/20 p-3 rounded-full text-sky-400">
                        <HomeIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Hola, {user.name}</h1>
                        <p className="text-slate-400 text-sm">Casa {user.houseNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Cerrar sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                {/* Action Bar */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
                        Mis Pagos
                    </h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-sky-900/20"
                    >
                        <Plus size={20} />
                        Nuevo Pago
                    </button>
                </div>

                {/* Payment Form ModalOverlay */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="glass card w-full max-w-md relative animate-in zoom-in-95 duration-200 p-8 rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <ArrowLeft size={24} className="rotate-180" />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-6">Registrar Pago</h3>

                            <div className="flex gap-4 mb-6">
                                <button
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'manual' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    onClick={() => setPaymentMethod('manual')}
                                >
                                    Depósito Bancario
                                </button>
                                <button
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'online' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    onClick={() => setPaymentMethod('online')}
                                >
                                    Pago en Línea
                                </button>
                            </div>

                            {paymentMethod === 'manual' ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Monto ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="number"
                                                required
                                                placeholder="0.00"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Fecha de Depósito</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Número de Referencia</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej. REF-12345"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                value={formData.reference}
                                                onChange={e => setFormData({ ...formData, reference: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Comprobante (Imagen)</label>
                                        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors cursor-pointer bg-slate-800/50">
                                            <Upload size={32} className="mb-2" />
                                            <span className="text-xs">Clic para subir (Simulado)</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button type="submit" className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-sky-900/20">
                                            Enviar Pago
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-sky-500/10 border border-sky-500/20 text-sky-200 p-4 rounded-lg text-sm">
                                        Ingresa el monto a pagar y presiona el botón para procesar tu pago de forma segura con PayPhone.
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Monto a Pagar ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="number"
                                                required
                                                placeholder="0.00"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {formData.amount && parseFloat(formData.amount) > 0 && (
                                        <div className="pt-2">
                                            <PayPhoneButton
                                                token={process.env.NEXT_PUBLIC_PAYPHONE_TOKEN || ''}
                                                storeId={process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID || ''}
                                                amount={Math.round(parseFloat(formData.amount) * 100)}
                                                amountWithoutTax={Math.round(parseFloat(formData.amount) * 100)}
                                                tax={0} // Assuming 0 tax for simplicity, can be calculated if needed
                                                clientTransactionId={`tx-${Date.now()}`}
                                                reference={`Pago Alícuota ${new Date().toLocaleDateString()}`}
                                                email="usuario@ejemplo.com" // Should come from user profile if available
                                                phoneNumber="0999999999" // Should come from user profile
                                                documentId="1700000000" // Should come from user profile
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors mt-4"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* Payments List */}
                <div className="grid gap-4">
                    {myPayments.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 glass card rounded-xl border border-white/5">
                            No hay pagos registrados aún.
                        </div>
                    ) : (
                        myPayments.map((payment) => (
                            <div key={payment.id} className="glass card p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors group border border-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-700/50 p-3 rounded-full text-slate-300 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors">
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">${payment.amount.toFixed(2)}</h4>
                                        <div className="flex gap-2 text-sm text-slate-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {payment.date}
                                            </span>
                                            <span className="text-slate-600">•</span>
                                            <span className="flex items-center gap-1">
                                                <FileText size={12} /> {payment.reference}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={payment.status} />
                            </div>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
}
