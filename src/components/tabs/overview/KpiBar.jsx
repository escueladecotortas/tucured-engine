// Archivo: src/components/tabs/overview/KpiBar.jsx
import React from 'react';
import { Shield, Zap, Activity, ChevronUp } from 'lucide-react';
import { navigate } from '../../../hooks/useAppLogic';

export function KpiBar({ vibe, projectData }) {
    return (
        <div className="flex flex-wrap items-center gap-6 p-3 bg-black/40 backdrop-blur-md border-b border-white/10 shrink-0 w-full z-20">
            <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <div className="relative w-8 h-8 rounded-full border border-amber-500/50 flex items-center justify-center bg-black overflow-hidden shrink-0">
                    {projectData?.image ? (
                        <img
                            src={projectData.image}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = "none")}
                            alt={projectData.name}
                        />
                    ) : (
                        <span className="text-xs font-bold text-amber-500">
                            {projectData?.name?.substring(0, 2).toUpperCase() || "NX"}
                        </span>
                    )}
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white tracking-widest uppercase">
                        {projectData?.name || "NEXUS HQ"}
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: vibe?.palette?.primary || '#F97316' }}
                        ></span>
                        <span className="text-[9px] font-mono text-gray-400">
                            VIBRA {vibe?.number || 8}
                        </span>
                    </div>
                </div>
            </div>

            {/* Compact KPIs */}
            <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-mono uppercase">Status</span>
                        <span className="text-xs font-bold text-white">NOMINAL</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-mono uppercase">Misiones</span>
                        <span className="text-xs font-bold text-white">ACTIVAS</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-fuchsia-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-mono uppercase">Fase SOP</span>
                        <span className="text-xs font-bold text-white">
                            {projectData?.status === "onboarding" ? "INICIO" : "ACTIVO"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/?start=lobby')}
                    className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer font-mono"
                    title="Volver a la Entrada Cinemática"
                >
                    <ChevronUp className="w-3 h-3" /> LOBBY
                </button>
            </div>
        </div>
    );
}
