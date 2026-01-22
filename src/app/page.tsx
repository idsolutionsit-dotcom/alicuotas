"use client";

import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'superadmin') router.push('/superadmin');
      else if (user.role === 'admin') router.push('/admin');
      else router.push('/resident');
    }
  }, [user, isLoading, router]);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full text-center space-y-12 py-16">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
            Gestión de Alícuotas
          </h1>
          <p className="text-slate-300 text-lg">
            Sistema de registro y control de pagos para conjuntos residenciales.
          </p>
        </div>

        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
