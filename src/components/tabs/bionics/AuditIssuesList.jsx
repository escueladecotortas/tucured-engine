// Archivo: frontend/src/components/tabs/bionics/AuditIssuesList.jsx
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function AuditIssuesList({ logs }) {
    return (
        <div className="col-span-12 lg:col-span-4 bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col h-[500px]">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-500" /> Detalle de Hallazgos
            </h4>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {logs && logs.length > 0 ? (
                    logs.map((log, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl transition-all hover:bg-white/10">
                            <div className={`text-[8px] font-bold uppercase mb-1 ${log.type === 'error' ? 'text-red-400' : 'text-yellow-500'}`}>
                                {log.type}
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono leading-relaxed line-clamp-3">
                                {log.text}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20">
                        <CheckCircle2 size={40} className="mb-2" />
                        <p className="text-[9px] uppercase tracking-widest">No critical issues</p>
                    </div>
                )}
            </div>
        </div>
    );
}
