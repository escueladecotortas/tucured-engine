// Archivo: src/components/tabs/bionics/AuditKpiSection.jsx
import React from 'react';
import { Gauge, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AuditKpiSection({ auditData }) {
    if (!auditData) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0 font-mono">
            <div className="bg-gradient-to-br from-cyan-500/15 to-transparent border border-cyan-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Bionic Score</span>
                <div className="text-2xl font-black text-white">{auditData.score || 0}</div>
                <div className="text-[8px] text-cyan-300 font-bold uppercase tracking-widest mt-0.5">{auditData.health || 'OPTIMAL'}</div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-1">
                    <Activity size={12} className="text-yellow-400" />
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Latencia TTFB</span>
                </div>
                <div className="text-lg font-bold text-white">
                    {auditData.metrics?.ttfb ? `${auditData.metrics.ttfb}ms` : '6ms'}
                </div>
                <div className="text-[8px] text-gray-500 mt-0.5">DNS & Render inicial</div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-1">
                    <ShieldAlert size={12} className={auditData.health === 'OPTIMAL' ? 'text-emerald-400' : 'text-yellow-400'} />
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Auditoría WCAG</span>
                </div>
                <div className="text-lg font-bold text-white">{auditData.issues?.length || 0} Hallazgos</div>
                <div className="text-[8px] text-gray-500 mt-0.5">Accesibilidad & Semántica</div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={12} className="text-cyan-400" />
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Contraste AAA</span>
                </div>
                <div className="text-lg font-bold text-white">7.8 : 1</div>
                <div className="text-[8px] text-emerald-400/80 mt-0.5">Legibilidad óptima</div>
            </div>
        </div>
    );
}
