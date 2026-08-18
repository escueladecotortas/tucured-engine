// Archivo: src/components/widgets/QuickProductionActions.jsx
import React from 'react';
import { Target, Globe, Terminal, BookOpen, ArrowUpRight } from 'lucide-react';
import { navigate } from '../../hooks/useAppLogic';

export default function QuickProductionActions({ projectId }) {
    const projId = projectId || 'tucu-red';

    const actions = [
        { label: 'Fábrica de Leads', icon: Target, tab: 'leads', color: 'text-indigo-400', bg: 'hover:bg-indigo-500/10' },
        { label: 'Portfolio Clientes', icon: Globe, tab: 'portfolio', color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10' },
        { label: 'Terminal Core', icon: Terminal, tab: 'terminal', color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10' },
        { label: 'Biblioteca SOPs', icon: BookOpen, tab: 'library', color: 'text-amber-400', bg: 'hover:bg-amber-500/10' }
    ];

    return (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl font-mono shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Accesos Rápidos</span>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">PRODUCCIÓN</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {actions.map((act) => {
                    const Icon = act.icon;
                    return (
                        <button
                            key={act.tab}
                            onClick={() => navigate(`/project/${projId}?tab=${act.tab}`)}
                            className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${act.bg} hover:border-white/15 transition-all text-left group flex flex-col justify-between cursor-pointer`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Icon className={`w-4 h-4 ${act.color}`} />
                                <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-200 group-hover:text-white leading-tight">
                                {act.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
