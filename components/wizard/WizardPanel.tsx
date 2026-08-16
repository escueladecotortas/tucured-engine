import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

interface WizardPanelProps {
    onStart: () => void;
    priceOffer: number;
    priceFull: number;
}

export const WizardPanel = ({ onStart, priceOffer, priceFull }: WizardPanelProps) => {
    return (
        <section className="h-[20vh] w-full bg-black/80 backdrop-blur-2xl border-t border-white/5 flex flex-col items-center justify-center relative z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.9)]">
            
            {/* --- STATUS & INFRASTRUCTURE --- */}
            <div className="absolute top-0 -translate-y-[120%] flex flex-col items-center gap-3 drop-shadow-2xl">
                
                {/* ID Tag */}
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                     <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"/>
                     <span className="text-white/60 font-mono text-[10px] tracking-widest uppercase">ID: ADORE-TU-ESENCIA</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter text-center leading-none">
                    INFRAESTRUCTURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#999]">DESPLEGADA</span>
                </h2>
                
                <div className="flex items-center gap-2">
                    <span className="text-[var(--color-warning)] text-[10px] font-bold px-3 py-1 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-full uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={10} /> Propiedad Digital
                    </span>
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">
                        Estado: <span className="text-white">Esperando Firma</span>
                    </span>
                </div>
            </div>

            {/* --- ACTION AREA (20%) --- */}
            <div className="w-full max-w-md px-6 flex flex-col gap-3">
                
                {/* Price Tag (Sovereign) */}
                <div className="flex justify-center items-baseline gap-3">
                    <span className="text-xs text-white/40 tracking-widest uppercase">Valor de Activo:</span>
                    <span className="text-2xl font-bold text-white tracking-tight">${priceOffer.toLocaleString('es-AR')}</span>
                    <span className="text-xs text-[var(--color-warning)] border border-[rgba(245,158,11,0.3)] px-1.5 py-0.5 rounded ml-1">PAGO ÚNICO</span>
                </div>

                {/* Plasma Trigger */}
                 <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 69, 0, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onStart}
                    className="w-full relative overflow-hidden bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(255,69,0,0.2)] flex items-center justify-center gap-3 group border border-white/10"
                >
                    <Zap className="w-4 h-4 fill-white animate-pulse" />
                    <span className="relative z-10">TOMAR CONTROL (ACTIVAR)</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    
                    {/* Plasma Flow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                </motion.button>
            </div>

        </section>
    );
};
