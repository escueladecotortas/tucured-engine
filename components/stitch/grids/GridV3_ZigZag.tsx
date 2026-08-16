'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

/**
 * WIDGET: Grid V3 (Sovereign ZigZag)
 * Enfoque: Storytelling de marca, Metodología, Historia.
 */

interface ZigZagRow {
    title: string;
    description: string;
    image: string;
    points?: string[];
    ctaText?: string;
    ctaLink?: string;
    reverse?: boolean;
}

interface GridV3Props {
    data?: any;
    rows?: ZigZagRow[];
    primaryColor?: string;
    secondaryColor?: string;
}

export const GridV3_ZigZag = ({
    data = {},
    rows = [],
    primaryColor = "#4F46E5",
    secondaryColor = "#FF2A2A"
}: GridV3Props) => {

    const displayRows = data.items || rows;

    return (
        <section className="py-24 overflow-hidden bg-slate-950 relative">
            {/* Atmosferas de Fondo */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px]" />

            <div className="container mx-auto px-6 space-y-32 relative z-10">
                
                {displayRows.map((row: any, idx: number) => (
                    <div key={idx} className={`flex flex-col md:flex-row items-center gap-16 lg:gap-24 ${row.reverse ? 'md:flex-row-reverse' : ''}`}>
                        
                        {/* Text Side */}
                        <motion.div 
                            initial={{ opacity: 0, x: row.reverse ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">Capítulo 0{idx + 1}</span>
                                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{row.title}</h2>
                                <div className="w-20 h-1 bg-indigo-600/50 rounded-full" />
                            </div>
                            
                            <p className="text-lg text-slate-400 font-medium leading-relaxed italic max-w-lg">{row.description}</p>
                            
                            {row.points && (
                                <ul className="space-y-4 pt-4">
                                    {row.points.map((p: string, i: number) => (
                                        <li key={i} className="flex items-center gap-4 text-slate-300 font-bold italic text-sm group">
                                            <div className="w-5 h-5 bg-indigo-600/20 rounded-full flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-600 transition-colors">
                                                <Check size={12} className="text-indigo-400 group-hover:text-white" />
                                            </div>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {row.ctaText && (
                                <button className="group flex items-center gap-4 px-10 py-5 bg-white/5 hover:bg-white text-white hover:text-black font-black rounded-full transition-all duration-500 border border-white/10 hover:border-white uppercase tracking-widest text-[11px] shadow-2xl">
                                    {row.ctaText}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                                </button>
                            )}
                        </motion.div>

                        {/* Image Side */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, rotate: row.reverse ? -2 : 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            viewport={{ once: true }}
                            className="flex-1 relative w-full group"
                        >
                            <div className="absolute inset-0 bg-indigo-600/10 rounded-[3rem] blur-3xl group-hover:bg-red-600/10 transition-colors duration-1000" />
                            <div className="relative aspect-4/3 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                                <img 
                                    src={row.image} 
                                    alt={row.title} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-1000" />
                            </div>
                        </motion.div>

                    </div>
                ))}

            </div>
        </section>
    );
};
