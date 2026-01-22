"use client";

import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Building, Plus, LogOut, UserPlus } from "lucide-react";

export default function SuperAdminDashboard() {
    const { user, logout, isLoading } = useAuth();
    const { complexes, getComplexUsers } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'superadmin')) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Panel Super Administrador
                    </h1>
                    <p className="text-slate-400">Gestionar Conjuntos y Administradores</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300">Hola, {user.name}</span>
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-200">Conjuntos Residenciales</h2>
                    <Link href="/superadmin/create-complex">
                        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            <Plus size={18} />
                            Nuevo Conjunto
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complexes.map(complex => {
                        const admins = getComplexUsers(complex.id).filter(u => u.role === 'admin');
                        return (
                            <div key={complex.id} className="glass card p-6 rounded-xl border border-white/5 space-y-4 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="bg-purple-500/20 p-3 rounded-lg">
                                        <Building className="text-purple-400" size={24} />
                                    </div>
                                    <Link href={`/superadmin/create-admin?complexId=${complex.id}`}>
                                        <button className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded transition-colors">
                                            <UserPlus size={14} />
                                            Crear Admin
                                        </button>
                                    </Link>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white">{complex.name}</h3>
                                    <p className="text-sm text-slate-400">{complex.address}</p>
                                </div>

                                <div className="border-t border-white/5 pt-4">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Administradores</h4>
                                    {admins.length > 0 ? (
                                        <ul className="space-y-1">
                                            {admins.map(admin => (
                                                <li key={admin.id} className="text-sm text-slate-300 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                                    {admin.name} ({admin.username})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-600 italic">No hay administradores asignados</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
