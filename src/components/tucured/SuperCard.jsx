// Archivo: frontend/src/components/tucured/SuperCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Activity, CheckCircle2, Terminal, ChevronRight } from 'lucide-react';
import StatusPill from './StatusPill';

const SuperCard = ({ client, onClick, viewMode }) => {
    const getBrandColor = (gradientClass) => {
        if (!gradientClass) return 'indigo';
        if (gradientClass.includes('pink') || gradientClass.includes('rose')) return 'rose';
        if (gradientClass.includes('amber') || gradientClass.includes('orange')) return 'amber';
        if (gradientClass.includes('emerald') || gradientClass.includes('teal')) return 'emerald';
        if (gradientClass.includes('cyan') || gradientClass.includes('blue')) return 'cyan';
        return 'indigo';
    };

    const brandColor = getBrandColor(client.color);

    const breathingVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        zen: {
            opacity: 1,
            scale: 1,
            boxShadow: `0 0 0 1px rgba(${brandColor === 'rose' ? '244,63,94' : '99,102,241'}, 0.1)`,
            transition: {
                boxShadow: { duration: 4, repeat: Infinity, repeatType: "mirror" },
                default: { duration: 0.5 }
            }
        },
        active: {
            opacity: 1,
            scale: 1,
            boxShadow: [`0 0 0 2px rgba(${brandColor === 'rose' ? '244,63,94' : '99,102,241'}, 0.6)`, `0 0 30px 5px rgba(${brandColor === 'rose' ? '244,63,94' : '99,102,241'}, 0.3)`],
            transition: {
                boxShadow: { duration: 1.5, repeat: Infinity, repeatType: "mirror" },
                default: { duration: 0.5 }
            }
        }
    };

    return (
        <motion.div
            layout
            initial="hidden"
            whileHover={{ y: -4, scale: 1.01 }}
            variants={breathingVariants}
            animate={client.status === 'active' ? 'active' : 'zen'}
            onClick={onClick}
            className={`
                group relative bg-[#0B0F19] border border-white/10 rounded-xl overflow-hidden cursor-pointer flex flex-col
                ${viewMode === 'list' ? 'flex-row h-24 items-center' : 'h-[420px]'} 
            `}
        >
            <div className={`relative h-1.5 w-full bg-gradient-to-r ${client.color || 'from-indigo-500 to-violet-600'}`} />

            <div className={`
                relative overflow-hidden flex-shrink-0 bg-white
                ${viewMode === 'list' ? 'w-32 h-full border-r border-white/5' : 'h-[180px] w-full border-b border-white/5'}
            `}>
                {(client.siteUrl || client.deployUrl) ? (
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 z-20 bg-transparent" />
                        <iframe
                            src={client.siteUrl || client.deployUrl}
                            title={`Preview of ${client.name}`}
                            className="w-[400%] h-[400%] transform scale-25 origin-top-left border-none pointer-events-none select-none z-10"
                            loading="lazy"
                        />
                    </div>
                ) : client.image ? (
                    <img
                        src={client.image}
                        alt={client.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${client.color || 'from-indigo-600 to-violet-600'} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <Globe className="w-16 h-16 text-white/30 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                    </div>
                )}

                <div className="absolute top-3 right-3 z-30">
                    <StatusPill status={client.status || (client.isGenerated ? 'generated' : 'pilot')} />
                </div>
            </div>

            <div className={`flex-1 p-4 flex flex-col bg-[#0B0F19]/90 backdrop-blur ${viewMode === 'list' ? 'justify-center' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className={`font-['Outfit'] font-bold text-white leading-tight group-hover:text-${brandColor}-400 transition-colors ${viewMode === 'list' ? 'text-lg' : 'text-2xl'}`}>
                            {client.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Globe className="w-3 h-3 text-gray-500" />
                            <p className="text-xs text-gray-400 line-clamp-1 font-mono opacity-80 decoration-gray-600 underline-offset-2 group-hover:underline">
                                {client.siteUrl || client.deployUrl ? 'Local Staging Environment' : 'No Deploy Active'}
                            </p>
                        </div>
                    </div>
                </div>

                {viewMode === 'grid' && (
                    <>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-white/5 rounded p-2 border border-white/5">
                                <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-bold">Agents</span>
                                <div className="flex items-center gap-1.5 text-white font-mono text-base">
                                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                                    {client.activeAgents || 1}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded p-2 border border-white/5">
                                <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-bold">Uptime</span>
                                <div className="flex items-center gap-1.5 text-white font-mono text-base">
                                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                    99.8%
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-white/5 rounded p-2 border border-white/5">
                                <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-bold">Stack</span>
                                <div className="flex items-center gap-1.5 text-white font-mono text-xs">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    React + Vite
                                </div>
                            </div>
                            <div className="bg-white/5 rounded p-2 border border-white/5">
                                <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-bold">System Health</span>
                                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
                                    <CheckCircle2 className="w-3 h-3" /> Nominal
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-auto pt-3 border-t border-white/10">
                    <div className="overflow-hidden h-6 flex items-center bg-black/40 rounded px-2 border border-white/5">
                        <motion.div
                            animate={{ x: [0, -200] }}
                            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                            className={`whitespace-nowrap text-xs font-mono ${client.status === 'active' ? 'text-emerald-400' : 'text-gray-300'} flex items-center gap-8`}
                        >
                            <span className="flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                {client.lastActivity || `System Monitoring: ${client.name} Node Active`}
                            </span>
                            <span className="opacity-50 text-[10px]">///</span>
                            <span>Waiting for User Input...</span>
                            <span className="opacity-50 text-[10px]">///</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {viewMode === 'list' && (
                <div className="pr-6 flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-[9px] text-gray-500 uppercase">Agents</span>
                        <span className="text-white font-mono">{client.activeAgents || 1}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
            )}
        </motion.div>
    );
};

export default SuperCard;
