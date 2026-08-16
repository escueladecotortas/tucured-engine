// Archivo: frontend/src/components/tabs/KanbanView.jsx
// StrategyRadar + KanbanColumn — vistas del tablero de misiones.
// Extraídas del monolito MissionsTab.jsx — Ley de 200 Líneas 2026.

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle } from 'lucide-react';
import { STATUS_CONFIG, AGENTS } from './missions-config';
import MissionCard from './MissionCard';

/**
 * StrategyRadar — Visualización de distribución de misiones por agente.
 */
export const StrategyRadar = ({ missions }) => {
    const distribution = React.useMemo(() => {
        const counts = {};
        AGENTS.forEach(a => (counts[a.id] = 0));
        missions.forEach(m => { if (m.assignedTo && counts[m.assignedTo] !== undefined) counts[m.assignedTo]++; });
        const max = Math.max(...Object.values(counts), 1);
        return AGENTS.map(a => ({ ...a, value: counts[a.id], percent: (counts[a.id] / max) * 100 }));
    }, [missions]);

    return (
        <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Target className="w-24 h-24 text-indigo-500" />
            </div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <Zap className="w-4 h-4 text-emerald-400" /> Distribución Estratégica de Energía
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Barras de distribución */}
                <div className="space-y-4">
                    {distribution.map(d => (
                        <div key={d.id} className="group">
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="flex items-center gap-1.5 text-gray-300">
                                    <div className={`w-2 h-2 rounded-full bg-${d.color}-500`} />
                                    {d.name} <span className="text-gray-600">({d.role})</span>
                                </span>
                                <span className="font-mono text-gray-400">{d.value} misiones</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${d.percent}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full bg-${d.color}-500 rounded-full group-hover:brightness-125 transition-all`} />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Panel de análisis */}
                <div className="flex flex-col justify-center">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-white mb-2">Análisis Nexus</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            El foco operativo actual está ponderado hacia
                            <strong className="text-indigo-400"> implementación </strong>
                            y <strong className="text-emerald-400">crecimiento</strong>.
                            Considera asignar más recursos a
                            <strong className="text-purple-400"> refinamiento de diseño </strong>
                            en el próximo ciclo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * KanbanColumn — Columna individual del tablero kanban de misiones.
 */
export const KanbanColumn = ({ status, missions, onStatusChange, onDelete, onEdit }) => {
    const config = STATUS_CONFIG[status];
    return (
        <div className="flex-1 min-w-[300px] flex flex-col bg-[#0A0A1A]/30 border border-white/5 rounded-xl overflow-hidden h-full">
            <div className={`p-3 border-b border-white/5 ${config.bg} flex justify-between items-center`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest text-${config.color}-400`}>{config.label}</h3>
                <span className="text-[10px] font-mono bg-black/20 px-2 py-0.5 rounded text-gray-400">{missions.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {missions.map(mission => (
                    <MissionCard key={mission.id} mission={mission} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
                ))}
                {missions.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-white/5 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-gray-600 uppercase">Vacío</span>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * ListView — Vista de lista plana de misiones.
 */
export const ListView = ({ missions, onStatusChange, onDelete, onEdit }) => (
    <div className="h-full overflow-y-auto custom-scrollbar space-y-3">
        {missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
        ))}
        {missions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Target className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No se encontraron misiones</p>
            </div>
        )}
    </div>
);
