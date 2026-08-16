import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Terminal, Activity, Zap, List, LayoutGrid } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import MemoryAidWidget from './widgets/MemoryAidWidget';

export default function WorkspaceOverview({ projectId, onOpenClient }) {
    // ... filters ...
    const isStrategy = projectId === 'tucu-red' || projectId === 'atlas-corp';
    // ...
    const workspaceProjects = projects.filter(p => {
        if (projectId === 'tucu-red') return true;
        return p.id !== 'tucu-red';
    });

    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="h-full bg-transparent text-text-primary overflow-y-auto custom-scrollbar font-['Outfit'] p-8 relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-nexus-cyan/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-nexus-purple/10 blur-[120px] rounded-full" />
            </div>

            {/* HEADER SECTION */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/5 pb-6">
                {/* Left: Title */}
                <div className="self-start md:self-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nexus-orange animate-pulse shadow-[0_0_10px_#F97316]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-nexus-orange font-bold font-['Outfit']">
                            Torre Nexus
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight font-['Outfit']">
                        {projectId === 'tucu-red' ? 'Comando de Agencia' :
                            projectId === 'deco-tortas' ? 'Operaciones (Bakery)' :
                                projectId === 'atlas-corp' ? 'Centro de Estrategia' : 'Lobby del Sistema'}
                    </h1>
                </div>

                {/* Controls: Search Only */}
                <div className="flex items-center gap-3 self-start md:self-auto mt-4 md:mt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar nodo..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-nexus-orange outline-none w-64 transition-all placeholder-gray-600 focus:bg-white/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* LEFT: Concierge (Wider now) */}
                <div className="lg:col-span-5 h-full min-h-[350px]">
                    <MemoryAidWidget />
                </div>

                {/* RIGHT: Active Projects Focus */}
                <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-nexus-orange shadow-[0_0_10px_#F97316]" />
                            Pisos Activos
                        </h2>
                    </div>

                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {workspaceProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={{
                                    ...project,
                                    status: project.id === 'tucu-red' ? 'ACTIVE' : 'STANDBY'
                                }}
                                onOpen={() => onOpenClient(project.id)}
                            />
                        ))}

                        {/* Add Project Ghost Card */}
                        <button className="group border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 min-h-[200px] hover:border-nexus-orange/50 hover:bg-nexus-orange/5 transition-all bg-white/5">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5 group-hover:border-nexus-orange/30">
                                <Plus className="w-6 h-6 text-gray-500 group-hover:text-nexus-orange" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-nexus-orange">Desplegar Nuevo Nodo</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
