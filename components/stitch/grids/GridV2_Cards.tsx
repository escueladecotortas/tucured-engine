'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Shield, Sparkles } from 'lucide-react';

/**
 * WIDGET: Grid V2 (Sovereign Cards)
 * Enfoque: Servicios, Características o Beneficios con Imágenes/Iconos.
 */

interface CardItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
}

interface GridV2Props {
    data?: any;
    title?: string;
    subtitle?: string;
    items?: CardItem[];
    primaryColor?: string;
    label?: string;
}

export const GridV2_Cards = ({
    data = {},
    title = "Servicios de Vanguardia",
    subtitle = "Arquitectura digital diseñada para la soberanía absoluta.",
    items = [],
    primaryColor = "#4F46E5",
    label = "SOLUCIONES NEXUS"
}: GridV2Props) => {

    const displayItems = data.items || items;
    const displayTitle = data.title || title;
    const displaySubtitle = data.subtitle || subtitle;
    const displayLabel = data.label || label;

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Atmosferas Atenea */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 text-balance">
                    <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-4 block" style={{ color: primaryColor }}>{displayLabel}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter italic uppercase">{displayTitle}</h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed italic">{displaySubtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayItems.map((item: any, idx: number) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden"
                        >
                            {item.image && (
                                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                                    <img src={item.image} alt="" className="w-full h-full object-cover grayscale" />
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
                                    <div className="text-slate-400 group-hover:text-white transition-colors">
                                        {item.icon || <Sparkles size={28} />}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 tracking-tight italic uppercase">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-400 transition-colors italic">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
