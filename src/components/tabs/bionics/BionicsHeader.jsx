// Archivo: src/components/tabs/bionics/BionicsHeader.jsx
import React from 'react';
import { ScanEye, Globe, Zap, Loader2, Terminal, FileDown } from 'lucide-react';

export function BionicsHeader({
    url = '',
    onUrlChange = () => {},
    loading = false,
    onCapture,
    onExportReport,
    canExport = false,
    logs = []
}) {
    const safeLogs = Array.isArray(logs) ? logs : [];

    return (
        <div className="grid grid-cols-12 gap-4 shrink-0 font-mono">
            <section className="col-span-12 lg:col-span-8 bg-black/40 border border-white/10 rounded-2xl p-4 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ScanEye className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-sm font-bold text-white tracking-wider">
                            NEXUS <span className="text-cyan-400">VISION</span>
                        </h2>
                        <span className="text-[10px] text-gray-500 font-mono ml-2 hidden sm:inline">Auditoría Biónica & WCAG</span>
                    </div>

                    {canExport && (
                        <button
                            onClick={onExportReport}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            title="Exportar Ficha Comercial de Diagnóstico"
                        >
                            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Exportar Reporte</span>
                        </button>
                    )}
                </div>
                
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                        <input 
                            type="url" 
                            placeholder="http://localhost:5005"
                            value={url}
                            onChange={(e) => onUrlChange(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-white font-mono text-xs focus:border-cyan-500/50 outline-none transition-all"
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={onCapture}
                        disabled={loading || !url}
                        className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                            loading ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-950/40'
                        }`}
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        {loading ? 'AUDITANDO...' : 'INICIAR AUDITORÍA'}
                    </button>
                </div>
            </section>

            <aside className="col-span-12 lg:col-span-4 bg-black/40 border border-white/10 rounded-2xl p-3.5 shadow-xl flex flex-col">
                <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Terminal size={11} /> Live Trace
                </h3>
                <div className="font-mono text-[9px] flex-1 max-h-16 overflow-y-auto custom-scrollbar space-y-1">
                    {safeLogs.length > 0 ? (
                        safeLogs.map((log, i) => (
                            <div key={i} className={`p-0.5 border-l border-white/10 pl-1.5 ${i === 0 ? 'text-cyan-300 font-bold' : 'text-gray-500'}`}>
                                {typeof log === 'string' ? log : (log?.message || JSON.stringify(log))}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-600 italic">Listo para auditar.</div>
                    )}
                </div>
            </aside>
        </div>
    );
}
