"use client";

import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, User, Search } from "lucide-react";

export default function ResidentsListPage() {
    const { users, loading: storeLoading } = useStore();
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    if (authLoading || storeLoading || !user) return null;

    const residents = users.filter(u => u.complexId === user.complexId && u.role === 'resident');

    return (
        <div className="min-h-screen bg-slate-900 p-6 pb-20 text-white">
            <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
                <Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} />
                    Volver al Panel
                </Link>
                <h1 className="text-2xl font-bold">Residentes</h1>
            </header>

            <main className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar residente..."
                            className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <Link href="/admin/residents/create">
                        <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            <Plus size={18} />
                            Nuevo Residente
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {residents.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                            No hay residentes registrados en este conjunto.
                        </div>
                    ) : (
                        residents.map(resident => (
                            <div key={resident.id} className="glass card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-sky-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                        {resident.houseNumber}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{resident.name}</h3>
                                        <p className="text-sm text-slate-400">Usuario: {resident.username}</p>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-slate-500">
                                    Casa {resident.houseNumber}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
