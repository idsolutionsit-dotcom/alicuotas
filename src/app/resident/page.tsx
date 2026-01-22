"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Upload, DollarSign, Calendar, FileText, Home as HomeIcon } from "lucide-react";
import { usePayments, Payment } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";

export default function ResidentDashboard() {
    const { payments, addPayment, loading } = usePayments();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        amount: "",
        date: new Date().toISOString().split('T')[0],
        reference: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.reference) return;

        addPayment({
            amount: parseFloat(formData.amount),
            date: formData.date,
            reference: formData.reference,
            residentName: "Juan Pérez", // Mocked current user
            houseNumber: "A-101",
        });

        setShowForm(false);
        setFormData({ amount: "", date: new Date().toISOString().split('T')[0], reference: "" });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

    return (
        <div className="min-h-screen p-6 pb-20">
            <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
                <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} />
                    Volver
                </Link>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-white">Hola, Juan</h1>
                        <p className="text-slate-400 text-sm">Casa A-101</p>
                    </div>
                    <div className="bg-sky-500/20 p-3 rounded-full text-sky-400">
                        <HomeIcon size={24} />
                    </div>
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
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Nuevo Pago
                    </button>
                </div>

                {/* Payment Form ModalOverlay */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="glass-card w-full max-w-md relative animate-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <ArrowLeft size={24} className="rotate-180" /> {/* Using arrow as close for style or X */}
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-6">Registrar Pago</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Monto ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0.00"
                                            className="glass-input w-full pl-10"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Fecha de Depósito</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            required
                                            className="glass-input w-full pl-10" // standard date picker style
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Número de Referencia</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ej. REF-12345"
                                            className="glass-input w-full pl-10"
                                            value={formData.reference}
                                            onChange={e => setFormData({ ...formData, reference: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Comprobante (Imagen)</label>
                                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors cursor-pointer bg-white/5">
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-xs">Clic para subir (Simulado)</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary flex-1">
                                        Enviar Pago
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Payments List */}
                <div className="grid gap-4">
                    {payments.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 glass rounded-xl">
                            No hay pagos registrados aún.
                        </div>
                    ) : (
                        payments.map((payment) => (
                            <div key={payment.id} className="glass p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors group">
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
