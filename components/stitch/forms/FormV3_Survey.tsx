'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Frown, Meh, Smile, Star } from 'lucide-react';

/**
 * WIDGET: Survey / Poll - NANO BANANA EDITION
 * Enfoque: Feedback sofisticado con estética Neón Rojo & Platino.
 */

export const FormV3_Survey = ({ data = {} }: { data?: any }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const question = data.question || '¿Cómo calificarías tu experiencia nexus?';

    const OPTIONS = [
        { icon: Frown, label: 'Crítico', color: 'text-zinc-500' },
        { icon: Meh, label: 'Neutral', color: 'text-zinc-400' },
        { icon: Smile, label: 'Bueno', color: 'text-emerald-400' },
        { icon: Heart, label: 'Excelente', color: 'text-red-500' },
        { icon: Star, label: 'Soberano', color: 'text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' },
    ];

    return (
        <div className="max-w-xl mx-auto bg-slate-950/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Atmosfera de fondo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-[80px] group-hover:bg-red-600/20 transition-all duration-700" />
            
            <div className="relative z-10 text-center">
                <span className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase mb-4 block">Feedback Intelligence</span>
                <h4 className="text-2xl font-bold text-white mb-8 tracking-tight italic">"{question}"</h4>
                
                <div className="flex justify-between items-center gap-4">
                    {OPTIONS.map((opt, i) => {
                        const Icon = opt.icon;
                        const isSelected = selected === i;
                        
                        return (
                            <motion.button
                                key={i}
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelected(i)}
                                className={`flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                                    isSelected 
                                    ? 'bg-red-600/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                    : 'bg-white/5 border-white/10'
                                }`}>
                                    <Icon size={24} className={isSelected ? 'text-red-500' : 'text-slate-300'} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-red-400' : 'text-slate-500'}`}>
                                    {opt.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 pt-6 border-t border-white/5"
                    >
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Gracias. Tu soberanía ha sido registrada.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
