'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Target, Star, TrendingUp, Cpu, Briefcase, Zap, CheckCircle, Shield } from 'lucide-react';
import { GlassCard } from '../core';

export default function AchievementsTab({ projectId }) {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/shield/achievements/${projectId}`);
            const data = await res.json();
            if (data.success) {
                setAchievements(data.achievements);
            }
        } catch (e) {
            console.error("Error fetching achievements:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchAchievements();
    }, [projectId]);

    const getRankIcon = (type) => {
        switch(type) {
            case 'MILESTONE': return <Trophy className="w-4 h-4 text-amber-400" />;
            case 'SECURITY': return <Shield className="w-4 h-4 text-nexus-cyan" />;
            case 'INTELLIGENCE': return <Cpu className="w-4 h-4 text-nexus-purple" />;
            default: return <Award className="w-4 h-4 text-white" />;
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6 p-6 overflow-hidden">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 border-amber-500/30 bg-amber-500/10 flex flex-col items-center justify-center space-y-2">
                    <Trophy className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    <p className="text-2xl font-bold text-white">{achievements.length}</p>
                    <p className="text-[10px] text-amber-400/60 uppercase tracking-widest text-center">Logros Totales</p>
                </GlassCard>

                <GlassCard className="p-4 border-nexus-cyan/30 bg-nexus-cyan/10 flex flex-col items-center justify-center space-y-2">
                    <Zap className="w-8 h-8 text-nexus-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <p className="text-2xl font-bold text-white">{achievements.filter(a => a.type === 'MILESTONE').length}</p>
                    <p className="text-[10px] text-nexus-cyan/60 uppercase tracking-widest text-center">Hitos de Negocio</p>
                </GlassCard>

                <GlassCard className="p-4 border-nexus-purple/30 bg-nexus-purple/10 flex flex-col items-center justify-center space-y-2">
                    <Target className="w-8 h-8 text-nexus-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                    <p className="text-2xl font-bold text-white">{achievements.length > 0 ? 'L3' : 'L0'}</p>
                    <p className="text-[10px] text-nexus-purple/60 uppercase tracking-widest text-center">Nivel Operativo</p>
                </GlassCard>

                <GlassCard className="p-4 border-emerald-500/30 bg-emerald-500/10 flex flex-col items-center justify-center space-y-2">
                    <TrendingUp className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    <p className="text-2xl font-bold text-white">100%</p>
                    <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest text-center">Tasa de Éxito</p>
                </GlassCard>
            </div>

            {/* Achievement Timeline */}
            <GlassCard className="flex-1 flex flex-col overflow-hidden border-white/10 group relative">
                <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-bold text-white tracking-widest uppercase">Cronograma de Éxitos</h3>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                    {/* Vertical Line */}
                    <div className="absolute left-11 top-0 bottom-0 w-px bg-linear-to-b from-amber-400/50 via-nexus-cyan/50 to-transparent pointer-events-none" />

                    {loading ? (
                        <div className="h-full flex items-center justify-center text-xs text-white/40 animate-pulse">
                            Decodificando Hitos Neuronales...
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-white/40 flex-col gap-4">
                            <Star className="w-8 h-8 text-white/10" />
                            Sin logros registrados aún en esta sesión.
                        </div>
                    ) : (
                        <AnimatePresence>
                            {achievements.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-6 relative"
                                >
                                    {/* Icon Point */}
                                    <div className={`mt-1 z-10 w-10 h-10 rounded-full flex items-center justify-center border shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all
                                        ${item.type === 'MILESTONE' ? 'bg-amber-400/20 border-amber-400/40 text-amber-400' : 'bg-nexus-cyan/20 border-nexus-cyan/40 text-nexus-cyan'}`}>
                                        {item.agentId === 'nexus' ? <Cpu className="w-5 h-5" /> : (item.type === 'MILESTONE' ? <Trophy className="w-5 h-5" /> : <Zap className="w-5 h-5" />)}
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:translate-x-1 group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{item.agentId}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="text-[10px] font-bold text-nexus-cyan uppercase tracking-tighter">{item.type}</span>
                                            </div>
                                            <span className="text-[10px] text-white/20 font-mono italic">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-nexus-white font-medium text-sm leading-relaxed mb-4">{item.description}</p>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/5">
                                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                <span className="text-[8px] font-bold text-emerald-400 tracking-widest uppercase">Verified by Nexus</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/5">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span className="text-[8px] font-bold text-amber-400 tracking-widest uppercase">+10 Achievement pts</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
