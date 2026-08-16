'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WIDGET: Age Gate Guard (Sovereign Security)
 * Enfoque: Verificación de edad con estética Soberana y visibilidad garantizada.
 */

export const ToolV5_AgeGate = ({ data = {} }: { data?: any }) => {
    const startHidden = data.startHidden ?? false;
    const [visible, setVisible] = useState(!startHidden);
    const title = data.title || 'Control de Acceso';
    const message = data.message || 'Esta sección contiene material reservado para soberanos mayores de edad.';

    // Fuerza visibilidad si data cambia (evita fallos en showroom)
    useEffect(() => {
        if (data.startHidden === false) setVisible(true);
    }, [data.startHidden]);

    if(!visible) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100000] bg-slate-1000/98 backdrop-blur-3xl flex items-center justify-center p-6"
                style={{ backgroundColor: 'rgba(2, 6, 23, 0.98)' }}
            >
                {/* Atmosferas Atenea */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
                
                <motion.div 
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-slate-900 border border-white/10 p-12 rounded-[4rem] max-w-lg w-full text-center shadow-[0_40px_120px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
                >
                    <div className="w-28 h-28 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-2xl shadow-red-600/20">
                        <ShieldAlert size={56} className="text-red-500" />
                    </div>

                    <span className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase mb-4 block">Security Protocol v4.0</span>
                    <h2 className="text-4xl font-black text-white mb-6 tracking-tighter italic uppercase">{title}</h2>
                    <p className="text-slate-400 text-sm font-medium mb-12 leading-relaxed max-w-xs mx-auto italic">"{message}"</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => setVisible(false)} 
                            className="flex-1 bg-red-600 hover:bg-white hover:text-black text-white font-black py-6 rounded-2xl shadow-2xl shadow-red-600/20 transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 group"
                        >
                            <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /> Acceso Concedido
                        </button>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-500 hover:text-white font-black py-6 rounded-2xl transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                            <XCircle size={16} /> Abortar
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                            End-to-End Sovereign Encryption Active
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
