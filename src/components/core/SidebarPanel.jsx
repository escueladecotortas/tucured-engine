// Archivo: src/components/core/SidebarPanel.jsx
import React from 'react';

const QuickProductionActions = React.lazy(() => import('../widgets/QuickProductionActions'));
const AgentStatusHub = React.lazy(() => import('../AgentStatusHub'));
const SmartNotepad = React.lazy(() => import('../SmartNotepad'));

export default function SidebarPanel({ activeWidgets, projectId, projectData }) {
    return (
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden min-h-0 z-20 flex flex-col gap-4">
            {/* 1. Accesos Rápidos de Producción */}
            <div className="shrink-0">
                <React.Suspense fallback={<div className="h-28 bg-white/5 animate-pulse rounded-2xl" />}>
                    <QuickProductionActions projectId={projectId} />
                </React.Suspense>
            </div>

            {/* 2. Actividad de Agentes */}
            <div className="shrink-0">
                <React.Suspense fallback={<div className="h-20 bg-white/5 animate-pulse rounded-2xl" />}>
                    <AgentStatusHub projectId={projectId} />
                </React.Suspense>
            </div>

            {/* 3. Bloc de Notas de Sesión (Altura Completa) */}
            <div className="flex-1 min-h-0 relative flex flex-col glass-panel rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="p-3.5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-200 uppercase font-mono tracking-wider">Notas de Sesión</span>
                    <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">AUTOSAVE</span>
                </div>
                <React.Suspense fallback={<div className="p-4 text-xs text-gray-500 font-mono">Cargando Notas...</div>}>
                    <SmartNotepad clientId={projectId} />
                </React.Suspense>
            </div>
        </div>
    );
}
