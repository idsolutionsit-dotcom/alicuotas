"use client";

import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, UserPlus, Loader2, Home } from "lucide-react";
import Link from "next/link";

export default function CreateResidentPage() {
    const { user, isLoading } = useAuth();
    const { addUser } = useStore();
    const router = useRouter();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isLoading && (!user || user.role !== 'admin')) {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        addUser({
            name,
            username,
            password,
            role: 'resident',
            complexId: user!.complexId,
            houseNumber
        });

        router.push('/admin/residents');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <Link href="/admin/residents" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Volver a la Lista
                </Link>

                <div className="glass card p-8 rounded-xl border border-white/5">
                    <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="bg-sky-500/20 p-2 rounded-lg">
                            <UserPlus className="text-sky-400" size={24} />
                        </div>
                        Nuevo Residente
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nombre del Propietario</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Número de Casa / Apto</label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={houseNumber}
                                        onChange={e => setHouseNumber(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: A-101"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: juan.perez"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Crear Residente'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
