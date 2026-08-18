// Archivo: src/components/widgets/tactical/TacticalExtras.jsx
import React from 'react';
import { ArrowRight, CheckCircle2, Target, Globe, Plus } from 'lucide-react';
import { navigate } from '../../../hooks/useAppLogic';

export function TacticalFooter({ projectId }) {
    const projId = projectId || 'tucu-red';
    return (
        <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between font-mono">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Radar de Ejecución</span>
            <button 
                onClick={() => navigate(`/project/${projId}?tab=missions`)}
                className="text-[10px] text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
            >
                <span>Ver Misiones</span> <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    );
}

export function EmptyState({ projectId }) {
    const projId = projectId || 'tucu-red';

    return (
        <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-white/5 rounded-2xl border border-white/5 font-mono">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Pipeline de Operaciones Activo
            </h4>
            <p className="text-[11px] text-gray-400 max-w-sm mb-4 leading-relaxed">
                No hay bloqueos críticos pendientes. El enjambre de 14 agentes está sincronizado con la fábrica de leads y el catálogo de producción.
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={() => navigate(`/project/${projId}?tab=leads`)}
                    className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                    <Target className="w-3.5 h-3.5" /> Explorar Leads
                </button>
                <button
                    onClick={() => navigate(`/project/${projId}?tab=portfolio`)}
                    className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                    <Globe className="w-3.5 h-3.5" /> Ver Portafolio
                </button>
            </div>
        </div>
    );
}
