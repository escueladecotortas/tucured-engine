'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * WIDGET: Pinterest Masonry Grid (Sovereign Reveal)
 * Enfoque: Inspiración Visual fluida con estética Dark Premium.
 */

interface Pin {
    id: string;
    image: string;
    title: string;
}

export const SocialV5_Pinterest = ({
    data = {}
}: { data?: any }) => {
    const pins = data.images?.map((img: string, i: number) => ({
        id: String(i),
        image: img,
        title: `Asset ${i + 1}`
    })) || [
        { id: '1', image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=500", title: "Diseño Interior" },
        { id: '2', image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=500", title: "Modern Art" },
        { id: '3', image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=500", title: "Luz & Sombra" },
        { id: '4', image: "https://images.unsplash.com/photo-1518005020251-0eb03495f903?auto=format&fit=crop&q=80&w=500", title: "Vanguardia" },
        { id: '5', image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=500", title: "Laboratorio" },
    ];

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Atmosferas Atenea */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col items-center mb-16">
                    <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mb-4 block">Visual Discovery Vault</span>
                    <div className="flex items-center gap-4 bg-slate-900/40 border border-white/10 px-8 py-4 rounded-full backdrop-blur-xl shadow-2xl">
                        <div className="bg-red-600 text-white rounded-xl w-7 h-7 flex items-center justify-center font-serif font-black text-xs shadow-lg shadow-red-600/20">P</div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-100">Pinterest Collection</span>
                    </div>
                </div>

                <div className="columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
                    {pins.map((pin: any, idx: number) => (
                        <motion.div 
                            key={pin.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05, duration: 0.8 }}
                            className="break-inside-avoid rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-md relative group cursor-pointer shadow-2xl hover:border-red-500/30 transition-all duration-700 hover:-translate-y-2"
                        >
                            <div className="relative overflow-hidden aspect-auto">
                                <img 
                                    src={pin.image} 
                                    alt={pin.title} 
                                    className="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
                            </div>
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <span className="text-sm font-black text-white mb-4 italic uppercase tracking-tighter tracking-widest">{pin.title}</span>
                                <button className="w-full bg-white text-black hover:bg-red-600 hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl">
                                    Expandir Visión
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
