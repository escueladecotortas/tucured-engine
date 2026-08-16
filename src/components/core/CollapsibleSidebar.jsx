// ============================================
// COLLAPSIBLE SIDEBAR - Navegación con Agentes
// NEXUS PRO v1.0
// ============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Folder, Brain, Users,
    Settings, Zap, Terminal, Search, Target
} from 'lucide-react';
import WorkspaceSelector from '../WorkspaceSelector';

// Lista de agentes del sistema con sus avatares
const AGENTS = [
    { id: 'antigravity', name: 'Antigravity', role: 'Chief Architect', color: '#d946ef' },
    { id: 'nexus', name: 'Nexus', role: 'System Operator', color: '#22d3ee' },
    { id: 'atenea', name: 'Atenea', role: 'Design Lead', color: '#818cf8' },
    { id: 'codi', name: 'Codi', role: 'Code Engineer', color: '#34d399' },
    { id: 'lorem', name: 'Lorem', role: 'Copywriter', color: '#fbbf24' },
    { id: 'icaro', name: 'Ícaro', role: 'Growth Hacker', color: '#f472b6' },
    { id: 'tucu_red', name: 'Tucu Red', role: 'Agency Manager', color: '#ef4444' },
    { id: 'deco', name: 'Deco', role: 'E-commerce Lead', color: '#fb923c' },
    { id: 'atlas', name: 'Atlas', role: 'Knowledge Base', color: '#3b82f6' },
    { id: 'licitia', name: 'Licítia', role: 'Legal Tech', color: '#10b981' },
    { id: 'elara', name: 'Elara', role: 'File Archivist', color: '#a78bfa' },
    { id: 'kael', name: 'Kael', role: 'SRE Engineer', color: '#64748b' },
    { id: 'argus', name: 'Argus', role: 'QA Lead', color: '#06b6d4' },
    { id: 'orion', name: 'Orion', role: 'Security Chief', color: '#f43f5e' },
];

/**
 * CollapsibleSidebar - Sidebar estilo VS Code con avatares de agentes
 * 
 * @param {function} onAgentClick - Callback cuando se clickea un agente
 * @param {string} activeAgentId - ID del agente actualmente seleccionado
 * @param {function} onNavigate - Callback para navegación (vault, brain, etc)
 */
// Core Team IDs - Always Visible
const CORE_TEAM = ['antigravity', 'nexus', 'atenea', 'codi', 'lorem'];

export default function CollapsibleSidebar({
    onAgentClick,
    activeAgentId,
    onNavigate,
    recentLogs = [],
    className = '',
    // New Props for Lifted State & Filtering
    isExpanded = true,
    onToggle,
    managerAgentId = null,
    navItems = [],
    activeTab,
    currentWorkspace,
    onWorkspaceChange
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeAgents, setActiveAgents] = useState({});

    // Calculate Active Agents (The Pulse Logic)
    useEffect(() => {
        if (!recentLogs.length) return;
        const now = new Date();
        const active = {};

        recentLogs.forEach(log => {
            const time = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
            const diff = (now - time) / 1000;
            if (diff < 5) { // Active in last 5 seconds
                const agentId = AGENTS.find(a =>
                    log.agent?.toLowerCase().includes(a.id) ||
                    a.id.includes(log.agent?.toLowerCase())
                )?.id;
                if (agentId) active[agentId] = true;
            }
        });
        setActiveAgents(active);
    }, [recentLogs]);

    // Filter logic removed as Agent List is deprecated in Sidebar.

    return (
        <motion.aside
            initial={false}
            animate={{ width: isExpanded ? 280 : 70 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`h-full glass-panel border-r border-nexus-border flex flex-col relative z-50 ${className}`}
        >
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-6 z-20 w-6 h-6 bg-nexus-bg border border-nexus-orange/50 rounded-full flex items-center justify-center hover:bg-nexus-orange hover:text-white hover:scale-110 transition-all shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            >
                {isExpanded ? <ChevronLeft className="w-3 h-3 text-nexus-orange hover:text-white" /> : <ChevronRight className="w-3 h-3 text-nexus-orange hover:text-white" />}
            </button>

            {/* Header */}
            <div className="p-4 border-b border-white/5 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                    {/* ... existing Logo ... */}
                    {isExpanded ? (
                        <motion.div
                            key="expanded-header"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.05 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-orange to-pink-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white tracking-wide font-['Outfit']">NEXUS PRO</h2>
                                <p className="text-[10px] text-nexus-cyan font-mono tracking-wider">v5.4 NEON</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="collapsed-logo" className="flex justify-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-orange to-pink-600 flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* WORKSPACE SELECTOR (Only Visible when Expanded) */}
                {/* WORKSPACE SELECTOR (Only Visible when Expanded) */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: 0.1 }}
                        >
                            <WorkspaceSelector
                                currentWorkspace={currentWorkspace}
                                onWorkspaceChange={onWorkspaceChange}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-white/5 p-2 space-y-1 bg-transparent">
                {(navItems || []).filter(t => t.id !== 'agents').map(tab => (
                    <NavItem
                        key={tab.id}
                        icon={tab.icon}
                        label={tab.label}
                        isExpanded={isExpanded}
                        active={activeTab === tab.id}
                        colorClass={tab.colorClass}
                        onClick={() => onNavigate?.(tab.id)}
                    />
                ))}
            </div>
        </motion.aside>
    );
}

// Componente auxiliar para items de navegación
function NavItem({ icon: Icon, label, isExpanded, onClick, active, colorClass }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all clickable-scale ${active
                ? `nav-item-active-glow text-white ${colorClass || ''}`
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            title={!isExpanded ? label : undefined}
        >
            <Icon className={`w-4 h-4 flex-shrink-0 ${active && 'animate-pulse'}`} />
            <AnimatePresence>
                {isExpanded && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
