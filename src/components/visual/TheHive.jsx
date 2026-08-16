import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Terminal, Cpu, TrendingUp, Shield,
    Database, Layout, Target, Eye, Code,
    FileText, Hexagon, Activity, Star, Server,
    Globe, ShoppingBag, Scale, Archive, Crown
} from 'lucide-react';

// Agent Configuration Map
const AGENTS = [
    { id: 'nexus', name: 'Nexus', color: '#22d3ee', icon: Terminal, row: 1, col: 2 }, // Center
    { id: 'codi', name: 'Codi', color: '#34d399', icon: Code, row: 1, col: 1 },
    { id: 'atenea', name: 'Atenea', color: '#818cf8', icon: Layout, row: 1, col: 3 },

    { id: 'icaro', name: 'Ícaro', color: '#f472b6', icon: TrendingUp, row: 2, col: 1 },
    { id: 'antigravity', name: 'Antigravity', color: '#d946ef', icon: Zap, row: 0, col: 2 }, // Top Center
    { id: 'tucu_red', name: 'Tucu Red', color: '#ef4444', icon: Crown, row: 2, col: 2 },

    { id: 'argus', name: 'Argus', color: '#06b6d4', icon: Eye, row: 2, col: 3 },
    { id: 'orion', name: 'Orion', color: '#f43f5e', icon: Shield, row: 0, col: 1 },
    { id: 'lorem', name: 'Lorem', color: '#fbbf24', icon: FileText, row: 0, col: 3 },
];

const HexCell = ({ agent, isActive, lastLog }) => {
    return (
        <div className="relative w-24 h-28 flex items-center justify-center group">
            {/* Hexagon Shape SVG */}
            <svg
                viewBox="0 0 100 115"
                className="absolute inset-0 w-full h-full drop-shadow-2xl"
                style={{ filter: isActive ? `drop-shadow(0 0 15px ${agent.color})` : 'none' }}
            >
                <motion.path
                    d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"
                    fill="none"
                    stroke={isActive ? agent.color : '#334155'}
                    strokeWidth={isActive ? "3" : "1"}
                    initial={false}
                    animate={{
                        stroke: isActive ? agent.color : '#334155',
                        strokeWidth: isActive ? 4 : 1,
                        fill: isActive ? `${agent.color}20` : '#0F172A'
                    }}
                    transition={{ duration: 0.3 }}
                />
            </svg>

            {/* Inner Content */}
            <div className="relative z-10 flex flex-col items-center gap-1 mt-[-5px]">
                <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <agent.icon
                        className="w-6 h-6"
                        style={{ color: isActive ? '#fff' : '#64748b' }}
                    />
                </motion.div>
                <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {agent.name}
                </span>
            </div>

            {/* Activity Pulse Ring */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 1, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute inset-0 z-0 bg-transparent border-2 border-white/20"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                />
            )}

            {/* Tooltip / Last Log */}
            <AnimatePresence>
                {isActive && lastLog && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-48 z-50 pointer-events-none"
                    >
                        <div className="bg-black/90 border border-white/10 text-white text-[10px] p-2 rounded shadow-xl text-center backdrop-blur-md">
                            <span style={{ color: agent.color }}>›</span> {lastLog}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function TheHive({ recentLogs = [] }) {
    // We determine active agents by checking logs from the last 5 seconds
    const [activeState, setActiveState] = useState({});

    useEffect(() => {
        if (recentLogs.length === 0) return;

        const newActiveState = {};
        const now = new Date();

        recentLogs.forEach(log => {
            // If log is newer than 5 seconds
            const logTime = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
            const diff = (now - logTime) / 1000;

            if (diff < 5) {
                // Normalize agent ID
                const agentId = log.agent?.toLowerCase().replace(' ', '_');
                // Find matching agent config
                const config = AGENTS.find(a => a.id === agentId || (agentId.includes(a.id)));

                if (config) {
                    newActiveState[config.id] = {
                        isActive: true,
                        lastLog: log.description
                    };
                }
            }
        });

        setActiveState(newActiveState);

        // Cleanup interval to toggle off old states
        const interval = setInterval(() => {
            setActiveState(prev => {
                const next = { ...prev };
                let changed = false;
                Object.keys(next).forEach(key => {
                    // Check if we should turn it off (this is a simplified logic, 
                    // essentially we depend on the parent passing updated logs or we'd custom track time here)
                    // For visual effect, let's just rely on the prop updates mostly, 
                    // but we force a clutter cleanup here if needed. 
                });
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [recentLogs]);

    return (
        <div className="h-full w-full flex items-center justify-center bg-[#050505] relative overflow-hidden">
            {/* Background Grid Ambience */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none"></div>

            {/* Hive Container - Centered */}
            <div className="relative w-[320px] h-[260px] flex items-center justify-center">
                {/* Row 0 - Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
                    {AGENTS.filter(a => a.row === 0).map(agent => (
                        <HexCell
                            key={agent.id}
                            agent={agent}
                            isActive={activeState[agent.id]?.isActive}
                            lastLog={activeState[agent.id]?.lastLog}
                        />
                    ))}
                </div>

                {/* Row 1 - Middle */}
                <div className="absolute top-[85px] left-1/2 -translate-x-1/2 flex gap-2">
                    {AGENTS.filter(a => a.row === 1).map(agent => (
                        <HexCell
                            key={agent.id}
                            agent={agent}
                            isActive={activeState[agent.id]?.isActive}
                            lastLog={activeState[agent.id]?.lastLog}
                        />
                    ))}
                </div>

                {/* Row 2 - Bottom */}
                <div className="absolute top-[170px] left-1/2 -translate-x-1/2 flex gap-2">
                    {AGENTS.filter(a => a.row === 2).map(agent => (
                        <HexCell
                            key={agent.id}
                            agent={agent}
                            isActive={activeState[agent.id]?.isActive}
                            lastLog={activeState[agent.id]?.lastLog}
                        />
                    ))}
                </div>
            </div>

            {/* Empty state pulsing help */}
            {Object.keys(activeState).length === 0 && (
                <div className="absolute bottom-4 text-slate-700 text-[10px] font-mono animate-pulse">
                    AWAITING NEURAL UPLINK...
                </div>
            )}
        </div>
    );
}
