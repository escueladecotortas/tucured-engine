// Archivo: src/components/tabs/AgentGridView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const AgentGridView = ({ agents, managerId, projectId, onAgentClick }) => (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
        <h2 className="text-2xl font-bold text-white mb-2 font-['Outfit']">Neural Team</h2>
        <p className="text-gray-400 mb-8 font-mono text-xs">14 Agentes Especialistas desplegados en {projectId || 'Tucu Red'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map(agent => {
                const IconComponent = agent.icon || Zap;
                return (
                    <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        onClick={() => onAgentClick && onAgentClick(agent)}
                        className={`bg-[#0A0A1A]/60 border rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all
                            ${agent.id === managerId ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/10 hover:border-white/25'}
                        `}
                    >
                        <div className="flex flex-col items-center relative z-10">
                            <div 
                                className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center shadow-lg ring-2 ring-white/10 group-hover:ring-white/30 transition-all border"
                                style={{ backgroundColor: `${agent.color}15`, borderColor: `${agent.color}40` }}
                            >
                                <IconComponent className="w-9 h-9 transition-transform duration-500 group-hover:scale-110" style={{ color: agent.color }} />
                            </div>
                            <h3 className="text-lg font-bold text-white font-['Outfit']">{agent.name}</h3>
                            <div className="text-xs text-nexus-cyan font-mono mb-2">{agent.role}</div>
                            <p className="text-xs text-center text-gray-400 line-clamp-2">{agent.desc}</p>

                            {agent.id === managerId && (
                                <div className="mt-3 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded-full border border-indigo-500/30 flex items-center gap-1.5 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                    PROJECT LEAD
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
);

export default AgentGridView;
