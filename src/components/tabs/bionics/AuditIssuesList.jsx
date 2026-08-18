// Archivo: src/components/tabs/bionics/AuditIssuesList.jsx
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Wrench, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export function AuditIssuesList({ issues = [], logs = [] }) {
    const items = (issues && issues.length > 0) ? issues : logs;
    const [repairedIds, setRepairedIds] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const handleAutoFix = async (item, idx) => {
        const itemId = item.id || `issue-${idx}`;
        setLoadingId(itemId);
        const toastId = toast.loading(`Codi procesando reparación para "${item.title || item.message}"...`);

        try {
            const res = await fetch('/api/nexus/apply-html-patch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    issueId: itemId,
                    title: item.title || item.message,
                    desc: item.desc,
                    severity: item.severity || 'warning'
                })
            });

            if (res.ok) {
                // Copiar directiva técnica al portapapeles
                const directive = `[CODI AUTO-FIX] Incidencia: ${item.title || item.message}. Solución: ${item.desc || 'Optimización aplicada'}.`;
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(directive).catch(() => {});
                }
                setRepairedIds(prev => [...prev, itemId]);
                toast.success("¡Parche aplicado por Codi y copiado!", { id: toastId });
            } else {
                throw new Error("Fallo al aplicar parche");
            }
        } catch (e) {
            toast.error("Error al aplicar parche automático", { id: toastId });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col h-full font-mono">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-400" /> Diagnóstico y Accionabilidad
                </h4>
                <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {items.length} Hallazgos
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                {items && items.length > 0 ? (
                    items.map((item, i) => {
                        const itemId = item.id || `issue-${i}`;
                        const isRepaired = repairedIds.includes(itemId);
                        const isOptimal = (item.severity === 'optimal' || item.type === 'success') && !isRepaired;
                        const isWarning = item.severity === 'warning' || item.type === 'warning';
                        const title = item.title || item.message || item.text || `Diagnóstico #${i + 1}`;
                        const desc = item.desc || (item.type ? `Nivel de telemetría: ${item.type}` : '');

                        return (
                            <div key={itemId} className={`p-3 rounded-xl border transition-all ${
                                isRepaired ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'
                            }`}>
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        {isRepaired || isOptimal ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        ) : isWarning ? (
                                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                        ) : (
                                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                        )}
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                            isRepaired || isOptimal ? 'text-emerald-400' : isWarning ? 'text-yellow-400' : 'text-rose-400'
                                        }`}>
                                            {isRepaired ? 'REPARADO' : (item.severity || item.type || 'INFO')}
                                        </span>
                                    </div>

                                    {!isOptimal && !isRepaired && (
                                        <button
                                            onClick={() => handleAutoFix(item, i)}
                                            disabled={loadingId === itemId}
                                            className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                            title="Auto-reparar con Codi"
                                        >
                                            <Wrench className="w-2.5 h-2.5" />
                                            <span>{loadingId === itemId ? 'Reparando...' : 'Reparar con Codi'}</span>
                                        </button>
                                    )}
                                </div>

                                <h5 className="text-xs font-bold text-gray-200">{title}</h5>
                                {desc && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{desc}</p>}
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                        <CheckCircle2 size={28} className="text-emerald-400 opacity-60" />
                        <p className="text-[10px] uppercase">Sin incidencias detectadas</p>
                    </div>
                )}
            </div>
        </div>
    );
}
