import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";

export default function Home() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
          <Link href="/resident" className="group">
            <div className="glass hover:bg-white/10 transition-all p-8 rounded-2xl flex flex-col items-center gap-4 border border-white/5 hover:border-sky-500/50 cursor-pointer">
              <div className="bg-sky-500/20 p-4 rounded-full text-sky-400 group-hover:scale-110 transition-transform">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white">Residente</h2>
              <p className="text-slate-400 text-sm">Registrar y ver mis pagos</p>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="glass hover:bg-white/10 transition-all p-8 rounded-2xl flex flex-col items-center gap-4 border border-white/5 hover:border-purple-500/50 cursor-pointer">
              <div className="bg-purple-500/20 p-4 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white">Administrador</h2>
              <p className="text-slate-400 text-sm">Gestionar y aprobar pagos</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
