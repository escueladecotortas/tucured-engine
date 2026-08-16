import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, Database, Radio } from 'lucide-react';

const AgentCard = ({ agent, status }) => {
    // Determine colors/animations based on status
    const isThinking = status === 'THINKING';
    const isWorking = status === 'WORKING';
    const isError = status === 'ERROR';

    let statusColor = "bg-gray-500/10 border-gray-500/20 text-gray-500";
    let glow = "";

    if (isThinking) {
        statusColor = "bg-purple-500/20 border-purple-500/40 text-purple-400";
        glow = "shadow-[0_0_15px_rgba(168,85,247,0.3)]";
    } else if (isWorking) {
        statusColor = "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
        glow = "shadow-[0_0_15px_rgba(16,185,129,0.3)]";
    } else if (isError) {
        statusColor = "bg-rose-500/20 border-rose-500/40 text-rose-400";
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative p-4 rounded-xl border backdrop-blur-md transition-all duration-300
                ${statusColor} ${glow}
                flex flex-col gap-3 min-w-[140px]
            `}
        >
            {/* Thinking Pulse */}
            {isThinking && (
                <div className="absolute inset-0 rounded-xl animate-pulse bg-purple-500/5 pointer-events-none"></div>
            )}

            <div className="flex items-center justify-between">
                <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${isWorking ? 'animate-bounce' : ''}
                    bg-white/10
                `}>
                    <Cpu className="w-4 h-4" />
                </div>
                {/* Status Indicator Dot */}
                <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-purple-400 animate-ping' : isWorking ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
            </div>

            <div>
                <h4 className="text-sm font-bold text-white tracking-wide uppercase">{agent.name}</h4>
                <p className="text-[10px] opacity-70 font-mono truncate">{agent.role}</p>
            </div>

            <div className="text-[9px] font-mono bg-black/30 px-2 py-1 rounded inline-block self-start border border-white/5">
                STATUS: {status || 'IDLE'}
            </div>
        </motion.div>
    );
};

export default function AgentGrid({ socket }) {
    const [agents, setAgents] = useState([]);
    const [agentStates, setAgentStates] = useState({});

    // Fetch initial list
    useEffect(() => {
        fetch('/api/agents')
            .then(res => res.json())
            .then(data => setAgents(data))
            .catch(err => console.error("Failed to load agents", err));
    }, []);

    // Listen for state changes
    useEffect(() => {
        if (!socket) return;

        // Init: We might want to ask backend for current states if we join mid-session
        // For now, assume IDLE until event.

        const handleState = (data) => {
            // data = { id: 'nexus', state: 'THINKING' }
            setAgentStates(prev => ({
                ...prev,
                [data.id]: data.state
            }));
        };

        socket.on('agent:state', handleState);
        return () => socket.off('agent:state', handleState);
    }, [socket]);

    const activeList = agents.length > 0 ? agents : [
        // Skeleton / Fallback if fetch fails
        { id: 'nexus', name: 'NEXUS', role: 'Orchestrator' },
        { id: 'antigravity', name: 'ANTIGRAVITY', role: 'Builder' }
    ];

    return (
        <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 custom-scrollbar mask-gradient-right">
            {activeList.map(agent => (
                <div key={agent.id} className="shrink-0 w-[140px]">
                    <AgentCard
                        agent={agent}
                        status={agentStates[agent.id] || 'IDLE'}
                    />
                </div>
            ))}
        </div>
    );
}
