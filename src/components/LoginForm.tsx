"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { User, Lock, Loader2 } from 'lucide-react';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const success = await login(username, password);
            if (!success) {
                setError('Credenciales inválidas');
            }
        } catch (err) {
            setError('Ocurrió un error al iniciar sesión');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                <p className="text-sm text-gray-500 mt-2">Bienvenido de nuevo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Usuario</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Ej: superadmin"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        'Ingresar'
                    )}
                </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                <p>Usuarios de prueba:</p>
                <div className="mt-2 space-y-1">
                    <p>Super Admin: <code className="bg-gray-100 px-1 py-0.5 rounded">superadmin</code> / <code className="bg-gray-100 px-1 py-0.5 rounded">123</code></p>
                    <p>Conjunto Admin: <code className="bg-gray-100 px-1 py-0.5 rounded">admin_pinos</code> / <code className="bg-gray-100 px-1 py-0.5 rounded">123</code></p>
                    <p>Residente: <code className="bg-gray-100 px-1 py-0.5 rounded">res_pinos_101</code> / <code className="bg-gray-100 px-1 py-0.5 rounded">123</code></p>
                </div>
            </div>
        </div>
    );
}
