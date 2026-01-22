"use client";

import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowLeft, UserPlus, Loader2, Building } from "lucide-react";
import Link from "next/link";

function CreateAdminContent() {
    const { user, isLoading } = useAuth();
    const { addUser, complexes } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedComplexId = searchParams.get('complexId');

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [complexId, setComplexId] = useState(preselectedComplexId || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isLoading && (!user || user.role !== 'superadmin')) {
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
            role: 'admin',
            complexId
        });

        router.push('/superadmin');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <Link href="/superadmin" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Volver al Panel
                </Link>

                <div className="glass card p-8 rounded-xl border border-white/5">
                    <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <UserPlus className="text-green-400" size={24} />
                        </div>
                        Nuevo Administrador de Conjunto
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Conjunto Residencial</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                <select
                                    value={complexId}
                                    onChange={e => setComplexId(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all appearance-none"
                                    required
                                >
                                    <option value="" disabled>Seleccione un conjunto</option>
                                    {complexes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nombre del Administrador</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: Roberto Gomez"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: admin_conjunto"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Crear Administrador'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CreateAdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}>
            <CreateAdminContent />
        </Suspense>
    );
}
