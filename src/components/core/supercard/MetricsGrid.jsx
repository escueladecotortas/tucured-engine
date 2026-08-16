// Archivo: frontend/src/components/core/supercard/MetricsGrid.jsx
import React from 'react';
import { Users, Activity, CheckCircle2 } from 'lucide-react';

const MetricsGrid = ({ client, viewMode }) => {
    if (viewMode !== 'grid') return null;

    return (
        <>
            {/* Row 1: Core Metrics */}
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

            {/* Row 2: Tech & Health (New Density) */}
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
    );
};

export default MetricsGrid;
