"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Search, Filter, ShieldCheck, FileText, Calendar, DollarSign, Home as HomeIcon, Users, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const { payments, updatePaymentStatus, loading: storeLoading, users, complexes } = useStore();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    if (authLoading || storeLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Cargando...</div>;
    }

    const myComplex = complexes.find(c => c.id === user.complexId);

    // Filter payments for this complex
    const complexPayments = payments.filter(p => p.complexId === user.complexId);

    const filteredPayments = complexPayments.filter(p =>
        filter === 'all' ? true : p.status === filter
    );

    const pendingCount = complexPayments.filter(p => p.status === 'pending').length;

    // Calculate stats
    const totalResidents = users.filter(u => u.complexId === user.complexId && u.role === 'resident').length;
    const monthlyTotal = complexPayments
        .filter(p => p.status === 'approved') // Only count approved? Or all? Let's say approved.
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="min-h-screen bg-slate-900 p-6 pb-20">
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Panel Administrador</h1>
                        <p className="text-slate-400 text-sm">{myComplex?.name || 'Conjunto'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300 hidden md:inline">Hola, {user.name}</span>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Cerrar sesión"
                    >
                        <LogOut size={20} />
                    </button>
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
                            <h3 className="text-slate-400 text-sm font-medium">Recaudado (Total)</h3>
                            <p className="text-4xl font-bold text-white mt-2">${monthlyTotal.toFixed(2)}</p>
                        </div>
                        <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-500">
                            <DollarSign size={32} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                    </div>

                    <Link href="/admin/residents" className="block h-full">
                        <div className="glass-card flex items-center justify-between relative overflow-hidden group h-full cursor-pointer hover:border-sky-500/50 transition-colors">
                            <div>
                                <h3 className="text-slate-400 text-sm font-medium">Residentes</h3>
                                <p className="text-4xl font-bold text-white mt-2">{totalResidents}</p>
                            </div>
                            <div className="bg-sky-500/10 p-4 rounded-full text-sky-500">
                                <Users size={32} />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-colors"></div>
                        </div>
                    </Link>
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
                                                        {payment.houseNumber?.split('-')[1] || payment.houseNumber}
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
                                                            onClick={() => updatePaymentStatus(payment.id, 'approved')}
                                                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                                                            title="Aprobar"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => updatePaymentStatus(payment.id, 'rejected')}
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
