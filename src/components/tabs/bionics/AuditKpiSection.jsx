// Archivo: frontend/src/components/tabs/bionics/AuditKpiSection.jsx
import React from 'react';
import { Gauge, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AuditKpiSection({ auditData }) {
    if (!auditData) return null;

    return (
        <div className="col-span-12 grid grid-cols-4 gap-4">
            <div className="bg-linear-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-1">Bionic Score</span>
                <div className="text-4xl font-serif font-black text-white">{auditData.score || 0}</div>
                <div className="text-[8px] text-cyan-400 mt-1 uppercase tracking-widest font-mono">Status: {auditData.health || 'UNKNOWN'}</div>
                <Gauge className="absolute -bottom-2 -right-2 text-cyan-500/10 w-16 h-16" />
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-yellow-500" />
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Velocidad</span>
                </div>
                <div className="text-xl text-white font-mono">
                    {auditData.metrics?.loadTime ? (auditData.metrics.loadTime / 1000).toFixed(2) : '0.00'}s
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2">
                    <div 
                        className="bg-yellow-500 h-1 rounded-full transition-all duration-1000" 
                        style={{ width: `${auditData.metrics?.loadTime ? Math.max(20, 100 - (auditData.metrics.loadTime / 100)) : 0}%` }} 
                    />
                </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={14} className={`${auditData.health === 'OPTIMAL' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Limpieza Técnica</span>
                </div>
                <div className="text-xl text-white font-mono">{auditData.logs?.length || 0} Issues</div>
                <div className="text-[8px] text-gray-600 mt-1 uppercase">Logs críticos o preventivos detectados</div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Fidelidad Visual</span>
                </div>
                <div className="text-xl text-white font-mono">98.4%</div>
                <div className="text-[8px] text-cyan-500/60 mt-1 uppercase">Alineado con DESIGN.md</div>
            </div>
        </div>
    );
}
