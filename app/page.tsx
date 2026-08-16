import Link from 'next/link';
import { ArrowRight, Zap, Target, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-0 relative overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-4 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            V 5.1 Active
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            Tucu Red
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Agencia de Soberanía Digital. <br />
            No hacemos sitios web. Construimos activos.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/alta"
              className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-amber-400 transition-all flex items-center gap-2"
            >
              Iniciar Onboarding
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      <footer className="border-t border-white/5 py-8 text-center text-white/20 text-sm">
        <p>Operado por NEXUS-OS | San Miguel de Tucumán</p>
      </footer>
    </main>
  );
}
