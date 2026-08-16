'use client';

import React from 'react';
import { Check, Zap } from 'lucide-react';

/**
 * WIDGET: Strategic Pricing Table
 * Enfoque: Comparación de planes y venta de suscripciones.
 */

interface Plan {
    name: string;
    price: string;
    features: string[];
    isPopular?: boolean;
    ctaText: string;
    highlighted?: boolean;
}

export const GridV6_Pricing = ({
    data = {}
}: { data?: any }) => {
    const plans = data.tiers || [
        { name: "Básico", price: "$15K", features: ["Acceso limitado", "Soporte email"], ctaText: "Comenzar" },
        { name: "Pro", price: "$35K", features: ["Acceso total", "Soporte prioritario", "Análisis avanzado"], highlighted: true, ctaText: "Elegir Pro" },
        { name: "Enterprise", price: "$90K", features: ["Todo incluído", "Gerente dedicado", "API Access"], ctaText: "Contactar" }
    ];

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Atmosferas Atenea */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-4 block">Revenue Architecture</span>
                    <h2 className="text-4xl font-bold text-white tracking-tighter italic">Planes de Inversión</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`relative bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-10 border transition-all duration-500 hover:translate-y-[-10px] ${
                                plan.highlighted 
                                ? 'border-indigo-500/50 shadow-[0_20px_50px_rgba(79,70,229,0.2)] scale-105 z-10' 
                                : 'border-white/5 hover:border-white/10'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/30">
                                    <Zap size={12} fill="currentColor" /> Recomendado
                                </div>
                            )}
                            
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-white tracking-tighter italic">{plan.price}</span>
                                <span className="text-sm font-bold text-slate-600">/mes</span>
                            </div>
                            
                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feat: string, i: number) => (
                                    <li key={i} className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                        <div className="w-5 h-5 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                                            <Check size={12} className="text-indigo-400" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                                plan.highlighted 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20' 
                                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                            }`}>
                                {plan.ctaText || 'Activar'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
