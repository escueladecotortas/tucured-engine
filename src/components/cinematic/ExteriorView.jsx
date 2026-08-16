// Archivo: frontend/src/components/cinematic/ExteriorView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function ExteriorView({ bgImage, onStart }) {
    return (
        <motion.div
            key="exterior"
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 1.5 } }}
            className="absolute inset-0"
        >
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <img src={bgImage} alt="Nexus HQ" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </motion.div>

            <div className="absolute bottom-20 left-16 z-20">
                <h1 className="text-[120px] leading-[0.8] font-black text-white mix-blend-overlay opacity-90 tracking-tighter">
                    NEXUS HQ
                </h1>
                <div className="h-1 w-24 bg-white/50 mt-6 mb-2"></div>
                <p className="text-white/60 font-mono tracking-[0.5em] text-sm uppercase">Sovereign Digital Architecture</p>
            </div>

            <div className="absolute bottom-24 right-24 z-20 flex flex-col gap-4 items-end">
                <button
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-white/40 rounded-full transition-all duration-500 overflow-hidden"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <span className="text-xs font-bold text-white tracking-[0.3em] uppercase group-hover:text-amber-400 transition-colors">Secuencia Cinemática</span>
                        <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>
            </div>

            <BypassButtons />
        </motion.div>
    );
}

function BypassButtons() {
    return (
        <>
            <button
                onClick={() => window.location.hash = '#/project/system'}
                className="absolute top-8 left-8 text-[10px] text-white/20 hover:text-white font-mono tracking-widest uppercase py-2 px-4 border border-white/5 rounded-lg transition-all z-50 hover:bg-white/5"
            >
                Direct Access [Bypass]
            </button>
            <button
                onClick={() => window.location.hash = '#/project/tucu-red'}
                className="absolute top-8 right-8 text-[10px] text-red-900/20 hover:text-red-500 font-mono tracking-widest uppercase py-2 px-4 border border-transparent hover:border-red-900/30 rounded-lg transition-all z-50 hover:bg-red-900/10"
            >
                TR [Direct]
            </button>
        </>
    );
}
