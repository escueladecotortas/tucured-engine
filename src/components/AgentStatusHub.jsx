import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';

export default function AgentStatusHub({ projectId, className = "" }) {
    const [activeAgents, setActiveAgents] = useState([]);

    useEffect(() => {
        // 1. Listen to Project Agents
        const qProject = query(
            collection(db, 'projects', projectId || 'general', 'agents'),
            where('status', '==', 'working')
        );

        // 2. Listen to Global Agents (Fallback)
        const qGlobal = query(
            collection(db, 'agents'),
            where('status', '==', 'working')
        );

        const unsubProject = onSnapshot(qProject, (snap) => {
            const pAgents = snap.docs.map(d => ({ id: d.id, ...d.data(), source: 'project' }));
            // Merge logic could be complex, but for now let's just use a state updater that handles overrides
            setActiveAgents(prev => {
                // Filter out previous project agents, keep global, add new project agents
                const others = prev.filter(a => a.source === 'global');
                return [...others, ...pAgents];
            });
        });

        const unsubGlobal = onSnapshot(qGlobal, (snap) => {
            const gAgents = snap.docs.map(d => ({ id: d.id, ...d.data(), source: 'global' }));
            setActiveAgents(prev => {
                // Filter out previous global agents, keep project, add new global agents
                const others = prev.filter(a => a.source === 'project');
                return [...others, ...gAgents];
            });
        });

        return () => {
            unsubProject();
            unsubGlobal();
        };
    }, [projectId]);

    if (activeAgents.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`bg-indigo-900/40 border border-indigo-500/30 rounded-lg p-3 mb-4 backdrop-blur-sm ${className}`}
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                    <Cpu className="w-4 h-4 text-indigo-300" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Neural Activity Detected
                </h4>
            </div>

            <div className="space-y-2">
                {activeAgents.map(agent => (
                    <div key={agent.id} className="flex items-center gap-3 bg-indigo-500/10 rounded p-2 border border-indigo-500/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
                            {agent.name ? agent.name.substring(0, 2).toUpperCase() : 'AI'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-white truncate">{agent.name || agent.id}</span>
                                <span className="text-[9px] text-emerald-400 font-mono animate-pulse">WORKING</span>
                            </div>
                            <p className="text-[10px] text-indigo-300 truncate">
                                {agent.current_task || 'Processing data...'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
