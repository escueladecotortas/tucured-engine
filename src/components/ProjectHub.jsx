import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import { Plus, Command, Search, Zap, FlaskConical } from 'lucide-react';
// import AgentLab from '../legacy_backup/AgentLab';

export default function ProjectHub() {
    const [showAgentLab, setShowAgentLab] = useState(false);

    return (
        <div className="min-h-screen bg-[#030014] text-white p-8 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-2">
                        Nexus Project Hub
                    </h1>
                    <p className="text-gray-400">Select a neural workspace to begin.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 w-64 transition-all"
                        />
                    </div>

                    {/* Neural Team Button */}
                    <button
                        onClick={() => setShowAgentLab(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full font-medium text-sm transition-all text-green-400 border-green-500/30 hover:border-green-500/50"
                    >
                        <Zap className="w-4 h-4" /> Neural Team
                    </button>

                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">LL</span>
                    </div>
                </div>
            </header>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.filter(p => p.status !== 'pilot').map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ProjectCard
                            project={project}
                            onClick={(id) => window.location.hash = `/project/${id}`}
                        />
                    </motion.div>
                ))}

                {/* Add New Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: projects.length * 0.1 }}
                    className="group border border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all min-h-[200px]"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="w-8 h-8 text-gray-500 group-hover:text-indigo-400" />
                    </div>
                    <h3 className="text-gray-400 group-hover:text-white font-medium transition-colors">Initialize New Node</h3>
                </motion.div>
            </div>

            {/* System Status Footer */}
            <div className="fixed bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg px-4 py-2 pointer-events-auto flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-gray-300 font-mono">SYSTEM OPERATIONAL</span>
                    </div>
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-xs text-gray-500 font-mono">V 5.5 NEXUS PRO</span>
                </div>
            </div>

            {/* Agent Lab Modal */}
            <AnimatePresence>
                {showAgentLab && <AgentLab onClose={() => setShowAgentLab(false)} />}
            </AnimatePresence>
        </div>
    );
}
