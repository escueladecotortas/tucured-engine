// Archivo: frontend/src/components/tabs/AgentGridView.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AgentGridView = ({ agents, managerId, projectId, onAgentClick }) => (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Neural Team</h2>
        <p className="text-gray-400 mb-8">Active agents deployed on {projectId || 'Network'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map(agent => (
                <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    onClick={() => onAgentClick && onAgentClick(agent)}
                    className={`bg-[#0A0A1A]/60 border rounded-xl p-6 relative overflow-hidden group cursor-pointer transition-colors
                        ${agent.id === managerId ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-white/10'}
                    `}
                >
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:via-indigo-500/5 group-hover:to-indigo-500/10 transition-all duration-500"></div>

                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-20 h-20 rounded-2xl mb-4 overflow-hidden shadow-lg ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                            <img
                                src={`/avatars/team_${agent.id}.png`}
                                alt={agent.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                        <div className="text-xs text-nexus-cyan font-mono mb-2">{agent.role}</div>
                        <p className="text-xs text-center text-gray-500 line-clamp-2">{agent.desc}</p>

                        {agent.id === managerId && (
                            <div className="mt-3 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded-full border border-indigo-500/30 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                PROJECT LEAD
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

export default AgentGridView;
