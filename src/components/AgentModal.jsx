import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Hexagon, Star, Activity, Palette, Zap } from 'lucide-react';

// Icon Map (Shared)
const ICON_MAP = {
    hexagon: Hexagon,
    star: Star,
    "trending-up": Activity,
    palette: Palette
};

export default function AgentModal({ agent, onClose }) {
    console.log("Rendering AgentModal with:", agent);
    if (!agent) return null;

    const Icon = ICON_MAP[agent.icon] || Hexagon;

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { scale: 0.9, opacity: 0, y: 50 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        }
    };

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative font-outfit"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Avatar Area */}
                <div className="relative p-8 flex flex-col items-center justify-center border-b border-white/10 overflow-hidden">
                    {/* Dynamic Background based on Agent Color */}
                    <div
                        className="absolute inset-0 opacity-20 blur-3xl"
                        style={{ background: `radial-gradient(circle at center, ${agent.color}, transparent 70%)` }}
                    />

                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <motion.div
                        className="relative w-32 h-32 rounded-full flex items-center justify-center mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow" style={{ borderColor: agent.color }} />
                        <div className="absolute inset-2 bg-black/50 rounded-full backdrop-blur-sm shadow-inner" />
                        <Icon className="w-12 h-12 relative z-10" style={{ color: agent.color }} />
                    </motion.div>

                    <h2 className="text-4xl font-bold tracking-widest text-white mb-2">{agent.id.toUpperCase()}</h2>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/5">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
                        <span className="text-xs font-mono uppercase tracking-wider text-gray-300">{agent.role}</span>
                    </div>
                </div>

                {/* Content (The Soul) */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Col: Identity */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-2">Arquetipo</h3>
                            <p className="text-xl font-light text-white">{agent.archetype || "Desconocido"}</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-2">Directiva Principal</h3>
                            <p className="text-lg text-nexus-amber italic">"{agent.directive || "Operar"}"</p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border-l-2" style={{ borderLeftColor: agent.color }}>
                            <p className="text-sm text-gray-300 leading-relaxed italic">"{agent.quote}"</p>
                        </div>
                    </div>

                    {/* Right Col: Stats (Visual Bars) */}
                    <div>
                        <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">Neural Stats</h3>
                        <div className="space-y-4">
                            {agent.stats && Object.entries(agent.stats).map(([key, value], i) => (
                                <div key={key}>
                                    <div className="flex justify-between text-xs font-bold uppercase mb-1 text-gray-400">
                                        <span>{key}</span>
                                        <span>{value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: agent.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${value}%` }}
                                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {!agent.stats && <p className="text-sm text-gray-500 italic">Analizando métricas...</p>}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                                <span>ESTADO ACTUAL</span>
                                <span className={agent.status === 'working' ? 'text-green-400' : 'text-gray-400'}>
                                    {agent.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="border border-dashed border-gray-700 mt-2 p-2 rounded text-sm text-gray-300">
                                {">"} {agent.current_task}
                            </p>
                        </div>
                    </div>
                </div>

            </motion.div>
        </motion.div>,
        document.body
    );
}
