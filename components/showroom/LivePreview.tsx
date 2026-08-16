'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield } from 'lucide-react';
import { StitchFactory } from '@/components/StitchFactory';

interface LivePreviewProps {
    isOpen: boolean;
    widgetId: string | null;
    widgetLabel: string;
    onClose: () => void;
    widgetData?: any;
}

export const LivePreview = ({ isOpen, widgetId, widgetLabel, onClose, widgetData = {} }: LivePreviewProps) => {
    // Escape key listener
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && widgetId && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col overflow-hidden"
                >
                    {/* Header bar - Ultra Slim & Premium */}
                    <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl relative z-[100001] pointer-events-auto">
                        <div className="flex items-center gap-4">
                            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                                <Zap className="text-white w-4 h-4" fill="currentColor" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Simulación Soberana</h2>
                                    <Shield size={10} className="text-red-500" />
                                </div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{widgetLabel} <span className="text-red-500/50">ID: {widgetId}</span></p>
                            </div>
                        </div>

                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-all text-slate-500 hover:text-white group border border-transparent hover:border-white/10"
                            title="Cerrar (Esc)"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>

                    {/* Simulation Area - Optimized for 100% view without friction */}
                    <div className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar z-[10000] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                        {/* Atmosferas de Fondo */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                            <div className="absolute -top-[250px] -left-[250px] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
                            <div className="absolute -bottom-[250px] -right-[250px] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
                        </div>

                        <div className="w-full min-h-full flex flex-col items-center relative z-10 py-12 px-0 md:px-12">
                            {/* The Widget Container - Max Width & Clean */}
                            <div className="w-full max-w-7xl shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-slate-950/20 backdrop-blur-sm rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-700">
                                <StitchFactory component={widgetId} data={widgetData} vibe="1" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Warning - Slimmer */}
                    <div className="py-2 bg-red-600/80 backdrop-blur-md text-[8px] font-black text-center text-white uppercase tracking-[0.4em] relative z-[100002]">
                        Ambiente de Pruebas • Nexus OS Kernel v3.0 • Cero Latencia
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
