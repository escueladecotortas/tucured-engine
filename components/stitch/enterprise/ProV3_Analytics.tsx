'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Users, 
    Target, 
    Cpu,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Globe
} from 'lucide-react';

const STATS = [
    { id: 1, label: "Misiones Activas", value: "36", growth: "+12%", icon: Target, color: "text-red-500" },
    { id: 2, label: "Sincronía Global", value: "98.2%", growth: "+0.5%", icon: Globe, color: "text-blue-500" },
    { id: 3, label: "Nexus Load", value: "42%", growth: "-2%", icon: Cpu, color: "text-emerald-500" },
    { id: 4, label: "Agentes Online", value: "12", growth: "+3", icon: Users, color: "text-amber-500" },
];

export const ProV3_Analytics = ({ data = {} }: { data?: any }) => {
    // Generador de puntos para un gráfico SVG simple
    const points = "0,80 20,40 40,60 60,20 80,50 100,10 120,40 140,30 160,70 180,20 200,40";

    return (
        <section className="py-20 bg-slate-950 min-h-[700px] relative overflow-hidden flex flex-col">
            {/* Atmosfera */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[200px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <Zap className="text-red-600 fill-red-600 w-5 h-5" />
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Quantum Intelligence</span>
                    </div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Nexus Analytics</h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-4xl border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.growth.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.growth}
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-3xl font-black text-white italic tracking-tighter group-hover:text-red-500 transition-colors">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Chart Section */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-slate-900/20 backdrop-blur-md rounded-[3rem] border border-white/5 p-10 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-white font-bold text-lg">Mando de Operaciones</h3>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Frecuencia de Inyección Stitch</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[9px] font-black rounded-lg border border-red-500/20">LIVE</span>
                            </div>
                        </div>

                        {/* Custom SVG Chart */}
                        <div className="relative flex-1 min-h-[250px] w-full mt-auto group">
                            <svg viewBox="0 0 200 100" className="w-full h-full preserve-3d">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    d={`M ${points}`}
                                    fill="transparent"
                                    stroke="#dc2626"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    d={`M ${points} L 200,100 L 0,100 Z`}
                                    fill="url(#chartGradient)"
                                />
                            </svg>
                            {/* Overlay Neón */}
                            <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/60 backdrop-blur-3xl rounded-4xl border border-white/5 p-10 flex flex-col"
                    >
                        <h3 className="text-white font-bold mb-8">Nivel de Soberanía</h3>
                        <div className="space-y-8 flex-1 flex flex-col justify-center">
                            {[
                                { label: "Aislamiento CSS", val: 95 },
                                { label: "Integridad Data", val: 100 },
                                { label: "Shadow DOM Scope", val: 88 }
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                                        <span>{item.label}</span>
                                        <span className="text-red-500">{item.val}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.val}%` }}
                                            transition={{ delay: 0.5 + (i * 0.2), duration: 1 }}
                                            className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-red-600/5 rounded-2xl border border-red-500/10">
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                "El sistema reporta una estabilidad nuclear del 99.8% tras la inyección de la Tríada Enterprise."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
