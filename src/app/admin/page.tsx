"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Search, Filter, ShieldCheck, FileText, Calendar, DollarSign, Home as HomeIcon } from "lucide-react";
import { usePayments, Payment } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const { payments, updateStatus, loading } = usePayments();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const filteredPayments = payments.filter(p =>
        filter === 'all' ? true : p.status === filter
    );

    const pendingCount = payments.filter(p => p.status === 'pending').length;

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

    return (
        <div className="min-h-screen p-6 pb-20">
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
                <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} />
                    Volver
                </Link>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-white">Panel Administrador</h1>
                        <p className="text-slate-400 text-sm">Conjunto Residencial</p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-8">
                {/* Stats / Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card flex items-center justify-between relative overflow-hidden group">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium">Pagos Pendientes</h3>
                            <p className="text-4xl font-bold text-white mt-2">{pendingCount}</p>
                        </div>
                        <div className="bg-amber-500/10 p-4 rounded-full text-amber-500">
                            <Filter size={32} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                    </div>

                    <div className="glass-card flex items-center justify-between relative overflow-hidden group">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium">Recaudado (Mes)</h3>
                            <p className="text-4xl font-bold text-white mt-2">$3,450</p>
                        </div>
                        <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-500">
                            <DollarSign size={32} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                    </div>

                    <div className="glass-card flex items-center justify-between relative overflow-hidden group">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium">Total Residentes</h3>
                            <p className="text-4xl font-bold text-white mt-2">24</p>
                        </div>
                        <div className="bg-sky-500/10 p-4 rounded-full text-sky-500">
                            <HomeIcon size={32} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-colors"></div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border",
                                filter === f
                                    ? "bg-white text-slate-900 border-white"
                                    : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
                            )}
                        >
                            {f === 'all' ? 'Todos' : f}
                        </button>
                    ))}
                </div>

                {/* Payments Table */}
                <div className="glass overflow-hidden rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Residente</th>
                                    <th className="px-6 py-4 font-medium">Fecha</th>
                                    <th className="px-6 py-4 font-medium">Referencia</th>
                                    <th className="px-6 py-4 font-medium">Monto</th>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No se encontraron pagos.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                        {payment.houseNumber.split('-')[1]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{payment.residentName}</p>
                                                        <p className="text-xs text-slate-400">{payment.houseNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-500" />
                                                    {payment.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-slate-500" />
                                                    {payment.reference}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                ${payment.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={payment.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {payment.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => updateStatus(payment.id, 'approved')}
                                                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                                                            title="Aprobar"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(payment.id, 'rejected')}
                                                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                                                            title="Rechazar"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                                {payment.status !== 'pending' && (
                                                    <span className="text-xs text-slate-500 italic">Procesado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
