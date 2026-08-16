import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, AlertCircle, ArrowRight, Layers, Crown, Globe, Users, CheckCircle2, Terminal } from 'lucide-react';

export default function ProjectCard({ project, onClick, viewMode = 'grid' }) {
    // 1. HEALTH DIAGNOSIS
    const getHealthColor = () => {
        if (project.health === 'critical') return 'rose';
        if (project.health === 'warning') return 'orange'; // Changed from amber to orange
        return 'emerald'; // Nominal
    };

    const healthColor = getHealthColor();
    // Use nexus-orange for interactions instead of generic indigo
    const brandColor = 'orange';

    // 2. BREATHING ANIMATION (Health Pulse)
    const breathingVariants = {
        idle: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
        hover: { y: -5, scale: 1.02, transition: { duration: 0.2 }, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" },
        critical: {
            boxShadow: ["0 0 0 0px rgba(244, 63, 94, 0.4)", "0 0 0 10px rgba(244, 63, 94, 0)"],
            transition: { repeat: Infinity, duration: 1.5 }
        }
    };

    return (
        <motion.div
            layout
            initial="idle"
            whileHover="hover"
            animate={project.health === 'critical' ? 'critical' : 'idle'}
            variants={breathingVariants}
            onClick={() => onClick(project.id)}
            className={`
                group relative glass-panel rounded-xl overflow-hidden cursor-pointer flex flex-col
                ${viewMode === 'list' ? 'flex-row h-24 items-center' : 'h-[380px]'}
                hover:border-nexus-orange hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300
            `}
        >
            {/* 1. IDENTITY STRIP - Thinner & Cleaner */}
            <div className={`relative h-1 w-full bg-gradient-to-r ${project.gradient || 'from-nexus-orange to-pink-500'}`} />

            {/* 2. THE VIEWPORT (Visual Preview) */}
            <div className={`
                relative overflow-hidden flex-shrink-0 bg-gray-50
                ${viewMode === 'list' ? 'w-32 h-full border-r border-nexus-border' : 'h-[160px] w-full border-b border-nexus-border'}
            `}>
                {(project.siteUrl) ? (
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                        {/* IFRAME MOCKUP */}
                        <div className="absolute inset-0 z-20 bg-transparent" />
                        <iframe
                            src={project.siteUrl}
                            title={`Preview of ${project.name}`}
                            className="w-[400%] h-[400%] transform scale-25 origin-top-left border-none pointer-events-none select-none z-10 opacity-80 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center relative bg-white">
                        <Globe className="w-12 h-12 text-nexus-border group-hover:text-nexus-orange/30 transition-colors" />
                    </div>
                )}

                {/* Health Badge - Cleaner */}
                <div className="absolute top-3 right-3 z-30">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-nexus-border shadow-sm`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-${healthColor}-500 ${project.health === 'critical' ? 'animate-pulse' : ''}`} />
                        <span className={`text-[9px] font-bold tracking-wider text-${healthColor}-600 uppercase`}>
                            {project.health || 'NOMINAL'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. DATA LAYER - Electric Mode */}
            <div className="flex-1 p-5 flex flex-col bg-transparent">
                <div className="mb-4">
                    <h3 className="font-['Outfit'] font-bold text-lg text-white group-hover:text-nexus-orange transition-colors tracking-wide text-shadow-sm">
                        {project.name}
                    </h3>
                    <p className="text-xs text-text-secondary font-medium mt-1">
                        {project.description}
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    {/* Critical Task / KPI */}
                    <div className={`bg-white/5 rounded-lg p-3 border ${project.pendingActions > 0 ? 'border-nexus-orange/50 bg-nexus-orange/10' : 'border-white/5'}`}>
                        <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1 font-bold">Pendiente</span>
                        <div className={`flex items-center gap-1.5 font-mono text-sm ${project.pendingActions > 0 ? 'text-nexus-orange font-bold text-neon' : 'text-text-secondary'}`}>
                            {project.pendingActions > 0 ? (
                                <><AlertCircle className="w-3.5 h-3.5" /> {project.pendingActions} Requiere</>
                            ) : (
                                <><CheckCircle2 className="w-3.5 h-3.5 text-nexus-success" /> Todo en Orden</>
                            )}
                        </div>
                    </div>

                    {/* Uptime */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1 font-bold">Uptime</span>
                        <div className="flex items-center gap-1.5 text-nexus-success font-mono text-sm font-bold">
                            <Activity className="w-3.5 h-3.5" />
                            99.9%
                        </div>
                    </div>
                </div>

                {/* Live Activity Ticker - Subtle */}
                <div className="mt-4 pt-3 border-t border-nexus-border/50">
                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono">
                        <div className="w-1.5 h-1.5 rounded-full bg-nexus-orange/50 animate-pulse"></div>
                        <span className="truncate">
                            {project.lastActivity || "Sistema en Reposo. Nodo Activo."}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
